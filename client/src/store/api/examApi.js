import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseApi';

export const examApi = createApi({
    reducerPath: 'examApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Exams', 'Exam', 'ExamStats', 'ExamResults', 'QuestionPapers'],
    endpoints: (builder) => ({
        getExamOverviewStats: builder.query({
            query: () => ({ url: '/exams/overview-stats', method: 'GET' }),
            providesTags: ['ExamStats'],
        }),
        listExams: builder.query({
            query: (params = {}) => {
                const queryStr = new URLSearchParams(
                    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
                ).toString();
                return {
                    url: `/exams${queryStr ? `?${queryStr}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['Exams'],
        }),
        getExamById: builder.query({
            query: (id) => ({ url: `/exams/${id}`, method: 'GET' }),
            providesTags: (_res, _err, id) => [{ type: 'Exam', id }],
        }),
        createExam: builder.mutation({
            query: (data) => ({
                url: '/exams',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Exams', 'ExamStats'],
        }),
        updateExam: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/exams/${id}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (_res, _err, { id }) => ['Exams', 'ExamStats', { type: 'Exam', id }],
        }),
        deleteExam: builder.mutation({
            query: (id) => ({
                url: `/exams/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Exams', 'ExamStats'],
        }),
        getRecentResults: builder.query({
            query: (params = {}) => {
                const queryStr = new URLSearchParams(
                    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
                ).toString();
                return {
                    url: `/exams/recent-results${queryStr ? `?${queryStr}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['ExamResults'],
        }),
        getClassResults: builder.query({
            query: (params = {}) => {
                const queryStr = new URLSearchParams(
                    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
                ).toString();
                return {
                    url: `/exams/class-results${queryStr ? `?${queryStr}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['ExamResults'],
        }),
        getStudentResult: builder.query({
            query: ({ studentId, examId } = {}) => ({
                url: `/exams/student-result/${studentId || 'default'}${examId ? `?examId=${examId}` : ''}`,
                method: 'GET',
            }),
            providesTags: ['ExamResults'],
        }),
        saveMarks: builder.mutation({
            query: (data) => ({
                url: '/exams/save-marks',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['ExamResults', 'ExamStats', 'Exams'],
        }),
        listQuestionPapers: builder.query({
            query: (params = {}) => {
                const queryStr = new URLSearchParams(
                    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
                ).toString();
                return {
                    url: `/exams/question-papers${queryStr ? `?${queryStr}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['QuestionPapers'],
        }),
    }),
});

export const {
    useGetExamOverviewStatsQuery,
    useListExamsQuery,
    useGetExamByIdQuery,
    useCreateExamMutation,
    useUpdateExamMutation,
    useDeleteExamMutation,
    useGetRecentResultsQuery,
    useGetClassResultsQuery,
    useGetStudentResultQuery,
    useSaveMarksMutation,
    useListQuestionPapersQuery,
} = examApi;
