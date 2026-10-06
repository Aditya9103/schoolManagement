import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseApi';

export const homeworkApi = createApi({
    reducerPath: 'homeworkApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Assignments', 'Assignment', 'AssignmentStats', 'Submissions', 'HomeworkAnalytics'],
    endpoints: (builder) => ({
        getHomeworkStats: builder.query({
            query: () => ({ url: '/homework/overview-stats', method: 'GET' }),
            providesTags: ['AssignmentStats'],
        }),
        listAssignments: builder.query({
            query: (params = {}) => {
                const queryStr = new URLSearchParams(
                    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
                ).toString();
                return {
                    url: `/homework${queryStr ? `?${queryStr}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['Assignments'],
        }),
        getAssignmentById: builder.query({
            query: (id) => ({ url: `/homework/${id}`, method: 'GET' }),
            providesTags: (_res, _err, id) => [{ type: 'Assignment', id }],
        }),
        createAssignment: builder.mutation({
            query: (data) => ({
                url: '/homework',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Assignments', 'AssignmentStats', 'HomeworkAnalytics'],
        }),
        updateAssignment: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/homework/${id}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (_res, _err, { id }) => [
                'Assignments',
                'AssignmentStats',
                { type: 'Assignment', id },
            ],
        }),
        deleteAssignment: builder.mutation({
            query: (id) => ({
                url: `/homework/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Assignments', 'AssignmentStats'],
        }),
        listSubmissions: builder.query({
            query: ({ assignmentId, ...params }) => {
                const queryStr = new URLSearchParams(
                    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
                ).toString();
                return {
                    url: `/homework/${assignmentId}/submissions${queryStr ? `?${queryStr}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: (_res, _err, { assignmentId }) => [
                { type: 'Submissions', id: assignmentId },
            ],
        }),
        gradeSubmission: builder.mutation({
            query: ({ assignmentId, submissionId, ...data }) => ({
                url: `/homework/${assignmentId}/submissions/${submissionId}/grade`,
                method: 'PATCH',
                data,
            }),
            invalidatesTags: (_res, _err, { assignmentId }) => [
                'Assignments',
                'AssignmentStats',
                { type: 'Submissions', id: assignmentId },
            ],
        }),
        submitHomework: builder.mutation({
            query: ({ assignmentId, ...data }) => ({
                url: `/homework/${assignmentId}/submissions`,
                method: 'POST',
                data,
            }),
            invalidatesTags: (_res, _err, { assignmentId }) => [
                'Assignments',
                'AssignmentStats',
                { type: 'Submissions', id: assignmentId },
            ],
        }),
        getHomeworkAnalytics: builder.query({
            query: (params = {}) => {
                const queryStr = new URLSearchParams(
                    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
                ).toString();
                return {
                    url: `/homework/analytics${queryStr ? `?${queryStr}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['HomeworkAnalytics'],
        }),
    }),
});

export const {
    useGetHomeworkStatsQuery,
    useListAssignmentsQuery,
    useGetAssignmentByIdQuery,
    useCreateAssignmentMutation,
    useUpdateAssignmentMutation,
    useDeleteAssignmentMutation,
    useListSubmissionsQuery,
    useGradeSubmissionMutation,
    useSubmitHomeworkMutation,
    useGetHomeworkAnalyticsQuery,
} = homeworkApi;
