// src/components/orders/RatingModal.jsx
import React, { useState, useEffect } from 'react';
import { FiStar, FiX, FiSend, FiAlertCircle, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { submitRating, updateRating, markItemAsRated } from '../../services/ratingService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import '../../styles/ratingModal.css';

const RatingModal = ({ isOpen, onClose, orderId, item, existingRating, onRatingComplete }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.rating);
      setReview(existingRating.review || '');
      setIsAnonymous(existingRating.isAnonymous || false);
      setIsEditing(true);
    } else {
      setRating(0);
      setReview('');
      setIsAnonymous(false);
      setIsEditing(false);
    }
  }, [existingRating, isOpen]);

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const ratingData = {
        rating,
        review,
        isAnonymous,
        reviewerName: isAnonymous ? null : user?.name,
        productId: item.product._id || item.productId,
        variantId: item.variant._id || item.variantId,
        orderId
      };

      let result;
      if (isEditing && existingRating) {
        result = await updateRating(existingRating._id, ratingData);
      } else {
        result = await submitRating(ratingData);
        
        // Mark item as rated in order only for new ratings
        if (result.success) {
          await markItemAsRated(orderId, item._id || item.id, result.data.ratingId);
        }
      }
      
      setSuccess(true);
      showToast(isEditing ? 'Rating updated successfully!' : 'Thank you for your rating!', 'success');
      
      setTimeout(() => {
        onRatingComplete();
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting rating:', error);
      setError(error.response?.data?.message || 'Failed to submit rating');
      showToast('Failed to submit rating', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="rating-modal-overlay" onClick={onClose}>
      <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
        <button className="rating-modal-close" onClick={onClose}>
          <FiX />
        </button>

        <div className="rating-modal-content">
          {!success ? (
            <>
              <div className="rating-modal-header">
                <h3>{isEditing ? 'Edit Your Rating' : 'Rate Your Purchase'}</h3>
                <p>How would you rate {item.name}?</p>
              </div>

              <div className="rating-stars-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`rating-star ${
                      (hoverRating || rating) >= star ? 'filled' : ''
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>

              <div className="rating-review-container">
                <label htmlFor="review">Write a review (optional)</label>
                <textarea
                  id="review"
                  rows="4"
                  placeholder="Tell us about your experience with this product..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  maxLength="500"
                />
                <div className="review-counter">{review.length}/500</div>
              </div>

              <div className="rating-anonymous-container">
                <label className="anonymous-checkbox">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="anonymous-text">
                    {isAnonymous ? <FiEyeOff /> : <FiEye />}
                    Post anonymously
                  </span>
                </label>
                {isAnonymous && (
                  <p className="anonymous-note">
                    Your name will not be displayed publicly
                  </p>
                )}
                {!isAnonymous && user?.name && (
                  <p className="display-name">
                    Displaying as: <strong>{user.name}</strong>
                  </p>
                )}
              </div>

              {error && (
                <div className="rating-error">
                  <FiAlertCircle />
                  <span>{error}</span>
                </div>
              )}

              <div className="rating-modal-actions">
                <button
                  className="btn-secondary"
                  onClick={onClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleRatingSubmit}
                  disabled={submitting || rating === 0}
                >
                  {submitting ? 'Submitting...' : (isEditing ? 'Update Rating' : 'Submit Rating')}
                  <FiSend />
                </button>
              </div>
            </>
          ) : (
            <div className="rating-success">
              <FiCheckCircle className="success-icon" />
              <h3>Thank You!</h3>
              <p>Your rating has been {isEditing ? 'updated' : 'submitted'} successfully.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingModal;