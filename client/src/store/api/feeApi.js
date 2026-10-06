import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseApi';

export const feeApi = createApi({
    reducerPath: 'feeApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['FeeOverview', 'FeeCategories', 'FeeStructures', 'FeeAllocations', 'FeeTransactions', 'FeeDefaulters'],
    endpoints: (builder) => ({
        getFeeOverview: builder.query({
            query: () => ({
                url: '/fees/overview',
                method: 'GET',
            }),
            providesTags: ['FeeOverview'],
        }),

        getFeeCategories: builder.query({
            query: () => ({
                url: '/fees/categories',
                method: 'GET',
            }),
            providesTags: ['FeeCategories'],
        }),

        createFeeCategory: builder.mutation({
            query: (data) => ({
                url: '/fees/categories',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['FeeCategories', 'FeeStructures'],
        }),

        getFeeStructures: builder.query({
            query: () => ({
                url: '/fees/structures',
                method: 'GET',
            }),
            providesTags: ['FeeStructures'],
        }),

        createFeeStructure: builder.mutation({
            query: (data) => ({
                url: '/fees/structures',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['FeeStructures', 'FeeOverview', 'FeeAllocations', 'FeeDefaulters'],
        }),

        getFeeAllocations: builder.query({
            query: (params) => ({
                url: '/fees/allocations',
                method: 'GET',
                params,
            }),
            providesTags: ['FeeAllocations'],
        }),

        getStudentFeeAccount: builder.query({
            query: (studentId) => ({
                url: `/fees/student/${studentId}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'FeeAllocations', id }],
        }),

        collectFeePayment: builder.mutation({
            query: (data) => ({
                url: '/fees/collect',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['FeeAllocations', 'FeeOverview', 'FeeTransactions', 'FeeDefaulters'],
        }),

        getFeeTransactions: builder.query({
            query: (params) => ({
                url: '/fees/transactions',
                method: 'GET',
                params,
            }),
            providesTags: ['FeeTransactions'],
        }),

        getFeeDefaulters: builder.query({
            query: (params) => ({
                url: '/fees/defaulters',
                method: 'GET',
                params,
            }),
            providesTags: ['FeeDefaulters'],
        }),
    }),
});

export const {
    useGetFeeOverviewQuery,
    useGetFeeCategoriesQuery,
    useCreateFeeCategoryMutation,
    useGetFeeStructuresQuery,
    useCreateFeeStructureMutation,
    useGetFeeAllocationsQuery,
    useGetStudentFeeAccountQuery,
    useCollectFeePaymentMutation,
    useGetFeeTransactionsQuery,
    useGetFeeDefaultersQuery,
} = feeApi;
