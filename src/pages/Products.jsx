// src/pages/Products.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import SEO from '../components/common/SEO';
import Loader from '../components/common/Loader';
import { FiFilter, FiX } from 'react-icons/fi';
import '../styles/pages.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter state with default values from URL
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'createdAt:desc',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProductsData = async () => {
      setLoading(true);
      try {
        console.log('Fetching with filters:', filters);
        
        // Clean up filters - remove empty values
        const cleanFilters = {};
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== '' && value !== null && value !== undefined) {
            cleanFilters[key] = value;
          }
        });
        
        console.log('Clean filters:', cleanFilters);
        
        const response = await getProducts(cleanFilters);
        console.log('Products response:', response);
        
        setProducts(response.data || []);
        setTotalCount(response.pagination?.total || 0);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsData();

    // Update URL params
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.sort && filters.sort !== 'createdAt:desc') params.sort = filters.sort;
    if (filters.page > 1) params.page = filters.page;
    
    setSearchParams(params);
  }, [filters.category, filters.search, filters.minPrice, filters.maxPrice, filters.sort, filters.page, filters.limit]);

  const handleFilterChange = useCallback((newFilters) => {
    console.log('Filter change:', newFilters);
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
    // Close mobile filters after applying
    setShowFilters(false);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sort: 'createdAt:desc',
      page: 1,
      limit: 12
    });
  }, []);

  // Check if any filters are active (for mobile badge)
  const hasActiveFilters = useCallback(() => {
    return filters.category !== '' || 
           filters.search !== '' || 
           filters.minPrice !== '' || 
           filters.maxPrice !== '' || 
           filters.sort !== 'createdAt:desc';
  }, [filters]);

  return (
    <>
      <SEO 
        title="Products - Apiary Honey"
        description="Browse our collection of pure, organic honey products. Raw honey, flavored honey, beeswax candles, and more."
        keywords="honey products, raw honey, organic honey, beeswax"
      />

      <div className="products-page">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Our Products</h1>
          <p className="page-description">
            Discover our range of pure, natural honey products
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <button 
          className="mobile-filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiFilter />
          <span>Filters</span>
          {hasActiveFilters() && (
            <span className="filter-badge">•</span>
          )}
        </button>

        <div className="products-layout">
          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${showFilters ? 'open' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button 
                className="close-filters"
                onClick={() => setShowFilters(false)}
              >
                <FiX />
              </button>
            </div>
            
            <ProductFilters 
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClear={clearFilters}
            />
          </aside>

          {/* Products Grid */}
          <main className="products-main">
            <div className="products-header">
              <span className="products-count">
                {totalCount} product{totalCount !== 1 ? 's' : ''} found
              </span>
              
              <select 
                className="sort-select"
                value={filters.sort}
                onChange={(e) => handleFilterChange({ sort: e.target.value })}
              >
                <option value="createdAt:desc">Newest First</option>
                <option value="price:asc">Price: Low to High</option>
                <option value="price:desc">Price: High to Low</option>
                <option value="name:asc">Name: A to Z</option>
                <option value="name:desc">Name: Z to A</option>
                <option value="soldCount:desc">Best Selling</option>
              </select>
            </div>

            {loading ? (
              <Loader />
            ) : (
              <>
                <ProductGrid products={products} />
                
                {/* Pagination */}
                {Math.ceil(totalCount / filters.limit) > 1 && (
                  <div className="pagination">
                    <button
                      disabled={filters.page === 1}
                      onClick={() => handlePageChange(filters.page - 1)}
                    >
                      Previous
                    </button>
                    
                    {[...Array(Math.ceil(totalCount / filters.limit))].map((_, i) => {
                      const pageNumber = i + 1;
                      // Show current page, first, last, and pages around current
                      if (
                        pageNumber === 1 ||
                        pageNumber === Math.ceil(totalCount / filters.limit) ||
                        (pageNumber >= filters.page - 2 && pageNumber <= filters.page + 2)
                      ) {
                        return (
                          <button
                            key={i}
                            className={filters.page === pageNumber ? 'active' : ''}
                            onClick={() => handlePageChange(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        );
                      }
                      // Show ellipsis
                      if (pageNumber === filters.page - 3 || pageNumber === filters.page + 3) {
                        return <span key={i} className="pagination-ellipsis">...</span>;
                      }
                      return null;
                    })}
                    
                    <button
                      disabled={filters.page === Math.ceil(totalCount / filters.limit)}
                      onClick={() => handlePageChange(filters.page + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Products;