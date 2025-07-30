// =====================================================
// Database Constants
// =====================================================

export const ITEM_TYPES = ['book', 'volume', 'saga', 'arc', 'issue'] as const;
export const CONTENT_STATUSES = ['draft', 'published', 'archived'] as const;
export const CHARACTER_STATUSES = ['active', 'inactive', 'deceased', 'unknown'] as const;
export const USER_ROLES = ['user', 'admin', 'moderator'] as const;

// =====================================================
// Validation Constants
// =====================================================

export const VALIDATION_LIMITS = {
  // Text fields
  MAX_TITLE_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 5000,
  MAX_COMMENT_LENGTH: 2000,
  MAX_POSITION_LENGTH: 1000,
  MAX_ALIAS_LENGTH: 255,
  
  // Ratings and levels
  MIN_RATING: 1,
  MAX_RATING: 5,
  MIN_IMPORTANCE_LEVEL: 1,
  MAX_IMPORTANCE_LEVEL: 10,
  MIN_DIFFICULTY_LEVEL: 1,
  MAX_DIFFICULTY_LEVEL: 5,
  MIN_HINT_LEVEL: 1,
  MAX_HINT_LEVEL: 3,
  
  // Progress
  MIN_PROGRESS: 0,
  MAX_PROGRESS: 100,
  MIN_READING_TIME: 0,
  MIN_SESSION_COUNT: 0,
  
  // Order indices
  MIN_ORDER_INDEX: 1,
  
  // Pagination
  MIN_LIMIT: 1,
  MAX_LIMIT: 100,
  DEFAULT_LIMIT: 50,
  MIN_OFFSET: 0,
  DEFAULT_OFFSET: 0,
} as const;

// =====================================================
// API Constants
// =====================================================

export const API_ENDPOINTS = {
  // Admin endpoints
  ADMIN: {
    BOOKS: '/api/admin/books',
    VOLUMES: '/api/admin/volumes',
    SAGAS: '/api/admin/sagas',
    ARCS: '/api/admin/arcs',
    ISSUES: '/api/admin/issues',
    POSTS: '/api/admin/posts',
    TIMELINE: '/api/admin/timeline',
    SHOP: '/api/admin/shop',
  },
  
  // Public endpoints
  BOOKS: '/api/books',
  CHARACTERS: '/api/characters',
  POSTS: '/api/posts',
  SHOP: '/api/shop',
  TIMELINE: '/api/timeline',
  
  // User-specific endpoints
  REVIEWS: '/api/books/reviews',
  PROGRESS: '/api/books/progress',
  EASTER_EGGS: '/api/easter_eggs/unlock',
} as const;

// =====================================================
// Cache and Performance Constants
// =====================================================

export const CACHE_DURATIONS = {
  PRICING: 5 * 60 * 1000, // 5 minutes
  STATIC_DATA: 15 * 60 * 1000, // 15 minutes
  USER_DATA: 60 * 1000, // 1 minute
  REAL_TIME_DATA: 5 * 1000, // 5 seconds
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 0,
  LIMIT: 50,
  OFFSET: 0,
} as const;

// =====================================================
// Rate Limiting Constants
// =====================================================

export const RATE_LIMITS = {
  GENERAL_API: {
    REQUESTS: 100,
    WINDOW: '15 m',
    PREFIX: 'general_api',
  },
  REVIEW_CREATION: {
    REQUESTS: 5,
    WINDOW: '1 h',
    PREFIX: 'review_creation',
  },
  PROGRESS_UPDATE: {
    REQUESTS: 30,
    WINDOW: '5 m',
    PREFIX: 'progress_update',
  },
  ADMIN_ACTIONS: {
    REQUESTS: 200,
    WINDOW: '5 m',
    PREFIX: 'admin_actions',
  },
  AUTH_ATTEMPTS: {
    REQUESTS: 10,
    WINDOW: '5 m',
    PREFIX: 'auth_attempts',
  },
} as const;

// =====================================================
// Bundle Pricing Constants
// =====================================================

export const BUNDLE_DISCOUNTS = {
  ARC: 0.10,    // 10% discount for buying full arc vs individual issues
  SAGA: 0.20,   // 20% discount for buying full saga vs individual arcs
  VOLUME: 0.30, // 30% discount for buying full volume vs individual sagas
  BOOK: 0.40,   // 40% discount for buying complete book vs individual volumes
} as const;

export const SUBSCRIPTION_DISCOUNTS = {
  MONTHLY: 0.10,    // 10% off for monthly subscription
  QUARTERLY: 0.15,  // 15% off for quarterly subscription
  ANNUAL: 0.25,     // 25% off for annual subscription
} as const;

export const VOLUME_DISCOUNT_TIERS = {
  TIER_1: { MIN_QUANTITY: 3, DISCOUNT: 0.10 },   // 10% off for 3+ items
  TIER_2: { MIN_QUANTITY: 5, DISCOUNT: 0.15 },   // 15% off for 5+ items
  TIER_3: { MIN_QUANTITY: 10, DISCOUNT: 0.20 },  // 20% off for 10+ items
} as const;

// =====================================================
// Character System Constants
// =====================================================

export const CHARACTER_RELATIONSHIP_TYPES = [
  'family',
  'friend',
  'enemy',
  'romantic',
  'ally',
  'rival',
  'mentor',
  'student',
  'neutral',
  'unknown',
] as const;

export const CHARACTER_ASSOCIATION_TYPES = [
  'organization',
  'location',
  'item',
  'event',
  'concept',
  'group',
  'faction',
  'religion',
  'profession',
] as const;

export const CHARACTER_TAG_CATEGORIES = [
  'personality',
  'appearance',
  'role',
  'archetype',
  'skills',
  'background',
] as const;

// =====================================================
// Easter Egg Constants
// =====================================================

export const EASTER_EGG_TYPES = {
  TRIGGER_TYPES: ['click', 'hover', 'sequence', 'time', 'condition'] as const,
  REWARD_TYPES: ['points', 'art', 'content', 'special', 'achievement'] as const,
  DIFFICULTY_LEVELS: [1, 2, 3, 4, 5] as const,
  HINT_LEVELS: [1, 2, 3] as const,
} as const;

// =====================================================
// Shop and Commerce Constants
// =====================================================

export const SHOP_ITEM_STATUSES = ['draft', 'published', 'pre-order', 'coming-soon'] as const;
export const CURRENCY = 'USD';
export const DEFAULT_PRICE = 0;

// =====================================================
// Search and Filtering Constants
// =====================================================

export const SEARCH_OPERATORS = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'in', 'not_in'] as const;
export const SORT_DIRECTIONS = ['asc', 'desc'] as const;

// =====================================================
// File and Media Constants
// =====================================================

export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGE_DIMENSION = 2048; // pixels

// =====================================================
// Environment and Feature Flags
// =====================================================

export const FEATURE_FLAGS = {
  EASTER_EGGS_ENABLED: true,
  REAL_TIME_UPDATES: true,
  ADVANCED_SEARCH: true,
  BULK_OPERATIONS: true,
  ANALYTICS_TRACKING: true,
} as const;

// =====================================================
// Regex Patterns
// =====================================================

export const REGEX_PATTERNS = {
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  POSITIVE_INTEGER: /^\d+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
} as const;

// =====================================================
// Error Messages
// =====================================================

export const ERROR_MESSAGES = {
  VALIDATION: {
    REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_UUID: 'Invalid UUID format',
    INVALID_ID: 'ID must be a positive integer',
    TOO_LONG: 'This field is too long',
    TOO_SHORT: 'This field is too short',
    INVALID_RANGE: 'Value is outside the valid range',
  },
  AUTH: {
    REQUIRED: 'Authentication required',
    INVALID_TOKEN: 'Invalid or expired token',
    INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
    ADMIN_REQUIRED: 'Admin privileges required',
  },
  RATE_LIMIT: {
    TOO_MANY_REQUESTS: 'Too many requests. Please try again later.',
    REVIEW_LIMIT: 'Too many review submissions. You can submit up to 5 reviews per hour.',
    PROGRESS_LIMIT: 'Too many progress updates. Please slow down.',
    ADMIN_LIMIT: 'Too many admin requests. Please try again later.',
    AUTH_LIMIT: 'Too many authentication attempts. Please try again later.',
  },
  GENERAL: {
    NOT_FOUND: 'Resource not found',
    SERVER_ERROR: 'Internal server error',
    INVALID_REQUEST: 'Invalid request format',
    FORBIDDEN: 'Access forbidden',
  },
} as const;

// =====================================================
// Default Values
// =====================================================

export const DEFAULTS = {
  CHARACTER: {
    IMPORTANCE_LEVEL: 5,
    STATUS: 'draft' as const,
    IS_MAIN_CHARACTER: false,
    IS_ANTAGONIST: false,
    IS_PROTAGONIST: false,
  },
  CONTENT: {
    ORDER_INDEX: 1,
    STATUS: 'draft' as const,
    IS_COMPLETE: false,
    PHYSICAL_AVAILABLE: false,
    DIGITAL_BUNDLE: false,
  },
  PROGRESS: {
    PERCENT_COMPLETE: 0,
    TOTAL_READING_TIME: 0,
    SESSION_COUNT: 0,
  },
  REVIEW: {
    IS_VERIFIED_PURCHASE: false,
    IS_SPOILER: false,
    HELPFUL_COUNT: 0,
  },
  EASTER_EGG: {
    TRIGGER_TYPE: 'hidden',
    DIFFICULTY_LEVEL: 1,
    HINT_LEVEL: 1,
    REWARD_TYPE: 'content',
    IS_ACTIVE: true,
  },
} as const;

// Type exports for TypeScript
export type ItemType = typeof ITEM_TYPES[number];
export type ContentStatus = typeof CONTENT_STATUSES[number];
export type CharacterStatus = typeof CHARACTER_STATUSES[number];
export type UserRole = typeof USER_ROLES[number];
export type CharacterRelationshipType = typeof CHARACTER_RELATIONSHIP_TYPES[number];
export type CharacterAssociationType = typeof CHARACTER_ASSOCIATION_TYPES[number];
export type CharacterTagCategory = typeof CHARACTER_TAG_CATEGORIES[number];
export type EasterEggTriggerType = typeof EASTER_EGG_TYPES.TRIGGER_TYPES[number];
export type EasterEggRewardType = typeof EASTER_EGG_TYPES.REWARD_TYPES[number];
export type ShopItemStatus = typeof SHOP_ITEM_STATUSES[number];
export type SearchOperator = typeof SEARCH_OPERATORS[number];
export type SortDirection = typeof SORT_DIRECTIONS[number];
export type SupportedImageType = typeof SUPPORTED_IMAGE_TYPES[number];
