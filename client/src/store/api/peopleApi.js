import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseApi';

export const peopleApi = createApi({
    reducerPath: 'peopleApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Teachers', 'Staff', 'Attendance', 'Parents', 'Payroll'],
    endpoints: (builder) => ({
        // ── TEACHERS ───────────────────────────────────────────────────────
        getTeachers: builder.query({
            query: (params) => ({
                url: '/people/teachers',
                method: 'GET',
                params,
            }),
            providesTags: ['Teachers'],
        }),

        getTeacherById: builder.query({
            query: (id) => ({
                url: `/people/teachers/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Teachers', id }],
        }),

        createTeacher: builder.mutation({
            query: (data) => ({
                url: '/people/teachers',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Teachers'],
        }),

        // ── STAFF ──────────────────────────────────────────────────────────
        getStaffList: builder.query({
            query: (params) => ({
                url: '/people/staff',
                method: 'GET',
                params,
            }),
            providesTags: ['Staff'],
        }),

        getStaffById: builder.query({
            query: (id) => ({
                url: `/people/staff/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Staff', id }],
        }),

        getStaffPayroll: builder.query({
            query: (id) => ({
                url: `/people/staff/${id}/payroll`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Payroll', id }],
        }),

        createStaff: builder.mutation({
            query: (data) => ({
                url: '/people/staff',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Staff'],
        }),

        // ── EMPLOYEE ATTENDANCE ────────────────────────────────────────────
        getEmployeeAttendance: builder.query({
            query: (params) => ({
                url: '/people/attendance',
                method: 'GET',
                params,
            }),
            providesTags: ['Attendance'],
        }),

        markEmployeeAttendance: builder.mutation({
            query: (data) => ({
                url: '/people/attendance/mark',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Attendance'],
        }),

        // ── PARENTS ────────────────────────────────────────────────────────
        getParents: builder.query({
            query: (params) => ({
                url: '/people/parents',
                method: 'GET',
                params,
            }),
            providesTags: ['Parents'],
        }),

        getParentById: builder.query({
            query: (id) => ({
                url: `/people/parents/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Parents', id }],
        }),

        createParent: builder.mutation({
            query: (data) => ({
                url: '/people/parents',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Parents'],
        }),
    }),
});

export const {
    useGetTeachersQuery,
    useGetTeacherByIdQuery,
    useCreateTeacherMutation,
    useGetStaffListQuery,
    useGetStaffByIdQuery,
    useGetStaffPayrollQuery,
    useCreateStaffMutation,
    useGetEmployeeAttendanceQuery,
    useMarkEmployeeAttendanceMutation,
    useGetParentsQuery,
    useGetParentByIdQuery,
    useCreateParentMutation,
} = peopleApi;

export default peopleApi;
