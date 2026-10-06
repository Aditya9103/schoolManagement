import { Router } from 'express';
import * as ctrl from './fee.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { ALL_ROLES, SCHOOL_STAFF_ROLES, ROLES } from '../../config/constants.js';

const router = Router();

// Authentication required for all fee routes
router.use(authenticate);

const viewRoles = [
    ROLES.SUPER_ADMIN,
    ...SCHOOL_STAFF_ROLES,
];

const adminAccountRoles = [
    ROLES.SUPER_ADMIN,
    ROLES.SCHOOL_ADMIN,
    ROLES.ACCOUNTANT,
    ROLES.FRONT_OFFICE,
];

// 1. Overview & Analytics
router.get('/overview', authorize(...viewRoles), ctrl.getFeeOverview);

// 2. Categories
router.get('/categories', authorize(...viewRoles), ctrl.getFeeCategories);
router.post('/categories', authorize(...adminAccountRoles), ctrl.createFeeCategory);

// 3. Structures & Configurations
router.get('/structures', authorize(...viewRoles), ctrl.getFeeStructures);
router.post('/structures', authorize(...adminAccountRoles), ctrl.createFeeStructure);

// 4. Allocations (Student Fee Accounts)
router.get('/allocations', authorize(...viewRoles), ctrl.getFeeAllocations);

// 5. Single Student Fee Ledger
router.get('/student/:studentId', authorize(...ALL_ROLES), ctrl.getStudentFeeAccount);

// 6. Payment Collection (Offline / Cashier Desk)
router.post('/collect', authorize(...adminAccountRoles), ctrl.collectFeePayment);

// 7. Transactions Register & Receipts
router.get('/transactions', authorize(...viewRoles), ctrl.getFeeTransactions);

// 8. Defaulters / Overdue Register
router.get('/defaulters', authorize(...viewRoles), ctrl.getFeeDefaulters);

export default router;
