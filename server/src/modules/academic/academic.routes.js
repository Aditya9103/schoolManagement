import { Router } from 'express';
import * as ctrl from './academic.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { ALL_ROLES, SCHOOL_STAFF_ROLES, ROLES } from '../../config/constants.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

const manageRoles = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.FRONT_OFFICE];

// ── 1. Academic Years (Placed before /:id) ───────────────────────────────────
router.get('/academic-years', ctrl.getAcademicYears);
router.post('/academic-years', authorize(...manageRoles), ctrl.createAcademicYear);
router.patch('/academic-years/:id/current', authorize(...manageRoles), ctrl.setCurrentAcademicYear);
router.put('/academic-years/:id', authorize(...manageRoles), ctrl.updateAcademicYear);
router.delete('/academic-years/:id', authorize(...manageRoles), ctrl.deleteAcademicYear);

// ── 2. Top-level Named Routes (Must be before /:id) ───────────────────────────
router.get('/overview-stats', ctrl.getOverviewStats);
router.get('/teacher-dashboard', ctrl.getTeacherDashboard);

// Teachers
router.get('/teachers', ctrl.getClassTeachers);
router.get('/staff-teachers', ctrl.getStaffTeachers);
router.post('/teachers/assign', authorize(...manageRoles), ctrl.assignTeacher);

// Subjects
router.get('/subjects', ctrl.getSubjects);
router.post('/subjects', authorize(...manageRoles), ctrl.createSubject);
router.post('/subjects/assign-teachers', authorize(...manageRoles), ctrl.assignSubjectTeachers);
router.put('/subjects/:id', authorize(...manageRoles), ctrl.updateSubject);
router.delete('/subjects/:id', authorize(...manageRoles), ctrl.deleteSubject);

// Timetable
router.get('/timetable', ctrl.getTimetable);
router.post('/timetable', authorize(...manageRoles), ctrl.saveTimetable);

// Reports
router.get('/reports', ctrl.getClassReports);

// Settings
router.get('/settings', ctrl.getClassSettings);
router.put('/settings', authorize(...manageRoles), ctrl.updateClassSettings);

// ── 3. Base Classes Collection ───────────────────────────────────────────────
router.get('/', ctrl.getClasses);
router.post('/', authorize(...manageRoles), ctrl.createClass);

// ── 4. Parameterized Class Specific Sub-resources ───────────────────────────
router.get('/:id/details', ctrl.getClassDetails);
router.get('/:id/students', ctrl.getClassStudents);
router.put('/:id', authorize(...manageRoles), ctrl.updateClass);
router.delete('/:id', authorize(...manageRoles), ctrl.deleteClass);

// ── 5. Section Specific Operations ──────────────────────────────────────────
router.post('/:classId/sections', authorize(...manageRoles), ctrl.createSection);
router.put('/:classId/sections/:sectionId', authorize(...manageRoles), ctrl.updateSection);
router.delete('/:classId/sections/:sectionId', authorize(...manageRoles), ctrl.deleteSection);

export default router;
