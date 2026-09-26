import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseApi';

export const rolesApi = createApi({
    reducerPath: 'rolesApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Role', 'MyPermissions'],
    endpoints: (builder) => ({
        getSchoolRoles: builder.query({
            query: () => ({ url: '/roles', method: 'GET' }),
            providesTags: (result) =>
                result?.data
                    ? [
                          ...result.data.map(({ _id }) => ({ type: 'Role', id: _id })),
                          { type: 'Role', id: 'LIST' },
                      ]
                    : [{ type: 'Role', id: 'LIST' }],
        }),

        getRoleById: builder.query({
            query: (id) => ({ url: `/roles/${id}`, method: 'GET' }),
            providesTags: (result, error, id) => [{ type: 'Role', id }],
        }),

        getModuleDefinitions: builder.query({
            query: () => ({ url: '/roles/modules', method: 'GET' }),
        }),

        createRole: builder.mutation({
            query: (data) => ({
                url: '/roles',
                method: 'POST',
                data,
            }),
            invalidatesTags: [{ type: 'Role', id: 'LIST' }],
        }),

        updateRole: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/roles/${id}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Role', id },
                { type: 'Role', id: 'LIST' },
                'MyPermissions',
            ],
        }),

        deleteRole: builder.mutation({
            query: (id) => ({
                url: `/roles/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Role', id: 'LIST' }, 'MyPermissions'],
        }),

        copyRole: builder.mutation({
            query: ({ id, name }) => ({
                url: `/roles/${id}/copy`,
                method: 'POST',
                data: { name },
            }),
            invalidatesTags: [{ type: 'Role', id: 'LIST' }],
        }),

        resetRole: builder.mutation({
            query: (id) => ({
                url: `/roles/${id}/reset`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Role', id },
                { type: 'Role', id: 'LIST' },
                'MyPermissions',
            ],
        }),

        getMyPermissions: builder.query({
            query: () => ({ url: '/roles/my-permissions', method: 'GET' }),
            providesTags: ['MyPermissions'],
        }),
    }),
});

export const {
    useGetSchoolRolesQuery,
    useGetRoleByIdQuery,
    useGetModuleDefinitionsQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useCopyRoleMutation,
    useResetRoleMutation,
    useGetMyPermissionsQuery,
} = rolesApi;

export const useUpdateRolePermissionsMutation = useUpdateRoleMutation;
