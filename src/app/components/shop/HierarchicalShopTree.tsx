'use client';

import React, { useState } from 'react';
import { TreeNode, CartItem } from '@/types/shop';
import { BundlePricingCalculator } from '@/utils/bundlePricing';
import InlineRating from '../reviews/InlineRating';
import ReviewPanel from '../reviews/ReviewPanel';

interface HierarchicalShopTreeProps {
  data: TreeNode[];
  onAddToCart: (item: CartItem) => void;
  onViewDetails: (itemId: string, type: string) => void;
}

const HierarchicalShopTree: React.FC<HierarchicalShopTreeProps> = ({ 
  data, 
  onAddToCart, 
  onViewDetails 
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [reviewModalOpen, setReviewModalOpen] = useState<{itemId: number, itemType: string, itemTitle: string} | null>(null);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getNodeStyles = (type: string) => {
    const styles = {
      book: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-500',
      volume: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-400', 
      saga: 'bg-gradient-to-r from-purple-400 to-purple-500 text-white border-purple-300',
      arc: 'bg-gradient-to-r from-purple-300 to-purple-400 text-gray-900 border-purple-200',
      issue: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300'
    };
    return styles[type as keyof typeof styles] || styles.issue;
  };

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

  const getDepthPadding = (depth: number) => {
    return `${depth * 2}rem`;
  };

  const handleAddToCart = (node: TreeNode, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const cartItem: CartItem = {
      id: node.id,
      type: node.type,
      title: node.title,
      price: node.price,
      quantity: 1,
      coverImage: node.coverImage,
      description: node.description
    };
    
    onAddToCart(cartItem);
  };

  const renderSavingsBadge = (node: TreeNode) => {
    if (node.bundleInfo) {
      const savingsPercent = Math.round(
        ((node.bundleInfo.individualPrice - node.bundleInfo.bundlePrice) / node.bundleInfo.individualPrice) * 100
      );
      
      return (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold z-10">
          Save {savingsPercent}%
        </div>
      );
    }
    return null;
  };

  const renderNode = (node: TreeNode, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="mb-2">
        <div 
          className={`
            relative group cursor-pointer transition-all duration-300 
            rounded-xl border-2 p-4 hover:shadow-xl transform hover:scale-[1.02]
            ${getNodeStyles(node.type)}
          `}
          style={{ marginLeft: getDepthPadding(depth) }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {renderSavingsBadge(node)}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              {hasChildren && (
                <div className="text-xl transition-transform duration-200">
                  {isExpanded ? '📂' : '📁'}
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getTypeIcon(node.type)}</span>
                <div>
                  <h3 className="font-bold text-lg">{node.title}</h3>
                  <div className="flex items-center space-x-2 text-sm opacity-75">
                    <span className="uppercase font-semibold">{node.type}</span>
                    {node.bundleInfo && (
                      <span className="bg-white/20 px-2 py-1 rounded-full">
                        Bundle Deal
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                {node.bundleInfo && (
                  <div className="text-sm line-through opacity-60">
                    {BundlePricingCalculator.formatPrice(node.bundleInfo.individualPrice)}
                  </div>
                )}
                <div className="text-2xl font-bold">
                  {BundlePricingCalculator.formatPrice(node.price)}
                </div>
                {node.bundleInfo && (
                  <div className="text-xs text-green-200">
                    {BundlePricingCalculator.formatSavings(
                      node.bundleInfo.individualPrice, 
                      node.bundleInfo.bundlePrice
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={(e) => handleAddToCart(node, e)}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors duration-200 text-sm font-semibold shadow-lg"
                >
                  🛒 Add to Cart
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(node.id, node.type);
                  }}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-current rounded-lg transition-colors duration-200 text-sm"
                >
                  👁️ Details
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-3 text-sm opacity-80">
            {node.description}
          </div>

          {/* Rating and Review Section */}
          <div className="mt-3 flex items-center justify-between">
            <InlineRating
              itemId={parseInt(node.id)}
              itemType={node.type}
              onClick={() => setReviewModalOpen({
                itemId: parseInt(node.id),
                itemType: node.type,
                itemTitle: node.title
              })}
              size="sm"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setReviewModalOpen({
                  itemId: parseInt(node.id),
                  itemType: node.type,
                  itemTitle: node.title
                });
              }}
              className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors duration-200"
            >
              📝 Reviews
            </button>
          </div>

          {/* Progress indicator for partially complete series */}
          {hasChildren && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Series Progress</span>
                <span>{node.children?.length || 0} items</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(100, (node.children?.length || 0) * 20)}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Children */}
        {isExpanded && hasChildren && (
          <div className="mt-4 space-y-2 border-l-2 border-white/20 ml-4">
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4">
        {data.map(node => renderNode(node))}
      </div>
      
      {/* Review Modal */}
      {reviewModalOpen && (
        <ReviewPanel
          itemId={reviewModalOpen.itemId}
          itemType={reviewModalOpen.itemType as 'book' | 'volume' | 'saga' | 'arc' | 'issue'}
          itemTitle={reviewModalOpen.itemTitle}
          isModal={true}
          onClose={() => setReviewModalOpen(null)}
        />
      )}
    </>
  );
};

export default HierarchicalShopTree;
