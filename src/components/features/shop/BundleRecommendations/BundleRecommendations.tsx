'use client';

import React from 'react';
import { BundleRecommendation } from '@/types/shop';
import { BundlePricingCalculator } from '@/lib/utils';

interface BundleRecommendationsProps {
  currentItem: any;
  recommendations: BundleRecommendation[];
  onSelectBundle: (recommendation: BundleRecommendation) => void;
}

const BundleRecommendations: React.FC<BundleRecommendationsProps> = ({
  currentItem,
  recommendations,
  onSelectBundle
}) => {
  if (recommendations.length === 0) return null;

  const getRecommendationIcon = (type: string) => {
    const icons = {
      arc: '📝',
      saga: '📜',
      volume: '📖',
      book: '📚'
    };
    return icons[type as keyof typeof icons] || '💎';
  };

  const getRecommendationColor = (type: string) => {
    const colors = {
      arc: 'from-purple-400 to-purple-500',
      saga: 'from-purple-500 to-purple-600',
      volume: 'from-purple-600 to-purple-700',
      book: 'from-purple-700 to-purple-800'
    };
    return colors[type as keyof typeof colors] || 'from-gray-400 to-gray-500';
  };

  const recommendedOption = BundlePricingCalculator.getRecommendedPurchaseOption(recommendations);

  return (
    <div className="glass-dark rounded-2xl border border-white/20 p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-2xl">💡</span>
        <h3 className="text-xl font-bold text-white">Bundle & Save</h3>
        <div className="bg-cyan-400 text-black px-2 py-1 rounded-full text-xs font-bold">
          RECOMMENDED
        </div>
      </div>
      
      <div className="space-y-3">
        {recommendations.map((rec, index) => {
          const isRecommended = recommendedOption?.title === rec.title;
          
          return (
            <div 
              key={index}
              className={`
                relative group cursor-pointer transition-all duration-300 
                rounded-xl border-2 p-4 hover:shadow-xl transform hover:scale-[1.02]
                ${isRecommended 
                  ? 'border-cyan-400 bg-gradient-to-r from-cyan-400/10 to-purple-400/10' 
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
                }
              `}
              onClick={() => onSelectBundle(rec)}
            >
              {isRecommended && (
                <div className="absolute -top-2 -right-2 bg-cyan-400 text-black text-xs px-3 py-1 rounded-full font-bold z-10">
                  BEST VALUE
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`
                    w-12 h-12 rounded-xl bg-gradient-to-r ${getRecommendationColor(rec.type)}
                    flex items-center justify-center text-2xl
                  `}>
                    {getRecommendationIcon(rec.type)}
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-white text-lg">{rec.title}</h4>
                    <p className="text-purple-200 text-sm">{rec.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        {rec.savings}
                      </span>
                      <span className="text-xs text-white/60">
                        {rec.items.length} items included
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-white/60 line-through">
                    {BundlePricingCalculator.formatPrice(rec.originalPrice)}
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {BundlePricingCalculator.formatPrice(rec.price)}
                  </div>
                  <button className={`
                    mt-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold
                    ${isRecommended 
                      ? 'bg-cyan-400 hover:bg-cyan-500 text-black' 
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }
                  `}>
                    {isRecommended ? '⭐ Get Best Deal' : '🛒 Add Bundle'}
                  </button>
                </div>
              </div>
              
              {/* Progress bar showing bundle value */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-white/70">Bundle Value</span>
                  <span className="text-cyan-400">
                    {Math.round(((rec.originalPrice - rec.price) / rec.originalPrice) * 100)}% savings
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, ((rec.originalPrice - rec.price) / rec.originalPrice) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center space-x-2 text-sm text-white/80">
          <span>💎</span>
          <span>
            <strong>Smart Tip:</strong> Higher-tier bundles offer exponentially better value. 
            The {recommendedOption?.type} bundle saves you the most money per word!
          </span>
        </div>
      </div>
    </div>
  );
};

export default BundleRecommendations;
