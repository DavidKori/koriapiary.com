// src/pages/settings/ReviewsTab.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getUserRatings, deleteRating } from '../../services/ratingService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import RatingModal from '../../components/orders/RatingModal';
import { 
  FiStar, 
  FiEdit2, 
  FiTrash2, 
  FiShoppingBag,
  FiCalendar,
  FiThumbsUp,
  FiSmile,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { MdVerified, MdRateReview } from 'react-icons/md';
import '../../styles/reviews.css';

const ReviewsTab = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }
  });
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      loadReviews();
    }
  }, [isAuthenticated]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      // Fetch user's ratings from the API
      const data = await getUserRatings();
      const userReviews = data || [];
      setReviews(userReviews);
      
      // Calculate stats from user's reviews
      const total = userReviews.length;
      const avg = total > 0 ? userReviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      userReviews.forEach(r => {
        distribution[r.rating] = (distribution[r.rating] || 0) + 1;
      });
      
      setStats({
        totalReviews: total,
        averageRating: avg,
        ratingDistribution: distribution
      });
    } catch (error) {
      console.error('Error loading reviews:', error);
      showToast('Failed to load your reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setSelectedReview(review);
    setShowEditModal(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        await deleteRating(reviewId);
        showToast('Review deleted successfully', 'success');
        loadReviews(); // Refresh the list
      } catch (error) {
        console.error('Error deleting review:', error);
        showToast(error.response?.data?.message || 'Failed to delete review', 'error');
      }
    }
  };

  const handleRatingUpdate = () => {
    setShowEditModal(false);
    setSelectedReview(null);
    loadReviews(); // Refresh reviews
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderStars = (rating) => {
    return (
      <div className="stars-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`star ${star <= rating ? 'filled' : 'empty'}`}
          />
        ))}
      </div>
    );
  };

  const renderRatingBar = (stars, count) => {
    const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
    return (
      <div className="rating-bar-item">
        <span className="rating-star-label">{stars} ★</span>
        <div className="rating-bar-track">
          <div 
            className="rating-bar-fill" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="rating-count">{count}</span>
      </div>
    );
  };

  if (loading) {
    return <Loader size="small" text="Loading your reviews..." />;
  }

  return (
    <div className="reviews-tab">
      <div className="tab-header">
        <h2>
          <MdRateReview className="header-icon" />
          My Reviews
        </h2>
        <p className="tab-description">
          Share your thoughts and help others discover our products
        </p>
      </div>

      {/* Stats Overview - Only show if user has reviews */}
      {stats.totalReviews > 0 && (
        <div className="reviews-stats">
          <div className="stats-card">
            <div className="stats-main">
              <div className="average-rating">
                <span className="rating-value">{stats.averageRating.toFixed(1)}</span>
                <div className="stars-large">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <span className="total-reviews">Based on {stats.totalReviews} of your reviews</span>
              </div>
              <div className="rating-distribution">
                {renderRatingBar(5, stats.ratingDistribution[5])}
                {renderRatingBar(4, stats.ratingDistribution[4])}
                {renderRatingBar(3, stats.ratingDistribution[3])}
                {renderRatingBar(2, stats.ratingDistribution[2])}
                {renderRatingBar(1, stats.ratingDistribution[1])}
              </div>
            </div>
            <div className="stats-footer">
              <div className="stat-item">
                <FiSmile className="stat-icon" />
                <span>Thank you for sharing your feedback!</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="empty-reviews">
          <FiStar className="empty-icon" />
          <h3>No Reviews Yet</h3>
          <p>You haven't written any reviews yet. Share your experience with our products!</p>
          <Link to="/products" className="btn btn-primary">
            <FiShoppingBag /> Start Shopping
          </Link>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="product-info">
                  <div className="product-image">
                    <img 
                      src={review.product?.images?.[0]?.url || '/images/placeholder.jpg'} 
                      alt={review.product?.name}
                    />
                  </div>
                  <div className="product-details">
                    <Link to={`/product/${review.product?.slug}`} className="product-name">
                      {review.product?.name}
                    </Link>
                    {review.isAnonymous ? (
                      <span className="anonymous-badge">
                        <FiEyeOff /> Anonymous
                      </span>
                    ) : (
                      <span className="verified-badge">
                        <FiEye /> {review.displayName || review.reviewerName || user?.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="review-actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEditReview(review)}
                    title="Edit review"
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteReview(review._id)}
                    title="Delete review"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <div className="review-content">
                <div className="review-rating">
                  {renderStars(review.rating)}
                  <span className="review-date">
                    <FiCalendar /> {formatDate(review.createdAt)}
                  </span>
                  {review.isEdited && (
                    <span className="edited-badge">
                      <FiEdit2 /> Edited
                    </span>
                  )}
                </div>
                <p className="review-text">{review.review || 'No review text provided.'}</p>
              </div>

              <div className="review-footer">
                <Link to={`/product/${review.product?.slug}`} className="view-product-btn">
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Rating Modal */}
      {showEditModal && selectedReview && (
        <RatingModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedReview(null);
          }}
          orderId={selectedReview.order}
          item={{
            productId: selectedReview.product,
            variantId: selectedReview.variant,
            name: selectedReview.product?.name || 'Product',
            product: selectedReview.product
          }}
          existingRating={{
            rating: selectedReview.rating,
            review: selectedReview.review,
            isAnonymous: selectedReview.isAnonymous
          }}
          onRatingComplete={handleRatingUpdate}
        />
      )}
    </div>
  );
};

export default ReviewsTab;