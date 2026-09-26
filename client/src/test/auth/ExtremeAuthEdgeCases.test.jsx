import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders, createTestStore } from '../testUtils';
import LoginPage from '../../auth/LoginPage';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import authReducer, {
    setCredentials,
    logout,
    updateUser,
    getPortalRoute,
    ROLES,
    SCHOOL_ERP_ROLES,
} from '../../store/slices/authSlice';

// Mock auth API hooks
const mockSendOtp = vi.fn();
const mockLoginWithPassword = vi.fn();
const mockLoginWithOtp = vi.fn();

vi.mock('../../store/api/authApi', () => ({
    authApi: {
        reducerPath: 'authApi',
        reducer: (state = {}) => state,
        middleware: () => (next) => (action) => next(action),
    },
    useSendOtpMutation: () => [mockSendOtp, { isLoading: false }],
    useLoginWithPasswordMutation: () => [mockLoginWithPassword, { isLoading: false }],
    useLoginWithOtpMutation: () => [mockLoginWithOtp, { isLoading: false }],
}));

describe('Extreme Comprehensive Frontend Authentication Test Suite', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // 1. ALL 10 ROLES MATRIX & PORTAL RESOLUTION
    // ─────────────────────────────────────────────────────────────────────────────
    describe('Role Matrix & Portal Navigation Resolution (All Users)', () => {
        const roleExpectations = [
            { role: ROLES.SUPER_ADMIN, expected: '/super-admin', label: 'Super Admin' },
            { role: ROLES.SCHOOL_ADMIN, expected: '/school', label: 'School Admin' },
            { role: ROLES.TEACHER, expected: '/staff', label: 'Teacher / Staff' },
            { role: ROLES.ACCOUNTANT, expected: '/school', label: 'Accountant' },
            { role: ROLES.LIBRARIAN, expected: '/school', label: 'Librarian' },
            { role: ROLES.FRONT_OFFICE, expected: '/school', label: 'Front Office' },
            { role: ROLES.DRIVER, expected: '/driver', label: 'Driver' },
            { role: ROLES.PARENT, expected: '/parent', label: 'Parent' },
            { role: ROLES.STUDENT, expected: '/parent', label: 'Student' },
        ];

        roleExpectations.forEach(({ role, expected, label }) => {
            it(`should map ${label} (${role}) to portal route: ${expected}`, () => {
                expect(getPortalRoute(role)).toBe(expected);
            });
        });

        it('should handle unauthenticated, null, or attacker/unknown role safely', () => {
            expect(getPortalRoute('HACKER_ATTEMPT')).toBe('/auth/login');
            expect(getPortalRoute(null)).toBe('/auth/login');
            expect(getPortalRoute(undefined)).toBe('/auth/login');
            expect(getPortalRoute('')).toBe('/auth/login');
        });
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // 2. FULL LOGIN INTERACTIONS, WHITESPACE TRIMMING & CREDENTIAL FLOWS
    // ─────────────────────────────────────────────────────────────────────────────
    describe('LoginPage Form Interactions & Extreme Input Edge Cases', () => {
        it('should login Super Admin with password, trimming whitespaces and storing credentials', async () => {
            const superAdminUser = {
                _id: 'sa-001',
                name: 'Super Admin Commander',
                email: 'superadmin@primeschoolos.edu',
                role: ROLES.SUPER_ADMIN,
            };

            mockLoginWithPassword.mockReturnValue({
                unwrap: () =>
                    Promise.resolve({
                        data: {
                            user: superAdminUser,
                            accessToken: 'sa-jwt-token-123',
                            refreshToken: 'sa-refresh-token-456',
                        },
                    }),
            });

            const { store } = renderWithProviders(<LoginPage />, { route: '/auth/login' });

            const idInputs = screen.getAllByPlaceholderText(/email or mobile number/i);
            const pwInputs = screen.getAllByPlaceholderText(/^Password$/i);

            idInputs.forEach((el) => fireEvent.change(el, { target: { value: '   superadmin@primeschoolos.edu   ' } }));
            pwInputs.forEach((el) => fireEvent.change(el, { target: { value: 'SuperSecret123!' } }));

            const forms = document.querySelectorAll('form');
            fireEvent.submit(forms[0]);

            await waitFor(() => {
                expect(mockLoginWithPassword).toHaveBeenCalledTimes(1);
            });

            // Verify trimmed identifier was sent to API
            expect(mockLoginWithPassword).toHaveBeenCalledWith({
                identifier: 'superadmin@primeschoolos.edu',
                password: 'SuperSecret123!',
            });

            // Verify Redux state updated with user and token
            const authState = store.getState().auth;
            expect(authState.isAuthenticated).toBe(true);
            expect(authState.user.email).toBe('superadmin@primeschoolos.edu');
            expect(authState.user.role).toBe(ROLES.SUPER_ADMIN);
            expect(authState.accessToken).toBe('sa-jwt-token-123');

            // Verify LocalStorage persisted
            expect(localStorage.getItem('pso_accessToken')).toBe('sa-jwt-token-123');
            expect(localStorage.getItem('pso_refreshToken')).toBe('sa-refresh-token-456');
        });

        it('should login Student via OTP flow with full validation and channel selection', async () => {
            const studentUser = {
                _id: 'std-999',
                name: 'Rohan Sharma',
                email: 'rohan.student@delhischool.edu',
                role: ROLES.STUDENT,
                schoolId: 'sch-delhi-1',
            };

            mockSendOtp.mockReturnValue({
                unwrap: () => Promise.resolve({ success: true, message: 'OTP sent' }),
            });

            mockLoginWithOtp.mockReturnValue({
                unwrap: () =>
                    Promise.resolve({
                        data: {
                            user: studentUser,
                            accessToken: 'student-jwt-xyz',
                            refreshToken: 'student-refresh-xyz',
                        },
                    }),
            });

            const { store } = renderWithProviders(<LoginPage />, { route: '/auth/login' });

            // Switch to OTP mode
            const otpTabs = screen.getAllByRole('button', { name: /login with otp|otp/i });
            fireEvent.click(otpTabs[0]);

            // Type identifier
            const idInputs = screen.getAllByPlaceholderText(/email or mobile number/i);
            idInputs.forEach((el) => fireEvent.change(el, { target: { value: '  rohan.student@delhischool.edu  ' } }));

            // Click "Send OTP"
            const sendOtpBtns = screen.getAllByRole('button', { name: /send otp/i });
            fireEvent.click(sendOtpBtns[0]);

            await waitFor(() => {
                expect(mockSendOtp).toHaveBeenCalledWith({
                    email: 'rohan.student@delhischool.edu',
                    purpose: 'LOGIN',
                    channel: 'email',
                });
            });

            // Enter 6-digit OTP
            const otpInputs = screen.getAllByPlaceholderText(/••••••/);
            otpInputs.forEach((el) => fireEvent.change(el, { target: { value: ' 654321 ' } }));

            // Submit form
            const forms = document.querySelectorAll('form');
            fireEvent.submit(forms[0]);

            await waitFor(() => {
                expect(mockLoginWithOtp).toHaveBeenCalledWith({
                    email: 'rohan.student@delhischool.edu',
                    otp: '654321',
                });
            });

            const authState = store.getState().auth;
            expect(authState.isAuthenticated).toBe(true);
            expect(authState.user.role).toBe(ROLES.STUDENT);
        });

        it('should handle deactivated account error cleanly and display notification without crashing', async () => {
            mockLoginWithPassword.mockReturnValue({
                unwrap: () =>
                    Promise.reject({
                        data: {
                            message: 'Your institutional account has been deactivated. Contact administrator.',
                        },
                    }),
            });

            renderWithProviders(<LoginPage />, { route: '/auth/login' });

            const idInputs = screen.getAllByPlaceholderText(/email or mobile number/i);
            const pwInputs = screen.getAllByPlaceholderText(/^Password$/i);

            idInputs.forEach((el) => fireEvent.change(el, { target: { value: 'teacher.suspended@school.edu' } }));
            pwInputs.forEach((el) => fireEvent.change(el, { target: { value: 'AnyPassword123' } }));

            const forms = document.querySelectorAll('form');
            fireEvent.submit(forms[0]);

            await waitFor(() => {
                expect(mockLoginWithPassword).toHaveBeenCalled();
            });

            const errorAlerts = await screen.findAllByText(
                /Your institutional account has been deactivated/i
            );
            expect(errorAlerts.length).toBeGreaterThan(0);
            expect(errorAlerts[0]).toBeInTheDocument();
        });

        it('should handle API authentication rejection (401 Bad Credentials) with error alert', async () => {
            mockLoginWithPassword.mockReturnValue({
                unwrap: () =>
                    Promise.reject({
                        data: {
                            message: 'Invalid email or password. Please try again.',
                        },
                    }),
            });

            renderWithProviders(<LoginPage />, { route: '/auth/login' });

            const idInputs = screen.getAllByPlaceholderText(/email or mobile number/i);
            const pwInputs = screen.getAllByPlaceholderText(/^Password$/i);

            idInputs.forEach((el) => fireEvent.change(el, { target: { value: 'wrong@school.edu' } }));
            pwInputs.forEach((el) => fireEvent.change(el, { target: { value: 'WrongPass123' } }));

            const forms = document.querySelectorAll('form');
            fireEvent.submit(forms[0]);

            const errorAlerts = await screen.findAllByText(/Invalid email or password/i);
            expect(errorAlerts.length).toBeGreaterThan(0);
            expect(errorAlerts[0]).toBeInTheDocument();
        });

        it('should remember user identifier when Remember Me checkbox is checked and clear when unchecked', async () => {
            mockLoginWithPassword.mockReturnValue({
                unwrap: () =>
                    Promise.resolve({
                        data: {
                            user: { _id: 'u1', email: 'remember@test.edu', role: 'TEACHER' },
                            accessToken: 'tok',
                        },
                    }),
            });

            renderWithProviders(<LoginPage />, { route: '/auth/login' });

            const idInputs = screen.getAllByPlaceholderText(/email or mobile number/i);
            const pwInputs = screen.getAllByPlaceholderText(/^Password$/i);
            const rememberCheckboxes = screen.getAllByRole('checkbox');

            // Check Remember Me
            fireEvent.click(rememberCheckboxes[0]);
            idInputs.forEach((el) => fireEvent.change(el, { target: { value: 'remember@test.edu' } }));
            pwInputs.forEach((el) => fireEvent.change(el, { target: { value: 'Pass123' } }));

            const forms = document.querySelectorAll('form');
            fireEvent.submit(forms[0]);

            await waitFor(() => {
                expect(localStorage.getItem('psos_remember')).toBe('true');
                expect(localStorage.getItem('psos_identifier')).toBe('remember@test.edu');
            });
        });
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // 3. EXTREME RBAC ACCESS BOUNDARIES & CROSS-PORTAL INTRUSION TESTS
    // ─────────────────────────────────────────────────────────────────────────────
    describe('Extreme RBAC Security Guard Matrix', () => {
        const makeStoreWithRole = (role) =>
            createTestStore({
                auth: {
                    user: { id: `user-${role}`, name: `User ${role}`, role },
                    accessToken: `token-${role}`,
                    isAuthenticated: true,
                },
            });

        const testRBAC = (userRole, targetRoute, allowedRoles, shouldAllow) => {
            const store = makeStoreWithRole(userRole);
            renderWithProviders(
                <Routes>
                    <Route
                        path={targetRoute}
                        element={
                            <ProtectedRoute requiredRole={allowedRoles}>
                                <div>ACCESS_GRANTED_AREA</div>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/unauthorized" element={<div>ACCESS_DENIED_403</div>} />
                    <Route path="/auth/login" element={<div>LOGIN_REDIRECT</div>} />
                </Routes>,
                { store, route: targetRoute }
            );

            if (shouldAllow) {
                expect(screen.getByText('ACCESS_GRANTED_AREA')).toBeInTheDocument();
                expect(screen.queryByText('ACCESS_DENIED_403')).not.toBeInTheDocument();
            } else {
                expect(screen.queryByText('ACCESS_GRANTED_AREA')).not.toBeInTheDocument();
                expect(screen.getByText('ACCESS_DENIED_403')).toBeInTheDocument();
            }
        };

        // SUPER ADMIN PORTAL GUARDS
        it('Super Admin should access /super-admin', () => {
            testRBAC(ROLES.SUPER_ADMIN, '/super-admin', ROLES.SUPER_ADMIN, true);
        });

        it('School Admin CANNOT access /super-admin (Denied 403)', () => {
            testRBAC(ROLES.SCHOOL_ADMIN, '/super-admin', ROLES.SUPER_ADMIN, false);
        });

        it('Teacher CANNOT access /super-admin (Denied 403)', () => {
            testRBAC(ROLES.TEACHER, '/super-admin', ROLES.SUPER_ADMIN, false);
        });

        it('Student CANNOT access /super-admin (Denied 403)', () => {
            testRBAC(ROLES.STUDENT, '/super-admin', ROLES.SUPER_ADMIN, false);
        });

        it('Driver CANNOT access /super-admin (Denied 403)', () => {
            testRBAC(ROLES.DRIVER, '/super-admin', ROLES.SUPER_ADMIN, false);
        });

        // SCHOOL ERP PORTAL GUARDS (School Admin, Accountant, Librarian, Front Office)
        it('School Admin should access /school', () => {
            testRBAC(ROLES.SCHOOL_ADMIN, '/school', SCHOOL_ERP_ROLES, true);
        });

        it('Accountant should access /school', () => {
            testRBAC(ROLES.ACCOUNTANT, '/school', SCHOOL_ERP_ROLES, true);
        });

        it('Librarian should access /school', () => {
            testRBAC(ROLES.LIBRARIAN, '/school', SCHOOL_ERP_ROLES, true);
        });

        it('Front Office should access /school', () => {
            testRBAC(ROLES.FRONT_OFFICE, '/school', SCHOOL_ERP_ROLES, true);
        });

        it('Student CANNOT access /school (Denied 403)', () => {
            testRBAC(ROLES.STUDENT, '/school', SCHOOL_ERP_ROLES, false);
        });

        it('Teacher CANNOT access /school (Denied 403)', () => {
            testRBAC(ROLES.TEACHER, '/school', SCHOOL_ERP_ROLES, false);
        });

        // TEACHER APP GUARDS
        it('Teacher should access /staff', () => {
            testRBAC(ROLES.TEACHER, '/staff', ROLES.TEACHER, true);
        });

        it('Parent CANNOT access /staff (Denied 403)', () => {
            testRBAC(ROLES.PARENT, '/staff', ROLES.TEACHER, false);
        });

        // DRIVER APP GUARDS
        it('Driver should access /driver', () => {
            testRBAC(ROLES.DRIVER, '/driver', ROLES.DRIVER, true);
        });

        it('Student CANNOT access /driver (Denied 403)', () => {
            testRBAC(ROLES.STUDENT, '/driver', ROLES.DRIVER, false);
        });

        // PARENT & STUDENT APP GUARDS
        it('Parent should access /parent', () => {
            testRBAC(ROLES.PARENT, '/parent', [ROLES.PARENT, ROLES.STUDENT], true);
        });

        it('Student should access /parent', () => {
            testRBAC(ROLES.STUDENT, '/parent', [ROLES.PARENT, ROLES.STUDENT], true);
        });

        it('Unauthenticated user is immediately redirected to /auth/login', () => {
            const unauthStore = createTestStore({
                auth: { user: null, accessToken: null, isAuthenticated: false },
            });

            renderWithProviders(
                <Routes>
                    <Route
                        path="/super-admin"
                        element={
                            <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
                                <div>SUPER_ADMIN_SECRET</div>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/auth/login" element={<div>LOGIN_REDIRECT</div>} />
                </Routes>,
                { store: unauthStore, route: '/super-admin' }
            );

            expect(screen.queryByText('SUPER_ADMIN_SECRET')).not.toBeInTheDocument();
            expect(screen.getByText('LOGIN_REDIRECT')).toBeInTheDocument();
        });
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // 4. CORRUPTED STORAGE RESILIENCE & LOGOUT PURGE
    // ─────────────────────────────────────────────────────────────────────────────
    describe('Storage Corruption Resilience & Session Lifecycles', () => {
        it('should safely handle corrupted JSON in localStorage without throwing', () => {
            localStorage.setItem('pso_user', '{bad-json-syntax}');
            // Creating a store should not throw error
            expect(() => createTestStore()).not.toThrow();
        });

        it('should purge all access tokens, refresh tokens, and user cache on logout', () => {
            const store = createTestStore({
                auth: {
                    user: { id: 'u1', role: ROLES.SCHOOL_ADMIN },
                    accessToken: 'token-to-purge',
                    refreshToken: 'refresh-to-purge',
                    isAuthenticated: true,
                },
            });

            localStorage.setItem('pso_accessToken', 'token-to-purge');
            localStorage.setItem('pso_refreshToken', 'refresh-to-purge');
            localStorage.setItem('pso_user', JSON.stringify({ id: 'u1' }));

            store.dispatch(logout());

            const state = store.getState().auth;
            expect(state.user).toBeNull();
            expect(state.accessToken).toBeNull();
            expect(state.refreshToken).toBeNull();
            expect(state.isAuthenticated).toBe(false);

            expect(localStorage.getItem('pso_accessToken')).toBeNull();
            expect(localStorage.getItem('pso_refreshToken')).toBeNull();
            expect(localStorage.getItem('pso_user')).toBeNull();
        });
    });
});
