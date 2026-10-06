import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseApi';

export const noticeApi = createApi({
    reducerPath: 'noticeApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Notices'],
    endpoints: (builder) => ({
        getNotices: builder.query({
            query: (params) => ({
                url: '/notices',
                method: 'GET',
                params,
            }),
            providesTags: ['Notices'],
        }),

        getNoticeById: builder.query({
            query: (id) => ({
                url: `/notices/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Notices', id }],
        }),

        createNotice: builder.mutation({
            query: (data) => ({
                url: '/notices',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Notices'],
        }),

        updateNotice: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/notices/${id}`,
                method: 'PATCH',
                data,
            }),
            invalidatesTags: (result, error, { id }) => ['Notices', { type: 'Notices', id }],
        }),

        togglePinNotice: builder.mutation({
            query: (id) => ({
                url: `/notices/${id}/pin`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Notices'],
        }),

        acknowledgeNotice: builder.mutation({
            query: (id) => ({
                url: `/notices/${id}/acknowledge`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => ['Notices', { type: 'Notices', id }],
        }),

        deleteNotice: builder.mutation({
            query: (id) => ({
                url: `/notices/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Notices'],
        }),
    }),
});

export const {
    useGetNoticesQuery,
    useGetNoticeByIdQuery,
    useCreateNoticeMutation,
    useUpdateNoticeMutation,
    useTogglePinNoticeMutation,
    useAcknowledgeNoticeMutation,
    useDeleteNoticeMutation,
} = noticeApi;

export default noticeApi;
