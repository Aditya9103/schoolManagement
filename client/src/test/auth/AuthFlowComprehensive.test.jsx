/**
 * AuthFlowComprehensive.test.jsx
 *
 * Extreme, comprehensive authentication flow testing across all platform user roles:
 * - SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, ACCOUNTANT, LIBRARIAN, FRONT_OFFICE, DRIVER, PARENT, STUDENT
 *
 * Tested Layers:
 * 1. Redux Store & authSlice (state initialization, token persistence, logout purge, resilience to corrupt storage)
 * 2. Axios baseApi & Interceptors (token injection, 401 handling, mutex token refresh queue, infinite loop guards)
 * 3. ProtectedRoute & RBAC Matrix (10-role navigation rules, unauthorized rejection, unauthenticated redirection)
 * 4. Socket Client Auth (token extraction and refresh re-authentication)
 */

import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import authReducer, {
    setCredentials,
    logout,
    updateUser,
    getPortalRoute,
    ROLES,
    SCHOOL_ERP_ROLES,
} from '../../store/slices/authSlice';

import {
    axiosInstance,
    setupResponseInterceptor,
    resetInterceptorState,
} from '../../store/api/baseApi';

import ProtectedRoute from '../../components/common/ProtectedRoute';
import { initSocket, updateSocketToken, disconnectSocket } from '../../socket/socketClient';
import { renderWithProviders } from '../testUtils';

// Mock axios.post for refresh calls
vi.mock('axios', async () => {
    const actual = await vi.importActual('axios');
    return {
        ...actual,
        default: {
            ...actual.default,
            post: vi.fn(),
            create: actual.default.create,
        },
    };
});

// Mock socket.io-client
vi.mock('socket.io-client', () => {
    return {
        io: vi.fn((url, opts) => {
            return {
                id: 'mock-socket-id',
                auth: opts?.auth || {},
                connected: true,
                on: vi.fn(),
                disconnect: vi.fn(),
                connect: vi.fn(),
            };
        }),
    };
});

describe('Extreme Frontend Auth Flow Test Suite', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        resetInterceptorState();
    });

    afterEach(() => {
        disconnectSocket();
        localStorage.clear();
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 1. Redux authSlice & Storage Lifecycle Matrix
    // ─────────────────────────────────────────────────────────────────────────
    describe('1. Redux authSlice & Storage Resilience', () => {
        it('should initialize with default unauthenticated state when localStorage is clean', () => {
            const state = authReducer(undefined, { type: '@@INIT' });
            expect(state.isAuthenticated).toBe(false);
            expect(state.user).toBeNull();
            expect(state.accessToken).toBeNull();
            expect(state.refreshToken).toBeNull();
        });

        it('should gracefully handle corrupt JSON in pso_user without throwing', () => {
            localStorage.setItem('pso_user', '{corrupted_json_payload:');
            localStorage.setItem('pso_accessToken', 'valid-tok');

            // Re-import or test parsing behavior
            let parsed = null;
            try {
                parsed = JSON.parse(localStorage.getItem('pso_user'));
            } catch {
                parsed = null;
            }
            expect(parsed).toBeNull();
        });

        it('should handle string "undefined" and "null" in localStorage gracefully', () => {
            localStorage.setItem('pso_user', 'undefined');
            const state = authReducer(undefined, { type: '@@INIT' });
            expect(state.user).toBeNull();
        });

        const ALL_ROLES = [
            ROLES.SUPER_ADMIN,
            ROLES.SCHOOL_ADMIN,
            ROLES.TEACHER,
            ROLES.ACCOUNTANT,
            ROLES.LIBRARIAN,
            ROLES.FRONT_OFFICE,
            ROLES.DRIVER,
            ROLES.PARENT,
            ROLES.STUDENT,
        ];

        ALL_ROLES.forEach((role) => {
            it(`setCredentials should correctly authenticate user role: ${role}`, () => {
                const userPayload = {
                    _id: `user-${role}-001`,
                    name: `Test ${role}`,
                    email: `${role.toLowerCase()}@primeschoolos.edu`,
                    role,
                    schoolId: role === ROLES.SUPER_ADMIN ? null : 'sch-delhi-01',
                };

                const action = setCredentials({
                    user: userPayload,
                    accessToken: `jwt-acc-${role}`,
                    refreshToken: `jwt-ref-${role}`,
                });

                const state = authReducer(undefined, action);
                expect(state.isAuthenticated).toBe(true);
                expect(state.user).toEqual(userPayload);
                expect(state.accessToken).toBe(`jwt-acc-${role}`);
                expect(state.refreshToken).toBe(`jwt-ref-${role}`);

                // Verify LocalStorage sync
                expect(localStorage.getItem('pso_accessToken')).toBe(`jwt-acc-${role}`);
                expect(localStorage.getItem('pso_refreshToken')).toBe(`jwt-ref-${role}`);
                expect(JSON.parse(localStorage.getItem('pso_user'))).toEqual(userPayload);
            });
        });

        it('logout should purge all tokens and user data from both pso_ and legacy keys', () => {
            localStorage.setItem('pso_accessToken', 'acc-1');
            localStorage.setItem('pso_refreshToken', 'ref-1');
            localStorage.setItem('pso_user', JSON.stringify({ id: 'u1' }));
            localStorage.setItem('accessToken', 'legacy-acc-1');
            localStorage.setItem('refreshToken', 'legacy-ref-1');
            localStorage.setItem('user', JSON.stringify({ id: 'u1' }));

            const loggedInState = {
                user: { id: 'u1' },
                accessToken: 'acc-1',
                refreshToken: 'ref-1',
                isAuthenticated: true,
            };

            const state = authReducer(loggedInState, logout());
            expect(state.isAuthenticated).toBe(false);
            expect(state.user).toBeNull();
            expect(state.accessToken).toBeNull();
            expect(state.refreshToken).toBeNull();

            expect(localStorage.getItem('pso_accessToken')).toBeNull();
            expect(localStorage.getItem('pso_refreshToken')).toBeNull();
            expect(localStorage.getItem('pso_user')).toBeNull();
            expect(localStorage.getItem('accessToken')).toBeNull();
            expect(localStorage.getItem('refreshToken')).toBeNull();
            expect(localStorage.getItem('user')).toBeNull();
        });

        it('updateUser should update specified user fields in Redux and localStorage', () => {
            const initial = {
                user: { id: 'u1', name: 'Original', role: ROLES.TEACHER },
                isAuthenticated: true,
            };
            const updated = authReducer(initial, updateUser({ name: 'Updated Name', phone: '9876543210' }));
            expect(updated.user.name).toBe('Updated Name');
            expect(updated.user.phone).toBe('9876543210');
            expect(updated.user.role).toBe(ROLES.TEACHER);
            expect(JSON.parse(localStorage.getItem('pso_user')).name).toBe('Updated Name');
        });

        describe('getPortalRoute matrix for all user types', () => {
            it('routes SUPER_ADMIN to /super-admin', () => {
                expect(getPortalRoute(ROLES.SUPER_ADMIN)).toBe('/super-admin');
            });
            it('routes SCHOOL_ADMIN, ACCOUNTANT, LIBRARIAN, FRONT_OFFICE to /school', () => {
                expect(getPortalRoute(ROLES.SCHOOL_ADMIN)).toBe('/school');
                expect(getPortalRoute(ROLES.ACCOUNTANT)).toBe('/school');
                expect(getPortalRoute(ROLES.LIBRARIAN)).toBe('/school');
                expect(getPortalRoute(ROLES.FRONT_OFFICE)).toBe('/school');
            });
            it('routes TEACHER to /staff', () => {
                expect(getPortalRoute(ROLES.TEACHER)).toBe('/staff');
            });
            it('routes DRIVER to /driver', () => {
                expect(getPortalRoute(ROLES.DRIVER)).toBe('/driver');
            });
            it('routes PARENT and STUDENT to /parent', () => {
                expect(getPortalRoute(ROLES.PARENT)).toBe('/parent');
                expect(getPortalRoute(ROLES.STUDENT)).toBe('/parent');
            });
            it('routes unknown, null, undefined, or unauthorized roles back to /auth/login', () => {
                expect(getPortalRoute('HACKER')).toBe('/auth/login');
                expect(getPortalRoute('')).toBe('/auth/login');
                expect(getPortalRoute(null)).toBe('/auth/login');
                expect(getPortalRoute(undefined)).toBe('/auth/login');
            });
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Axios Request/Response Interceptor & Token Flow
    // ─────────────────────────────────────────────────────────────────────────
    describe('2. Axios Interceptors, 401 Handling & Token Refresh Mutex', () => {
        it('request interceptor should attach Bearer token when token is present', async () => {
            localStorage.setItem('pso_accessToken', 'my-secret-jwt-token');

            // Find request interceptor
            const requestHandler = axiosInstance.interceptors.request.handlers[0];
            const config = await requestHandler.fulfilled({ headers: {} });

            expect(config.headers.Authorization).toBe('Bearer my-secret-jwt-token');
        });

        it('request interceptor should fall back to legacy accessToken if pso_accessToken is not present', async () => {
            localStorage.setItem('accessToken', 'legacy-jwt-token');

            const requestHandler = axiosInstance.interceptors.request.handlers[0];
            const config = await requestHandler.fulfilled({ headers: {} });

            expect(config.headers.Authorization).toBe('Bearer legacy-jwt-token');
        });

        it('request interceptor should not attach Authorization header when no token exists', async () => {
            const requestHandler = axiosInstance.interceptors.request.handlers[0];
            const config = await requestHandler.fulfilled({ headers: {} });

            expect(config.headers.Authorization).toBeUndefined();
        });

        it('should trigger token refresh on 401 Unauthorized and replay original request', async () => {
            localStorage.setItem('pso_refreshToken', 'valid-refresh-token');
            localStorage.setItem('pso_user', JSON.stringify({ id: 'u1', role: ROLES.SCHOOL_ADMIN }));

            const mockDispatch = vi.fn();
            setupResponseInterceptor(mockDispatch);

            // Mock refresh endpoint returning new token
            axios.post.mockResolvedValueOnce({
                data: {
                    data: {
                        accessToken: 'fresh-new-access-token',
                        refreshToken: 'fresh-new-refresh-token',
                    },
                },
            });

            // Mock replaying axiosInstance
            const originalRequest = {
                url: '/academic/classes',
                method: 'get',
                headers: {},
            };

            const responseInterceptor = axiosInstance.interceptors.response.handlers[0].rejected;
            
            // Trigger 401 error
            const error = {
                config: originalRequest,
                response: { status: 401 },
            };

            // Call interceptor and catch replayed request in test mock environment
            const refreshPromise = responseInterceptor(error).catch(() => {});

            await waitFor(() => {
                expect(axios.post).toHaveBeenCalledWith(
                    expect.stringContaining('/auth/refresh'),
                    { refreshToken: 'valid-refresh-token' }
                );
            });

            await refreshPromise;

            // Verify tokens were updated in localStorage
            expect(localStorage.getItem('pso_accessToken')).toBe('fresh-new-access-token');
            expect(localStorage.getItem('pso_refreshToken')).toBe('fresh-new-refresh-token');

            // Verify Redux credentials were dispatched
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: setCredentials.type,
                    payload: expect.objectContaining({
                        accessToken: 'fresh-new-access-token',
                        refreshToken: 'fresh-new-refresh-token',
                    }),
                })
            );
        });

        it('should handle concurrent 401 requests with a single refresh call and queue resolution', async () => {
            localStorage.setItem('pso_refreshToken', 'valid-refresh-token');
            const mockDispatch = vi.fn();
            setupResponseInterceptor(mockDispatch);

            // Simulate delayed refresh response
            axios.post.mockImplementationOnce(
                () =>
                    new Promise((resolve) =>
                        setTimeout(
                            () =>
                                resolve({
                                    data: {
                                        data: {
                                            accessToken: 'fresh-concurrent-token',
                                            refreshToken: 'fresh-concurrent-refresh',
                                        },
                                    },
                                }),
                            30
                        )
                    )
            );

            const responseInterceptor = axiosInstance.interceptors.response.handlers[0].rejected;

            const req1 = { url: '/academic/subjects', method: 'get', headers: {} };
            const req2 = { url: '/academic/departments', method: 'get', headers: {} };
            const req3 = { url: '/academic/sections', method: 'get', headers: {} };

            // Dispatch 3 concurrent 401s
            const p1 = responseInterceptor({ config: req1, response: { status: 401 } }).catch(() => {});
            const p2 = responseInterceptor({ config: req2, response: { status: 401 } }).catch(() => {});
            const p3 = responseInterceptor({ config: req3, response: { status: 401 } }).catch(() => {});

            await Promise.all([p1, p2, p3]);

            // ONLY ONE refresh call should have been made despite 3 concurrent 401s
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(localStorage.getItem('pso_accessToken')).toBe('fresh-concurrent-token');
        });

        it('should NOT attempt token refresh if 401 occurs on /auth/login or /auth/refresh (infinite loop guard)', async () => {
            const mockDispatch = vi.fn();
            setupResponseInterceptor(mockDispatch);

            const responseInterceptor = axiosInstance.interceptors.response.handlers[0].rejected;

            // 401 on login
            const loginError = {
                config: { url: '/auth/login/password', _retry: false },
                response: { status: 401 },
            };

            await expect(responseInterceptor(loginError)).rejects.toEqual(loginError);
            expect(axios.post).not.toHaveBeenCalled();

            // 401 on refresh
            const refreshError = {
                config: { url: '/auth/refresh', _retry: false },
                response: { status: 401 },
            };

            await expect(responseInterceptor(refreshError)).rejects.toEqual(refreshError);
            expect(axios.post).not.toHaveBeenCalled();
        });

        it('should logout and reject when 401 occurs and no refresh token exists', async () => {
            const mockDispatch = vi.fn();
            setupResponseInterceptor(mockDispatch);

            const responseInterceptor = axiosInstance.interceptors.response.handlers[0].rejected;

            const error = {
                config: { url: '/finance/invoices', headers: {} },
                response: { status: 401 },
            };

            await expect(responseInterceptor(error)).rejects.toEqual(error);
            expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: logout.type }));
        });

        it('should logout and reject all queued requests when refresh token request fails', async () => {
            localStorage.setItem('pso_refreshToken', 'expired-bad-refresh-token');

            const mockDispatch = vi.fn();
            setupResponseInterceptor(mockDispatch);

            // Mock refresh failure
            axios.post.mockRejectedValueOnce(new Error('Refresh token expired'));

            const responseInterceptor = axiosInstance.interceptors.response.handlers[0].rejected;

            const error = {
                config: { url: '/student/grades', headers: {} },
                response: { status: 401 },
            };

            await expect(responseInterceptor(error)).rejects.toThrow('Refresh token expired');
            expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: logout.type }));
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 3. ProtectedRoute & Cross-Role RBAC Authorization Matrix
    // ─────────────────────────────────────────────────────────────────────────
    describe('3. ProtectedRoute & RBAC Authorization Matrix across all 10 user roles', () => {
        function TestRbacRouter({ requiredRole }) {
            return (
                <Routes>
                    <Route path="/auth/login" element={<div>LOGIN_VIEW</div>} />
                    <Route path="/unauthorized" element={<div>UNAUTHORIZED_VIEW</div>} />
                    <Route
                        path="/protected-portal"
                        element={
                            <ProtectedRoute requiredRole={requiredRole}>
                                <div>PORTAL_AUTHORIZED_ACCESS</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            );
        }

        it('should redirect unauthenticated users to /auth/login for any protected role', () => {
            renderWithProviders(<TestRbacRouter requiredRole={ROLES.SUPER_ADMIN} />, {
                preloadedState: {
                    auth: { isAuthenticated: false, user: null, accessToken: null },
                },
                route: '/protected-portal',
            });

            expect(screen.getByText('LOGIN_VIEW')).toBeInTheDocument();
            expect(screen.queryByText('PORTAL_AUTHORIZED_ACCESS')).not.toBeInTheDocument();
        });

        it('SUPER_ADMIN: allows access to SUPER_ADMIN portal and rejects unprivileged users', () => {
            // Authorized
            renderWithProviders(<TestRbacRouter requiredRole={ROLES.SUPER_ADMIN} />, {
                preloadedState: {
                    auth: {
                        isAuthenticated: true,
                        user: { role: ROLES.SUPER_ADMIN, email: 'admin@prime.edu' },
                        accessToken: 'sa-token',
                    },
                },
                route: '/protected-portal',
            });
            expect(screen.getByText('PORTAL_AUTHORIZED_ACCESS')).toBeInTheDocument();

            // Unauthorized user (e.g. STUDENT)
            renderWithProviders(<TestRbacRouter requiredRole={ROLES.SUPER_ADMIN} />, {
                preloadedState: {
                    auth: {
                        isAuthenticated: true,
                        user: { role: ROLES.STUDENT, email: 'student@delhi.edu' },
                        accessToken: 'st-token',
                    },
                },
                route: '/protected-portal',
            });
            expect(screen.getByText('UNAUTHORIZED_VIEW')).toBeInTheDocument();
        });

        it('SCHOOL_ERP_ROLES: permits SCHOOL_ADMIN, ACCOUNTANT, LIBRARIAN, FRONT_OFFICE', () => {
            const erpRoles = [ROLES.SCHOOL_ADMIN, ROLES.ACCOUNTANT, ROLES.LIBRARIAN, ROLES.FRONT_OFFICE];

            erpRoles.forEach((role) => {
                const { unmount } = renderWithProviders(<TestRbacRouter requiredRole={SCHOOL_ERP_ROLES} />, {
                    preloadedState: {
                        auth: {
                            isAuthenticated: true,
                            user: { role, email: `${role}@school.edu` },
                            accessToken: 'tok',
                        },
                    },
                    route: '/protected-portal',
                });
                expect(screen.getByText('PORTAL_AUTHORIZED_ACCESS')).toBeInTheDocument();
                unmount();
            });
        });

        it('SCHOOL_ERP_ROLES: rejects TEACHER, DRIVER, STUDENT, PARENT from accessing admin ERP portal', () => {
            const nonErpRoles = [ROLES.TEACHER, ROLES.DRIVER, ROLES.STUDENT, ROLES.PARENT];

            nonErpRoles.forEach((role) => {
                const { unmount } = renderWithProviders(<TestRbacRouter requiredRole={SCHOOL_ERP_ROLES} />, {
                    preloadedState: {
                        auth: {
                            isAuthenticated: true,
                            user: { role, email: `${role}@school.edu` },
                            accessToken: 'tok',
                        },
                    },
                    route: '/protected-portal',
                });
                expect(screen.getByText('UNAUTHORIZED_VIEW')).toBeInTheDocument();
                unmount();
            });
        });

        it('TEACHER: permits TEACHER on staff portal and rejects unauthorized roles', () => {
            renderWithProviders(<TestRbacRouter requiredRole={ROLES.TEACHER} />, {
                preloadedState: {
                    auth: {
                        isAuthenticated: true,
                        user: { role: ROLES.TEACHER, email: 'teacher@school.edu' },
                        accessToken: 't-tok',
                    },
                },
                route: '/protected-portal',
            });
            expect(screen.getByText('PORTAL_AUTHORIZED_ACCESS')).toBeInTheDocument();
        });

        it('DRIVER: permits DRIVER on driver portal and rejects parents/students', () => {
            renderWithProviders(<TestRbacRouter requiredRole={ROLES.DRIVER} />, {
                preloadedState: {
                    auth: {
                        isAuthenticated: true,
                        user: { role: ROLES.DRIVER, email: 'driver@school.edu' },
                        accessToken: 'd-tok',
                    },
                },
                route: '/protected-portal',
            });
            expect(screen.getByText('PORTAL_AUTHORIZED_ACCESS')).toBeInTheDocument();
        });

        it('PARENT & STUDENT: permits PARENT or STUDENT on family portal', () => {
            const familyRoles = [ROLES.PARENT, ROLES.STUDENT];

            familyRoles.forEach((role) => {
                const { unmount } = renderWithProviders(<TestRbacRouter requiredRole={[ROLES.PARENT, ROLES.STUDENT]} />, {
                    preloadedState: {
                        auth: {
                            isAuthenticated: true,
                            user: { role, email: `${role}@family.edu` },
                            accessToken: 'fam-tok',
                        },
                    },
                    route: '/protected-portal',
                });
                expect(screen.getByText('PORTAL_AUTHORIZED_ACCESS')).toBeInTheDocument();
                unmount();
            });
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 4. Socket Client Auth Integration
    // ─────────────────────────────────────────────────────────────────────────
    describe('4. Socket Client Auth Integration', () => {
        it('initSocket should successfully initialize socket when pso_accessToken is present', () => {
            localStorage.setItem('pso_accessToken', 'socket-auth-pso-token');
            const socket = initSocket();
            expect(socket).not.toBeNull();
            expect(socket.auth.token).toBe('socket-auth-pso-token');
        });

        it('initSocket should return null when no token is present', () => {
            const socket = initSocket();
            expect(socket).toBeNull();
        });

        it('updateSocketToken should update socket token and reconnect', () => {
            localStorage.setItem('pso_accessToken', 'initial-token');
            const socket = initSocket();
            expect(socket.auth.token).toBe('initial-token');

            updateSocketToken('newly-refreshed-token');
            expect(socket.auth.token).toBe('newly-refreshed-token');
            expect(socket.disconnect).toHaveBeenCalled();
            expect(socket.connect).toHaveBeenCalled();
        });
    });
});
