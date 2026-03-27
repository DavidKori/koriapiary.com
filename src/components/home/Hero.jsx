// src/components/home/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiHeart } from 'react-icons/fi';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          Pure Nature,
          <span className="gradient-text"> Sweet Life</span>
        </h1>
        <p className="hero-subtitle">
          Discover the purest honey directly from our family-owned apiary. 
          Raw, unfiltered, and packed with natural goodness.
        </p>
        <div className="hero-cta">
          <Link to="/products" className="btn btn-primary btn-glow">
            Shop Now <FiArrowRight />
          </Link>
          <Link to="/about" className="btn btn-outline">
            Our Story
          </Link>
        </div>
      </div>
      <div className="hero-image">
        <img src="/images/hero-honey.jpg" alt="Honey harvest" />
        <div className="floating-badge">
          <FiHeart />
          <span>100% Organic</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;