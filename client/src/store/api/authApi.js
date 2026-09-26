/**
 * authApi.js — PrimeSchoolOs Authentication RTK Query API.
 */
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseApi';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        // OTP: Send via email or whatsapp
        sendOtp: builder.mutation({
            query: (data) => ({ url: '/auth/otp/send', method: 'POST', data }),
        }),
        loginWithOtp: builder.mutation({
            query: (data) => ({ url: '/auth/login/otp', method: 'POST', data }),
        }),
        loginWithPassword: builder.mutation({
            query: (data) => ({ url: '/auth/login/password', method: 'POST', data }),
        }),
        logout: builder.mutation({
            query: (data) => ({ url: '/auth/logout', method: 'POST', data }),
        }),
        refreshToken: builder.mutation({
            query: (data) => ({ url: '/auth/refresh', method: 'POST', data }),
        }),
        getMe: builder.query({
            query: () => ({ url: '/auth/me', method: 'GET' }),
        }),
        changePassword: builder.mutation({
            query: (data) => ({ url: '/auth/change-password', method: 'POST', data }),
        }),
        sendForgotPasswordOtp: builder.mutation({
            query: (data) => ({ url: '/auth/otp/send', method: 'POST', data: { ...data, purpose: 'FORGOT_PASSWORD' } }),
        }),
        resetPassword: builder.mutation({
            query: (data) => ({ url: '/auth/forgot-password/reset', method: 'POST', data }),
        }),
        registerFcmToken: builder.mutation({
            query: (data) => ({ url: '/auth/fcm-token', method: 'POST', data }),
        }),
        wakeupServer: builder.query({
            query: () => ({ url: '/wakeup', method: 'GET' }),
        }),
    }),
});

export const {
    useSendOtpMutation,
    useLoginWithOtpMutation,
    useLoginWithPasswordMutation,
    useLogoutMutation,
    useRefreshTokenMutation,
    useGetMeQuery,
    useChangePasswordMutation,
    useSendForgotPasswordOtpMutation,
    useResetPasswordMutation,
    useRegisterFcmTokenMutation,
    useWakeupServerQuery,
} = authApi;
