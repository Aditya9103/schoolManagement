import { Router } from 'express';
import authRoutes    from '../modules/auth/auth.routes.js';
import schoolRoutes  from '../modules/school/school.routes.js';
import notificationRoutes from '../modules/notification/notification.routes.js';
import uploadRoutes  from '../modules/upload/upload.routes.js';

import classRoutes    from '../modules/academic/academic.routes.js';
import studentRoutes  from '../modules/student/student.routes.js';
import roleRoutes     from '../modules/role/role.routes.js';
import admissionRoutes from '../modules/admission/admission.routes.js';
import attendanceRoutes from '../modules/attendance/attendance.routes.js';
import homeworkRoutes   from '../modules/homework/homework.routes.js';
import examRoutes       from '../modules/exam/exam.routes.js';
import peopleRoutes     from '../modules/people/people.routes.js';
import noticeRoutes     from '../modules/notice/notice.routes.js';
import feeRoutes        from '../modules/fee/fee.routes.js';

/**
 * routes/index.js — Central API router for PrimeSchoolOs (v1).
 * Route convention: /api/v1/<resource>
 */
const router = Router();

// Health check (unauthenticated)
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'PrimeSchoolOs API is operational',
        timestamp: new Date().toISOString(),
        version: 'v1',
        platform: 'PrimeSchoolOs — School ERP & SaaS Platform',
    });
});

// Auth (public)
router.use('/auth', authRoutes);

// Schools (Super Admin — multi-tenant management)
router.use('/schools', schoolRoutes);

// Admissions & Public Enrollment Subsystem
router.use('/admissions', admissionRoutes);

// Notifications
router.use('/notifications', notificationRoutes);

// File & Image Uploads (AWS S3)
router.use('/uploads', uploadRoutes);

// Academic & Class Management
router.use('/classes', classRoutes);

// Student Management & Admissions
router.use('/students', studentRoutes);

// Dynamic Roles & Permissions Matrix
router.use('/roles', roleRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/people', peopleRoutes);
router.use('/fees',       feeRoutes);
router.use('/homework',   homeworkRoutes);
router.use('/exams',      examRoutes);
// router.use('/transport',  transportRoutes);
router.use('/notices',    noticeRoutes);
// router.use('/timetable',  timetableRoutes);
// router.use('/library',    libraryRoutes);
// router.use('/leave',      leaveRoutes);
// router.use('/payroll',    payrollRoutes);

export default router;
