/**
 * SchoolErpApp.jsx — School ERP Portal (SCHOOL_ADMIN, ACCOUNTANT, LIBRARIAN, FRONT_OFFICE).
 * Desktop-first with full mobile responsiveness.
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ClipboardList, Wallet, FileText, GraduationCap, Bus, UserCog, Megaphone, Clock, Library, BarChart3, Settings, BookCopy } from 'lucide-react';
import SchoolErpLayout from './components/SchoolErpLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import StudentsListPage from './pages/students/StudentsListPage';
import StudentDetailPage from './pages/students/StudentDetailPage';
import AddStudentPage from './pages/students/AddStudentPage';
import ClassesPage from './pages/classes/ClassesPage';
import RolesAndPermissionsPage from './pages/roles/RolesAndPermissionsPage';
import AdmissionsHubPage from './pages/admissions/AdmissionsHubPage';
import ApplicationDetailPage from './pages/admissions/ApplicationDetailPage';
import AttendanceManagementPage from './pages/attendance/AttendanceManagementPage';
import HomeworkManagementPage from './pages/homework/HomeworkManagementPage';
import ExamsPage from './pages/exams/ExamsPage';
import TeachersPage from './pages/teachers/TeachersPage';
import TeacherDetailPage from './pages/teachers/TeacherDetailPage';
import StaffManagementPage from './pages/staff/StaffManagementPage';
import StaffDetailPage from './pages/staff/StaffDetailPage';
import StaffAttendancePage from './pages/staff/StaffAttendancePage';
import ParentsPage from './pages/parents/ParentsPage';
import ParentDetailPage from './pages/parents/ParentDetailPage';
import NoticesPage from './pages/notices/NoticesPage';
import FeesPage from './pages/fees/FeesPage';
import ComingSoonPage from '../../components/common/ComingSoonPage';

const SCHOOL_ERP_NAV = [
    { to: '/school', label: 'Dashboard', Icon: LayoutDashboard, end: true },
    { to: '/school/students', label: 'Students', Icon: GraduationCap },
    { to: '/school/admissions', label: 'Admissions', Icon: UserCog },
    { to: '/school/classes', label: 'Classes', Icon: BookCopy },
    { to: '/school/classes/subjects', label: 'Subjects', Icon: BookOpen },
    { to: '/school/classes/timetable', label: 'Timetable', Icon: Clock },
    { to: '/school/attendance', label: 'Attendance', Icon: ClipboardList },
    { to: '/school/fees', label: 'Fees', Icon: Wallet },
    { to: '/school/homework', label: 'Homework', Icon: FileText },
    { to: '/school/exams', label: 'Exams', Icon: BookOpen },
    { to: '/school/transport', label: 'Transport', Icon: Bus },
    { to: '/school/teachers', label: 'Teachers', Icon: UserCog },
    { to: '/school/staff', label: 'Staff', Icon: UserCog },
    { to: '/school/parents', label: 'Parents', Icon: UserCog },
    { to: '/school/notices', label: 'Notices', Icon: Megaphone },
    { to: '/school/library', label: 'Library', Icon: Library },
    { to: '/school/reports', label: 'Reports', Icon: BarChart3 },
    { to: '/school/roles', label: 'Roles & Permissions', Icon: Settings },
    { to: '/school/settings', label: 'Settings', Icon: Settings },
];

export default function SchoolErpApp() {
    return (
        <SchoolErpLayout nav={SCHOOL_ERP_NAV}>
            <Routes>
                <Route index element={<DashboardPage />} />
                <Route path="students" element={<StudentsListPage />} />
                <Route path="students/new" element={<AddStudentPage />} />
                <Route path="students/:id" element={<StudentDetailPage />} />
                <Route path="admissions" element={<AdmissionsHubPage />} />
                <Route path="admissions/:id" element={<ApplicationDetailPage />} />
                <Route path="classes/*" element={<ClassesPage />} />
                <Route path="subjects" element={<Navigate to="/school/classes/subjects" replace />} />
                <Route path="subjects/*" element={<Navigate to="/school/classes/subjects" replace />} />
                <Route path="timetable" element={<Navigate to="/school/classes/timetable" replace />} />
                <Route path="timetable/*" element={<Navigate to="/school/classes/timetable" replace />} />
                <Route path="attendance/*" element={<AttendanceManagementPage />} />
                <Route path="fees" element={<FeesPage />} />
                <Route path="fees/*" element={<FeesPage />} />
                <Route path="homework" element={<HomeworkManagementPage />} />
                <Route path="homework/*" element={<HomeworkManagementPage />} />
                <Route path="assignments" element={<HomeworkManagementPage />} />
                <Route path="assignments/*" element={<HomeworkManagementPage />} />
                <Route path="exams/*" element={<ExamsPage />} />

                {/* ── PEOPLE MODULE ROUTES ── */}
                <Route path="teachers" element={<TeachersPage />} />
                <Route path="teachers/:id" element={<TeacherDetailPage />} />
                <Route path="staff" element={<StaffManagementPage />} />
                <Route path="staff/attendance" element={<StaffAttendancePage />} />
                <Route path="my-attendance" element={<Navigate to="/school/staff/attendance" replace />} />
                <Route path="staff/:id" element={<StaffDetailPage />} />
                <Route path="parents" element={<ParentsPage />} />
                <Route path="parents/:id" element={<ParentDetailPage />} />

                {/* ── NOTICES & CIRCULARS ── */}
                <Route path="notices" element={<NoticesPage />} />

                {/* ── TEACHER WORKFLOW & PROFILE ROUTES ── */}
                <Route path="profile" element={<TeacherDetailPage />} />
                <Route path="lesson-planning" element={<ComingSoonPage title="Curriculum & Lesson Planning" />} />
                <Route path="study-materials" element={<ComingSoonPage title="Study Materials & Notes" />} />
                <Route path="question-bank" element={<ComingSoonPage title="Question Bank & Repositories" />} />
                <Route path="performance" element={<ComingSoonPage title="Student Performance Insights" />} />
                <Route path="messages" element={<ComingSoonPage title="Communication & Parent Messaging" />} />
                <Route path="leave" element={<ComingSoonPage title="Leave Management & Balances" />} />
                <Route path="documents" element={<ComingSoonPage title="My Documents & Certificates" />} />

                <Route path="roles" element={<RolesAndPermissionsPage />} />
                <Route path="*" element={<ComingSoonPage />} />
            </Routes>
        </SchoolErpLayout>
    );
}
