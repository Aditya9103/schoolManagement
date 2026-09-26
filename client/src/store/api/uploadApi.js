/**
 * uploadApi.js — PrimeSchoolOs File & Media Uploads RTK Query API.
 * Centralizes all file and media uploads to AWS S3.
 */
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseApi';

export const uploadApi = createApi({
    reducerPath: 'uploadApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Uploads'],
    endpoints: (builder) => ({
        uploadImage: builder.mutation({
            query: (formData) => ({
                url: '/uploads/image',
                method: 'POST',
                data: formData,
            }),
        }),
        uploadDocument: builder.mutation({
            query: (formData) => ({
                url: '/uploads/document',
                method: 'POST',
                data: formData,
            }),
        }),
        getPresignedUrl: builder.mutation({
            query: (data) => ({
                url: '/uploads/presigned-url',
                method: 'POST',
                data,
            }),
        }),
        deleteUpload: builder.mutation({
            query: (data) => ({
                url: '/uploads',
                method: 'DELETE',
                data,
            }),
        }),
    }),
});

export const {
    useUploadImageMutation,
    useUploadDocumentMutation,
    useGetPresignedUrlMutation,
    useDeleteUploadMutation,
} = uploadApi;
