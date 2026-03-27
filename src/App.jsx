// src/App.jsx
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

// Layout
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Projects from './pages/Projects';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import CheckoutForm from './components/checkout/CheckoutForm';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PaymentCallback from './pages/PaymentCallback';
import Wishlist from './pages/Wishlist';
import Settings from './pages/settings/index';
import OrderDetails from './pages/OrderDetails';
import VerifyEmail from './pages/VerifyEmail';
import AdminDeleteConfirm from './pages/AdminDeleteConfirm';

// Static Pages
import FAQ from './pages/FAQ';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnsPolicy from './pages/ReturnsPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Styles
import './styles/global.css';
import './styles/pages.css';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                <Layout>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:slug" element={<ProductDetails />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/cart" element={<Cart />} />
                    
                    {/* Static Pages */}
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/shipping" element={<ShippingPolicy />} />
                    <Route path="/returns" element={<ReturnsPolicy />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                   
                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify" element={<VerifyEmail />} />
                    
                    {/* Guest Access Routes - No authentication required */}
                    <Route path="/checkout" element={<CheckoutForm />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/payment-callback" element={<PaymentCallback />} />
                    
                    {/* Protected Routes - Require authentication */}
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    } />
                    <Route path="/wishlist" element={
                      <ProtectedRoute>
                        <Wishlist />
                      </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } />
                    <Route path="/orders/:id" element={
                      <ProtectedRoute>
                        <OrderDetails />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin-delete-confirm" element={
                      <ProtectedRoute>
                        <AdminDeleteConfirm />
                      </ProtectedRoute>
                    } />
                 </Routes>
                </Layout>
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
