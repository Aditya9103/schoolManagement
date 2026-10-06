/**
 * dataScope.middleware.js — Dynamic Two-Layer Data Scope Middleware for PrimeSchoolOS.
 *
 * Resolves the allowed data boundary (records/scope) for a requested feature
 * based on the configured `dataScope` on the user's role permission, or default role scoping.
 *
 * Supported scopes:
 *   - 'ALL_SCHOOL': Universal access within the school tenant.
 *   - 'MY_DEPARTMENT': Filtered by user's assigned department.
 *   - 'ASSIGNED_CLASSES': Filtered by classes/sections active in TeacherAssignment.
 *   - 'ASSIGNED_SUBJECTS': Filtered by subjects/sections active in SubjectAssignment.
 *   - 'PARENTS_OF_ASSIGNED_STUDENTS': Parents of students in teacher's assigned classes.
 *   - 'PARENT_CHILDREN': Children linked via ParentStudentRelation.
 *   - 'OWN_RECORDS': Only records created by or matching user's own _id.
 */

import TeacherAssignment from '../modules/people/models/teacherAssignment.model.js';
import SubjectAssignment from '../modules/people/models/subjectAssignment.model.js';
import TeachingAssignment from '../modules/people/models/teachingAssignment.model.js';
import ParentProfile from '../modules/people/models/parentProfile.model.js';
import ParentStudentRelation from '../modules/people/models/parentStudentRelation.model.js';
import Student from '../modules/student/student.model.js';
import ApiError from '../utils/ApiError.js';
import { ROLES } from '../config/constants.js';

export const resolveDataScope = (featureKey) => async (req, res, next) => {
    if (!req.user) {
        return next(ApiError.unauthorized('Authentication required'));
    }

    const schoolId = req.user.schoolId || req.user.societyId;
    if (!schoolId) {
        return next(ApiError.forbidden('No school associated with this account'));
    }

    // 1. Universal access for Super Admin & School Admin / Principal
    if (req.user.role === ROLES.SUPER_ADMIN || req.user.role === 'SCHOOL_ADMIN' || req.user.role === 'PRINCIPAL') {
        req.dataScope = { type: 'ALL_SCHOOL', schoolId };
        req.scopeFilter = { schoolId };
        return next();
    }

    // 2. Read configured dataScope from requireDynamicPermission (if previously executed), or evaluate role defaults
    const featurePerm = req.userFeaturePerm || {};
    let scope = featurePerm.dataScope;

    if (!scope) {
        if (req.user.role === 'TEACHER') {
            if (featureKey === 'academic_attendance') {
                scope = 'ASSIGNED_ATTENDANCE_PERIODS';
            } else if (featureKey === 'homework_assignments') {
                scope = 'ASSIGNED_SUBJECTS';
            } else if (featureKey === 'exams_results') {
                scope = 'ASSIGNED_EXAM_SUBJECTS';
            } else if (featureKey === 'academic_timetable') {
                scope = 'OWN_TIMETABLE';
            } else if (featureKey === 'parents_directory') {
                scope = 'PARENTS_OF_ASSIGNED_STUDENTS';
            } else if (featureKey === 'teachers_directory') {
                scope = 'ALL_SCHOOL';
            } else {
                scope = 'OWN_RECORDS';
            }
        } else if (req.user.role === 'PARENT') {
            scope = 'MY_CHILDREN';
        } else if (req.user.role === 'STUDENT') {
            scope = 'OWN_RECORDS';
        } else if (['TRANSPORT_MANAGER', 'HOSTEL_WARDEN'].includes(req.user.role)) {
            scope = 'MY_DEPARTMENT';
        } else {
            scope = 'ALL_SCHOOL';
        }
    }

    req.dataScope = { type: scope, schoolId };

    try {
        switch (scope) {
            case 'ALL_SCHOOL': {
                req.scopeFilter = { schoolId };
                return next();
            }

            case 'MY_DEPARTMENT': {
                req.scopeFilter = { schoolId, department: req.user.department || '' };
                return next();
            }

            case 'OWN_TIMETABLE': {
                req.scopeFilter = {
                    schoolId,
                    teacherId: req.user._id,
                };
                return next();
            }

            case 'ASSIGNED_CLASSES':
            case 'ASSIGNED_ATTENDANCE_PERIODS': {
                // Check canonical TeachingAssignment first, fallback to TeacherAssignment
                let assignments = await TeachingAssignment.find({
                    schoolId,
                    teacherId: req.user._id,
                    status: 'ACTIVE',
                }).select('sectionId assignmentType');

                let sectionIds = assignments.map((a) => a.sectionId);

                if (!sectionIds.length) {
                    const legacy = await TeacherAssignment.find({
                        schoolId,
                        teacherId: req.user._id,
                        status: 'ACTIVE',
                    }).select('sectionId');
                    sectionIds = legacy.map((a) => a.sectionId);
                }

                req.dataScope.sectionIds = sectionIds;
                req.scopeFilter = { schoolId, sectionId: { $in: sectionIds } };
                return next();
            }

            case 'ASSIGNED_SUBJECTS':
            case 'ASSIGNED_EXAM_SUBJECTS': {
                // Check canonical TeachingAssignment first, fallback to SubjectAssignment
                let subjectAssignments = await TeachingAssignment.find({
                    schoolId,
                    teacherId: req.user._id,
                    subjectId: { $ne: null },
                    status: 'ACTIVE',
                }).select('sectionId subjectId');

                if (!subjectAssignments.length) {
                    subjectAssignments = await SubjectAssignment.find({
                        schoolId,
                        teacherId: req.user._id,
                        status: 'ACTIVE',
                    }).select('sectionId subjectId');
                }

                req.dataScope.subjectAssignments = subjectAssignments;
                const orClauses = subjectAssignments.map((s) => ({
                    sectionId: s.sectionId,
                    subjectId: s.subjectId,
                }));

                req.scopeFilter = {
                    schoolId,
                    ...(orClauses.length ? { $or: orClauses } : { _id: null }),
                };
                return next();
            }

            case 'PARENTS_OF_ASSIGNED_STUDENTS': {
                let assignments = await TeachingAssignment.find({
                    schoolId,
                    teacherId: req.user._id,
                    status: 'ACTIVE',
                }).select('sectionId');

                let sectionIds = assignments.map((a) => a.sectionId);
                if (!sectionIds.length) {
                    const legacy = await TeacherAssignment.find({
                        schoolId,
                        teacherId: req.user._id,
                        status: 'ACTIVE',
                    }).select('sectionId');
                    sectionIds = legacy.map((a) => a.sectionId);
                }

                const enrolledStudents = await Student.find({
                    schoolId,
                    sectionId: { $in: sectionIds },
                }).select('_id');
                const studentIds = enrolledStudents.map((s) => s._id);

                const relations = await ParentStudentRelation.find({
                    schoolId,
                    studentId: { $in: studentIds },
                    status: 'ACTIVE',
                }).select('parentId');

                const parentIds = relations.map((r) => r.parentId);
                req.dataScope.parentIds = parentIds;
                req.scopeFilter = { schoolId, _id: { $in: parentIds } };
                return next();
            }

            case 'MY_CHILDREN':
            case 'PARENT_CHILDREN': {
                const parentProfile = await ParentProfile.findOne({ schoolId, userId: req.user._id });
                if (!parentProfile) {
                    return next(ApiError.forbidden('No active parent profile linked to this user'));
                }
                const relations = await ParentStudentRelation.find({
                    schoolId,
                    parentId: parentProfile._id,
                    status: 'ACTIVE',
                }).select('studentId');

                const studentIds = relations.map((r) => r.studentId);
                req.dataScope.studentIds = studentIds;
                req.scopeFilter = { schoolId, _id: { $in: studentIds } };
                return next();
            }

            case 'OWN_RECORDS':
            default: {
                req.scopeFilter = {
                    schoolId,
                    $or: [
                        { userId: req.user._id },
                        { employeeId: req.user._id },
                        { staffId: req.user._id },
                        { markedBy: req.user._id },
                        { teacherId: req.user._id },
                        { studentId: req.user._id },
                    ],
                };
                return next();
            }
        }
    } catch (err) {
        next(err);
    }
};

export default resolveDataScope;
