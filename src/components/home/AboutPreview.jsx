// src/components/home/AboutPreview.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiUsers, FiTruck, FiGlobe } from 'react-icons/fi';

const AboutPreview = () => {
  const stats = [
    { icon: <FiUsers />, value: '50+', label: 'Years Experience' },
    { icon: <FiTruck />, value: '10k+', label: 'Happy Customers' },
    { icon: <FiGlobe />, value: '15+', label: 'Countries' }
  ];

  return (
    <section className="about-preview">
      <div className="about-content">
        <h2>Our Apiary Story</h2>
        <p>
          For over 5 years, we've been dedicated to sustainable beekeeping and producing 
          the finest quality honey. Our bees forage on wildflowers in pristine locations, 
          ensuring every jar is packed with natural goodness.
        </p>

        <div className="about-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        <Link to="/about" className="btn btn-outline">
          Read Our Story <FiArrowRight />
        </Link>
      </div>
      
      <div className="about-image">
        <img src="/images/apiary.jpg" alt="Our apiary" />
        <div className="image-badge">
          <span>Since 1970</span>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;