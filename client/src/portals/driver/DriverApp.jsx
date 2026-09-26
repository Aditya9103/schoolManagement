import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home, Map, QrCode, Users, MoreHorizontal } from 'lucide-react';
import MobileShell from '../../components/common/MobileShell';
import BottomNav from '../../components/common/BottomNav';
import HomePage from './pages/home/HomePage';
import ComingSoonPage from '../../components/common/ComingSoonPage';

const NAV_ITEMS = [
    { to: '/driver', label: 'Home', Icon: Home, end: true },
    { to: '/driver/route', label: 'Route', Icon: Map },
    { to: '/driver/scan', label: 'Scan', Icon: QrCode },
    { to: '/driver/students', label: 'Students', Icon: Users },
    { to: '/driver/more', label: 'More', Icon: MoreHorizontal },
];

export default function DriverApp() {
    return (
        <MobileShell>
            <Routes>
                <Route index element={<HomePage />} />
                <Route path="*" element={<ComingSoonPage />} />
            </Routes>
            <BottomNav items={NAV_ITEMS} />
        </MobileShell>
    );
}
