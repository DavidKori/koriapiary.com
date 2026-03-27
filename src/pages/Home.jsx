// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { getFeaturedPosts } from '../services/blogService';
import ProductCard from '../components/products/ProductCard';
import BlogCard from '../components/blog/BlogCard';
import SEO from '../components/common/SEO';
import Loader from '../components/common/Loader';
import {
  FiArrowRight,
  FiHeart,
  FiTruck,
  FiShield,
  FiClock,
  FiStar,
  FiPackage,
  FiAward,
  FiMail,
  FiCheckCircle,
  FiTrendingUp
} from 'react-icons/fi';
import {
  FaLeaf,
  FaSeedling
} from 'react-icons/fa';
import { GiBee, GiHoneyJar,GiPlantRoots, GiForest } from 'react-icons/gi';
import { MdOutlineAgriculture, MdOutlineForest } from 'react-icons/md';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        const [productsData, categoriesData, postsData] = await Promise.all([
          getFeaturedProducts(8),
          getCategories(),
          getFeaturedPosts(3)
        ]);

        setFeaturedProducts(Array.isArray(productsData) ? productsData : []);
        
        const filteredCategories = Array.isArray(categoriesData) 
          ? categoriesData.filter(c => c.productCount > 0).slice(0, 4)
          : [];
        setCategories(filteredCategories);
        
        setFeaturedPosts(Array.isArray(postsData) ? postsData : []);
        
      } catch (error) {
        console.error('Error fetching home data:', error);
        setFeaturedProducts([]);
        setCategories([]);
        setFeaturedPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Raw Honey': <GiHoneyJar />,
      'Flavored Honey': <FaLeaf />,
      'Beeswax': <GiHoneyJar />,
      'Gifts': <FiPackage />,
      'Beekeeping': <GiBee />,
      'Health': <FiHeart />,
      'Organic': <FaSeedling />,
      'Wildflower': <MdOutlineForest />,
      'Manuka': <MdOutlineAgriculture />,
      'Acacia': <GiForest />
    };
    return icons[categoryName] || <GiHoneyJar />;
  };

  if (loading) {
    return <Loader size="large" text="Loading amazing honey products..." />;
  }

  return (
    <>
      <SEO 
        title="Home - Apiary Honey"
        description="Discover pure, organic honey from our family-owned apiary. Shop raw honey, beeswax products, and beekeeping supplies."
        keywords="honey, organic honey, raw honey, apiary, beekeeping"
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Pure Honey,
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
          <img 
            src="https://res.cloudinary.com/dxritu7i3/image/upload/v1773849292/apiary/products/pq0db1jcjs46s1hgkjrp.jpg" 
            alt="Natural Honey Product" 
          />
          <div className="floating-badge">
            <FiHeart />
            <span>100% Organic</span>
          </div>
          <div className="product-badge">
            <span>NATURAL HONEY PRODUCT</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <FiTruck className="feature-icon" />
            <h3><span style={{color:"tomato"}}>Free</span> Shipping</h3>
            <p>On orders over <span style={{color:"green"}}>Ksh.10,000</span></p>
          </div>
          <div className="feature-card">
            <FiShield className="feature-icon" />
            <h3>Quality Guaranteed</h3>
            <p>100% pure honey</p>
          </div>
          <div className="feature-card">
            <FiClock className="feature-icon" />
            <h3>Fast Delivery</h3>
            <p>2-3 business days</p>
          </div>
          <div className="feature-card">
            <FaLeaf className="feature-icon" />
            <h3>Eco-Friendly</h3>
            <p>Sustainable practices</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
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
                to={`/products?category=${category._id}`}
                className="category-card futuristic-card"
              >
                <div className="category-icon">
                  {getCategoryIcon(category.name)}
                </div>
                <h3>{category.name}</h3>
                <p>{category.productCount > 10 ? "10+": category.productCount || 0} products</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="featured-section">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products" className="view-all">
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <FiAward className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">5+</span>
              <span className="stat-label">Years of Excellence</span>
            </div>
          </div>
          <div className="stat-card">
            <FiHeart className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">1K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
          </div>
          <div className="stat-card">
            <FiPackage className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">10+</span>
              <span className="stat-label">Honey Varieties</span>
            </div>
          </div>
          <div className="stat-card">
            <FiTrendingUp className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">100%</span>
              <span className="stat-label">Organic Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="about-preview">
        <div className="about-content">
          <h2>Our Apiary Story</h2>
          <p>
            For over 5 years, we've been dedicated to sustainable beekeeping and producing 
            the finest quality honey. Our bees forage on wildflowers in pristine locations, 
            ensuring every jar is packed with natural goodness.
          </p>
          <div className="about-features">
            <div className="about-feature">
              <FiCheckCircle className="feature-icon-small" />
              <span>Chemical-free beekeeping</span>
            </div>
            <div className="about-feature">
              <FiCheckCircle className="feature-icon-small" />
              <span>Hand-harvested honey</span>
            </div>
            <div className="about-feature">
              <FiCheckCircle className="feature-icon-small" />
              <span>No additives or preservatives</span>
            </div>
          </div>
          <Link to="/about" className="btn btn-outline">
            Read Our Story <FiArrowRight />
          </Link>
        </div>
        <div className="about-image">
          <img src="https://res.cloudinary.com/dxritu7i3/image/upload/v1773849292/apiary/products/pq0db1jcjs46s1hgkjrp.jpg" alt="Our apiary" />
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="testimonials-preview">
        <h2>What Our Customers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-rating">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="star-filled" />
              ))}
            </div>
            <p className="testimonial-text">
              "The best honey I've ever tasted! You can really taste the difference."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">SJ</div>
              <div className="author-info">
                <span className="author-name">Sarah Johnson</span>
                <span className="author-title">Verified Buyer</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-rating">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="star-filled" />
              ))}
            </div>
            <p className="testimonial-text">
              "Amazing quality and fast shipping. My family loves the wildflower honey!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">MC</div>
              <div className="author-info">
                <span className="author-name">Michael Chen</span>
                <span className="author-title">Verified Buyer</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-rating">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="star-filled" />
              ))}
            </div>
            <p className="testimonial-text">
              "The beeswax candles are incredible! They burn so clean and smell amazing."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">EW</div>
              <div className="author-info">
                <span className="author-name">Emma Williams</span>
                <span className="author-title">Verified Buyer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      {featuredPosts.length > 0 && (
        <section className="blog-preview">
          <div className="section-header">
            <h2>Latest from Our Blog</h2>
            <Link to="/blog" className="view-all">
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="blog-grid">
            {featuredPosts.map(post => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <FiMail className="newsletter-icon" />
          <h2>Join the Hive</h2>
          <p>Subscribe for honey recipes, beekeeping tips, and exclusive offers</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="newsletter-input"
              required
            />
            <button type="submit" className="btn btn-primary btn-glow">
              Subscribe
            </button>
          </form>
          <p className="newsletter-note">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </>
  );
};

export default Home;