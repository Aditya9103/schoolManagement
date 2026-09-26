import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseApi';

export const studentApi = createApi({
    reducerPath: 'studentApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Students', 'Student'],
    endpoints: (builder) => ({
        getStudents: builder.query({
            query: (params = {}) => {
                const queryStr = new URLSearchParams(
                    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
                ).toString();
                return {
                    url: `/students${queryStr ? `?${queryStr}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['Students'],
        }),
        getStudentById: builder.query({
            query: (id) => ({ url: `/students/${id}`, method: 'GET' }),
            providesTags: (_res, _err, id) => [{ type: 'Student', id }],
        }),
        getStudentProfile: builder.query({
            query: () => ({ url: '/students/me', method: 'GET' }),
            providesTags: ['Student'],
        }),
        createStudent: builder.mutation({
            query: (data) => ({ url: '/students', method: 'POST', data }),
            invalidatesTags: ['Students'],
        }),
        updateStudent: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/students/${id}`, method: 'PUT', data }),
            invalidatesTags: (_res, _err, { id }) => ['Students', { type: 'Student', id }],
        }),
        deleteStudent: builder.mutation({
            query: (id) => ({ url: `/students/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Students'],
        }),
        addStudentDocument: builder.mutation({
            query: ({ studentId, document }) => ({
                url: `/students/${studentId}/documents`,
                method: 'POST',
                data: document,
            }),
            invalidatesTags: (_res, _err, { studentId }) => [{ type: 'Student', id: studentId }],
        }),
        removeStudentDocument: builder.mutation({
            query: ({ studentId, docId }) => ({
                url: `/students/${studentId}/documents/${docId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_res, _err, { studentId }) => [{ type: 'Student', id: studentId }],
        }),
    }),
});

export const {
    useGetStudentsQuery,
    useGetStudentByIdQuery,
    useGetStudentProfileQuery,
    useCreateStudentMutation,
    useUpdateStudentMutation,
    useDeleteStudentMutation,
    useAddStudentDocumentMutation,
    useRemoveStudentDocumentMutation,
} = studentApi;
