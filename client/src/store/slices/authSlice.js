/**
 * authSlice.js — PrimeSchoolOs Authentication State.
 */
import { createSlice } from '@reduxjs/toolkit';

// ── Role Constants ─────────────────────────────────────────────────────────────
export const ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    SCHOOL_ADMIN: 'SCHOOL_ADMIN',
    TEACHER: 'TEACHER',
    ACCOUNTANT: 'ACCOUNTANT',
    LIBRARIAN: 'LIBRARIAN',
    FRONT_OFFICE: 'FRONT_OFFICE',
    DRIVER: 'DRIVER',
    PARENT: 'PARENT',
    STUDENT: 'STUDENT',
};

export const SCHOOL_ERP_ROLES = [
    ROLES.SCHOOL_ADMIN,
    ROLES.TEACHER,
    ROLES.ACCOUNTANT,
    ROLES.LIBRARIAN,
    ROLES.FRONT_OFFICE,
];

// ── Portal Route Resolver ──────────────────────────────────────────────────────
export const getPortalRoute = (role) => {
    switch (role) {
        case ROLES.SUPER_ADMIN:  return '/super-admin';
        case ROLES.SCHOOL_ADMIN: return '/school';
        case ROLES.TEACHER:      return '/school';
        case ROLES.ACCOUNTANT:   return '/school';
        case ROLES.LIBRARIAN:    return '/school';
        case ROLES.FRONT_OFFICE: return '/school';
        case ROLES.DRIVER:       return '/driver';
        case ROLES.PARENT:       return '/portal';
        case ROLES.STUDENT:      return '/portal';
        default:                 return '/auth/login';
    }
};

// ── Initial State ──────────────────────────────────────────────────────────────
const storedUser = localStorage.getItem('pso_user') || localStorage.getItem('user');
let parsedUser = null;
try {
    if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        parsedUser = JSON.parse(storedUser);
    }
} catch (e) {
    console.error('[AuthSlice] Failed to parse stored user:', e);
}

const initialAccessToken = localStorage.getItem('pso_accessToken') || localStorage.getItem('accessToken') || null;
const initialRefreshToken = localStorage.getItem('pso_refreshToken') || localStorage.getItem('refreshToken') || null;

const initialState = {
    user: parsedUser,
    accessToken: initialAccessToken,
    refreshToken: initialRefreshToken,
    isAuthenticated: !!initialAccessToken,
};

// ── Slice ──────────────────────────────────────────────────────────────────────
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken, refreshToken } = action.payload;
            state.user = user;
            state.accessToken = accessToken;
            if (refreshToken) state.refreshToken = refreshToken;
            state.isAuthenticated = true;

            localStorage.setItem('pso_accessToken', accessToken);
            if (refreshToken) localStorage.setItem('pso_refreshToken', refreshToken);
            if (user) localStorage.setItem('pso_user', JSON.stringify(user));
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;

            localStorage.removeItem('pso_accessToken');
            localStorage.removeItem('pso_refreshToken');
            localStorage.removeItem('pso_user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');

            if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker?.controller) {
                navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_USER_CACHES' });
            }
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            if (state.user) localStorage.setItem('pso_user', JSON.stringify(state.user));
        },
    },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
