// ==========================================
// CAROUSEL - Image carousel for product details
// ==========================================
import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiMaximize } from 'react-icons/fi';

const Carousel = ({ images, autoPlay = false, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="carousel-placeholder">
        <span>No images available</span>
      </div>
    );
  }

  return (
    <>
      <div className="carousel-container">
        <div className="carousel-main">
          <img 
            src={images[currentIndex].url || images[currentIndex]} 
            alt={`Product view ${currentIndex + 1}`}
            className="carousel-image"
            onClick={() => setIsModalOpen(true)}
          />
          
          <button 
            className="carousel-nav prev" 
            onClick={prevSlide}
            aria-label="Previous image"
          >
            <FiChevronLeft />
          </button>
          
          <button 
            className="carousel-nav next" 
            onClick={nextSlide}
            aria-label="Next image"
          >
            <FiChevronRight />
          </button>

          <button 
            className="carousel-expand"
            onClick={() => setIsModalOpen(true)}
            aria-label="Expand image"
          >
            <FiMaximize />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="carousel-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            >
              <img 
                src={image.url || image} 
                alt={`Thumbnail ${index + 1}`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div className="carousel-modal" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={images[currentIndex].url || images[currentIndex]} 
              alt="Full size"
            />
            <button 
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Carousel;