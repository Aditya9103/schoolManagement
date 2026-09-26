import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useGetMyPermissionsQuery } from '../store/api/rolesApi';

/**
 * usePermissions — Hook for real-time fine-grained dynamic RBAC checks.
 *
 * Automatically evaluates whether the logged-in staff has access to a page
 * or permission to perform an action (view, create, edit, delete, export).
 */
export function usePermissions() {
    const { user, token } = useSelector((state) => state.auth);
    const { data: permRes, isLoading } = useGetMyPermissionsQuery(undefined, {
        skip: !token,
    });

    const isSuperAdmin = user?.role === 'SUPER_ADMIN';
    const isSchoolAdmin = user?.role === 'SCHOOL_ADMIN';
    const isAdmin = isSuperAdmin || isSchoolAdmin;

    const permissions = useMemo(() => {
        return permRes?.data?.permissions || {};
    }, [permRes]);

    /**
     * Check if user has page-level access to a feature or module.
     * @param {string} featureId - e.g. 'students_list', 'fees_collection'
     */
    const canAccess = (featureId) => {
        if (isAdmin) return true;
        if (!featureId) return true;

        const feature = permissions[featureId];
        if (!feature) return false;

        return Boolean(feature.pageAccess || feature.view);
    };

    /**
     * Check if user has permission to perform an action on a feature.
     * @param {string} featureId - e.g. 'students_list'
     * @param {'view'|'create'|'edit'|'delete'|'export'|string} action
     */
    const hasAction = (featureId, action) => {
        if (isAdmin) return true;
        if (!featureId) return false;

        const feature = permissions[featureId];
        if (!feature) return false;

        if (action === 'other' || action.startsWith('other.')) {
            const otherKey = action.includes('.') ? action.split('.')[1] : action;
            return Boolean(feature.other?.[otherKey]);
        }

        return Boolean(feature[action]);
    };

    return {
        canAccess,
        hasAction,
        isAdmin,
        isSuperAdmin,
        isSchoolAdmin,
        role: user?.role,
        roleName: permRes?.data?.roleName || user?.role,
        permissions,
        isLoading,
    };
}

export default usePermissions;
