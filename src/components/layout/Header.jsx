// src/components/layout/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../common/ThemeToggle';
import { 
  FiShoppingCart, 
  FiUser, 
  FiMenu, 
  FiX, 
  FiSearch,
  FiHeart,
  FiLogOut,
  FiSettings,
  FiPackage,
  FiHome,
  FiInfo,
  FiMail,
  FiBriefcase,
  FiBookOpen,
  FiChevronDown
} from 'react-icons/fi';
import { FaLeaf, FaSeedling } from 'react-icons/fa';
import { GiBee, GiHoneyJar } from 'react-icons/gi';
const Header = () => {
  const { cartItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''} ${theme}`}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <GiHoneyJar className="logo-icon" />
          <span className="logo-text">Kori Apiary</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link to="/" className="nav-link">
            <FiHome /> <span>Home</span>
          </Link>
          <Link to="/products" className="nav-link">
            <FiPackage /> <span>Products</span>
          </Link>
          <Link to="/about" className="nav-link">
            <FiInfo /> <span>About</span>
          </Link>
          <Link to="/blog" className="nav-link">
            <FiBookOpen /> <span>Blog</span>
          </Link>
          <Link to="/contact" className="nav-link">
            <FiMail /> <span>Contact</span>
          </Link>
          <Link to="/projects" className="nav-link">
            <FiBriefcase /> <span>Projects</span>
          </Link>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Search Toggle */}
          <div className="search-wrapper" ref={searchRef}>
            <button 
              className="icon-btn search-toggle"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <FiSearch />
            </button>
            
            {/* Search Dropdown */}
            {searchOpen && (
              <div className="search-dropdown">
                <form onSubmit={handleSearch} className="search-form">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                    autoFocus
                  />
                  <button type="submit" className="search-submit">
                    <FiSearch />
                  </button>
                </form>
                <div className="search-suggestions">
                  <p className="suggestions-title">Popular searches:</p>
                  <div className="suggestion-tags">
                    <button onClick={() => navigate('/products?search=honey')}>Honey</button>
                    <button onClick={() => navigate('/products?search=raw')}>Raw Honey</button>
                    <button onClick={() => navigate('/products?search=organic')}>Organic</button>
                    <button onClick={() => navigate('/products?search=beeswax')}>Beeswax</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link to="/wishlist" className="icon-btn wishlist-btn">
            <FiHeart />
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Cart */}
          <Link to="/cart" className="icon-btn cart-btn">
            <FiShoppingCart />
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </Link>

          {/* User Menu / Sign In Button */}
          <div className="user-menu-wrapper" ref={userMenuRef}>
            {isAuthenticated ? (
              <>
                <button 
                  className={`user-btn ${userMenuOpen ? 'active' : ''}`}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                >
                  <div className="user-avatar-small">
                    {user?.name?.charAt(0) || user?.email?.charAt(0)}
                  </div>
                  <span className="user-name-small">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <FiChevronDown className={`dropdown-arrow ${userMenuOpen ? 'open' : ''}`} />
                </button>
                
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <div className="user-avatar">
                        {user?.name?.charAt(0) || user?.email?.charAt(0)}
                      </div>
                      <div className="user-info">
                        <span className="user-name">{user?.name || 'User'}</span>
                        <span className="user-email">{user?.email}</span>
                      </div>
                    </div>
                    <div className="dropdown-menu">
                      <Link to="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <FiUser /> My Profile
                      </Link>
                      <Link to="/orders" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <FiPackage /> My Orders
                      </Link>
                      <Link to="/wishlist" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <FiHeart /> Wishlist
                      </Link>
                      <Link to="/settings" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <FiSettings /> Settings
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-item logout">
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="login-btn">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle icon-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <div className="mobile-nav-header">
            <GiHoneyJar className="mobile-logo-icon" />
            <span className="mobile-logo-text">Apiary Honey</span>
            <button 
              className="mobile-close-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiX />
            </button>
          </div>
          
          <div className="mobile-nav-links">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <FiHome /> Home
            </Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
              <FiPackage /> Products
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
              <FiInfo /> About
            </Link>
            <Link to="/blog" onClick={() => setMobileMenuOpen(false)}>
              <FiBookOpen /> Blog
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
              <FiMail /> Contact
            </Link>
            <Link to="/projects" onClick={() => setMobileMenuOpen(false)}>
              <FiBriefcase /> Projects
            </Link>
          </div>

          {!isAuthenticated && (
            <div className="mobile-auth-buttons">
              <Link to="/login" className="mobile-login-btn" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="mobile-register-btn" onClick={() => setMobileMenuOpen(false)}>
                Create Account
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;