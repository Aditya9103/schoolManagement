/**
 * superAdminApi.js — PrimeSchoolOs Super Admin RTK Query API.
 */
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseApi';

export const superAdminApi = createApi({
    reducerPath: 'superAdminApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Schools', 'PlatformStats'],
    endpoints: (builder) => ({
        // Platform Stats
        getPlatformStats: builder.query({
            query: () => ({ url: '/schools/stats', method: 'GET' }),
            providesTags: ['PlatformStats'],
        }),
        getSchoolsGrowth: builder.query({
            query: (months = 12) => ({ url: `/schools/growth?months=${months}`, method: 'GET' }),
        }),
        getRevenueOverview: builder.query({
            query: (months = 6) => ({ url: `/schools/revenue?months=${months}`, method: 'GET' }),
        }),
        // Schools CRUD
        getAllSchools: builder.query({
            query: (params = {}) => {
                const q = new URLSearchParams(params).toString();
                return { url: `/schools${q ? `?${q}` : ''}`, method: 'GET' };
            },
            providesTags: ['Schools'],
        }),
        getSchool: builder.query({
            query: (id) => ({ url: `/schools/${id}`, method: 'GET' }),
            providesTags: (_r, _e, id) => [{ type: 'Schools', id }],
        }),
        createSchool: builder.mutation({
            query: (data) => ({ url: '/schools', method: 'POST', data }),
            invalidatesTags: ['Schools', 'PlatformStats'],
        }),
        updateSchool: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/schools/${id}`, method: 'PUT', data }),
            invalidatesTags: (_r, _e, { id }) => [{ type: 'Schools', id }, 'PlatformStats'],
        }),
        toggleSchoolStatus: builder.mutation({
            query: (id) => ({ url: `/schools/${id}/toggle-status`, method: 'PATCH' }),
            invalidatesTags: ['Schools', 'PlatformStats'],
        }),
        updateSubscription: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/schools/${id}/subscription`, method: 'PATCH', data }),
            invalidatesTags: ['Schools', 'PlatformStats'],
        }),
        inviteSchoolAdmin: builder.mutation({
            query: ({ schoolId, ...data }) => ({
                url: `/schools/${schoolId}/invite-admin`,
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Schools', 'PlatformStats'],
        }),
        getOnboardingPipeline: builder.query({
            query: () => ({ url: '/schools/onboarding/pipeline', method: 'GET' }),
            providesTags: ['Schools'],
        }),
    }),
});

export const {
    useGetPlatformStatsQuery,
    useGetSchoolsGrowthQuery,
    useGetRevenueOverviewQuery,
    useGetAllSchoolsQuery,
    useGetSchoolQuery,
    useCreateSchoolMutation,
    useUpdateSchoolMutation,
    useToggleSchoolStatusMutation,
    useUpdateSubscriptionMutation,
    useInviteSchoolAdminMutation,
    useGetOnboardingPipelineQuery,
} = superAdminApi;
