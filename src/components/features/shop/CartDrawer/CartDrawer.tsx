'use client';

import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { BundlePricingCalculator } from '@/utils/bundlePricing';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  if (!isOpen) return null;

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

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-md h-full bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div>
              <h2 className="text-2xl font-bold text-white">Shopping Cart</h2>
              <p className="text-sm text-purple-200">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-bold text-white mb-2">Your cart is empty</h3>
                <p className="text-purple-200 mb-6">
                  Discover our amazing collection of books, volumes, and issues!
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="glass-dark rounded-xl p-4 border border-white/20"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Item Icon */}
                      <div className="text-3xl">
                        {getTypeIcon(item.type)}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-purple-200 line-clamp-1 mb-2">
                          {item.description}
                        </p>
                        
                        {/* Type Badge */}
                        <div className="inline-block px-2 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full uppercase font-semibold">
                          {item.type}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-6 h-6 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 text-xs flex items-center justify-center transition-colors"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-white/70">Qty:</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-white font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-white/60">
                          {BundlePricingCalculator.formatPrice(item.price)} each
                        </div>
                        <div className="text-lg font-bold text-cyan-400">
                          {BundlePricingCalculator.formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                {cartItems.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="w-full py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer with Total and Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-white/20 bg-black/20">
              <div className="mb-4">
                <div className="flex items-center justify-between text-lg font-bold text-white">
                  <span>Total:</span>
                  <span className="text-2xl text-cyan-400">
                    {BundlePricingCalculator.formatPrice(getCartTotal())}
                  </span>
                </div>
                <div className="text-xs text-white/60 mt-1">
                  Taxes and shipping calculated at checkout
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg">
                  🛒 Proceed to Checkout
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-white/60">
                <div className="flex items-center space-x-1">
                  <span>🔒</span>
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>📱</span>
                  <span>Instant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>💯</span>
                  <span>Guaranteed</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
