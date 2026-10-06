import { Router } from 'express';
import * as ctrl from './people.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireDynamicPermission } from '../../middleware/rbac.middleware.js';
import { resolveDataScope } from '../../middleware/dataScope.middleware.js';

const router = Router();

// Universal auth guard for all People endpoints
router.use(authenticate);

// ── TEACHERS ───────────────────────────────────────────────────────────────
router.get(
    '/teachers',
    requireDynamicPermission('teachers_directory', 'view'),
    resolveDataScope('teachers_directory'),
    ctrl.getTeachers
);

router.get(
    '/teachers/:id',
    requireDynamicPermission('teachers_directory', 'view'),
    resolveDataScope('teachers_directory'),
    ctrl.getTeacherById
);

router.post(
    '/teachers',
    requireDynamicPermission('teachers_directory', 'create'),
    ctrl.createTeacher
);

// ── STAFF ──────────────────────────────────────────────────────────────────
router.get(
    '/staff',
    requireDynamicPermission('staff_management', 'view'),
    resolveDataScope('staff_management'),
    ctrl.getStaffList
);

router.get(
    '/staff/:id',
    requireDynamicPermission('staff_management', 'view'),
    resolveDataScope('staff_management'),
    ctrl.getStaffById
);

// Isolated payroll route (requires permission or admin)
router.get(
    '/staff/:id/payroll',
    requireDynamicPermission('staff_management', 'view'),
    ctrl.getStaffPayroll
);

router.post(
    '/staff',
    requireDynamicPermission('staff_management', 'create'),
    ctrl.createStaff
);

// ── ATTENDANCE ─────────────────────────────────────────────────────────────
router.get(
    '/attendance',
    requireDynamicPermission('staff_attendance', 'view'),
    resolveDataScope('staff_attendance'),
    ctrl.getEmployeeAttendance
);

router.post(
    '/attendance/mark',
    requireDynamicPermission('staff_attendance', 'edit'),
    ctrl.markEmployeeAttendance
);

// ── PARENTS ────────────────────────────────────────────────────────────────
router.get(
    '/parents',
    requireDynamicPermission('parents_directory', 'view'),
    resolveDataScope('parents_directory'),
    ctrl.getParentsList
);

router.get(
    '/parents/:id',
    requireDynamicPermission('parents_directory', 'view'),
    resolveDataScope('parents_directory'),
    ctrl.getParentById
);

router.post(
    '/parents',
    requireDynamicPermission('parents_directory', 'create'),
    ctrl.createParent
);

export default router;
