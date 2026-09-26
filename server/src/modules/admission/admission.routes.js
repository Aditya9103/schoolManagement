import { Router } from 'express';
import ctrl from './admission.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { ROLES, SCHOOL_STAFF_ROLES } from '../../config/constants.js';

const router = Router();

// ── PUBLIC ADMISSION ROUTES (No Authentication Required) ─────────────────────
router.get('/public/schools', ctrl.getPublicSchoolsDirectory);
router.get('/public/school/:schoolSlug', ctrl.getPublicSchoolBySlug);
router.post('/public/school/:schoolSlug/apply', ctrl.submitPublicApplication);
router.get('/public/track', ctrl.trackPublicApplication);

// ── AUTHENTICATED SCHOOL ERP ADMISSION ROUTES ─────────────────────────────────
router.use(authenticate);

const admissionStaffRoles = [
    ROLES.SUPER_ADMIN,
    ROLES.SCHOOL_ADMIN,
    ROLES.FRONT_OFFICE,
    ROLES.TEACHER,
    ...SCHOOL_STAFF_ROLES,
];

// Admissions Hub Dashboard Stats
router.get('/stats', authorize(...admissionStaffRoles), ctrl.getAdmissionStats);

// Applications List (Search, Filters, Pagination)
router.get('/', authorize(...admissionStaffRoles), ctrl.getApplications);

// Walk-in Direct Offline Registration
router.post('/walk-in', authorize(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.FRONT_OFFICE), ctrl.createWalkInApplication);

// Enquiry Desk
router.get('/enquiries', authorize(...admissionStaffRoles), ctrl.getEnquiries);
router.post('/enquiries', authorize(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.FRONT_OFFICE), ctrl.createEnquiry);
router.post('/enquiries/:id/convert', authorize(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.FRONT_OFFICE), ctrl.convertEnquiry);

// Single Application Operations
router.get('/:id', authorize(...admissionStaffRoles), ctrl.getApplicationById);
router.patch('/:id/status', authorize(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.FRONT_OFFICE), ctrl.updateApplicationStatus);
router.patch('/:id/verify-doc', authorize(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.FRONT_OFFICE), ctrl.verifyDocument);
router.post('/:id/schedule-test', authorize(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.FRONT_OFFICE), ctrl.scheduleTest);
router.patch('/:id/test-result', authorize(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.FRONT_OFFICE), ctrl.recordTestResult);

// 1-Click Enrollment
router.post('/:id/enroll', authorize(ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN), ctrl.enrollStudent);

export default router;
