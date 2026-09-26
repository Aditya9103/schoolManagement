/**
 * school.middleware.js — PrimeSchoolOs Multi-tenancy / School isolation middleware.
 *
 * Usage in routes (after authenticate):
 *   router.get('/students', authenticate, injectSchool, authorize(...), controller);
 *
 * After injectSchool:
 *   req.schoolId — the schoolId from the JWT (MongoDB ObjectId string)
 *
 * Filter all tenant-scoped queries with: { schoolId: req.schoolId, ...otherFilters }
 */
import ApiError from '../utils/ApiError.js';

/**
 * Extracts schoolId from the authenticated user's JWT payload and attaches it to req.
 * Blocks requests from users not associated with a school (except SUPER_ADMIN).
 */
export const injectSchool = (req, _res, next) => {
    const { user } = req;
    if (!user) return next(ApiError.unauthorized('Authentication required'));

    // Super Admins are platform-level — they may access any school via params
    if (user.role === 'SUPER_ADMIN') {
        req.schoolId = req.params.schoolId || req.query.schoolId || null;
        return next();
    }

    if (!user.schoolId) return next(ApiError.forbidden('Your account is not associated with any school'));

    req.schoolId = user.schoolId.toString();
    next();
};
