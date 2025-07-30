'use client';

import React, { useState } from 'react';
import { PurchaseOption, BundleRecommendation } from '@/types/shop';
import { BundlePricingCalculator } from '@/lib/utils';

interface ProgressivePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  bundleOptions: BundleRecommendation[];
  onPurchase: (option: PurchaseOption) => void;
}

const ProgressivePurchaseModal: React.FC<ProgressivePurchaseModalProps> = ({
  isOpen,
  onClose,
  item,
  bundleOptions,
  onPurchase
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('individual');

  if (!isOpen) return null;

  // Generate purchase options
  const purchaseOptions: PurchaseOption[] = [
    {
      id: 'individual',
      title: `Just "${item.title}"`,
      description: `Single ${item.type} purchase`,
      price: item.price,
      type: 'individual',
      items: [item.id]
    },
    ...bundleOptions.map((bundle, index) => ({
      id: `bundle-${index}`,
      title: bundle.title,
      description: bundle.description,
      price: bundle.price,
      originalPrice: bundle.originalPrice,
      savings: bundle.savings,
      type: 'bundle' as const,
      items: bundle.items,
      recommended: index === 0 // First bundle is recommended
    })),
    {
      id: 'subscription',
      title: 'Subscribe & Save',
      description: 'Auto-delivery of new releases in this series',
      price: BundlePricingCalculator.calculateSubscriptionPrice(item.price, 'monthly'),
      originalPrice: item.price,
      savings: '20% ongoing + early access',
      type: 'subscription',
      items: [item.id],
      recommended: bundleOptions.length === 0 // Recommend if no bundles
    }
  ];

  const selectedPurchaseOption = purchaseOptions.find(opt => opt.id === selectedOption);

  const getOptionIcon = (type: string) => {
    const icons = {
      individual: '📄',
      bundle: '📦',
      subscription: '🔄'
    };
    return icons[type as keyof typeof icons] || '💎';
  };

  const handlePurchase = () => {
    if (selectedPurchaseOption) {
      onPurchase(selectedPurchaseOption);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="glass-dark rounded-2xl border border-white/20 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Purchase</h2>
              <p className="text-purple-200">
                Select the best option for "{item.title}"
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Purchase Options */}
          <div className="space-y-4 mb-6">
            {purchaseOptions.map((option) => (
              <label 
                key={option.id} 
                className={`
                  block cursor-pointer transition-all duration-200
                  rounded-xl border-2 p-4 hover:shadow-lg
                  ${selectedOption === option.id 
                    ? 'border-cyan-400 bg-cyan-400/10' 
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }
                `}
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="radio"
                    name="purchaseOption"
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="sr-only"
                  />
                  
                  {/* Radio indicator */}
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${selectedOption === option.id 
                      ? 'border-cyan-400 bg-cyan-400' 
                      : 'border-white/30'
                    }
                  `}>
                    {selectedOption === option.id && (
                      <div className="w-2 h-2 rounded-full bg-black" />
                    )}
                  </div>

                  {/* Option icon */}
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                    ${selectedOption === option.id 
                      ? 'bg-cyan-400/20' 
                      : 'bg-white/10'
                    }
                  `}>
                    {getOptionIcon(option.type)}
                  </div>

                  {/* Option details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-white">{option.title}</h3>
                      {option.recommended && (
                        <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <p className="text-purple-200 text-sm mb-2">{option.description}</p>
                    
                    {option.savings && (
                      <div className="flex items-center space-x-2">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          {option.savings}
                        </span>
                        <span className="text-xs text-white/60">
                          {option.items.length} item{option.items.length > 1 ? 's' : ''} included
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    {option.originalPrice && option.originalPrice > option.price && (
                      <div className="text-sm text-white/60 line-through">
                        {BundlePricingCalculator.formatPrice(option.originalPrice)}
                      </div>
                    )}
                    <div className="text-2xl font-bold text-white">
                      {BundlePricingCalculator.formatPrice(option.price)}
                      {option.type === 'subscription' && (
                        <span className="text-sm text-white/60">/month</span>
                      )}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* Selected option summary */}
          {selectedPurchaseOption && (
            <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-6">
              <h4 className="font-bold text-white mb-2">Order Summary</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200">{selectedPurchaseOption.title}</p>
                  <p className="text-sm text-white/60">{selectedPurchaseOption.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">
                    {BundlePricingCalculator.formatPrice(selectedPurchaseOption.price)}
                  </div>
                  {selectedPurchaseOption.originalPrice && selectedPurchaseOption.originalPrice > selectedPurchaseOption.price && (
                    <div className="text-sm text-green-400">
                      You save {BundlePricingCalculator.formatPrice(
                        selectedPurchaseOption.originalPrice - selectedPurchaseOption.price
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handlePurchase}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-xl transition-all duration-200 font-bold shadow-lg"
            >
              🛒 Purchase Now
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-center space-x-6 text-sm text-white/60">
              <div className="flex items-center space-x-1">
                <span>🔒</span>
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>📱</span>
                <span>Instant Download</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>💯</span>
                <span>30-Day Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressivePurchaseModal;
