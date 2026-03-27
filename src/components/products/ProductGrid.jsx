// src/components/products/ProductGrid.jsx
import React from 'react';
import ProductCard from './ProductCard';
import { FiShoppingBag } from 'react-icons/fi';
const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        <div className="no-products-content">
          <FiShoppingBag className="no-products-icon" />
          <h3>No products found</h3>
          <p>Try adjusting your filters or search criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;