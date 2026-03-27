// src/pages/Wishlist.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist, moveToCart, clearWishlist } from '../services/wishlistService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Loader from '../components/common/Loader';
import SEO from '../components/common/SEO';
import { 
  FiHeart, 
  FiShoppingCart, 
  FiTrash2, 
  FiX, 
  FiMove,
  FiPackage,
  FiAlertTriangle,
  FiStar
} from 'react-icons/fi';
import '../styles/wishlist.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState({ items: [], totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [movingItems, setMovingItems] = useState({});
  const { isAuthenticated } = useAuth();
  // const { addToCart } = useCart();
  const { showToast } = useToast();
    const { refreshCart } = useCart(); // Add this


  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const data = await getWishlist();
      setWishlist({
        items: data.items || [],
        totalItems: data.totalItems || 0
      });
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      showToast('Failed to fetch wishlist', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId, variantId) => {
    try {
      await removeFromWishlist(productId, variantId);
      await fetchWishlist();
      showToast('Item removed from wishlist', 'success');
    } catch (error) {
      console.error('Error removing item:', error);
      showToast('Failed to remove item', 'error');
    }
  };

// In Wishlist.jsx, update the handleMoveToCart function
  const handleMoveToCart = async (productId, variantId, item) => {
    setMovingItems(prev => ({ ...prev, [variantId]: true }));
    try {
      await moveToCart(productId, variantId, 1);
      await fetchWishlist(); // Refresh wishlist
      await refreshCart(); // Refresh cart using context
      showToast('Item moved to cart', 'success');
    } catch (error) {
      console.error('Error moving to cart:', error);
      showToast('Failed to move item to cart', 'error');
    } finally {
      setMovingItems(prev => ({ ...prev, [variantId]: false }));
    }
  };


  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      try {
        await clearWishlist();
        await fetchWishlist();
        showToast('Wishlist cleared', 'success');
      } catch (error) {
        console.error('Error clearing wishlist:', error);
        showToast('Failed to clear wishlist', 'error');
      }
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    if (!discount?.isActive) return price;
    if (discount.type === 'percentage') {
      return price * (1 - discount.value / 100);
    }
    return Math.max(0, price - discount.value);
  };

  if (!isAuthenticated) {
    return (
      <div className="wishlist-page">
        <div className="auth-required">
          <FiHeart className="auth-icon" />
          <h2>Authentication Required</h2>
          <p>Please log in to view your wishlist</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loader size="large" text="Loading your wishlist..." />;
  }

  return (
    <>
      <SEO 
        title="My Wishlist"
        description="View and manage your saved items"
      />

      <div className="wishlist-page">
        <div className="page-header">
          <h1 className="page-title">
            <FiHeart className="title-icon" />
            My Wishlist
          </h1>
          <p className="page-description">
            Items you've saved for later
          </p>
          {wishlist.totalItems > 0 && (
            <button 
              className="clear-wishlist-btn"
              onClick={handleClearWishlist}
            >
              <FiTrash2 /> Clear Wishlist
            </button>
          )}
        </div>

        {wishlist.totalItems === 0 ? (
          <div className="empty-wishlist">
            <FiHeart className="empty-icon" />
            <h3>Your Wishlist is Empty</h3>
            <p>Start adding items you love to your wishlist</p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.items.map((item) => {
              const product = item.product;
              const variant = item.variant;
              const discountedPrice = calculateDiscountedPrice(variant.price, product.discount);
              const hasDiscount = product.discount?.isActive && discountedPrice < variant.price;

              return (
                <div key={`${product._id}-${variant._id}`} className="wishlist-card futuristic-card">
                  <Link to={`/product/${product.slug}`} className="wishlist-link">
                    <div className="wishlist-image">
                      <img 
                        src={product.images?.[0]?.url || '/images/placeholder.jpg'} 
                        alt={product.name}
                      />
                      {hasDiscount && (
                        <div className="discount-badge-small">
                          {product.discount.type === 'percentage' 
                            ? `${product.discount.value}% OFF` 
                            : `$${product.discount.value} OFF`}
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="wishlist-info">
                    <Link to={`/product/${product.slug}`} className="product-title">
                      {product.name}
                    </Link>
                    <div className="product-variant">{variant.name}</div>
                    
                    {/* Rating */}
                    {product.averageRating > 0 && (
                      <div className="product-rating-small">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <FiStar 
                              key={i} 
                              className={i < Math.round(product.averageRating) ? 'star-filled' : 'star-empty'} 
                            />
                          ))}
                        </div>
                        <span className="rating-count">({product.ratings?.length || 0})</span>
                      </div>
                    )}

                    <div className="product-price">
                      {hasDiscount ? (
                        <>
                          <span className="discounted-price">
                            KSh {discountedPrice.toLocaleString()}
                          </span>
                          <span className="original-price">
                            KSh {variant.price.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="regular-price">
                          KSh {variant.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="stock-status">
                      {variant.stock > 0 ? (
                        <span className="in-stock">In Stock</span>
                      ) : (
                        <span className="out-of-stock">Out of Stock</span>
                      )}
                    </div>
                  </div>

                  <div className="wishlist-actions">
                    <button
                      className="action-btn move-to-cart"
                      onClick={() => handleMoveToCart(product._id, variant._id, item)}
                      disabled={movingItems[variant._id] || variant.stock <= 0}
                    >
                      {movingItems[variant._id] ? (
                        <span className="spinner-small"></span>
                      ) : (
                        <>
                          <FiMove /> Move to Cart
                        </>
                      )}
                    </button>
                    <button
                      className="action-btn remove"
                      onClick={() => handleRemoveItem(product._id, variant._id)}
                    >
                      <FiX /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;