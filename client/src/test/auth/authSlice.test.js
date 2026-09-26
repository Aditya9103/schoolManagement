import { describe, it, expect, beforeEach } from 'vitest';
import authReducer, {
    setCredentials,
    logout,
    updateUser,
    getPortalRoute,
    ROLES,
} from '../../store/slices/authSlice';

describe('Frontend Auth State & Reducer Tests', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should initialize with default unauthenticated state if localStorage is empty', () => {
        const state = authReducer(undefined, { type: 'unknown' });
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.accessToken).toBeNull();
        expect(state.refreshToken).toBeNull();
    });

    it('setCredentials should authenticate user and persist tokens in localStorage', () => {
        const mockUser = {
            id: 'u123',
            name: 'Aditya SuperAdmin',
            email: 'admin@prime.edu',
            role: ROLES.SUPER_ADMIN,
        };

        const action = setCredentials({
            user: mockUser,
            accessToken: 'mock.access.token',
            refreshToken: 'mock.refresh.token',
        });

        const state = authReducer(undefined, action);
        expect(state.isAuthenticated).toBe(true);
        expect(state.user).toEqual(mockUser);
        expect(state.accessToken).toBe('mock.access.token');
        expect(state.refreshToken).toBe('mock.refresh.token');

        expect(localStorage.getItem('pso_accessToken')).toBe('mock.access.token');
        expect(localStorage.getItem('pso_refreshToken')).toBe('mock.refresh.token');
        expect(JSON.parse(localStorage.getItem('pso_user'))).toEqual(mockUser);
    });

    it('logout should reset state and purge tokens from localStorage', () => {
        // Pre-populate localStorage
        localStorage.setItem('pso_accessToken', 'token-to-be-cleared');
        localStorage.setItem('pso_refreshToken', 'refresh-to-be-cleared');
        localStorage.setItem('pso_user', JSON.stringify({ id: 'u1' }));

        const loggedInState = {
            user: { id: 'u1' },
            accessToken: 'token-to-be-cleared',
            refreshToken: 'refresh-to-be-cleared',
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
    });

    it('updateUser should update user fields in state and localStorage', () => {
        const initialState = {
            user: { id: 'u1', role: ROLES.TEACHER, firstName: 'Test' },
            isAuthenticated: true,
        };

        const state = authReducer(initialState, updateUser({ role: ROLES.SCHOOL_ADMIN }));
        expect(state.user.role).toBe(ROLES.SCHOOL_ADMIN);
        expect(state.user.firstName).toBe('Test');
        expect(JSON.parse(localStorage.getItem('pso_user')).role).toBe(ROLES.SCHOOL_ADMIN);
    });

    describe('getPortalRoute Routing Matrix', () => {
        it('should map SUPER_ADMIN to /super-admin', () => {
            expect(getPortalRoute(ROLES.SUPER_ADMIN)).toBe('/super-admin');
        });

        it('should map ERP staff roles to /school', () => {
            expect(getPortalRoute(ROLES.SCHOOL_ADMIN)).toBe('/school');
            expect(getPortalRoute(ROLES.ACCOUNTANT)).toBe('/school');
            expect(getPortalRoute(ROLES.LIBRARIAN)).toBe('/school');
            expect(getPortalRoute(ROLES.FRONT_OFFICE)).toBe('/school');
        });

        it('should map TEACHER to /staff', () => {
            expect(getPortalRoute(ROLES.TEACHER)).toBe('/staff');
        });

        it('should map PARENT and STUDENT to /parent', () => {
            expect(getPortalRoute(ROLES.PARENT)).toBe('/parent');
            expect(getPortalRoute(ROLES.STUDENT)).toBe('/parent');
        });

        it('should map DRIVER to /driver', () => {
            expect(getPortalRoute(ROLES.DRIVER)).toBe('/driver');
        });

        it('should fallback to /auth/login for invalid or undefined role', () => {
            expect(getPortalRoute(null)).toBe('/auth/login');
            expect(getPortalRoute(undefined)).toBe('/auth/login');
            expect(getPortalRoute('UNKNOWN_ROLE')).toBe('/auth/login');
        });
    });
});
