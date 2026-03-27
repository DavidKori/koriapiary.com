// src/components/home/Features.jsx
import React from 'react';
import { FiTruck, FiShield, FiClock, FiHeart, FiAward, FiLeaf } from 'react-icons/fi';

const Features = () => {
  const features = [
    {
      icon: <FiTruck />,
      title: 'Free Shipping',
      description: 'On orders over $50',
      color: '#4a90e2'
    },
    {
      icon: <FiShield />,
      title: 'Quality Guaranteed',
      description: '100% pure honey',
      color: '#27ae60'
    },
    {
      icon: <FiClock />,
      title: 'Fast Delivery',
      description: '2-3 business days',
      color: '#f39c12'
    },
    {
      icon: <FiHeart />,
      title: 'Eco-Friendly',
      description: 'Sustainable practices',
      color: '#e74c3c'
    },
    {
      icon: <FiAward />,
      title: 'Award Winning',
      description: 'Golden taste award',
      color: '#9b59b6'
    },
    {
      icon: <FiLeaf />,
      title: '100% Organic',
      description: 'Certified organic',
      color: '#2ecc71'
    }
  ];

  return (
    <section className="features-section">
      <div className="features-grid">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="feature-card futuristic-card"
            style={{ '--feature-color': feature.color }}
          >
            <div className="feature-icon-wrapper">
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;