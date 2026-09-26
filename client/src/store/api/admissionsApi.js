import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseApi';

export const admissionsApi = createApi({
    reducerPath: 'admissionsApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Admission', 'AdmissionStats', 'AdmissionEnquiry'],
    endpoints: (builder) => ({
        // ── Public Multi-Tenant Admissions ──────────────────────────────────────────
        getPublicSchoolBySlug: builder.query({
            query: (schoolSlug) => ({
                url: `/admissions/public/school/${schoolSlug}`,
                method: 'GET',
            }),
        }),

        getPublicSchoolsDirectory: builder.query({
            query: (params) => ({
                url: '/admissions/public/schools',
                method: 'GET',
                params,
            }),
        }),

        submitPublicApplication: builder.mutation({
            query: ({ schoolSlug, data }) => ({
                url: `/admissions/public/school/${schoolSlug}/apply`,
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Admission', 'AdmissionStats'],
        }),

        trackPublicApplication: builder.query({
            query: ({ applicationNo, phoneOrDob }) => ({
                url: '/admissions/public/track',
                method: 'GET',
                params: { applicationNo, phoneOrDob },
            }),
        }),

        // ── School ERP Authenticated Admissions ──────────────────────────────────────
        getApplications: builder.query({
            query: (params) => ({
                url: '/admissions',
                method: 'GET',
                params,
            }),
            providesTags: (result) =>
                result?.data?.applications
                    ? [
                          ...result.data.applications.map(({ _id }) => ({ type: 'Admission', id: _id })),
                          { type: 'Admission', id: 'LIST' },
                      ]
                    : [{ type: 'Admission', id: 'LIST' }],
        }),

        getAdmissionStats: builder.query({
            query: (params) => ({
                url: '/admissions/stats',
                method: 'GET',
                params,
            }),
            providesTags: ['AdmissionStats'],
        }),

        getApplicationById: builder.query({
            query: (id) => ({
                url: `/admissions/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Admission', id }],
        }),

        updateApplicationStatus: builder.mutation({
            query: ({ id, status, remarks }) => ({
                url: `/admissions/${id}/status`,
                method: 'PATCH',
                data: { status, remarks },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Admission', id },
                { type: 'Admission', id: 'LIST' },
                'AdmissionStats',
            ],
        }),

        verifyDocument: builder.mutation({
            query: ({ id, docId, status, remarks }) => ({
                url: `/admissions/${id}/verify-doc`,
                method: 'PATCH',
                data: { docId, status, remarks },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Admission', id },
                { type: 'Admission', id: 'LIST' },
                'AdmissionStats',
            ],
        }),

        scheduleTest: builder.mutation({
            query: ({ id, ...testData }) => ({
                url: `/admissions/${id}/schedule-test`,
                method: 'POST',
                data: testData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Admission', id },
                { type: 'Admission', id: 'LIST' },
                'AdmissionStats',
            ],
        }),

        recordTestResult: builder.mutation({
            query: ({ id, ...resultData }) => ({
                url: `/admissions/${id}/test-result`,
                method: 'PATCH',
                data: resultData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Admission', id },
                { type: 'Admission', id: 'LIST' },
                'AdmissionStats',
            ],
        }),

        enrollStudent: builder.mutation({
            query: ({ id, ...enrollmentData }) => ({
                url: `/admissions/${id}/enroll`,
                method: 'POST',
                data: enrollmentData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Admission', id },
                { type: 'Admission', id: 'LIST' },
                'AdmissionStats',
            ],
        }),

        // ── Enquiry Desk ─────────────────────────────────────────────────────────────
        getEnquiries: builder.query({
            query: (params) => ({
                url: '/admissions/enquiries',
                method: 'GET',
                params,
            }),
            providesTags: ['AdmissionEnquiry'],
        }),

        createEnquiry: builder.mutation({
            query: (data) => ({
                url: '/admissions/enquiries',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['AdmissionEnquiry', 'AdmissionStats'],
        }),

        convertEnquiry: builder.mutation({
            query: (id) => ({
                url: `/admissions/enquiries/${id}/convert`,
                method: 'POST',
            }),
            invalidatesTags: ['AdmissionEnquiry', 'Admission', 'AdmissionStats'],
        }),

        createWalkInApplication: builder.mutation({
            query: (data) => ({
                url: '/admissions/walk-in',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Admission', 'AdmissionStats'],
        }),
    }),
});

export const {
    useGetPublicSchoolBySlugQuery,
    useGetPublicSchoolsDirectoryQuery,
    useSubmitPublicApplicationMutation,
    useTrackPublicApplicationQuery,
    useLazyTrackPublicApplicationQuery,
    useGetApplicationsQuery,
    useGetAdmissionStatsQuery,
    useGetApplicationByIdQuery,
    useUpdateApplicationStatusMutation,
    useVerifyDocumentMutation,
    useScheduleTestMutation,
    useRecordTestResultMutation,
    useEnrollStudentMutation,
    useGetEnquiriesQuery,
    useCreateEnquiryMutation,
    useConvertEnquiryMutation,
    useCreateWalkInApplicationMutation,
} = admissionsApi;
