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
