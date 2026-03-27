// src/pages/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { addToWishlist, removeFromWishlist, checkWishlistStatus } from '../services/wishlistService';
import Carousel from '../components/common/Carousel';
import VariantSelector from '../components/products/VariantSelector';
import ProductRecommendations from '../components/products/ProductRecommendations';
import SEO from '../components/common/SEO';
import Loader from '../components/common/Loader';
import { 
  FiShoppingCart, 
  FiHeart, 
  FiShare2, 
  FiCheck, 
  FiTruck, 
  FiRefreshCw, 
  FiShield, 
  FiStar,
  FiAlertCircle
} from 'react-icons/fi';
import '../styles/pages.css';
import '../styles/components.css';

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    console.log('ProductDetails - Slug from URL:', slug);
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      console.log('Setting default variant:', product.variants[0]);
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  // Check wishlist status when product loads or variant changes
  useEffect(() => {
    if (isAuthenticated && product && selectedVariant) {
      checkWishlistStatus(product._id, selectedVariant._id)
        .then(data => {
          setIsWishlisted(data.isInWishlist === true);
        })
        .catch(error => {
          console.error('Error checking wishlist status:', error);
          setIsWishlisted(false);
        });
    } else {
      setIsWishlisted(false);
    }
  }, [isAuthenticated, product, selectedVariant]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching product with slug:', slug);
      
      const data = await getProductBySlug(slug);
      console.log('Product data received:', data);
      
      if (!data) {
        setError('Product not found');
      } else {
        setProduct(data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error.response?.data?.message || 'Failed to load product');
      showToast('Failed to load product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      showToast('Please select a variant', 'warning');
      return;
    }

    addToCart(product, selectedVariant, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      showToast('Please login to add items to wishlist', 'warning');
      return;
    }

    if (!selectedVariant) {
      showToast('Please select a variant', 'warning');
      return;
    }

    if (wishlistLoading) return;

    setWishlistLoading(true);
    
    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id, selectedVariant._id);
        setIsWishlisted(false);
        showToast('Removed from wishlist', 'success');
      } else {
        await addToWishlist(product._id, selectedVariant._id);
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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    } catch (error) {
      console.error('Share error:', error);
      showToast('Failed to copy link', 'error');
    }
  };

  const calculateDiscountedPrice = () => {
    if (!selectedVariant || !product.discount?.isActive) return selectedVariant?.price;

    if (product.discount.type === 'percentage') {
      return selectedVariant.price * (1 - product.discount.value / 100);
    } else {
      return Math.max(0, selectedVariant.price - product.discount.value);
    }
  };

  if (loading) {
    return (
      <div className="product-details-loading">
        <Loader size="large" text="Loading product..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-not-found">
        <FiAlertCircle className="not-found-icon" />
        <h2>Product Not Found</h2>
        <p>{error || 'The product you\'re looking for doesn\'t exist or has been removed.'}</p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  const discountedPrice = calculateDiscountedPrice();
  const hasDiscount = product.discount?.isActive && discountedPrice < selectedVariant?.price;

  return (
    <>
      <SEO 
        title={product.metaTitle || product.name}
        description={product.metaDescription || product.description}
        keywords={product.keywords?.join(', ')}
        image={product.images?.[0]?.url}
        type="product"
      />

      <div className="product-details-page">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="product-details-container">
          {/* Image Carousel */}
          <div className="product-images">
            <Carousel images={product.images || []} autoPlay={false} />
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            {/* Rating */}
            {product.averageRating > 0 && (
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={i < Math.round(product.averageRating) ? 'star-filled' : 'star-empty'} 
                    />
                  ))}
                </div>
                <span className="rating-count">
                  ({product.ratings?.length || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="product-price-section">
              {hasDiscount ? (
                <>
                  <span className="original-price">
                    KES {selectedVariant?.price.toFixed(2)}
                  </span>
                  <span className="discounted-price">
                    KES {discountedPrice.toFixed(2)}
                  </span>
                  <span className="discount-badge-large">
                    {product.discount.type === 'percentage' 
                      ? `${product.discount.value}% OFF` 
                      : `KES ${product.discount.value} OFF`}
                  </span>
                </>
              ) : (
                <span className="current-price">
                  KES {selectedVariant?.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Variant Selector */}
            {product.variants?.length > 0 && (
              <VariantSelector 
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantChange={setSelectedVariant}
              />
            )}

            {/* Quantity Selector */}
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(
                    selectedVariant?.stock || 999,
                    Math.max(1, parseInt(e.target.value) || 1)
                  ))}
                  min="1"
                  max={selectedVariant?.stock || 999}
                />
                <button 
                  onClick={() => setQuantity(Math.min(
                    selectedVariant?.stock || 999, 
                    quantity + 1
                  ))}
                  disabled={quantity >= (selectedVariant?.stock || 999)}
                >
                  +
                </button>
              </div>
              {selectedVariant?.stock > 0 && selectedVariant?.stock < 10 && (
                <span className="low-stock-warning">
                  Only {selectedVariant.stock} left in stock!
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button 
                className={`add-to-cart-btn-large ${addedToCart ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock <= 0}
              >
                {addedToCart ? (
                  <>
                    <FiCheck /> Added to Cart!
                  </>
                ) : (
                  <>
                    <FiShoppingCart /> Add to Cart
                  </>
                )}
              </button>
              
              <button 
                className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={handleWishlist}
                disabled={wishlistLoading}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <FiHeart />
              </button>
              
              <button 
                className="share-btn"
                onClick={handleShare}
                aria-label="Share product"
              >
                <FiShare2 />
              </button>
            </div>

            {/* Stock Status */}
            <div className="stock-status">
              {selectedVariant?.stock > 0 ? (
                <span className="in-stock">
                  ✓ In Stock ({selectedVariant.stock < 50 ? selectedVariant.stock : "50+"} available)
                </span>
              ) : (
                <span className="out-of-stock">
                  ✗ Out of Stock
                </span>
              )}
            </div>

            {/* Product Features */}
            <div className="product-features">
              <div className="feature">
                <FiTruck />
                <span>Free shipping over KES 10,000</span>
              </div>
              <div className="feature">
                <FiRefreshCw />
                <span>7-day returns</span>
              </div>
              <div className="feature">
                <FiShield />
                <span>6-Month warranty</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="product-tabs">
              <div className="tab-headers">
                <button 
                  className={activeTab === 'description' ? 'active' : ''}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button 
                  className={activeTab === 'reviews' ? 'active' : ''}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews ({product.ratings?.length || 0})
                </button>
                <button 
                  className={activeTab === 'shipping' ? 'active' : ''}
                  onClick={() => setActiveTab('shipping')}
                >
                  Shipping
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'description' && (
                  <div className="product-description">
                    <p>{product.description}</p>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="product-reviews">
                    {product.ratings?.length > 0 ? (
                      product.ratings.map((review, index) => (
                        <div key={index} className="review-item">
                          <div className="review-header">
                            <span className="review-author">{review.user?.name || 'Anonymous'}</span>
                            <span className="review-date">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <FiStar key={i} className={i < review.rating ? 'star-filled' : 'star-empty'} />
                            ))}
                          </div>
                          <p className="review-content">{review.review}</p>
                        </div>
                      ))
                    ) : (
                      <p>No reviews yet. Be the first to review this product!</p>
                    )}
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="shipping-info">
                    <h4>Shipping Information</h4>
                    <ul>
                      <li>Free shipping on orders over KES 10,000</li>
                      <li>Standard shipping: 3-5 business days</li>
                      <li>Express shipping: 1-2 business days</li>
                      <li>International shipping available</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Product Tags */}
            {product.keywords?.length > 0 && (
              <div className="product-tags">
                <h4>Tags:</h4>
                <div className="tags-list">
                  {product.keywords.map(tag => (
                    <Link 
                      key={tag} 
                      to={`/products?search=${tag}`}
                      className="tag"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Recommendations */}
        <ProductRecommendations 
          currentProductId={product._id}
          categoryId={product.category?._id}
        />
      </div>
    </>
  );
};

export default ProductDetails;