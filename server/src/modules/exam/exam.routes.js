import { Router } from 'express';
import * as ctrl from './exam.controller.js';
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

// Recent results summary
router.get('/recent-results', authorize(...allRoles), ctrl.getRecentResults);

// Class results
router.get('/class-results', authorize(...allRoles), ctrl.getClassResults);

// Student detailed result
router.get('/student-result/:studentId', authorize(...allRoles), ctrl.getStudentResult);

// Question papers
router.get('/question-papers', authorize(...allRoles), ctrl.listQuestionPapers);

// Mark entry
router.post('/save-marks', authorize(...manageRoles), ctrl.saveMarks);

// Exams CRUD
router.get('/', authorize(...allRoles), ctrl.listExams);
router.post('/', authorize(...manageRoles), ctrl.createExam);
router.get('/:id', authorize(...allRoles), ctrl.getExamById);
router.put('/:id', authorize(...manageRoles), ctrl.updateExam);
router.delete('/:id', authorize(...manageRoles), ctrl.deleteExam);

export default router;
