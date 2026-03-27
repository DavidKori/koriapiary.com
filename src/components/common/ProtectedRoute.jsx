// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - State:', { 
    user: user?.email, 
    role: user?.role,
    isAuthenticated, 
    isAdmin,
    loading,
    requiredRole,
    path: window.location.pathname
  });

  if (loading) {
    return <Loader text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for specific role requirement
  if (requiredRole === 'admin' && !isAdmin) {
    console.log('ProtectedRoute - Admin access required but user is not admin');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  console.log('✅ ProtectedRoute - Access granted to:', location.pathname);
  return children ? children : <Outlet />;
};

export default ProtectedRoute;