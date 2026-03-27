// src/components/products/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiEye, FiStar, FiHeart, FiPercent, FiDollarSign, FiInfo } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { addToWishlist, removeFromWishlist, checkWishlistStatus } from '../../services/wishlistService';
import '../../styles/productCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Check if product has active discount
  const hasDiscount = product.discount?.isActive && 
    product.discount.type && 
    product.discount.value > 0;

  // Get default variant (first variant)
  const defaultVariant = product.variants?.[0];
  const isOutOfStock = defaultVariant?.stock <= 0;

  // Generate short description (50-100 characters)
  const getShortDescription = () => {
    if (product.description) {
      // Strip HTML tags if any
      const plainText = product.description.replace(/<[^>]*>/g, '');
      if (plainText.length <=30) return plainText;
      return plainText.substring(0, 30) + '...';
    }
    return 'Pure, natural honey from our family-owned apiary.';
  };

  // Check wishlist status on mount and when auth changes
  useEffect(() => {
    const checkStatus = async () => {
      if (isAuthenticated && product._id && defaultVariant) {
        try {
          const result = await checkWishlistStatus(product._id, defaultVariant._id);
          setIsWishlisted(result.isInWishlist === true);
        } catch (error) {
          console.error('Error checking wishlist status:', error);
          setIsWishlisted(false);
        }
      } else {
        setIsWishlisted(false);
      }
    };
    
    checkStatus();
  }, [isAuthenticated, product._id, defaultVariant]);

  // Calculate discount
  const getDiscountInfo = () => {
    if (!hasDiscount) return null;
    
    const firstVariant = product.variants?.[0];
    if (!firstVariant) return null;

    if (product.discount.type === 'percentage') {
      const discountedPrice = firstVariant.price * (1 - product.discount.value / 100);
      return {
        label: `${product.discount.value}% OFF`,
        icon: <FiPercent />,
        originalPrice: firstVariant.price,
        discountedPrice,
        saved: firstVariant.price * (product.discount.value / 100),
        discountValue: product.discount.value,
        type: 'percentage'
      };
    } else {
      const discountedPrice = Math.max(0, firstVariant.price - product.discount.value);
      return {
        label: `KES ${product.discount.value} OFF`,
        icon: <FiDollarSign />,
        originalPrice: firstVariant.price,
        discountedPrice,
        saved: product.discount.value,
        discountValue: product.discount.value,
        type: 'fixed'
      };
    }
  };

  const discountInfo = getDiscountInfo();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!defaultVariant) {
      showToast('This product has no variants available', 'error');
      return;
    }

    if (isOutOfStock) {
      showToast('This product is out of stock', 'error');
      return;
    }

    addToCart(product, defaultVariant, 1);
    showToast(`${product.name} added to cart`, 'success');
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      showToast('Please login to add items to wishlist', 'warning');
      return;
    }

    if (wishlistLoading) return;

    setWishlistLoading(true);
    
    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id, defaultVariant._id);
        setIsWishlisted(false);
        showToast('Removed from wishlist', 'success');
      } else {
        await addToWishlist(product._id, defaultVariant._id);
        setIsWishlisted(true);
        showToast('Added to wishlist', 'success');
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      showToast(error.response?.data?.message || 'Failed to update wishlist', 'error');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const productImage = imageError 
    ? 'https://res.cloudinary.com/dxritu7i3/image/upload/v1773849292/apiary/products/pq0db1jcjs46s1hgkjrp.jpg' 
    : (product.images?.[0]?.url || 'https://res.cloudinary.com/dxritu7i3/image/upload/v1773849292/apiary/products/pq0db1jcjs46s1hgkjrp.jpg');

  const shortDescription = getShortDescription();

  return (
    <div className="product-card">
      <Link to={`/product/${product.slug}`} className="product-link">
        <div className="product-image-container">
          {!imageLoaded && !imageError && (
            <div className="image-skeleton"></div>
          )}
          <img 
            src={productImage}
            alt={product.name}
            className={`product-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />
          
          {/* Discount Badge */}
          {hasDiscount && discountInfo && (
            <div className="discount-badge">
              {/* <span className="discount-icon">{discountInfo.icon}</span> */}
              <span className="discount-label">{discountInfo.label}</span>
              {/* {discountInfo.type === 'percentage' && (
                <span className="discount-value">Save {discountInfo.discountValue}%</span>
              )} */}
            </div>
          )}

          {/* Multiple Discount Badges */}
          {product.variants?.length > 1 && hasDiscount && (
            <div className="discount-badge secondary">
              <FiPercent />
              <span>Up to {Math.max(...product.variants.map(v => 
                product.discount?.type === 'percentage' 
                  ? product.discount.value 
                  : (product.discount?.value / v.price * 100)
              )).toFixed(0)}% OFF
              </span>
            </div>
          )}

          {/* Featured Badge */}
          {product.featured && (
            <div className="featured-badge">
              <FiStar /> Featured
            </div>
          )}

          {/* New Arrival Badge */}
          {new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
            <div className="new-badge">
              New
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="out-of-stock-overlay">
              <span>Out of Stock</span>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="product-actions">
            <button 
              className={`action-btn wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={handleWishlist}
              disabled={wishlistLoading}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart />
            </button>
            <button 
              className="action-btn quick-view-btn" 
              aria-label="Quick view"
            >
              <FiEye />
            </button>
          </div>
        </div>

        <div className="product-card-info">
          <h3 className="product-card-title">{product.name}</h3>
          
          {/* Rating */}
          {product.averageRating > 0 && (
            <div className="product-card-rating">
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

          {/* Short Description - NEW */}
          <div className="product-card-description">
            <FiInfo className="description-icon" />
            <span>{shortDescription}</span>
          </div>

          {/* Price Section */}
          <div className="product-card-price-section">
            {hasDiscount && discountInfo ? (
              <>
                <div className="price-card-container">
                  <span className="discounted-card-price">
                    KES {discountInfo.discountedPrice.toFixed(2)}
                  </span>
                  <span className="original-price">
                    KES {discountInfo.originalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="saved-container">
                  <span className="saved-amount">Save KES {discountInfo.saved.toFixed(2)}</span>
                  {/* {discountInfo.type === 'percentage' && (
                    <span className="discount-percentage">{discountInfo.discountValue}%</span>
                  )} */}
                </div>
              </>
            ) : (
              <span className="regular-card-price">
                KES {defaultVariant?.price?.toFixed(2) || '0.00'}
              </span>
            )}
          </div>

          {/* Variant Info */}
          {product.variants?.length > 1 && (
            <div className="variant-info">
              <span className="variant-count">{product.variants.length} sizes available</span>
              <span className="variant-range">
                KES {Math.min(...product.variants.map(v => v.price)).toFixed(2)} - 
                KES {Math.max(...product.variants.map(v => v.price)).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </Link>

      <button 
        className={`add-to-cart-btn ${isOutOfStock ? 'disabled' : ''}`}
        onClick={handleAddToCart}
        disabled={isOutOfStock}
      >
        <FiShoppingCart />
        <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
      </button>
    </div>
  );
};

export default ProductCard;