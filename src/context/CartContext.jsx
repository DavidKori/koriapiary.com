// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { 
  getCart, 
  addToCart as apiAddToCart, 
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
  syncCart 
} from '../services/cartService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Generate consistent unique ID for cart item
  const generateItemId = (productId, variantId) => {
    return `${productId}|${variantId}`;
  };

  // Load cart when user changes
  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    setLoading(true);
    try {
      if (isAuthenticated && user) {
        const cartData = await getCart();
        const transformedItems = (cartData.items || []).map(item => ({
          id: generateItemId(item.product._id, item.variant._id),
          productId: item.product._id,
          variantId: item.variant._id,
          productName: item.product.name,
          variantName: item.variant.name,
          price: item.price,
          quantity: item.quantity,
          image: item.product.images?.[0]?.url || '',
          maxStock: item.variant.stock,
          discount: item.product.discount
        }));
        
        // Remove any duplicates that might exist in the loaded data
        const uniqueItems = [];
        const seenIds = new Set();
        
        for (const item of transformedItems) {
          if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            uniqueItems.push(item);
          } else {
            // Merge quantities if duplicate found
            const existing = uniqueItems.find(i => i.id === item.id);
            if (existing) {
              existing.quantity += item.quantity;
            }
          }
        }
        
        setCartItems(uniqueItems);
      } else {
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          const parsedCart = JSON.parse(localCart);
          // Remove duplicates from local cart
          const uniqueItems = [];
          const seenIds = new Set();
          
          for (const item of parsedCart) {
            if (!seenIds.has(item.id)) {
              seenIds.add(item.id);
              uniqueItems.push(item);
            } else {
              // Merge quantities if duplicate found
              const existing = uniqueItems.find(i => i.id === item.id);
              if (existing) {
                existing.quantity += item.quantity;
              }
            }
          }
          setCartItems(uniqueItems);
        } else {
          setCartItems([]);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      showToast('Failed to load cart', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Save to localStorage for guests
  useEffect(() => {
    if (!isAuthenticated && cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } else if (!isAuthenticated && cartItems.length === 0) {
      localStorage.removeItem('cart');
    }
  }, [cartItems, isAuthenticated]);

  // Sync cart when user logs in
  useEffect(() => {
    const syncGuestCart = async () => {
      if (isAuthenticated && user) {
        const localCart = localStorage.getItem('cart');
        if (localCart && JSON.parse(localCart).length > 0) {
          try {
            const guestItems = JSON.parse(localCart);
            // Merge guest items by ID
            const mergedItems = [];
            const seenIds = new Set();
            
            for (const item of guestItems) {
              if (!seenIds.has(item.id)) {
                seenIds.add(item.id);
                mergedItems.push({
                  productId: item.productId,
                  variantId: item.variantId,
                  quantity: item.quantity
                });
              } else {
                const existing = mergedItems.find(i => i.productId === item.productId && i.variantId === item.variantId);
                if (existing) {
                  existing.quantity += item.quantity;
                }
              }
            }
            
            await syncCart(mergedItems);
            await loadCart();
            localStorage.removeItem('cart');
            showToast('Your cart has been synced', 'success');
          } catch (error) {
            console.error('Error syncing cart:', error);
          }
        }
      }
    };

    syncGuestCart();
  }, [isAuthenticated, user]);

// In CartContext.jsx, add this logging to the addToCart function
const addToCart = async (product, variant, quantity = 1) => {
  const itemId = generateItemId(product._id, variant._id);
  
  console.log('Adding to cart:', {
    productId: product._id,
    variantId: variant._id,
    quantity,
    itemId,
    existingItems: cartItems.map(i => ({ id: i.id, qty: i.quantity }))
  });
  
  try {
    if (isAuthenticated) {
      await apiAddToCart({
        productId: product._id,
        variantId: variant._id,
        quantity
      });
      await loadCart();
    } else {
      setCartItems(prev => {
        const existingItemIndex = prev.findIndex(item => item.id === itemId);
        
        if (existingItemIndex >= 0) {
          const updated = [...prev];
          const newQuantity = updated[existingItemIndex].quantity + quantity;
          console.log(`Item exists, updating quantity from ${updated[existingItemIndex].quantity} to ${newQuantity}`);
          if (newQuantity <= variant.stock) {
            updated[existingItemIndex] = {
              ...updated[existingItemIndex],
              quantity: newQuantity
            };
          }
          return updated;
        } else {
          console.log('New item, adding to cart');
          const newItem = {
            id: itemId,
            productId: product._id,
            variantId: variant._id,
            productName: product.name,
            variantName: variant.name,
            price: variant.price,
            quantity,
            image: product.images?.[0]?.url || '',
            maxStock: variant.stock,
            discount: product.discount
          };
          return [...prev, newItem];
        }
      });
    }
    showToast(`${product.name} added to cart`, 'success');
  } catch (error) {
    console.error('Error adding to cart:', error);
    showToast('Failed to add to cart', 'error');
  }
};

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    try {
      if (isAuthenticated) {
        const item = cartItems.find(i => i.id === itemId);
        if (item) {
          await apiUpdateCartItem(item.productId, item.variantId, newQuantity);
          await loadCart();
        }
      } else {
        setCartItems(prev =>
          prev.map(item =>
            item.id === itemId
              ? { ...item, quantity: Math.min(newQuantity, item.maxStock) }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      showToast('Failed to update quantity', 'error');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      if (isAuthenticated) {
        const item = cartItems.find(i => i.id === itemId);
        if (item) {
          await apiRemoveFromCart(item.productId, item.variantId);
          await loadCart();
        }
      } else {
        setCartItems(prev => prev.filter(item => item.id !== itemId));
      }
      showToast('Item removed from cart', 'info');
    } catch (error) {
      console.error('Error removing from cart:', error);
      showToast('Failed to remove item', 'error');
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await apiClearCart();
        await loadCart();
      } else {
        setCartItems([]);
        localStorage.removeItem('cart');
      }
      showToast('Cart cleared', 'info');
    } catch (error) {
      console.error('Error clearing cart:', error);
      showToast('Failed to clear cart', 'error');
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KES'
  }).format(cartTotal);
    const refreshCart = async () => {
    await loadCart();
  };
  const cartDiscount = cartItems.reduce((sum,item) => sum - item.discount, 0)
  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
    cartTotal,
    formattedTotal,
    itemCount,
    cartDiscount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};