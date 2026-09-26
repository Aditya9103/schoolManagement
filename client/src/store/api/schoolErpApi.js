/**
 * schoolErpApi.js — PrimeSchoolOs School ERP & Tenant Dashboard RTK Query API.
 * Encapsulates all school profile and ERP dashboard queries and mutations.
 */
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseApi';

export const schoolErpApi = createApi({
    reducerPath: 'schoolErpApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['SchoolProfile', 'SchoolDashboard'],
    endpoints: (builder) => ({
        getMySchool: builder.query({
            query: () => ({ url: '/schools/my-school', method: 'GET' }),
            providesTags: ['SchoolProfile'],
        }),
        getSchoolDashboardStats: builder.query({
            query: (params) => ({
                url: '/schools/dashboard-stats',
                method: 'GET',
                params,
            }),
            providesTags: ['SchoolDashboard'],
        }),
    }),
});

export const {
    useGetMySchoolQuery,
    useGetSchoolDashboardStatsQuery,
} = schoolErpApi;
