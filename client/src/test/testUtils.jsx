import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import { authApi } from '../store/api/authApi';
import { superAdminApi } from '../store/api/superAdminApi';
import { notificationApi } from '../store/api/notificationApi';
import { classApi } from '../store/api/classApi';
import { studentApi } from '../store/api/studentApi';
import { uploadApi } from '../store/api/uploadApi';
import { schoolErpApi } from '../store/api/schoolErpApi';
import { rolesApi } from '../store/api/rolesApi';
import { admissionsApi } from '../store/api/admissionsApi';

export function createTestStore(preloadedState = {}) {
    return configureStore({
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
            getDefaultMiddleware({ serializableCheck: false })
                .concat(authApi.middleware)
                .concat(superAdminApi.middleware)
                .concat(notificationApi.middleware)
                .concat(classApi.middleware)
                .concat(studentApi.middleware)
                .concat(uploadApi.middleware)
                .concat(schoolErpApi.middleware)
                .concat(rolesApi.middleware)
                .concat(admissionsApi.middleware),
        preloadedState,
    });
}

export function renderWithProviders(
    ui,
    {
        preloadedState = {},
        store = createTestStore(preloadedState),
        route = '/',
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return (
            <Provider store={store}>
                <MemoryRouter initialEntries={[route]}>
                    {children}
                </MemoryRouter>
            </Provider>
        );
    }

    return {
        store,
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    };
}
