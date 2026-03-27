// src/components/home/Categories.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const Categories = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  // Category icons mapping
  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Raw Honey': '🍯',
      'Flavored Honey': '🌸',
      'Beeswax': '🕯️',
      'Gifts': '🎁',
      'Beekeeping': '🐝',
      'Health': '💚',
      'Organic': '🌿',
      'Wildflower': '🌼'
    };
    return icons[categoryName] || '🍯';
  };

  return (
    <section className="categories-section">
      <div className="section-header">
        <h2>Shop by Category</h2>
        <Link to="/products" className="view-all">
          View All <FiArrowRight />
        </Link>
      </div>

      <div className="categories-grid">
        {categories.map(category => (
          <Link 
            key={category._id} 
            to={`/products?category=${category.slug || category._id}`}
            className="category-card futuristic-card"
          >
            <div className="category-icon">
              {getCategoryIcon(category.name)}
            </div>
            <h3>{category.name}</h3>
            <p>{category.productCount || 0} products</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;