import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseApi';

export const classApi = createApi({
    reducerPath: 'classApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: [
        'Classes',
        'AcademicYears',
        'Subjects',
        'Timetables',
        'ClassTeachers',
        'ClassReports',
        'ClassSettings',
        'ClassStudents',
        'TeacherDashboard',
    ],
    endpoints: (builder) => ({
        // Teacher Dashboard Summary
        getTeacherDashboard: builder.query({
            query: () => ({ url: '/classes/teacher-dashboard', method: 'GET' }),
            providesTags: ['TeacherDashboard', 'Classes', 'Timetables'],
        }),

        // Overview Stats
        getOverviewStats: builder.query({
            query: () => ({ url: '/classes/overview-stats', method: 'GET' }),
            providesTags: ['Classes'],
        }),

        // Classes List
        getClasses: builder.query({
            query: (params) => ({ url: '/classes', method: 'GET', params }),
            providesTags: ['Classes'],
        }),

        // Class Details
        getClassDetails: builder.query({
            query: (id) => ({ url: `/classes/${id}/details`, method: 'GET' }),
            providesTags: (result, error, id) => [{ type: 'Classes', id }],
        }),

        // Create Class
        createClass: builder.mutation({
            query: (data) => ({ url: '/classes', method: 'POST', data }),
            invalidatesTags: ['Classes'],
        }),

        // Update Class
        updateClass: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/classes/${id}`, method: 'PUT', data }),
            invalidatesTags: ['Classes'],
        }),

        // Delete Class
        deleteClass: builder.mutation({
            query: (arg) => {
                const id = typeof arg === 'object' ? arg.id : arg;
                const cascade = typeof arg === 'object' && arg.cascade !== undefined ? arg.cascade : true;
                return {
                    url: `/classes/${id}?cascade=${cascade}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: ['Classes', 'Subjects', 'Timetables'],
        }),

        // Section Operations
        createSection: builder.mutation({
            query: ({ classId, ...data }) => ({
                url: `/classes/${classId}/sections`,
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Classes'],
        }),
        updateSection: builder.mutation({
            query: ({ classId, sectionId, ...data }) => ({
                url: `/classes/${classId}/sections/${sectionId}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: ['Classes'],
        }),
        deleteSection: builder.mutation({
            query: ({ classId, sectionId }) => ({
                url: `/classes/${classId}/sections/${sectionId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Classes'],
        }),

        // Class Students
        getClassStudents: builder.query({
            query: ({ classId, ...params }) => ({
                url: `/classes/${classId}/students`,
                method: 'GET',
                params,
            }),
            providesTags: ['ClassStudents'],
        }),

        // Teachers
        getClassTeachers: builder.query({
            query: () => ({ url: '/classes/teachers', method: 'GET' }),
            providesTags: ['ClassTeachers'],
        }),
        getStaffTeachers: builder.query({
            query: () => ({ url: '/classes/staff-teachers', method: 'GET' }),
            providesTags: ['ClassTeachers'],
        }),
        assignTeacher: builder.mutation({
            query: (data) => ({
                url: '/classes/teachers/assign',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['ClassTeachers', 'Classes'],
        }),

        // Subjects
        getSubjects: builder.query({
            query: (params) => ({ url: '/classes/subjects', method: 'GET', params }),
            providesTags: ['Subjects'],
        }),
        createSubject: builder.mutation({
            query: (data) => ({ url: '/classes/subjects', method: 'POST', data }),
            invalidatesTags: ['Subjects'],
        }),
        updateSubject: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/classes/subjects/${id}`, method: 'PUT', data }),
            invalidatesTags: ['Subjects'],
        }),
        deleteSubject: builder.mutation({
            query: (id) => ({ url: `/classes/subjects/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Subjects'],
        }),
        assignSubjectTeachers: builder.mutation({
            query: (data) => ({ url: '/classes/subjects/assign-teachers', method: 'POST', data }),
            invalidatesTags: ['Subjects'],
        }),

        // Timetable
        getTimetable: builder.query({
            query: (params) => ({ url: '/classes/timetable', method: 'GET', params }),
            providesTags: ['Timetables'],
        }),
        saveTimetable: builder.mutation({
            query: (data) => ({ url: '/classes/timetable', method: 'POST', data }),
            invalidatesTags: ['Timetables'],
        }),

        // Reports
        getClassReports: builder.query({
            query: (params) => ({ url: '/classes/reports', method: 'GET', params }),
            providesTags: ['ClassReports'],
        }),

        // Settings
        getClassSettings: builder.query({
            query: () => ({ url: '/classes/settings', method: 'GET' }),
            providesTags: ['ClassSettings'],
        }),
        updateClassSettings: builder.mutation({
            query: (data) => ({ url: '/classes/settings', method: 'PUT', data }),
            invalidatesTags: ['ClassSettings'],
        }),

        // Academic Years
        getAcademicYears: builder.query({
            query: () => ({ url: '/classes/academic-years', method: 'GET' }),
            providesTags: ['AcademicYears'],
        }),
        createAcademicYear: builder.mutation({
            query: (data) => ({ url: '/classes/academic-years', method: 'POST', data }),
            invalidatesTags: ['AcademicYears', 'Classes'],
        }),
        setCurrentAcademicYear: builder.mutation({
            query: (id) => ({ url: `/classes/academic-years/${id}/current`, method: 'PATCH' }),
            invalidatesTags: ['AcademicYears', 'Classes'],
        }),
    }),
});

export const {
    useGetTeacherDashboardQuery,
    useGetOverviewStatsQuery,
    useGetClassesQuery,
    useGetClassDetailsQuery,
    useCreateClassMutation,
    useUpdateClassMutation,
    useDeleteClassMutation,
    useCreateSectionMutation,
    useUpdateSectionMutation,
    useDeleteSectionMutation,
    useGetClassStudentsQuery,
    useGetClassTeachersQuery,
    useGetStaffTeachersQuery,
    useAssignTeacherMutation,
    useGetSubjectsQuery,
    useCreateSubjectMutation,
    useUpdateSubjectMutation,
    useDeleteSubjectMutation,
    useAssignSubjectTeachersMutation,
    useGetTimetableQuery,
    useSaveTimetableMutation,
    useGetClassReportsQuery,
    useGetClassSettingsQuery,
    useUpdateClassSettingsMutation,
    useGetAcademicYearsQuery,
    useCreateAcademicYearMutation,
    useSetCurrentAcademicYearMutation,
} = classApi;
