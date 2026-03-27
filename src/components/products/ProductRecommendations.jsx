// ==========================================
// PRODUCT RECOMMENDATIONS - Shows related products randomly
// ==========================================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRelatedProducts } from '../../services/productService';
import ProductCard from './ProductCard';
import { FiRefreshCw, FiArrowRight } from 'react-icons/fi';

const ProductRecommendations = ({ currentProductId, categoryId, maxItems = 6 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shuffled, setShuffled] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        // Fetch more products than needed to have variety
        const data = await getRelatedProducts(currentProductId, categoryId, maxItems + 4);
        
        // Filter out the current product (just in case)
        const filteredData = data.filter(p => p._id !== currentProductId);
        setProducts(filteredData);
        
        // Randomize order
        setShuffled([...filteredData].sort(() => Math.random() - 0.5));
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentProductId && categoryId) {
      fetchRecommendations();
    }
  }, [currentProductId, categoryId, maxItems]);

  const shuffleProducts = () => {
    setShuffled([...products].sort(() => Math.random() - 0.5));
  };

  if (loading) {
    return (
      <div className="recommendations-section">
        <div className="recommendations-header">
          <h2>You May Also Like</h2>
        </div>
        <div className="recommendations-grid">
          {[...Array(maxItems)].map((_, i) => (
            <div key={i} className="product-card-skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (shuffled.length === 0) {
    return null;
  }

  // Limit to maxItems
  const displayProducts = shuffled.slice(0, maxItems);

  return (
    <div className="recommendations-section">
      <div className="recommendations-header">
        <h2>You May Also Like</h2>
        <div className="recommendations-actions">
          <button 
            className="shuffle-btn"
            onClick={shuffleProducts}
            title="Shuffle products"
            aria-label="Shuffle recommendations"
          >
            <FiRefreshCw />
          </button>
          <Link to="/products" className="see-more-btn">
            See More <FiArrowRight />
          </Link>
        </div>
      </div>
      
      <div className="recommendations-grid">
        {displayProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      
      {shuffled.length > maxItems && (
        <div className="recommendations-footer">
          <Link to="/products" className="view-all-btn">
            Browse All Products <FiArrowRight />
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductRecommendations;