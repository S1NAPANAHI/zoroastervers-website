import React, { useState, useCallback } from 'react';
import { TreeNode, CartItem } from '@/types/shop';
import { useInventory } from '@/lib/hooks/useInventory';
import { useCart } from '@/app/contexts/CartContext';
import HierarchicalShopTree from '../HierarchicalShopTree';
import GridView from '../GridView';

interface InventoryExplorerProps {
  initialData?: TreeNode[];
}

const InventoryExplorer: React.FC<InventoryExplorerProps> = ({ initialData }) => {
  const [viewMode, setViewMode] = useState<'tree' | 'grid' | 'route'>('tree');
  const { addToCart } = useCart();

  const { inventory, hierarchicalInventory } = useInventory({ includeHierarchy: true });

  const handleAddToCart = useCallback((item: CartItem) => {
    addToCart(item);
  }, [addToCart]);

  const handleViewDetails = (itemId: string, type: string) => {
    // Logic to view details about the item
    console.log(`Viewing details for ${itemId} of type ${type}`);
  };

  const displayData = initialData || hierarchicalInventory || [];

  return (
    <div className="space-y-4">
      {/* Toggle Buttons */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={() => setViewMode('tree')}
          className={`neon-button ${viewMode === 'tree' && 'shadow-lg'}`}
        >
          🌳 Tree View
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`neon-button ${viewMode === 'grid' && 'shadow-lg'}`}
        >
          📋 Grid View
        </button>
      </div>

      {/* Renderer */}
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
  );
};

export default InventoryExplorer;
