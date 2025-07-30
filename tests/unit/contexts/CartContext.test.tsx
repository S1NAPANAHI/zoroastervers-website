import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '@/app/contexts/CartContext'
import { CartItem } from '@/types/shop'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>
    {children}
  </CartProvider>
)

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: TestWrapper
    })

    expect(result.current.cartItems).toEqual([])
    expect(result.current.getCartTotal()).toBe(0)
    expect(result.current.getCartItemCount()).toBe(0)
  })

  test('should add items to cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: TestWrapper
    })

    const testItem: CartItem = {
      id: '1',
      type: 'book',
      title: 'Test Book',
      price: 15.99,
      quantity: 1,
      coverImage: '/test.jpg',
      description: 'A test book'
    }

    act(() => {
      result.current.addToCart(testItem)
    })

    expect(result.current.cartItems).toHaveLength(1)
    expect(result.current.cartItems[0]).toEqual(testItem)
    expect(result.current.getCartTotal()).toBe(15.99)
    expect(result.current.getCartItemCount()).toBe(1)
    expect(result.current.isInCart('1')).toBe(true)
  })

  test('should update quantity when adding existing item', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: TestWrapper
    })

    const testItem: CartItem = {
      id: '1',
      type: 'book',
      title: 'Test Book',
      price: 15.99,
      quantity: 1,
      coverImage: '/test.jpg',
      description: 'A test book'
    }

    act(() => {
      result.current.addToCart(testItem)
      result.current.addToCart({ ...testItem, quantity: 2 })
    })

    expect(result.current.cartItems).toHaveLength(1)
    expect(result.current.cartItems[0].quantity).toBe(3)
    expect(result.current.getCartTotal()).toBe(47.97) // 15.99 * 3
    expect(result.current.getCartItemCount()).toBe(3)
  })

  test('should remove items from cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: TestWrapper
    })

    const testItem: CartItem = {
      id: '1',
      type: 'book',
      title: 'Test Book',
      price: 15.99,
      quantity: 1,
      coverImage: '/test.jpg',
      description: 'A test book'
    }

    act(() => {
      result.current.addToCart(testItem)
    })

    expect(result.current.cartItems).toHaveLength(1)

    act(() => {
      result.current.removeFromCart('1')
    })

    expect(result.current.cartItems).toHaveLength(0)
    expect(result.current.isInCart('1')).toBe(false)
  })

  test('should update item quantity', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: TestWrapper
    })

    const testItem: CartItem = {
      id: '1',
      type: 'book',
      title: 'Test Book',
      price: 15.99,
      quantity: 1,
      coverImage: '/test.jpg',
      description: 'A test book'
    }

    act(() => {
      result.current.addToCart(testItem)
    })

    act(() => {
      result.current.updateQuantity('1', 5)
    })

    expect(result.current.cartItems[0].quantity).toBe(5)
    expect(result.current.getCartTotal()).toBe(79.95) // 15.99 * 5
  })

  test('should remove item when quantity is zero or negative', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: TestWrapper
    })

    const testItem: CartItem = {
      id: '1',
      type: 'book',
      title: 'Test Book',
      price: 15.99,
      quantity: 1,
      coverImage: '/test.jpg',
      description: 'A test book'
    }

    act(() => {
      result.current.addToCart(testItem)
    })

    act(() => {
      result.current.updateQuantity('1', 0)
    })

    expect(result.current.cartItems).toHaveLength(0)

    act(() => {
      result.current.addToCart(testItem)
      result.current.updateQuantity('1', -1)
    })

    expect(result.current.cartItems).toHaveLength(0)
  })

  test('should clear entire cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: TestWrapper
    })

    const testItem1: CartItem = {
      id: '1',
      type: 'book',
      title: 'Test Book 1',
      price: 15.99,
      quantity: 1,
      coverImage: '/test1.jpg',
      description: 'A test book'
    }

    const testItem2: CartItem = {
      id: '2',
      type: 'volume',
      title: 'Test Volume 2',
      price: 12.99,
      quantity: 2,
      coverImage: '/test2.jpg',
      description: 'A test volume'
    }

    act(() => {
      result.current.addToCart(testItem1)
      result.current.addToCart(testItem2)
    })

    expect(result.current.cartItems).toHaveLength(2)

    act(() => {
      result.current.clearCart()
    })

    expect(result.current.cartItems).toHaveLength(0)
    expect(result.current.getCartTotal()).toBe(0)
    expect(result.current.getCartItemCount()).toBe(0)
  })

  test('should calculate total correctly with multiple items', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: TestWrapper
    })

    const testItem1: CartItem = {
      id: '1',
      type: 'book',
      title: 'Test Book 1',
      price: 15.99,
      quantity: 2,
      coverImage: '/test1.jpg',
      description: 'A test book'
    }

    const testItem2: CartItem = {
      id: '2',
      type: 'volume',
      title: 'Test Volume 2',
      price: 12.50,
      quantity: 3,
      coverImage: '/test2.jpg',
      description: 'A test volume'
    }

    act(() => {
      result.current.addToCart(testItem1)
      result.current.addToCart(testItem2)
    })

    // 15.99 * 2 + 12.50 * 3 = 31.98 + 37.50 = 69.48
    expect(result.current.getCartTotal()).toBe(69.48)
    expect(result.current.getCartItemCount()).toBe(5)
  })

  test('should persist cart in localStorage', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: TestWrapper
    })

    const testItem: CartItem = {
      id: '1',
      type: 'book',
      title: 'Test Book',
      price: 15.99,
      quantity: 1,
      coverImage: '/test.jpg',
      description: 'A test book'
    }

    act(() => {
      result.current.addToCart(testItem)
    })

    const savedCart = localStorage.getItem('novel-hub-cart')
    expect(savedCart).toBeTruthy()
    expect(JSON.parse(savedCart!)).toEqual([testItem])
  })

  test('should load cart from localStorage on initialization', () => {
    const testItem: CartItem = {
      id: '1',
      type: 'book',
      title: 'Test Book',
      price: 15.99,
      quantity: 1,
      coverImage: '/test.jpg',
      description: 'A test book'
    }

    localStorage.setItem('novel-hub-cart', JSON.stringify([testItem]))

    const { result } = renderHook(() => useCart(), {
      wrapper: TestWrapper
    })

    expect(result.current.cartItems).toEqual([testItem])
    expect(result.current.getCartTotal()).toBe(15.99)
  })

  test('should handle corrupted localStorage data gracefully', () => {
    localStorage.setItem('novel-hub-cart', 'invalid-json')

    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    const { result } = renderHook(() => useCart(), {
      wrapper: TestWrapper
    })

    expect(result.current.cartItems).toEqual([])
    expect(consoleError).toHaveBeenCalled()

    consoleError.mockRestore()
  })

  test('should throw error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      renderHook(() => useCart())
    }).toThrow('useCart must be used within a CartProvider')

    consoleError.mockRestore()
  })
})
