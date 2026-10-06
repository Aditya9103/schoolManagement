/**
 * relationshipAuth.middleware.js — Relationship-Level Verification Middleware for PrimeSchoolOS.
 * Validates that an authenticated user possesses the specific academic binding
 * (Class + Section + Subject) before performing actions like creating homework or entering marks.
 */

import TeachingAssignment from '../modules/people/models/teachingAssignment.model.js';
import SubjectAssignment from '../modules/people/models/subjectAssignment.model.js';
import TeacherAssignment from '../modules/people/models/teacherAssignment.model.js';
import ParentProfile from '../modules/people/models/parentProfile.model.js';
import ParentStudentRelation from '../modules/people/models/parentStudentRelation.model.js';
import ApiError from '../utils/ApiError.js';
import { ROLES } from '../config/constants.js';

/**
 * Validates that a teacher is assigned to the targeted section and optionally subject.
 * Super Admins, School Admins, and Principals bypass this check.
 */
export const requireTeachingRelationship = (options = { requireSubject: false }) => async (req, _res, next) => {
    try {
        const { user } = req;
        if (!user) return next(ApiError.unauthorized('Authentication required'));

        // Admin override
        if ([ROLES.SUPER_ADMIN, 'SCHOOL_ADMIN', 'PRINCIPAL'].includes(user.role)) {
            return next();
        }

        if (user.role !== 'TEACHER') {
            return next(ApiError.forbidden('Only teaching faculty or administrators may perform this action'));
        }

        const schoolId = user.schoolId || req.schoolId;
        const sectionId = req.body.sectionId || req.params.sectionId || req.query.sectionId;
        const subjectId = req.body.subjectId || req.params.subjectId || req.query.subjectId;

        if (!sectionId) {
            return next(ApiError.badRequest('sectionId is required for relationship verification'));
        }

        if (options.requireSubject && !subjectId) {
            return next(ApiError.badRequest('subjectId is required for subject-bound action verification'));
        }

        // 1. Check canonical TeachingAssignment
        const canonicalQuery = {
            schoolId,
            teacherId: user._id,
            sectionId,
            status: 'ACTIVE',
        };
        if (options.requireSubject && subjectId) {
            canonicalQuery.subjectId = subjectId;
        }

        const canonicalMatch = await TeachingAssignment.findOne(canonicalQuery);
        if (canonicalMatch) {
            req.teachingAssignment = canonicalMatch;
            return next();
        }

        // 2. Fallback to legacy models
        if (options.requireSubject && subjectId) {
            const subjectMatch = await SubjectAssignment.findOne({
                schoolId,
                teacherId: user._id,
                sectionId,
                subjectId,
                status: 'ACTIVE',
            });
            if (subjectMatch) {
                req.teachingAssignment = subjectMatch;
                return next();
            }
        } else {
            const classMatch = await TeacherAssignment.findOne({
                schoolId,
                teacherId: user._id,
                sectionId,
                status: 'ACTIVE',
            });
            if (classMatch) {
                req.teachingAssignment = classMatch;
                return next();
            }
        }

        return next(
            ApiError.forbidden(
                `Unauthorized: You are not assigned to instruct ${options.requireSubject ? 'this subject in ' : ''}the specified section.`
            )
        );
    } catch (err) {
        next(err);
    }
};

/**
 * Validates that an authenticated parent is linked to the target student.
 */
export const requireParentStudentLink = () => async (req, _res, next) => {
    try {
        const { user } = req;
        if (!user) return next(ApiError.unauthorized('Authentication required'));

        if ([ROLES.SUPER_ADMIN, 'SCHOOL_ADMIN', 'PRINCIPAL'].includes(user.role)) {
            return next();
        }

        const schoolId = user.schoolId || req.schoolId;
        const studentId = req.body.studentId || req.params.studentId || req.query.studentId;

        if (!studentId) {
            return next(ApiError.badRequest('studentId is required for guardian relationship verification'));
        }

        const parentProfile = await ParentProfile.findOne({ schoolId, userId: user._id });
        if (!parentProfile) {
            return next(ApiError.forbidden('No active parent profile linked to your user account'));
        }

        const relation = await ParentStudentRelation.findOne({
            schoolId,
            parentId: parentProfile._id,
            studentId,
            status: 'ACTIVE',
        });

        if (!relation) {
            return next(ApiError.forbidden('Unauthorized: You are not registered as an active guardian of this student'));
        }

        req.parentStudentRelation = relation;
        next();
    } catch (err) {
        next(err);
    }
};

export default {
    requireTeachingRelationship,
    requireParentStudentLink,
};
