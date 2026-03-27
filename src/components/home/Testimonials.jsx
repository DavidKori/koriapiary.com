// src/components/home/Testimonials.jsx
import React, { useState, useEffect } from 'react';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'New York, USA',
      avatar: '/images/avatars/sarah.jpg',
      rating: 5,
      text: 'The raw honey from Apiary Honey is absolutely amazing! You can taste the difference compared to store-bought honey. My family loves it!',
      product: 'Raw Wildflower Honey'
    },
    {
      id: 2,
      name: 'Michael Chen',
      location: 'Toronto, Canada',
      avatar: '/images/avatars/michael.jpg',
      rating: 5,
      text: 'I use their honey for my tea every morning. The quality is consistently excellent, and the delivery is always fast. Highly recommended!',
      product: 'Organic Manuka Honey'
    },
    {
      id: 3,
      name: 'Emma Williams',
      location: 'London, UK',
      avatar: '/images/avatars/emma.jpg',
      rating: 5,
      text: 'Ordered the honey gift set for my mom and she loved it! Beautiful packaging and the honey varieties are all delicious.',
      product: 'Honey Gift Set'
    },
    {
      id: 4,
      name: 'David Omondi',
      location: 'Nairobi, Kenya',
      avatar: '/images/avatars/david.jpg',
      rating: 4,
      text: 'The beeswax candles are wonderful - they burn clean and long. Will definitely order again!',
      product: 'Beeswax Candles'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const testimonial = testimonials[currentIndex];

  return (
    <section className="testimonials-section">
      <h2>What Our Customers Say</h2>
      
      <div className="testimonials-container">
        <button 
          className="testimonial-nav prev" 
          onClick={prevTestimonial}
          aria-label="Previous testimonial"
        >
          <FiChevronLeft />
        </button>

        <div className="testimonial-card futuristic-card">
          <div className="testimonial-header">
            <div className="testimonial-avatar">
              <img src={testimonial.avatar} alt={testimonial.name} />
            </div>
            <div className="testimonial-info">
              <h3>{testimonial.name}</h3>
              <span className="location">{testimonial.location}</span>
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <FiStar 
                    key={i} 
                    className={i < testimonial.rating ? 'star-filled' : 'star-empty'} 
                  />
                ))}
              </div>
            </div>
          </div>
          
          <blockquote className="testimonial-text">
            "{testimonial.text}"
          </blockquote>
          
          <div className="testimonial-product">
            <span>Purchased: {testimonial.product}</span>
          </div>
        </div>

        <button 
          className="testimonial-nav next" 
          onClick={nextTestimonial}
          aria-label="Next testimonial"
        >
          <FiChevronRight />
        </button>
      </div>

      <div className="testimonial-dots">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;