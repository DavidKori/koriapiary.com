// src/components/home/FeaturedProducts.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import ProductCard from '../products/ProductCard';

const FeaturedProducts = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="featured-section">
      <div className="section-header">
        <h2>Featured Products</h2>
        <Link to="/products" className="view-all">
          View All <FiArrowRight />
        </Link>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;