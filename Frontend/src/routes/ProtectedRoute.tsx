import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { user, role, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071a2b] text-white">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-300">Authenticating Government Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // Redirect to user's assigned dashboard
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'inspector') return <Navigate to="/inspector/dashboard" replace />;
    if (role === 'mine') return <Navigate to="/mine/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
