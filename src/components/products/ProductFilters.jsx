// src/components/products/ProductFilters.jsx
import React, { useState, useEffect } from 'react';
import { FiSearch, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const ProductFilters = ({ categories = [], filters = {}, onFilterChange, onClear }) => {
  // Ensure filters has default values
  const safeFilters = {
    category: filters?.category || '',
    search: filters?.search || '',
    minPrice: filters?.minPrice || '',
    maxPrice: filters?.maxPrice || '',
    sort: filters?.sort || 'createdAt:desc'
  };

  const [searchInput, setSearchInput] = useState(safeFilters.search);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    sort: true
  });
  const [priceRange, setPriceRange] = useState({
    min: safeFilters.minPrice || '',
    max: safeFilters.maxPrice || ''
  });

  // Update local state when filters change
  useEffect(() => {
    setSearchInput(safeFilters.search);
    setPriceRange({
      min: safeFilters.minPrice || '',
      max: safeFilters.maxPrice || ''
    });
  }, [filters]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== safeFilters.search) {
        onFilterChange({ search: searchInput });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (categoryId) => {
    onFilterChange({ category: categoryId });
  };

  const handlePriceChange = (type, value) => {
    const newRange = { ...priceRange, [type]: value };
    setPriceRange(newRange);
  };

  const applyPriceFilter = () => {
    if (priceRange.min && priceRange.max) {
      onFilterChange({
        minPrice: priceRange.min,
        maxPrice: priceRange.max
      });
    }
  };

  const clearPriceFilter = () => {
    setPriceRange({ min: '', max: '' });
    onFilterChange({
      minPrice: undefined,
      maxPrice: undefined
    });
  };

  const sortOptions = [
    { value: 'createdAt:desc', label: 'Newest First' },
    { value: 'price:asc', label: 'Price: Low to High' },
    { value: 'price:desc', label: 'Price: High to Low' },
    { value: 'name:asc', label: 'Name: A to Z' },
    { value: 'name:desc', label: 'Name: Z to A' },
    { value: 'soldCount:desc', label: 'Best Selling' }
  ];

  const hasActiveFilters = safeFilters.category || safeFilters.search || (safeFilters.minPrice && safeFilters.maxPrice);

  // Ensure categories is an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="product-filters">
      {/* Search Box */}
      <div className="filter-section">
        <div className="filter-section-header">
          <h4>Search</h4>
        </div>
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          {searchInput && (
            <button 
              className="clear-search"
              onClick={() => {
                setSearchInput('');
                onFilterChange({ search: '' });
              }}
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="filter-section">
        <div 
          className="filter-section-header"
          onClick={() => toggleSection('categories')}
        >
          <h4>Categories</h4>
          {expandedSections.categories ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        {expandedSections.categories && (
          <div className="categories-list">
            <button
              className={`category-option ${!safeFilters.category ? 'active' : ''}`}
              onClick={() => handleCategoryChange('')}
            >
              All Categories
            </button>
            {safeCategories.map(category => (
              <button
                key={category._id}
                className={`category-option ${safeFilters.category === category._id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category._id)}
              >
                <span className="category-name">{category.name}</span>
                {category.productCount > 0 && (
                  <span className="category-count">({category.productCount})</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <div 
          className="filter-section-header"
          onClick={() => toggleSection('price')}
        >
          <h4>Price Range</h4>
          {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        {expandedSections.price && (
          <div className="price-filter">
            <div className="price-inputs">
              <div className="price-input-group">
                <span className="currency">Ksh</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <span className="price-separator">-</span>
              <div className="price-input-group">
                <span className="currency">Ksh</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="price-actions">
              <button 
                className="apply-price-btn"
                onClick={applyPriceFilter}
                disabled={!priceRange.min || !priceRange.max}
              >
                Apply
              </button>
              {(safeFilters.minPrice || safeFilters.maxPrice) && (
                <button 
                  className="clear-price-btn"
                  onClick={clearPriceFilter}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sort Options */}
      <div className="filter-section">
        <div 
          className="filter-section-header"
          onClick={() => toggleSection('sort')}
        >
          <h4>Sort By</h4>
          {expandedSections.sort ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        {expandedSections.sort && (
          <div className="sort-options">
            {sortOptions.map(option => (
              <button
                key={option.value}
                className={`sort-option ${safeFilters.sort === option.value ? 'active' : ''}`}
                onClick={() => onFilterChange({ sort: option.value })}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clear All Filters */}
      {hasActiveFilters && (
        <button className="clear-filters-btn" onClick={onClear}>
          <FiX /> Clear All Filters
        </button>
      )}
    </div>
  );
};

export default ProductFilters;