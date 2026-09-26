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
    { to: '/school/staff', label: 'Staff', Icon: UserCog },
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
                <Route path="roles" element={<RolesAndPermissionsPage />} />
                <Route path="*" element={<ComingSoonPage />} />
            </Routes>
        </SchoolErpLayout>
    );
}
