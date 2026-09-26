import { Router } from 'express';
import * as ctrl from './student.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { ROLES, SCHOOL_STAFF_ROLES } from '../../config/constants.js';

const router = Router();

router.use(authenticate);

// Student self profile endpoint
router.get('/me', authorize(ROLES.STUDENT, ROLES.PARENT), ctrl.getStudentProfile);

// Students Directory (Search, Filters, Pagination): Staff, Teachers, Super Admin
const directoryRoles = [...SCHOOL_STAFF_ROLES, ROLES.SUPER_ADMIN];
router.get('/', authorize(...directoryRoles), ctrl.getStudents);
router.get('/:id', authorize(...directoryRoles, ROLES.STUDENT, ROLES.PARENT), ctrl.getStudentById);

// Admissions & Management: Super Admin, School Admin, Front Office
const manageRoles = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.FRONT_OFFICE];
router.post('/', authorize(...manageRoles), ctrl.createStudent);
router.put('/:id', authorize(...manageRoles), ctrl.updateStudent);
router.delete('/:id', authorize(...manageRoles), ctrl.deleteStudent);

// Documents (backed by AWS S3)
router.post('/:id/documents', authorize(...manageRoles), ctrl.addDocument);
router.delete('/:id/documents/:docId', authorize(...manageRoles), ctrl.removeDocument);

export default router;
