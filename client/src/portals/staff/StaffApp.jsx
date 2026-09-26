import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home, BookOpen, ClipboardList, MoreHorizontal } from 'lucide-react';
import MobileShell from '../../components/common/MobileShell';
import BottomNav from '../../components/common/BottomNav';
import HomePage from './pages/home/HomePage';
import AttendancePage from './pages/attendance/AttendancePage';
import ComingSoonPage from '../../components/common/ComingSoonPage';

const NAV_ITEMS = [
    { to: '/staff', label: 'Home', Icon: Home, end: true },
    { to: '/staff/classes', label: 'Classes', Icon: BookOpen },
    { to: '/staff/attendance', label: 'Attendance', Icon: ClipboardList },
    { to: '/staff/more', label: 'More', Icon: MoreHorizontal },
];

export default function StaffApp() {
    return (
        <MobileShell>
            <Routes>
                <Route index element={<HomePage />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="*" element={<ComingSoonPage />} />
            </Routes>
            <BottomNav items={NAV_ITEMS} />
        </MobileShell>
    );
}
