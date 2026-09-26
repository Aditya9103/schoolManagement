/**
 * SuperAdminApp.jsx — PrimeSchoolOs Super Admin Portal shell.
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
    LayoutDashboard, School, PlusCircle, ClipboardCheck, Globe2, CreditCard,
    Receipt, RefreshCcw, Users, ShieldCheck, ActivitySquare, Layers, Settings2,
    Bell, Plug2, Webhook, Paintbrush, Settings, Ticket, MessageSquare, Megaphone,
} from 'lucide-react';
import SuperAdminLayout from './components/SuperAdminLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import AllSchoolsPage from './pages/schools/AllSchoolsPage';
import AddSchoolPage from './pages/add-school/AddSchoolPage';
import SubscriptionPlansPage from './pages/subscription-plans/SubscriptionPlansPage';
import SchoolOnboardingPage from './pages/onboarding/SchoolOnboardingPage';
import ComingSoonPage from '../../components/common/ComingSoonPage';

const SUPER_ADMIN_NAV = [
    {
        group: 'SCHOOLS',
        items: [
            { to: '/super-admin', label: 'Dashboard', Icon: LayoutDashboard, end: true },
            { to: '/super-admin/schools', label: 'All Schools', Icon: School },
            { to: '/super-admin/schools/new', label: 'Add New School', Icon: PlusCircle },
            { to: '/super-admin/onboarding', label: 'School Onboarding', Icon: ClipboardCheck },
            { to: '/super-admin/domains', label: 'Domains & Branding', Icon: Globe2 },
            { to: '/super-admin/plans', label: 'Subscription Plans', Icon: CreditCard },
            { to: '/super-admin/billing', label: 'Billing & Payments', Icon: Receipt },
            { to: '/super-admin/renewals', label: 'Renewals & Invoices', Icon: RefreshCcw },
        ],
    },
    {
        group: 'USERS & ACCESS',
        items: [
            { to: '/super-admin/users', label: 'Users', Icon: Users },
            { to: '/super-admin/roles', label: 'Roles & Permissions', Icon: ShieldCheck },
            { to: '/super-admin/activity', label: 'Activity Logs', Icon: ActivitySquare },
        ],
    },
    {
        group: 'SYSTEM MANAGEMENT',
        items: [
            { to: '/super-admin/modules', label: 'Modules & Features', Icon: Layers },
            { to: '/super-admin/app-config', label: 'App Configuration', Icon: Settings2 },
            { to: '/super-admin/notifications', label: 'Notifications', Icon: Bell },
            { to: '/super-admin/integrations', label: 'Integrations', Icon: Plug2 },
            { to: '/super-admin/webhooks', label: 'API & Webhooks', Icon: Webhook },
            { to: '/super-admin/theme', label: 'Theme & White Label', Icon: Paintbrush },
            { to: '/super-admin/settings', label: 'Settings', Icon: Settings },
        ],
    },
    {
        group: 'SUPPORT',
        items: [
            { to: '/super-admin/support', label: 'Support Tickets', Icon: Ticket },
            { to: '/super-admin/feedback', label: 'Feedback', Icon: MessageSquare },
            { to: '/super-admin/announcements', label: 'Announcements', Icon: Megaphone },
        ],
    },
];

export default function SuperAdminApp() {
    return (
        <SuperAdminLayout nav={SUPER_ADMIN_NAV}>
            <Routes>
                <Route index element={<DashboardPage />} />
                <Route path="schools" element={<AllSchoolsPage />} />
                <Route path="schools/new" element={<AddSchoolPage />} />
                <Route path="onboarding" element={<SchoolOnboardingPage />} />
                <Route path="plans" element={<SubscriptionPlansPage />} />
                <Route path="*" element={<ComingSoonPage />} />
            </Routes>
        </SuperAdminLayout>
    );
}
