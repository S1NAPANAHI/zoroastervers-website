import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest } from 'next/server';

// Create Redis instance - fallback to in-memory for development
let redis: Redis | undefined;
let isMemoryStore = false;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } else {
    console.warn('Redis credentials not found, using in-memory store for rate limiting');
    isMemoryStore = true;
  }
} catch (error) {
  console.warn('Failed to initialize Redis, using in-memory store for rate limiting:', error);
  isMemoryStore = true;
}

// =====================================================
// Rate Limit Configurations
// =====================================================

// General API rate limit - 100 requests per 15 minutes per IP
export const generalRateLimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '15 m'),
  analytics: true,
  prefix: 'general_api',
}) : null;

// Review creation rate limit - 5 reviews per hour per user (more restrictive)
export const reviewRateLimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true,
  prefix: 'review_creation',
}) : null;

// Progress update rate limit - 30 updates per 5 minutes per user
export const progressRateLimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '5 m'),
  analytics: true,
  prefix: 'progress_update',
}) : null;

// Admin actions rate limit - 200 requests per 5 minutes per admin user
export const adminRateLimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(200, '5 m'),
  analytics: true,
  prefix: 'admin_actions',
}) : null;

// Authentication rate limit - 10 attempts per 5 minutes per IP (for failed logins)
export const authRateLimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '5 m'),
  analytics: true,
  prefix: 'auth_attempts',
}) : null;

// =====================================================
// In-Memory Fallback Rate Limiting (Development)
// =====================================================

interface MemoryRateLimitEntry {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, MemoryRateLimitEntry>();

class MemoryRateLimit {
  private limit: number;
  private windowMs: number;
  private prefix: string;

  constructor(limit: number, windowMs: number, prefix: string) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.prefix = prefix;
  }

  async limit(identifier: string) {
    const key = `${this.prefix}:${identifier}`;
    const now = Date.now();
    const entry = memoryStore.get(key);

    if (!entry || now > entry.resetTime) {
      // Reset window
      memoryStore.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return {
        success: true,
        limit: this.limit,
        remaining: this.limit - 1,
        reset: new Date(now + this.windowMs),
      };
    }

    if (entry.count >= this.limit) {
      return {
        success: false,
        limit: this.limit,
        remaining: 0,
        reset: new Date(entry.resetTime),
      };
    }

    entry.count++;
    memoryStore.set(key, entry);

    return {
      success: true,
      limit: this.limit,
      remaining: this.limit - entry.count,
      reset: new Date(entry.resetTime),
    };
  }
}

// Fallback rate limiters for development
const memoryGeneralRateLimit = new MemoryRateLimit(100, 15 * 60 * 1000, 'general_api');
const memoryReviewRateLimit = new MemoryRateLimit(5, 60 * 60 * 1000, 'review_creation');
const memoryProgressRateLimit = new MemoryRateLimit(30, 5 * 60 * 1000, 'progress_update');
const memoryAdminRateLimit = new MemoryRateLimit(200, 5 * 60 * 1000, 'admin_actions');
const memoryAuthRateLimit = new MemoryRateLimit(10, 5 * 60 * 1000, 'auth_attempts');

// =====================================================
// Rate Limiting Helper Functions
// =====================================================

/**
 * Get client identifier from request (IP address or user ID)
 */
export function getClientIdentifier(request: NextRequest, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }
  
  // Try to get real IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || request.ip || 'unknown';
  
  return `ip:${ip}`;
}

/**
 * Apply general API rate limiting
 */
export async function applyGeneralRateLimit(
  request: NextRequest,
  userId?: string
): Promise<{ success: true } | { success: false; error: string; headers: Record<string, string> }> {
  const identifier = getClientIdentifier(request, userId);
  
  try {
    const result = isMemoryStore 
      ? await memoryGeneralRateLimit.limit(identifier)
      : await generalRateLimit?.limit(identifier);

    if (!result) {
      return { success: true }; // No rate limiting configured
    }

    const headers = {
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.getTime().toString(),
    };

    if (!result.success) {
      return {
        success: false,
        error: 'Too many requests. Please try again later.',
        headers,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Rate limiting error:', error);
    return { success: true }; // Allow request if rate limiting fails
  }
}

/**
 * Apply review-specific rate limiting
 */
export async function applyReviewRateLimit(
  request: NextRequest,
  userId: string
): Promise<{ success: true } | { success: false; error: string; headers: Record<string, string> }> {
  const identifier = `user:${userId}`;
  
  try {
    const result = isMemoryStore 
      ? await memoryReviewRateLimit.limit(identifier)
      : await reviewRateLimit?.limit(identifier);

    if (!result) {
      return { success: true }; // No rate limiting configured
    }

    const headers = {
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.getTime().toString(),
    };

    if (!result.success) {
      return {
        success: false,
        error: 'Too many review submissions. You can submit up to 5 reviews per hour.',
        headers,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Review rate limiting error:', error);
    return { success: true }; // Allow request if rate limiting fails
  }
}

/**
 * Apply progress-specific rate limiting
 */
export async function applyProgressRateLimit(
  request: NextRequest,
  userId: string
): Promise<{ success: true } | { success: false; error: string; headers: Record<string, string> }> {
  const identifier = `user:${userId}`;
  
  try {
    const result = isMemoryStore 
      ? await memoryProgressRateLimit.limit(identifier)
      : await progressRateLimit?.limit(identifier);

    if (!result) {
      return { success: true }; // No rate limiting configured
    }

    const headers = {
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.getTime().toString(),
    };

    if (!result.success) {
      return {
        success: false,
        error: 'Too many progress updates. Please slow down.',
        headers,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Progress rate limiting error:', error);
    return { success: true }; // Allow request if rate limiting fails
  }
}

/**
 * Apply admin-specific rate limiting
 */
export async function applyAdminRateLimit(
  request: NextRequest,
  userId: string
): Promise<{ success: true } | { success: false; error: string; headers: Record<string, string> }> {
  const identifier = `admin:${userId}`;
  
  try {
    const result = isMemoryStore 
      ? await memoryAdminRateLimit.limit(identifier)
      : await adminRateLimit?.limit(identifier);

    if (!result) {
      return { success: true }; // No rate limiting configured
    }

    const headers = {
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.getTime().toString(),
    };

    if (!result.success) {
      return {
        success: false,
        error: 'Too many admin requests. Please try again later.',
        headers,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Admin rate limiting error:', error);
    return { success: true }; // Allow request if rate limiting fails
  }
}

/**
 * Apply authentication rate limiting
 */
export async function applyAuthRateLimit(
  request: NextRequest
): Promise<{ success: true } | { success: false; error: string; headers: Record<string, string> }> {
  const identifier = getClientIdentifier(request);
  
  try {
    const result = isMemoryStore 
      ? await memoryAuthRateLimit.limit(identifier)
      : await authRateLimit?.limit(identifier);

    if (!result) {
      return { success: true }; // No rate limiting configured
    }

    const headers = {
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.getTime().toString(),
    };

    if (!result.success) {
      return {
        success: false,
        error: 'Too many authentication attempts. Please try again later.',
        headers,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Auth rate limiting error:', error);
    return { success: true }; // Allow request if rate limiting fails
  }
}

// =====================================================
// Cleanup function for memory store (development)
// =====================================================

/**
 * Clean up expired entries from memory store
 */
export function cleanupMemoryStore(): void {
  if (!isMemoryStore) return;
  
  const now = Date.now();
  for (const [key, entry] of memoryStore.entries()) {
    if (now > entry.resetTime) {
      memoryStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes in development
if (isMemoryStore && typeof setInterval !== 'undefined') {
  setInterval(cleanupMemoryStore, 5 * 60 * 1000);
}
// Bundle Pricing Calculator Utility
import { Issue, Arc, Saga, Volume, Book, BundleRecommendation } from '@/types/shop';

export class BundlePricingCalculator {
  private static BUNDLE_DISCOUNTS = {
    arc: 0.10,      // 10% discount for buying full arc vs individual issues
    saga: 0.20,     // 20% discount for buying full saga vs individual arcs
    volume: 0.30,   // 30% discount for buying full volume vs individual sagas
    book: 0.40      // 40% discount for buying complete book vs individual volumes
  };

  static calculateBundlePrice(
    items: { price: number }[], 
    bundleType: keyof typeof BundlePricingCalculator.BUNDLE_DISCOUNTS
  ): number {
    const totalIndividualPrice = items.reduce((sum, item) => sum + item.price, 0);
    const discount = this.BUNDLE_DISCOUNTS[bundleType];
    return Math.round(totalIndividualPrice * (1 - discount) * 100) / 100;
  }

  static getBundleOptions(currentItem: any, relatedData: any): BundleRecommendation[] {
    const options: BundleRecommendation[] = [];
    
    // Arc bundle (if part of incomplete arc)
    if (currentItem.type === 'issue' && relatedData.arc && !relatedData.arc.isComplete) {
      const arcPrice = this.calculateBundlePrice(relatedData.arc.issues, 'arc');
      const individualTotal = relatedData.arc.issues.reduce((sum: number, issue: Issue) => sum + issue.price, 0);
      const savings = individualTotal - arcPrice;
      
      options.push({
        title: `Complete this Arc`,
        description: `Get all ${relatedData.arc.issues.length} issues in "${relatedData.arc.title}"`,
        savings: `Save $${savings.toFixed(2)} (10% off)`,
        price: arcPrice,
        originalPrice: individualTotal,
        type: 'arc',
        items: relatedData.arc.issues.map((issue: Issue) => issue.id)
      });
    }

    // Saga bundle (if part of incomplete saga)
    if (['issue', 'arc'].includes(currentItem.type) && relatedData.saga) {
      const sagaPrice = this.calculateBundlePrice(relatedData.saga.arcs, 'saga');
      const individualTotal = relatedData.saga.arcs.reduce((sum: number, arc: Arc) => sum + arc.price, 0);
      const savings = individualTotal - sagaPrice;
      
      options.push({
        title: `Get the Full Saga`,
        description: `Access the complete "${relatedData.saga.title}" storyline`,
        savings: `Save $${savings.toFixed(2)} (20% off)`,
        price: sagaPrice,
        originalPrice: individualTotal,
        type: 'saga',
        items: relatedData.saga.arcs.map((arc: Arc) => arc.id)
      });
    }

    // Volume bundle
    if (['issue', 'arc', 'saga'].includes(currentItem.type) && relatedData.volume) {
      const volumePrice = this.calculateBundlePrice(relatedData.volume.sagas, 'volume');
      const individualTotal = relatedData.volume.sagas.reduce((sum: number, saga: Saga) => sum + saga.price, 0);
      const savings = individualTotal - volumePrice;
      
      options.push({
        title: `Complete Volume Collection`,
        description: `Own the entire "${relatedData.volume.title}" volume`,
        savings: `Save $${savings.toFixed(2)} (30% off)`,
        price: volumePrice,
        originalPrice: individualTotal,
        type: 'volume',
        items: relatedData.volume.sagas.map((saga: Saga) => saga.id)
      });
    }

    // Book bundle (ultimate collection)
    if (relatedData.book) {
      const bookPrice = this.calculateBundlePrice(relatedData.book.volumes, 'book');
      const individualTotal = relatedData.book.volumes.reduce((sum: number, volume: Volume) => sum + volume.price, 0);
      const savings = individualTotal - bookPrice;
      
      options.push({
        title: `Complete Book Series`,
        description: `The ultimate "${relatedData.book.title}" collection`,
        savings: `Save $${savings.toFixed(2)} (40% off)`,
        price: bookPrice,
        originalPrice: individualTotal,
        type: 'book',
        items: relatedData.book.volumes.map((volume: Volume) => volume.id)
      });
    }

    return options;
  }

  static calculateSubscriptionPrice(basePrice: number, subscriptionType: 'monthly' | 'quarterly' | 'annual'): number {
    const discounts = {
      monthly: 0.10,    // 10% off for monthly subscription
      quarterly: 0.15,  // 15% off for quarterly subscription
      annual: 0.25      // 25% off for annual subscription
    };
    
    return Math.round(basePrice * (1 - discounts[subscriptionType]) * 100) / 100;
  }

  static getVolumeDiscountTier(quantity: number): number {
    if (quantity >= 10) return 0.20;      // 20% off for 10+ items
    if (quantity >= 5) return 0.15;       // 15% off for 5+ items
    if (quantity >= 3) return 0.10;       // 10% off for 3+ items
    return 0;                             // No discount for less than 3 items
  }

  static calculateProgressDiscount(userProgress: any, itemId: string): number {
    // Give discounts based on how much of a series the user has already purchased
    const completionPercentage = userProgress.getCompletionPercentage?.(itemId) || 0;
    
    if (completionPercentage >= 0.75) return 0.15;  // 15% off if 75%+ complete
    if (completionPercentage >= 0.50) return 0.10;  // 10% off if 50%+ complete
    if (completionPercentage >= 0.25) return 0.05;  // 5% off if 25%+ complete
    return 0;
  }

  static formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  static formatSavings(originalPrice: number, salePrice: number): string {
    const savings = originalPrice - salePrice;
    const percentage = Math.round((savings / originalPrice) * 100);
    return `Save ${this.formatPrice(savings)} (${percentage}% off)`;
  }

  static getRecommendedPurchaseOption(options: BundleRecommendation[]): BundleRecommendation | null {
    if (options.length === 0) return null;
    
    // Recommend the option with the best value (highest savings percentage)
    return options.reduce((best, current) => {
      const currentSavingsPercent = (current.originalPrice - current.price) / current.originalPrice;
      const bestSavingsPercent = (best.originalPrice - best.price) / best.originalPrice;
      
      return currentSavingsPercent > bestSavingsPercent ? current : best;
    });
  }
}
// Unified Pricing Service
// Ensures all components read pricing from the same source and apply consistent logic

import { CartItem } from '@/types/shop';
import { BundlePricingCalculator } from './bundlePricing';

export interface PriceData {
  id: string;
  basePrice: number;
  currency: string;
  discountedPrice?: number;
  discountPercentage?: number;
  source: 'shop_items' | 'books' | 'mock';
}

export class PricingService {
  private static priceCache: Map<string, PriceData> = new Map();
  private static cacheExpiry: Map<string, number> = new Map();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get price data from the unified shop_items table
   */
  static async getPrice(itemId: string): Promise<PriceData | null> {
    // Check cache first
    const cached = this.getCachedPrice(itemId);
    if (cached) return cached;

    try {
      // Try shop_items table first (most authoritative)
      const shopResponse = await fetch(`/api/shop?id=${itemId}`);
      if (shopResponse.ok) {
        const shopData = await shopResponse.json();
        const priceData: PriceData = {
          id: itemId,
          basePrice: parseFloat(shopData.price),
          currency: 'USD',
          source: 'shop_items'
        };
        this.setCachePrice(itemId, priceData);
        return priceData;
      }

      // Fallback to books table for backwards compatibility
      const booksResponse = await fetch(`/api/books/${itemId}`);
      if (booksResponse.ok) {
        const bookData = await booksResponse.json();
        const priceData: PriceData = {
          id: itemId,
          basePrice: parseFloat(bookData.price || '0'),
          currency: 'USD',
          source: 'books'
        };
        this.setCachePrice(itemId, priceData);
        return priceData;
      }

      return null;
    } catch (error) {
      console.error('Error fetching price:', error);
      return null;
    }
  }

  /**
   * Get multiple prices in batch
   */
  static async getPrices(itemIds: string[]): Promise<Map<string, PriceData>> {
    const prices = new Map<string, PriceData>();
    
    // Get uncached items
    const uncachedIds = itemIds.filter(id => !this.getCachedPrice(id));
    
    // Add cached items
    itemIds.forEach(id => {
      const cached = this.getCachedPrice(id);
      if (cached) prices.set(id, cached);
    });

    // Fetch uncached items
    if (uncachedIds.length > 0) {
      try {
        const response = await fetch('/api/shop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: uncachedIds })
        });

        if (response.ok) {
          const items = await response.json();
          items.forEach((item: any) => {
            const priceData: PriceData = {
              id: item.id,
              basePrice: parseFloat(item.price),
              currency: 'USD',
              source: 'shop_items'
            };
            prices.set(item.id, priceData);
            this.setCachePrice(item.id, priceData);
          });
        }
      } catch (error) {
        console.error('Error batch fetching prices:', error);
      }
    }

    return prices;
  }

  /**
   * Apply bundle pricing to a cart item
   */
  static applyBundleDiscount(item: CartItem, bundleType?: 'arc' | 'saga' | 'volume' | 'book'): CartItem {
    if (!bundleType) return item;

    const discountedPrice = BundlePricingCalculator.calculateBundlePrice([item], bundleType);
    const discountPercentage = Math.round(((item.price - discountedPrice) / item.price) * 100);

    return {
      ...item,
      price: discountedPrice,
      // Store original price in description for reference
      description: `${item.description} (Bundle discount: ${discountPercentage}% off)`
    };
  }

  /**
   * Format price consistently across the application
   */
  static formatPrice(price: number, currency: string = 'USD'): string {
    return BundlePricingCalculator.formatPrice(price);
  }

  /**
   * Calculate the best bundle option for multiple items
   */
  static calculateBestBundle(items: CartItem[]): {
    bundleType: 'arc' | 'saga' | 'volume' | 'book';
    savings: number;
    bundlePrice: number;
    originalPrice: number;
  } | null {
    const originalPrice = items.reduce((sum, item) => sum + item.price, 0);
    const bundleTypes: ('arc' | 'saga' | 'volume' | 'book')[] = ['arc', 'saga', 'volume', 'book'];
    
    let bestBundle = null;
    let maxSavings = 0;

    bundleTypes.forEach(bundleType => {
      const bundlePrice = BundlePricingCalculator.calculateBundlePrice(items, bundleType);
      const savings = originalPrice - bundlePrice;
      
      if (savings > maxSavings) {
        maxSavings = savings;
        bestBundle = {
          bundleType,
          savings,
          bundlePrice,
          originalPrice
        };
      }
    });

    return bestBundle;
  }

  /**
   * Validate cart item pricing against database
   */
  static async validateCartPrice(item: CartItem): Promise<boolean> {
    const currentPrice = await this.getPrice(item.id);
    if (!currentPrice) return true; // Allow if price not found (might be custom item)
    
    // Allow small floating point differences
    const priceDifference = Math.abs(currentPrice.basePrice - item.price);
    return priceDifference < 0.01;
  }

  // Cache management
  private static getCachedPrice(itemId: string): PriceData | null {
    const expiry = this.cacheExpiry.get(itemId);
    if (!expiry || Date.now() > expiry) {
      this.priceCache.delete(itemId);
      this.cacheExpiry.delete(itemId);
      return null;
    }
    return this.priceCache.get(itemId) || null;
  }

  private static setCachePrice(itemId: string, priceData: PriceData): void {
    this.priceCache.set(itemId, priceData);
    this.cacheExpiry.set(itemId, Date.now() + this.CACHE_DURATION);
  }

  /**
   * Clear pricing cache (useful for admin operations)
   */
  static clearCache(): void {
    this.priceCache.clear();
    this.cacheExpiry.clear();
  }

  /**
   * Get pricing source for debugging
   */
  static async getPricingSource(itemId: string): Promise<string | null> {
    const priceData = await this.getPrice(itemId);
    return priceData?.source || null;
  }
}

// Export convenience functions
export const getPrice = PricingService.getPrice.bind(PricingService);
export const formatPrice = PricingService.formatPrice.bind(PricingService);
export const validateCartPrice = PricingService.validateCartPrice.bind(PricingService);
export default function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9-]/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
}

