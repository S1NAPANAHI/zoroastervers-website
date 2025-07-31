'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '@app/contexts/CartContext';
import {
  HierarchicalShopTree,
  GridView,
  CartDrawer,
  BundleRecommendations,
  ProgressivePurchaseModal
} from '@components/features/shop';
import { TreeNode, CartItem, ViewMode, FilterLevel, SortBy, BundleRecommendation, PurchaseOption } from '@/types/shop';
import { BundlePricingCalculator } from '@/lib/utils';
import { ShopItem } from '@/lib/supabase';

const ShopPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('tree');
  const [filterLevel, setFilterLevel] = useState<FilterLevel>('all');
  const [sortBy, setSortBy] = useState<SortBy>('release');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [bundleRecommendations, setBundleRecommendations] = useState<BundleRecommendation[]>([]);
  const [displayData, setDisplayData] = useState<TreeNode[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { addToCart, getCartItemCount, getCartTotal } = useCart();

  // Convert Supabase data to TreeNode structure
  const convertToTreeNodes = (items: ShopItem[]): TreeNode[] => {
    const itemMap = new Map<string, TreeNode>();
    const rootNodes: TreeNode[] = [];

    // First pass: create all nodes
    items.forEach(item => {
      const node: TreeNode = {
        id: item.id,
        title: item.title,
        type: item.type as any,
        price: parseFloat(item.price.toString()),
        description: item.description || '',
        coverImage: item.cover_image || '/placeholder-cover.jpg',
        content: item.content || '',
        status: item.status as any,
        children: [],
        orderIndex: item.order_index,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };
      itemMap.set(item.id, node);
    });

    // Second pass: build tree structure
    items.forEach(item => {
      const node = itemMap.get(item.id)!;
      if (item.parent_id && itemMap.has(item.parent_id)) {
        const parent = itemMap.get(item.parent_id)!;
        parent.children = parent.children || [];
        parent.children.push(node);
      } else {
        rootNodes.push(node);
      }
    });

    // Sort children by order_index
    const sortChildren = (nodes: TreeNode[]) => {
      nodes.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          sortChildren(node.children);
        }
      });
    };

    sortChildren(rootNodes);
    return rootNodes;
  };

  // Load shop data from API
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/shop');
        if (!response.ok) {
          throw new Error('Failed to fetch shop data');
        }
        const data: ShopItem[] = await response.json();
        setShopItems(data);
        const treeData = convertToTreeNodes(data);
        setDisplayData(treeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load shop data');
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, []);

  // Update display data when filters/sorting change
  useEffect(() => {
    if (shopItems.length === 0) return;
    
    let filteredItems = [...shopItems];
    
    // Apply filters
    if (filterLevel !== 'all') {
      const typeMap: Record<FilterLevel, string[]> = {
        'all': [],
        'books': ['book'],
        'volumes': ['volume'],
        'sagas': ['saga'],
        'arcs': ['arc'],
        'issues': ['issue']
      };
      if (typeMap[filterLevel]) {
        filteredItems = filteredItems.filter(item => typeMap[filterLevel].includes(item.type));
      }
    }
    
    // Apply sorting
    filteredItems.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return parseFloat(a.price.toString()) - parseFloat(b.price.toString());
        case 'title':
          return a.title.localeCompare(b.title);
        case 'release':
        case 'popularity':
        default:
          return a.order_index - b.order_index;
      }
    });
    
    const treeData = convertToTreeNodes(filteredItems);
    setDisplayData(treeData);
  }, [shopItems, filterLevel, sortBy]);

  const handleAddToCart = (item: CartItem) => {
    addToCart(item);
    
    // Show success notification (you could implement a toast system)
    console.log(`Added ${item.title} to cart!`);
  };

  const handleViewDetails = (itemId: string, type: string) => {
    // Find the item in the tree
    const findItem = (nodes: TreeNode[]): TreeNode | null => {
      for (const node of nodes) {
        if (node.id === itemId) return node;
        if (node.children) {
          const found = findItem(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const item = findItem(displayData);
    if (item) {
      setSelectedItem(item);
      
      // Generate bundle recommendations
      const mockRelatedData = {
        arc: { issues: [], isComplete: false },
        saga: { arcs: [] },
        volume: { sagas: [] },
        book: { volumes: [] }
      };
      
      const recommendations = BundlePricingCalculator.getBundleOptions(item, mockRelatedData);
      setBundleRecommendations(recommendations);
      setShowPurchaseModal(true);
    }
  };

  const handlePurchase = (option: PurchaseOption) => {
    console.log('Processing purchase:', option);
    
    // Add items to cart based on purchase option
    option.items.forEach(itemId => {
      const findAndAddItem = (nodes: TreeNode[]) => {
        for (const node of nodes) {
          if (node.id === itemId) {
            handleAddToCart({
              id: node.id,
              type: node.type,
              title: node.title,
              price: node.price,
              quantity: 1,
              coverImage: node.coverImage,
              description: node.description
            });
            return;
          }
          if (node.children) {
            findAndAddItem(node.children);
          }
        }
      };
      findAndAddItem(displayData);
    });

    // In a real app, you'd integrate with a payment processor here
    alert(`Purchase successful! ${option.title}`);
  };

  const handleSelectBundle = (recommendation: BundleRecommendation) => {
    const option: PurchaseOption = {
      id: `bundle-${recommendation.type}`,
      title: recommendation.title,
      description: recommendation.description,
      price: recommendation.price,
      originalPrice: recommendation.originalPrice,
      savings: recommendation.savings,
      type: 'bundle',
      items: recommendation.items
    };
    
    handlePurchase(option);
    setShowPurchaseModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-serif drop-shadow-2xl mb-4">
            📚 ZOROASTER Shop
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto mb-6">
            Explore our hierarchical collection - from single issues to complete book series. 
            Each level offers better value through intelligent bundling.
          </p>
          
          {/* Cart indicator */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <button 
              onClick={() => setShowCartDrawer(true)}
              className="glass-dark rounded-full px-6 py-3 border border-white/20 hover:border-cyan-400/50 transition-all duration-200 transform hover:scale-105"
            >
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🛒</span>
                <span className="text-white font-semibold">
                  {getCartItemCount()} items
                </span>
                <span className="text-cyan-400 font-bold">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                viewMode === 'tree' 
                  ? 'bg-cyan-500 text-white shadow-lg' 
                  : 'glass-dark text-white hover:bg-white/20'
              }`}
            >
              🌳 Tree View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                viewMode === 'grid' 
                  ? 'bg-cyan-500 text-white shadow-lg' 
                  : 'glass-dark text-white hover:bg-white/20'
              }`}
            >
              📋 Grid View
            </button>
          </div>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value as FilterLevel)}
            className="px-3 py-2 rounded-lg glass-dark text-white border border-white/20 focus:border-cyan-400 focus:outline-none text-sm sm:text-base"
          >
            <option value="all">All Levels</option>
            <option value="books">Books Only</option>
            <option value="volumes">Volumes Only</option>
            <option value="sagas">Sagas Only</option>
            <option value="arcs">Arcs Only</option>
            <option value="issues">Issues Only</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-3 py-2 rounded-lg glass-dark text-white border border-white/20 focus:border-cyan-400 focus:outline-none text-sm sm:text-base"
          >
            <option value="release">Release Date</option>
            <option value="price">Price</option>
            <option value="title">Title</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar with quick navigation */}
          <div className="lg:col-span-1">
            <div className="glass-dark rounded-2xl border border-white/20 p-4 sm:p-6 sticky top-24 sm:top-32">
              <h3 className="text-xl font-bold text-white mb-4">Quick Navigation</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg hover:bg-white/10 text-white transition-colors">
                  🔥 Latest Issues
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-white/10 text-white transition-colors">
                  💰 Bundle Deals
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-white/10 text-white transition-colors">
                  ⭐ Recommended
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-white/10 text-white transition-colors">
                  📈 Popular Arcs
                </button>
              </div>

              {user && (
                <div className="mt-6 pt-4 border-t border-white/20">
                  <h4 className="font-bold text-white mb-2">Your Progress</h4>
                  <div className="text-sm text-purple-200 space-y-1">
                    <div>Issues Read: {user.progress?.booksRead || 0}</div>
                    <div>Current Arc: Volume I, Saga 2</div>
                    <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                      <div className="bg-cyan-400 h-2 rounded-full w-1/3" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main shop content */}
          <div className="lg:col-span-3">
            {viewMode === 'tree' ? (
              <HierarchicalShopTree
                data={displayData}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            ) : (
              <GridView
                data={displayData}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            )}
          </div>
        </div>

        {/* Purchase Modal */}
        <ProgressivePurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          item={selectedItem}
          bundleOptions={bundleRecommendations}
          onPurchase={handlePurchase}
        />

        {/* Cart Drawer */}
        <CartDrawer
          isOpen={showCartDrawer}
          onClose={() => setShowCartDrawer(false)}
        />
      </div>
    </div>
  );
};

export default ShopPage;
