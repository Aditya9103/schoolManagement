import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { renderWithProviders } from '../testUtils';
import { ROLES, SCHOOL_ERP_ROLES } from '../../store/slices/authSlice';

// Isolated ProtectedRoute component replicating App.jsx logic
function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, user } = useSelector((s) => s.auth);
    if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (requiredRole && !allowed.includes(user?.role)) return <Navigate to="/unauthorized" replace />;
    return children;
}

function TestRouter({ requiredRole }) {
    return (
        <Routes>
            <Route path="/auth/login" element={<div>LOGIN_PAGE</div>} />
            <Route path="/unauthorized" element={<div>UNAUTHORIZED_PAGE</div>} />
            <Route
                path="/protected"
                element={
                    <ProtectedRoute requiredRole={requiredRole}>
                        <div>SECRET_PROTECTED_CONTENT</div>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

describe('Frontend ProtectedRoute & RBAC Navigation Tests', () => {
    it('should redirect unauthenticated user to /auth/login', () => {
        renderWithProviders(<TestRouter requiredRole={ROLES.SUPER_ADMIN} />, {
            preloadedState: {
                auth: { isAuthenticated: false, user: null },
            },
            route: '/protected',
        });

        expect(screen.getByText('LOGIN_PAGE')).toBeInTheDocument();
        expect(screen.queryByText('SECRET_PROTECTED_CONTENT')).not.toBeInTheDocument();
    });

    it('should redirect authenticated user with wrong role to /unauthorized', () => {
        renderWithProviders(<TestRouter requiredRole={ROLES.SUPER_ADMIN} />, {
            preloadedState: {
                auth: {
                    isAuthenticated: true,
                    user: { id: 'u1', role: ROLES.TEACHER },
                },
            },
            route: '/protected',
        });

        expect(screen.getByText('UNAUTHORIZED_PAGE')).toBeInTheDocument();
        expect(screen.queryByText('SECRET_PROTECTED_CONTENT')).not.toBeInTheDocument();
    });

    it('should render protected content when user has the exact required single role', () => {
        renderWithProviders(<TestRouter requiredRole={ROLES.SUPER_ADMIN} />, {
            preloadedState: {
                auth: {
                    isAuthenticated: true,
                    user: { id: 'u1', role: ROLES.SUPER_ADMIN },
                },
            },
            route: '/protected',
        });

        expect(screen.getByText('SECRET_PROTECTED_CONTENT')).toBeInTheDocument();
        expect(screen.queryByText('LOGIN_PAGE')).not.toBeInTheDocument();
        expect(screen.queryByText('UNAUTHORIZED_PAGE')).not.toBeInTheDocument();
    });

    it('should render protected content when user has any role matching an array of roles', () => {
        renderWithProviders(<TestRouter requiredRole={SCHOOL_ERP_ROLES} />, {
            preloadedState: {
                auth: {
                    isAuthenticated: true,
                    user: { id: 'u2', role: ROLES.ACCOUNTANT },
                },
            },
            route: '/protected',
        });

        expect(screen.getByText('SECRET_PROTECTED_CONTENT')).toBeInTheDocument();
    });
});
