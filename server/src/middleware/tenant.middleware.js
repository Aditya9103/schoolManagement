/**
 * tenant.middleware.js — PrimeSchoolOS Tenant Context & Multi-School Isolation Middleware.
 * Establishes req.context = { userId, schoolId, role, activeYearId } for downstream controllers and services.
 */
import ApiError from '../utils/ApiError.js';
import AcademicYear from '../modules/academic/academicYear.model.js';

export const establishTenantContext = async (req, _res, next) => {
    try {
        const { user } = req;
        if (!user) return next(ApiError.unauthorized('Authentication required'));

        let schoolId = user.schoolId ? user.schoolId.toString() : null;

        // Super Admins may specify tenant in params, headers, or query
        if (user.role === 'SUPER_ADMIN') {
            schoolId = req.headers['x-school-id'] || req.params.schoolId || req.query.schoolId || schoolId;
        }

        if (!schoolId && user.role !== 'SUPER_ADMIN') {
            return next(ApiError.forbidden('Your account is not associated with any active school'));
        }

        req.schoolId = schoolId;

        // Resolve active academic year if tenant exists
        let activeYearId = req.headers['x-academic-year-id'] || null;
        if (!activeYearId && schoolId) {
            const currentYear = await AcademicYear.findOne({ schoolId, isCurrent: true }).select('_id');
            activeYearId = currentYear?._id ? currentYear._id.toString() : null;
        }

        req.context = {
            userId: user._id ? user._id.toString() : user.sub,
            schoolId,
            role: user.role,
            activeYearId,
        };

        next();
    } catch (err) {
        next(err);
    }
};

export default establishTenantContext;
