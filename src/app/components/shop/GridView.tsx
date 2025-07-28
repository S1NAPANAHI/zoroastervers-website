'use client';

import React, { useState } from 'react';
import { TreeNode, CartItem } from '@/types/shop';
import { BundlePricingCalculator } from '@/utils/bundlePricing';
import InlineRating from '../reviews/InlineRating';
import ReviewPanel from '../reviews/ReviewPanel';

interface GridViewProps {
  data: TreeNode[];
  onAddToCart: (item: CartItem) => void;
  onViewDetails: (itemId: string, type: string) => void;
}

const GridView: React.FC<GridViewProps> = ({ data, onAddToCart, onViewDetails }) => {
  const [reviewModalOpen, setReviewModalOpen] = useState<{itemId: number, itemType: string, itemTitle: string} | null>(null);
  const getTypeIcon = (type: string) => {
    const icons = {
      book: '📚',
      volume: '📖',
      saga: '📜',
      arc: '📝',
      issue: '📄'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  const getTypeBadgeColor = (type: string) => {
    const colors = {
      book: 'bg-gradient-to-r from-purple-600 to-purple-700',
      volume: 'bg-gradient-to-r from-purple-500 to-purple-600',
      saga: 'bg-gradient-to-r from-purple-400 to-purple-500',
      arc: 'bg-gradient-to-r from-purple-300 to-purple-400',
      issue: 'bg-gradient-to-r from-gray-100 to-gray-200'
    };
    return colors[type as keyof typeof colors] || colors.issue;
  };

  const handleAddToCart = (item: TreeNode) => {
    const cartItem: CartItem = {
      id: item.id,
      type: item.type,
      title: item.title,
      price: item.price,
      quantity: 1,
      coverImage: item.coverImage,
      description: item.description
    };
    onAddToCart(cartItem);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {data.map((item) => (
        <div
          key={item.id}
          className="group relative glass-dark rounded-2xl border border-white/20 p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:border-cyan-400/50"
        >
          {/* Savings Badge */}
          {item.bundleInfo && (
            <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold z-10 shadow-lg">
              Save {item.bundleInfo.discount}%
            </div>
          )}

          {/* Type Badge */}
          <div className={`
            absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-bold uppercase z-10
            ${item.type === 'issue' ? 'text-gray-800' : 'text-white'}
            ${getTypeBadgeColor(item.type)}
          `}>
            {item.type}
          </div>

          <div className="text-center">
            {/* Icon */}
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              {getTypeIcon(item.type)}
            </div>

            {/* Title */}
            <h3 className="font-bold text-white text-base sm:text-lg mb-2 sm:mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-purple-200 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 h-12 sm:h-16">
              {item.description}
            </p>

            {/* Pricing */}
            <div className="mb-4 sm:mb-6">
              {item.bundleInfo && (
                <div className="text-xs sm:text-sm text-white/60 line-through mb-1">
                  {BundlePricingCalculator.formatPrice(item.bundleInfo.individualPrice)}
                </div>
              )}
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-1 sm:mb-2">
                {BundlePricingCalculator.formatPrice(item.price)}
              </div>
              {item.bundleInfo && (
                <div className="text-xs text-green-400 font-semibold">
                  You save {BundlePricingCalculator.formatPrice(
                    item.bundleInfo.individualPrice - item.bundleInfo.bundlePrice
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={() => handleAddToCart(item)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg transform hover:scale-105 text-sm sm:text-base"
              >
                🛒 Add to Cart
              </button>
              
              <button
                onClick={() => onViewDetails(item.id, item.type)}
                className="w-full px-3 sm:px-4 py-2 glass-dark hover:bg-white/20 text-white rounded-lg transition-colors duration-200 text-xs sm:text-sm"
              >
                👁️ View Details
              </button>
              
              <button
                onClick={() => setReviewModalOpen({itemId: item.id, itemType: item.type, itemTitle: item.title})}
                className="w-full px-3 sm:px-4 py-2 glass-dark hover:bg-white/20 text-white rounded-lg transition-colors duration-200 text-xs sm:text-sm"
              >
                ⭐ Reviews
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-white/60">
              {item.children && (
                <div className="flex items-center space-x-1">
                  <span>📦</span>
                  <span>{item.children.length} items</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <InlineRating 
                  itemId={item.id} 
                  itemType={item.type} 
                  onClick={() => setReviewModalOpen({itemId: item.id, itemType: item.type, itemTitle: item.title})} 
                />
              </div>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      ))}
      
      {/* Review Panel Modal */}
      {reviewModalOpen && (
        <ReviewPanel 
          itemId={reviewModalOpen.itemId} 
          itemType={reviewModalOpen.itemType} 
          itemTitle={reviewModalOpen.itemTitle} 
          onClose={() => setReviewModalOpen(null)} 
        />
      )}
    </div>
  );
};

export default GridView;
