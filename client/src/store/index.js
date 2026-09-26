/**
 * store/index.js — PrimeSchoolOs Redux Store.
 * All Society Management APIs removed. Only school-domain APIs registered.
 */
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { superAdminApi } from './api/superAdminApi';
import { notificationApi } from './api/notificationApi';
import { classApi } from './api/classApi';
import { studentApi } from './api/studentApi';
import { uploadApi } from './api/uploadApi';
import { schoolErpApi } from './api/schoolErpApi';
import { rolesApi } from './api/rolesApi';
import { admissionsApi } from './api/admissionsApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [superAdminApi.reducerPath]: superAdminApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,
        [classApi.reducerPath]: classApi.reducer,
        [studentApi.reducerPath]: studentApi.reducer,
        [uploadApi.reducerPath]: uploadApi.reducer,
        [schoolErpApi.reducerPath]: schoolErpApi.reducer,
        [rolesApi.reducerPath]: rolesApi.reducer,
        [admissionsApi.reducerPath]: admissionsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(superAdminApi.middleware)
            .concat(notificationApi.middleware)
            .concat(classApi.middleware)
            .concat(studentApi.middleware)
            .concat(uploadApi.middleware)
            .concat(schoolErpApi.middleware)
            .concat(rolesApi.middleware)
            .concat(admissionsApi.middleware),
    devTools: import.meta.env.DEV,
});
