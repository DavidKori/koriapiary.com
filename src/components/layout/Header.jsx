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
// import '../../styles/header.css';

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
  const mobileMenuRef = useRef(null);
  const mobileToggleRef = useRef(null);

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside for all dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user menu when clicking outside
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      
      // Close search dropdown when clicking outside
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      
      // Close mobile menu when clicking outside - FIXED
      // Check if click is outside the mobile overlay AND not on the mobile toggle button
      if (mobileMenuOpen) {
        const mobileOverlay = document.getElementById('mobile-overlay');
        const mobileToggle = mobileToggleRef.current;
        
        // If click is not on the mobile overlay and not on the toggle button, close the menu
        if (mobileOverlay && !mobileOverlay.contains(event.target) && 
            mobileToggle && !mobileToggle.contains(event.target)) {
          setMobileMenuOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]); // Add mobileMenuOpen as dependency

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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
    <header id='header' className={`header ${scrolled ? 'scrolled' : ''} ${theme}`}>
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
                      <ThemeToggle />
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
            ref={mobileToggleRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div id="mobile-overlay" className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`} ref={mobileMenuRef}>
        <nav className="mobile-nav">
          <div className="mobile-nav-header">
            <GiHoneyJar className="mobile-logo-icon" />
            <span className="mobile-logo-text"> Kori Apiary </span>
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
              <ThemeToggle />
              <Link to="/login" className="mobile-login-btn" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="mobile-register-btn" onClick={() => setMobileMenuOpen(false)}>
                Create Account
              </Link>
            </div>
          )}
          
          {isAuthenticated && (
            <div className="mobile-auth-buttons">
              <ThemeToggle />
              <button onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }} className="dropdown-item logout">
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;


// // src/components/layout/Header.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useCart } from '../../context/CartContext';
// import { useAuth } from '../../context/AuthContext';
// import { useTheme } from '../../context/ThemeContext';
// import ThemeToggle from '../common/ThemeToggle';
// import { 
//   FiShoppingCart, 
//   FiUser, 
//   FiMenu, 
//   FiX, 
//   FiSearch,
//   FiHeart,
//   FiLogOut,
//   FiSettings,
//   FiPackage,
//   FiHome,
//   FiInfo,
//   FiMail,
//   FiBriefcase,
//   FiBookOpen,
//   FiChevronDown
// } from 'react-icons/fi';
// import { FaLeaf, FaSeedling } from 'react-icons/fa';
// import { GiBee, GiHoneyJar } from 'react-icons/gi';
// // import '../../styles/header.css';
// const Header = () => {
//   const { cartItems } = useCart();
//   const { user, isAuthenticated, logout } = useAuth();
//   const { theme } = useTheme();
//   const navigate = useNavigate();
  
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
  
//   const userMenuRef = useRef(null);
//   const searchRef = useRef(null);
//   const mobileMenuRef = useRef(null)

//   const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//   // Handle scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
//         setUserMenuOpen(false);
//       }
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setSearchOpen(false);
//       }
//      if (mobileMenuRef.current && !mobileMenuOpen.current.contains(event.target)) {
//         setMobileMenuOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
//       setSearchOpen(false);
//       setSearchQuery('');
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     setUserMenuOpen(false);
//     navigate('/');
//   };

//   return (
//     <header id='header' className={`header ${scrolled ? 'scrolled' : ''} ${theme}`}>
//       <div className="header-container">
//         {/* Logo */}
//         <Link to="/" className="logo">
//           <GiHoneyJar className="logo-icon" />
//           <span className="logo-text">Kori Apiary</span>
//         </Link>

//         {/* Desktop Navigation */}
//         <nav className="desktop-nav">
//           <Link to="/" className="nav-link">
//             <FiHome /> <span>Home</span>
//           </Link>
//           <Link to="/products" className="nav-link">
//             <FiPackage /> <span>Products</span>
//           </Link>
//           <Link to="/about" className="nav-link">
//             <FiInfo /> <span>About</span>
//           </Link>
//           <Link to="/blog" className="nav-link">
//             <FiBookOpen /> <span>Blog</span>
//           </Link>
//           <Link to="/contact" className="nav-link">
//             <FiMail /> <span>Contact</span>
//           </Link>
//           <Link to="/projects" className="nav-link">
//             <FiBriefcase /> <span>Projects</span>
//           </Link>
//         </nav>

//         {/* Header Actions */}
//         <div className="header-actions">
//           {/* Search Toggle */}
//           <div className="search-wrapper" ref={searchRef}>
//             <button 
//               className="icon-btn search-toggle"
//               onClick={() => setSearchOpen(!searchOpen)}
//               aria-label="Search"
//             >
//               <FiSearch />
//             </button>
            
//             {/* Search Dropdown */}
//             {searchOpen && (
//               <div className="search-dropdown">
//                 <form onSubmit={handleSearch} className="search-form">
//                   <input
//                     type="text"
//                     placeholder="Search products..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="search-input"
//                     autoFocus
//                   />
//                   <button type="submit" className="search-submit">
//                     <FiSearch />
//                   </button>
//                 </form>
//                 <div className="search-suggestions">
//                   <p className="suggestions-title">Popular searches:</p>
//                   <div className="suggestion-tags">
//                     <button onClick={() => navigate('/products?search=honey')}>Honey</button>
//                     <button onClick={() => navigate('/products?search=raw')}>Raw Honey</button>
//                     <button onClick={() => navigate('/products?search=organic')}>Organic</button>
//                     <button onClick={() => navigate('/products?search=beeswax')}>Beeswax</button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Wishlist */}
//           <Link to="/wishlist" className="icon-btn wishlist-btn">
//             <FiHeart />
//           </Link>

//           {/* Cart */}
//           <Link to="/cart" className="icon-btn cart-btn">
//             <FiShoppingCart />
//             {cartItemsCount > 0 && (
//               <span className="cart-badge">{cartItemsCount}</span>
//             )}
//           </Link>

//           {/* User Menu / Sign In Button */}
//           <div className="user-menu-wrapper" ref={userMenuRef}>
//             {isAuthenticated ? (
//               <>
//                 <button 
//                   className={`user-btn ${userMenuOpen ? 'active' : ''}`}
//                   onClick={() => setUserMenuOpen(!userMenuOpen)}
//                   aria-label="User menu"
//                   aria-expanded={userMenuOpen}
//                 >
//                   <div className="user-avatar-small">
//                     {user?.name?.charAt(0) || user?.email?.charAt(0)}
//                   </div>
//                   <span className="user-name-small">
//                     {user?.name?.split(' ')[0] || 'User'}
//                   </span>
//                   <FiChevronDown className={`dropdown-arrow ${userMenuOpen ? 'open' : ''}`} />
//                 </button>
                
//                 {userMenuOpen && (
//                   <div className="user-dropdown">
//                     <div className="dropdown-header">
//                       <div className="user-avatar">
//                         {user?.name?.charAt(0) || user?.email?.charAt(0)}
//                       </div>
//                       <div className="user-info">
//                         <span className="user-name">{user?.name || 'User'}</span>
//                         <span className="user-email">{user?.email}</span>
//                       </div>
//                     </div>
//                     <div className="dropdown-menu">
//                       <Link to="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
//                         <FiUser /> My Profile
//                       </Link>
//                       <Link to="/orders" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
//                         <FiPackage /> My Orders
//                       </Link>
//                       <Link to="/wishlist" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
//                         <FiHeart /> Wishlist
//                       </Link>
//                       <Link to="/settings" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
//                         <FiSettings /> Settings
//                       </Link>
//                       <div className="dropdown-divider"></div>
//                         {/* Theme Toggle */}
//                         <ThemeToggle />
//                       <button onClick={handleLogout} className="dropdown-item logout">
//                         <FiLogOut /> Logout
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <Link to="/login" className="login-btn">
//                 Sign In
//               </Link>
//             )}
//           </div>

//           {/* Mobile Menu Toggle */}
//           <button 
//             className="mobile-menu-toggle icon-btn"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             aria-label="Toggle menu"
//             ref={mobileMenuRef}
//           >
//             {mobileMenuOpen ? <FiX /> : <FiMenu />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       <div id='mobile-overlay' className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`} ref={mobileMenuRef}>
//         <nav className="mobile-nav">
//           <div className="mobile-nav-header">
//             <GiHoneyJar className="mobile-logo-icon" />
//             <span className="mobile-logo-text">Apiary Honey</span>
//             <button 
//               className="mobile-close-btn"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               <FiX />
//             </button>
//           </div>
          
//           <div className="mobile-nav-links">
//             <Link to="/" onClick={() => setMobileMenuOpen(false)}>
//               <FiHome /> Home
//             </Link>
//             <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
//               <FiPackage /> Products
//             </Link>
//             <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
//               <FiInfo /> About
//             </Link>
//             <Link to="/blog" onClick={() => setMobileMenuOpen(false)}>
//               <FiBookOpen /> Blog
//             </Link>
//             <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
//               <FiMail /> Contact
//             </Link>
//             <Link to="/projects" onClick={() => setMobileMenuOpen(false)}>
//               <FiBriefcase /> Projects
//             </Link>
//           </div>
//           <div>

//           </div>
//           {!isAuthenticated && (
//             <div className="mobile-auth-buttons">
//               {/* Theme Toggle */}
//               <ThemeToggle />
//               <Link to="/login" className="mobile-login-btn" onClick={() => setMobileMenuOpen(false)}>
//                 Sign In
//               </Link>
//               <Link to="/register" className="mobile-register-btn" onClick={() => setMobileMenuOpen(false)}>
//                 Create Account
//               </Link>

//             </div>
//           )}
//            {isAuthenticated  &&(
//             <button onClick={handleLogout} className="dropdown-item logout">
//               <FiLogOut /> Logout
//             </button>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;