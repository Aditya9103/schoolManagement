import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, user } = useSelector((s) => s.auth);
    if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (requiredRole && !allowed.includes(user?.role)) return <Navigate to="/unauthorized" replace />;
    return children;
}
