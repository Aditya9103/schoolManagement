import { Router } from 'express';
import * as ctrl from './attendance.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { ROLES, SCHOOL_STAFF_ROLES } from '../../config/constants.js';

const router = Router();

router.use(authenticate);

// Permitted roles for attendance overview and registers
const staffAndAdminRoles = [...SCHOOL_STAFF_ROLES, ROLES.SUPER_ADMIN];
const markRoles = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.FRONT_OFFICE];

// High-level overview statistics and distribution
router.get('/stats', authorize(...staffAndAdminRoles, ROLES.PARENT, ROLES.STUDENT), ctrl.getAttendanceStats);

// Recent activity feed
router.get('/activities', authorize(...staffAndAdminRoles), ctrl.getRecentActivities);

// Fetch register for a class, section, date, period
router.get('/register', authorize(...staffAndAdminRoles), ctrl.getAttendanceRegister);

// Save / Update register
router.post('/register', authorize(...markRoles), ctrl.saveAttendanceRegister);

// Leave management
router.get('/leaves', authorize(...staffAndAdminRoles, ROLES.PARENT, ROLES.STUDENT), ctrl.getLeaveRequests);
router.post('/leaves', authorize(...staffAndAdminRoles, ROLES.PARENT, ROLES.STUDENT), ctrl.createLeaveRequest);
router.patch('/leaves/:id/status', authorize(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER), ctrl.updateLeaveStatus);

export default router;
