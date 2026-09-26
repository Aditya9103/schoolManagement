/**
 * school.routes.js — School (tenant) management routes.
 * All routes require SUPER_ADMIN role.
 */
import { Router } from 'express';
import * as ctrl from './school.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';

import { ROLES } from '../../config/constants.js';

const router = Router();

// Authenticated School Users (Admins, Teachers, Staff) can fetch their own school profile and ERP stats
router.get('/my-school', authenticate, ctrl.getMySchool);
router.get('/dashboard-stats', authenticate, ctrl.getSchoolDashboardStats);

// All school management is Super Admin only
router.use(authenticate, authorize(ROLES.SUPER_ADMIN));

router.get('/stats', ctrl.getPlatformStats);
router.get('/growth', ctrl.getSchoolsGrowth);
router.get('/revenue', ctrl.getRevenueOverview);
router.get('/onboarding/pipeline', ctrl.getOnboardingPipeline);
router.get('/', ctrl.getAllSchools);
router.post('/', ctrl.createSchool);
router.post('/:id/invite-admin', ctrl.inviteSchoolAdmin);
router.get('/:id', ctrl.getSchoolById);
router.put('/:id', ctrl.updateSchool);
router.patch('/:id/toggle-status', ctrl.toggleSchoolStatus);
router.patch('/:id/subscription', ctrl.updateSubscription);

export default router;
