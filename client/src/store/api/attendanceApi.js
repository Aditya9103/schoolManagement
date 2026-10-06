import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseApi';

export const attendanceApi = createApi({
    reducerPath: 'attendanceApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['AttendanceRegister', 'AttendanceStats', 'AttendanceActivities', 'StudentLeaves'],
    endpoints: (builder) => ({
        getAttendanceStats: builder.query({
            query: (params = {}) => {
                const queryStr = new URLSearchParams(
                    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
                ).toString();
                return {
                    url: `/attendance/stats${queryStr ? `?${queryStr}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['AttendanceStats'],
        }),
        getRecentActivities: builder.query({
            query: () => ({ url: '/attendance/activities', method: 'GET' }),
            providesTags: ['AttendanceActivities'],
        }),
        getAttendanceRegister: builder.query({
            query: (params = {}) => {
                const queryStr = new URLSearchParams(
                    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
                ).toString();
                return {
                    url: `/attendance/register${queryStr ? `?${queryStr}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['AttendanceRegister'],
        }),
        saveAttendanceRegister: builder.mutation({
            query: (data) => ({
                url: '/attendance/register',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['AttendanceRegister', 'AttendanceStats', 'AttendanceActivities'],
        }),
        getLeaveRequests: builder.query({
            query: (params = {}) => {
                const queryStr = new URLSearchParams(
                    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
                ).toString();
                return {
                    url: `/attendance/leaves${queryStr ? `?${queryStr}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['StudentLeaves'],
        }),
        createLeaveRequest: builder.mutation({
            query: (data) => ({
                url: '/attendance/leaves',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['StudentLeaves'],
        }),
        updateLeaveStatus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/attendance/leaves/${id}/status`,
                method: 'PATCH',
                data,
            }),
            invalidatesTags: ['StudentLeaves'],
        }),
    }),
});

export const {
    useGetAttendanceStatsQuery,
    useGetRecentActivitiesQuery,
    useGetAttendanceRegisterQuery,
    useSaveAttendanceRegisterMutation,
    useGetLeaveRequestsQuery,
    useCreateLeaveRequestMutation,
    useUpdateLeaveStatusMutation,
} = attendanceApi;
