import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, createTestStore } from '../testUtils';
import {
    logout,
    updateUser,
    getPortalRoute,
} from '../../store/slices/authSlice';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import { Routes, Route } from 'react-router-dom';

describe('Authentication & RBAC Edge Cases Suite', () => {
    describe('authSlice Edge Cases', () => {
        it('should return fallback /auth/login for undefined or unrecognized role string', () => {
            expect(getPortalRoute('UNKNOWN_ROLE_XYZ')).toBe('/auth/login');
            expect(getPortalRoute('')).toBe('/auth/login');
            expect(getPortalRoute(undefined)).toBe('/auth/login');
            expect(getPortalRoute(null)).toBe('/auth/login');
        });

        it('should handle partial user payload in updateUser without wiping existing fields', () => {
            const initialStore = createTestStore({
                auth: {
                    user: {
                        id: 'usr-1',
                        name: 'John Doe',
                        email: 'john@school.edu',
                        role: 'TEACHER',
                    },
                    accessToken: 'valid-jwt-token',
                    isAuthenticated: true,
                },
            });

            // Dispatch partial update (only name changed)
            initialStore.dispatch(updateUser({ name: 'Johnathon Doe' }));

            const state = initialStore.getState().auth;
            expect(state.user.name).toBe('Johnathon Doe');
            expect(state.user.email).toBe('john@school.edu');
            expect(state.user.role).toBe('TEACHER');
            expect(state.isAuthenticated).toBe(true);
        });

        it('should completely purge user session and auth flag on logout', () => {
            const initialStore = createTestStore({
                auth: {
                    user: { id: 'usr-1', role: 'SUPER_ADMIN' },
                    accessToken: 'active-token',
                    refreshToken: 'refresh-token',
                    isAuthenticated: true,
                },
            });

            initialStore.dispatch(logout());

            const state = initialStore.getState().auth;
            expect(state.user).toBeNull();
            expect(state.accessToken).toBeNull();
            expect(state.refreshToken).toBeNull();
            expect(state.isAuthenticated).toBe(false);
        });
    });

    describe('ProtectedRoute RBAC Security Edge Cases', () => {
        it('should block STUDENT from accessing SUPER_ADMIN portal routes', () => {
            const studentStore = createTestStore({
                auth: {
                    user: { id: 'std-1', role: 'STUDENT' },
                    accessToken: 'valid-token',
                    isAuthenticated: true,
                },
            });

            renderWithProviders(
                <Routes>
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute requiredRole="SUPER_ADMIN">
                                <div>Super Admin Restricted Area</div>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/unauthorized" element={<div>Access Forbidden 403</div>} />
                </Routes>,
                { store: studentStore, route: '/admin/dashboard' }
            );

            expect(screen.queryByText('Super Admin Restricted Area')).not.toBeInTheDocument();
            expect(screen.getByText('Access Forbidden 403')).toBeInTheDocument();
        });

        it('should grant access when user role matches one of multiple allowed roles in the array', () => {
            const accountantStore = createTestStore({
                auth: {
                    user: { id: 'acc-1', role: 'ACCOUNTANT' },
                    accessToken: 'valid-token',
                    isAuthenticated: true,
                },
            });

            renderWithProviders(
                <Routes>
                    <Route
                        path="/school/fees"
                        element={
                            <ProtectedRoute
                                requiredRole={['SCHOOL_ADMIN', 'PRINCIPAL', 'ACCOUNTANT']}
                            >
                                <div>Financial Fees Ledger</div>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/unauthorized" element={<div>Access Forbidden 403</div>} />
                </Routes>,
                { store: accountantStore, route: '/school/fees' }
            );

            expect(screen.getByText('Financial Fees Ledger')).toBeInTheDocument();
            expect(screen.queryByText('Access Forbidden 403')).not.toBeInTheDocument();
        });
    });
});
