import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { ROLES } from '../../config/constants.js';
import * as ctrl from './role.controller.js';

const router = Router();

// Base protection: must be logged in
router.use(authenticate);

// Public to authenticated staff
router.get('/modules', ctrl.getModuleDefinitions);
router.get('/my-permissions', ctrl.getMyPermissions);

// School Admin & Super Admin management routes
const adminOnly = authorize(ROLES.SCHOOL_ADMIN, ROLES.SUPER_ADMIN);

router.get('/', adminOnly, ctrl.getRoles);
router.post('/', adminOnly, ctrl.createRole);
router.get('/:id', adminOnly, ctrl.getRoleById);
router.put('/:id', adminOnly, ctrl.updateRole);
router.delete('/:id', adminOnly, ctrl.deleteRole);
router.post('/:id/copy', adminOnly, ctrl.copyRole);
router.post('/:id/reset', adminOnly, ctrl.resetToDefault);

export default router;
