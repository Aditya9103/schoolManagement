/**
 * App.jsx — PrimeSchoolOs root router.
 * Single login → role-based portal routing.
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { getPortalRoute, ROLES, SCHOOL_ERP_ROLES } from './store/slices/authSlice';
import { useWakeupServerQuery } from './store/api/authApi';
import GlobalSocketListener from './components/layout/GlobalSocketListener';
import OfflineBanner from './components/ui/OfflineBanner';
import PWAPrompt from './components/ui/PWAPrompt';
import { useFirebaseMessaging } from './hooks/useFirebaseMessaging';
import LoginPage from './auth/LoginPage';
import ForgotPasswordPage from './auth/ForgotPasswordPage';
import SuperAdminApp from './portals/super-admin/SuperAdminApp';
import SchoolErpApp from './portals/school-erp/SchoolErpApp';
import StaffApp from './portals/staff/StaffApp';
import ParentApp from './portals/parent/ParentApp';
import DriverApp from './portals/driver/DriverApp';
import NotFoundPage from './components/common/NotFoundPage';
import UnauthorizedPage from './components/common/UnauthorizedPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import UniversalSchoolDirectory from './portals/admissions/UniversalSchoolDirectory';
import PublicAdmissionLandingPage from './portals/admissions/PublicAdmissionLandingPage';
import PublicAdmissionFormPage from './portals/admissions/PublicAdmissionFormPage';
import PublicApplicationTrackerPage from './portals/admissions/PublicApplicationTrackerPage';

function App() {
    useFirebaseMessaging();
    useWakeupServerQuery();

    const { isAuthenticated, user } = useSelector((s) => s.auth);

    const defaultRoute = isAuthenticated && user
        ? getPortalRoute(user.role)
        : '/auth/login';

    return (
        <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
            <OfflineBanner />
            <PWAPrompt />
            <Toaster
                position="top-center"
                toastOptions={{
                    style: { background: '#1E293B', color: '#F1F5F9', border: '1px solid rgba(148,163,184,0.15)', marginTop: '12px' },
                    success: { iconTheme: { primary: '#22C55E', secondary: '#fff' } },
                    error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
                }}
            />
            <GlobalSocketListener />
            <Routes>
                <Route path="/" element={<Navigate to={defaultRoute} replace />} />

                {/* ── Public Multi-School Admissions ──────────────────────── */}
                <Route path="/admissions" element={<UniversalSchoolDirectory />} />
                <Route path="/admissions/track" element={<PublicApplicationTrackerPage />} />
                <Route path="/admissions/:schoolSlug" element={<PublicAdmissionLandingPage />} />
                <Route path="/admissions/:schoolSlug/apply" element={<PublicAdmissionFormPage />} />
                <Route path="/admissions/:schoolSlug/track" element={<PublicApplicationTrackerPage />} />

                {/* ── Auth ─────────────────────────────────────────────────── */}
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* ── Super Admin ───────────────────────────────────────────── */}
                <Route
                    path="/super-admin/*"
                    element={
                        <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
                            <SuperAdminApp />
                        </ProtectedRoute>
                    }
                />

                {/* ── School ERP (Admin, Accountant, Librarian, FrontOffice) ── */}
                <Route
                    path="/school/*"
                    element={
                        <ProtectedRoute requiredRole={SCHOOL_ERP_ROLES}>
                            <SchoolErpApp />
                        </ProtectedRoute>
                    }
                />

                {/* ── Teacher / Staff App (mobile-first) ────────────────────── */}
                <Route
                    path="/staff/*"
                    element={
                        <ProtectedRoute requiredRole={ROLES.TEACHER}>
                            <StaffApp />
                        </ProtectedRoute>
                    }
                />

                {/* ── Parent / Student App (mobile-first) ───────────────────── */}
                <Route
                    path="/parent/*"
                    element={
                        <ProtectedRoute requiredRole={[ROLES.PARENT, ROLES.STUDENT]}>
                            <ParentApp />
                        </ProtectedRoute>
                    }
                />

                {/* ── Driver App (mobile-first) ─────────────────────────────── */}
                <Route
                    path="/driver/*"
                    element={
                        <ProtectedRoute requiredRole={ROLES.DRIVER}>
                            <DriverApp />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
    );
}

export default App;
