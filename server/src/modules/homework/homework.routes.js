import { Router } from 'express';
import * as ctrl from './homework.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { ROLES, SCHOOL_STAFF_ROLES } from '../../config/constants.js';

const router = Router();

router.use(authenticate);

const staffAndAdminRoles = [...SCHOOL_STAFF_ROLES, ROLES.SUPER_ADMIN];
const manageRoles = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER];
const allRoles = [...staffAndAdminRoles, ROLES.STUDENT, ROLES.PARENT];

// Overview statistics for dashboard
router.get('/overview-stats', authorize(...allRoles), ctrl.getOverviewStats);

// Analytics
router.get('/analytics', authorize(...staffAndAdminRoles), ctrl.getAnalytics);

// List & Create
router.get('/', authorize(...allRoles), ctrl.listAssignments);
router.post('/', authorize(...manageRoles), ctrl.createAssignment);

// Single assignment details
router.get('/:id', authorize(...allRoles), ctrl.getAssignmentById);
router.put('/:id', authorize(...manageRoles), ctrl.updateAssignment);
router.delete('/:id', authorize(...manageRoles), ctrl.deleteAssignment);

// Submissions & Grading
router.get('/:id/submissions', authorize(...staffAndAdminRoles, ROLES.STUDENT, ROLES.PARENT), ctrl.listSubmissions);
router.post('/:id/submissions', authorize(ROLES.STUDENT, ROLES.PARENT, ...manageRoles), ctrl.submitHomework);
router.patch('/:id/submissions/:submissionId/grade', authorize(...manageRoles), ctrl.gradeSubmission);

export default router;
