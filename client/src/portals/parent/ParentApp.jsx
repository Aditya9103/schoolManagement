import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home, Bell, MessageCircle, User } from 'lucide-react';
import MobileShell from '../../components/common/MobileShell';
import BottomNav from '../../components/common/BottomNav';
import HomePage from './pages/home/HomePage';
import ComingSoonPage from '../../components/common/ComingSoonPage';

const NAV_ITEMS = [
    { to: '/parent', label: 'Home', Icon: Home, end: true },
    { to: '/parent/updates', label: 'Updates', Icon: Bell },
    { to: '/parent/chat', label: 'Chat', Icon: MessageCircle },
    { to: '/parent/profile', label: 'Profile', Icon: User },
];

export default function ParentApp() {
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
