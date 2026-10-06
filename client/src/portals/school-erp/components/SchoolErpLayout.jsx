import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Menu,
    X,
    Bell,
    Mail,
    Search,
    ChevronDown,
    LayoutDashboard,
    Users,
    UserCheck,
    Layers,
    BookOpen,
    Calendar,
    ClipboardList,
    Award,
    FileText,
    ArrowRightLeft,
    Wallet,
    Receipt,
    GraduationCap,
    CreditCard,
    TrendingUp,
    Megaphone,
    MessageSquare,
    Bus,
    Building,
    Library,
    Package,
    FolderOpen,
    ShieldCheck,
    Settings,
    Shield,
    Puzzle,
    Sliders,
    LogOut,
    Sparkles,
    Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { logout } from '../../../store/slices/authSlice';
import { useGetMySchoolQuery } from '../../../store/api/schoolErpApi';
import { useGetAcademicYearsQuery, useSetCurrentAcademicYearMutation } from '../../../store/api/classApi';
import usePermissions from '../../../hooks/usePermissions';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_GROUPS = [
    {
        title: null,
        items: [
            { to: '/school', label: 'Dashboard', Icon: LayoutDashboard, end: true, featureId: 'dashboard_main' }
        ]
    },
    {
        title: 'ACADEMIC',
        items: [
            { to: '/school/students', label: 'Students', Icon: Users, featureId: 'students_list' },
            { to: '/school/admissions', label: 'Admissions', Icon: UserCheck, featureId: 'admissions_apps' },
            { to: '/school/classes', label: 'Classes & Sections', Icon: Layers, featureId: 'classes_sections' },
            { to: '/school/classes/subjects', label: 'Subjects', Icon: BookOpen, featureId: 'subjects_curriculum' },
            { to: '/school/classes/timetable', label: 'Timetable', Icon: Calendar, featureId: 'academic_timetable' },
            { to: '/school/attendance', label: 'Attendance', Icon: ClipboardList, featureId: 'academic_attendance' },
            { to: '/school/exams', label: 'Exams & Results', Icon: Award, featureId: 'exams_results' },
            { to: '/school/assignments', label: 'Homework & Assignments', Icon: FileText, featureId: 'homework_assignments' },
            { to: '/school/promotion', label: 'Promotion & Transfer', Icon: ArrowRightLeft, featureId: 'student_promotion' }
        ]
    },
    {
        title: 'PEOPLE',
        items: [
            { to: '/school/teachers', label: 'Teachers', Icon: UserCheck, featureId: 'teachers_directory' },
            { to: '/school/staff', label: 'Staff Management', Icon: Users, featureId: 'staff_management' },
            { to: '/school/parents', label: 'Parents', Icon: Users, featureId: 'parents_directory' }
        ]
    },
    {
        title: 'FINANCE',
        items: [
            { to: '/school/fees', label: 'Fees & Payments', Icon: Wallet, featureId: 'fees_collection' },
            { to: '/school/invoices', label: 'Invoices', Icon: Receipt, featureId: 'invoices_billing' },
            { to: '/school/scholarships', label: 'Scholarships', Icon: GraduationCap, featureId: 'scholarships_discounts' },
            { to: '/school/expenses', label: 'Expenses', Icon: CreditCard, featureId: 'expenses_budget' },
            { to: '/school/reports', label: 'Financial Reports', Icon: TrendingUp, featureId: 'financial_reports' }
        ]
    },
    {
        title: 'COMMUNICATION',
        items: [
            { to: '/school/notices', label: 'Announcements', Icon: Megaphone, featureId: 'announcements_circulars' },
            { to: '/school/messages', label: 'Messages', Icon: MessageSquare, featureId: 'messages_chat' },
            { to: '/school/events', label: 'Events & Activities', Icon: Calendar, featureId: 'events_activities' },
            { to: '/school/parent-meetings', label: 'Parent Meetings', Icon: Users, featureId: 'parent_meetings' },
            { to: '/school/notices', label: 'Notices', Icon: Bell, featureId: 'announcements_circulars' }
        ]
    },
    {
        title: 'OPERATIONS',
        items: [
            { to: '/school/transport', label: 'Transport', Icon: Bus, featureId: 'transport_fleet' },
            { to: '/school/hostel', label: 'Hostel', Icon: Building, featureId: 'hostel_rooms' },
            { to: '/school/library', label: 'Library', Icon: Library, featureId: 'library_books' },
            { to: '/school/inventory', label: 'Inventory', Icon: Package, featureId: 'inventory_assets' },
            { to: '/school/documents', label: 'Documents', Icon: FolderOpen, featureId: 'documents_repository' },
            { to: '/school/visitors', label: 'Gate Pass & Visitors', Icon: ShieldCheck, featureId: 'gate_pass_visitors' }
        ]
    },
    {
        title: 'SETTINGS',
        items: [
            { to: '/school/settings', label: 'School Profile', Icon: Settings, featureId: 'school_profile' },
            { to: '/school/roles', label: 'Roles & Permissions', Icon: Shield, featureId: 'roles_permissions' },
            { to: '/school/integrations', label: 'Integrations', Icon: Puzzle, featureId: 'integrations_api' },
            { to: '/school/system-settings', label: 'System Settings', Icon: Sliders, featureId: 'system_settings' }
        ]
    }
];

const MOBILE_BOTTOM_NAV = [
    { to: '/school', label: 'Home', Icon: LayoutDashboard, end: true, featureId: 'dashboard_main' },
    { to: '/school/students', label: 'Students', Icon: Users, featureId: 'students_list' },
    { to: '/school/attendance', label: 'Attendance', Icon: ClipboardList, featureId: 'academic_attendance' },
    { to: '/school/fees', label: 'Fees', Icon: Wallet, featureId: 'fees_collection' },
    { to: '/school/settings', label: 'More', Icon: Settings, featureId: null }
];

export default function SchoolErpLayout({ children }) {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [academicYearDropdownOpen, setAcademicYearDropdownOpen] = useState(false);

    const { user } = useSelector((s) => s.auth);
    const { data: schoolRes } = useGetMySchoolQuery();
    const school = schoolRes?.data;
    const { canAccess, isAdmin } = usePermissions();

    // Real Academic Years from Database with actual IDs
    const { data: yearsRes } = useGetAcademicYearsQuery();
    const [setCurrentYear] = useSetCurrentAcademicYearMutation();

    const academicYears = yearsRes?.data?.academicYears || [];
    const currentAcademicYear =
        yearsRes?.data?.currentAcademicYear ||
        academicYears.find((y) => y.isCurrent) ||
        academicYears[0];

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Filter navigation groups dynamically based on assigned permissions
    const filteredNavGroups = NAV_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter((item) => !item.featureId || isAdmin || canAccess(item.featureId))
    })).filter((group) => group.items.length > 0);

    const filteredMobileNav = MOBILE_BOTTOM_NAV.filter(
        (item) => !item.featureId || isAdmin || canAccess(item.featureId)
    );

    const fullName = user?.firstName
        ? `${user.firstName} ${user.lastName || ''}`.trim()
        : 'Rohit Sharma';

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
            {/* Mobile Sidebar Backdrop */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Deep Navy Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[#071325] text-slate-300 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 lg:static lg:flex shrink-0 border-r border-[#13233c]`}
            >
                {/* Brand / School Logo Header */}
                <div className="flex items-center gap-3 h-16 px-4 border-b border-[#13233c] shrink-0">
                    {school?.logoUrl ? (
                        <img
                            src={school.logoUrl}
                            alt={school?.name || 'School Logo'}
                            className="w-10 h-10 rounded-xl object-cover bg-white p-1 shadow-md border border-white/20"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-blue-500/30 text-lg">
                            P
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <h2 className="text-sm font-bold text-white tracking-tight truncate">
                            {school?.name || 'PrimeSchoolOS'}
                        </h2>
                        <p className="text-[10px] text-slate-300 font-medium truncate">
                            {school?.tagline || 'Smart Education Management'}
                        </p>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-slate-300 hover:text-white p-1"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Sidebar Navigation Links */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-700">
                    {filteredNavGroups.map((group, groupIdx) => (
                        <div key={groupIdx}>
                            {group.title && (
                                <p className="px-3 mb-1.5 text-[10px] font-extrabold tracking-wider text-slate-300 uppercase">
                                    {group.title}
                                </p>
                            )}
                            <div className="space-y-0.5">
                                {group.items.map(({ to, label, Icon, end }) => {
                                    const isCustomActive = (isActive) => {
                                        if (to === '/school/classes') {
                                            return location.pathname.startsWith('/school/classes') &&
                                                !location.pathname.includes('/subjects') &&
                                                !location.pathname.includes('/timetable');
                                        }
                                        if (to === '/school/classes/subjects') {
                                            return location.pathname.startsWith('/school/classes/subjects') || location.pathname.startsWith('/school/subjects');
                                        }
                                        if (to === '/school/classes/timetable') {
                                            return location.pathname.startsWith('/school/classes/timetable') || location.pathname.startsWith('/school/timetable');
                                        }
                                        return isActive;
                                    };

                                    return (
                                        <NavLink
                                            key={to + label}
                                            to={to}
                                            end={end}
                                            onClick={() => setSidebarOpen(false)}
                                            className={({ isActive }) => {
                                                const active = isCustomActive(isActive);
                                                return `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${active
                                                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                                                    : 'text-slate-300 hover:bg-[#11233f] hover:text-white'
                                                    }`;
                                            }}
                                        >
                                            {({ isActive }) => {
                                                const active = isCustomActive(isActive);
                                                return (
                                                    <>
                                                        <Icon
                                                            size={16}
                                                            className={active ? 'text-white' : 'text-slate-300'}
                                                        />
                                                        <span className="truncate">{label}</span>
                                                    </>
                                                );
                                            }}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Bottom Promo Card */}
                <div className="p-3 m-3 rounded-xl bg-gradient-to-r from-blue-950/80 to-indigo-950/80 border border-blue-800/40 shrink-0">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[11px] font-bold text-white">Upgrade to Enterprise</span>
                        </div>
                        <button className="text-[10px] font-bold text-blue-300 hover:text-blue-200 bg-blue-500/20 px-2 py-0.5 rounded-md border border-blue-400/30">
                            View Plans
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-300 font-medium leading-tight">
                        Unlock advanced features & AI tools
                    </p>
                </div>
            </aside>

            {/* Main Application Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Top Header */}
                <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-slate-200/80 gap-3 shrink-0 z-20">
                    {/* Left: Mobile Toggle & Global Search */}
                    <div className="flex items-center gap-3 flex-1 max-w-xl">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-slate-600 hover:text-slate-900 p-1.5 rounded-lg border border-slate-200"
                        >
                            <Menu size={18} />
                        </button>

                        <div className="relative flex-1 max-w-md hidden sm:block">
                            <Search
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                            />
                            <input
                                placeholder="Search students, teachers, classes, fees, etc..."
                                className="w-full pl-9 pr-12 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder:text-slate-500 font-medium transition-all"
                            />
                            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-md shadow-xs">
                                ⌘ K
                            </kbd>
                        </div>
                    </div>

                    {/* Right: Academic Year, Notifications, Messages, User Profile */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Academic Year Selector (Real DB Documents with IDs) */}
                        <div className="relative hidden md:block">
                            <button
                                type="button"
                                onClick={() => setAcademicYearDropdownOpen(!academicYearDropdownOpen)}
                                className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                                <Calendar size={13} className="text-blue-600" />
                                <span>Academic Year {currentAcademicYear?.name || '2026-27'}</span>
                                <ChevronDown size={14} className="text-slate-600 font-medium" />
                            </button>

                            {academicYearDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-100 animate-in fade-in zoom-in-95 duration-150">
                                    <div className="px-2.5 py-1.5 border-b border-slate-100 text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                                        Academic Sessions
                                    </div>
                                    <div className="py-1 space-y-1">
                                        {academicYears.map((yr) => (
                                            <div
                                                key={yr._id}
                                                onClick={async () => {
                                                    if (!yr.isCurrent) {
                                                        try {
                                                            await setCurrentYear(yr._id).unwrap();
                                                            toast.success(`Active session switched to ${yr.name}`);
                                                        } catch (err) {
                                                            toast.error('Failed to switch academic session');
                                                        }
                                                    }
                                                    setAcademicYearDropdownOpen(false);
                                                }}
                                                className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${yr.isCurrent
                                                    ? 'bg-blue-50/80 text-blue-900 font-bold'
                                                    : 'hover:bg-slate-50 text-slate-700'
                                                    }`}
                                            >
                                                <div>
                                                    <div className="text-xs font-bold flex items-center gap-1.5">
                                                        <span>{yr.name}</span>
                                                        {yr.isCurrent && (
                                                            <span className="px-1.5 py-0.5 rounded-md bg-blue-600 text-white text-[9px] font-semibold">
                                                                Active
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] text-slate-700 font-semibold block font-mono">
                                                        ID: {yr._id}
                                                    </span>
                                                </div>
                                                {yr.isCurrent ? (
                                                    <Check size={14} className="text-blue-600 shrink-0" />
                                                ) : (
                                                    <span className="text-[10px] font-semibold text-slate-700 hover:text-blue-600">
                                                        Set Active
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Notifications Bell */}
                        <button
                            aria-label="Notifications"
                            className="relative h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <Bell size={16} />
                            <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                                12
                            </span>
                        </button>

                        {/* Direct Messages */}
                        <button
                            aria-label="Direct Messages"
                            className="relative h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <Mail size={16} />
                            <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                                3
                            </span>
                        </button>

                        {/* User Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-left"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                                    alt={fullName}
                                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=2563eb&color=fff`;
                                    }}
                                />
                                <div className="hidden sm:block">
                                    <p className="text-xs font-bold text-slate-900 leading-tight">
                                        {fullName}
                                    </p>
                                    <p className="text-[10px] text-slate-600 font-semibold leading-tight">
                                        School Admin
                                    </p>
                                </div>
                                <ChevronDown size={14} className="text-slate-500 hidden sm:block" />
                            </button>

                            {/* User Profile Dropdown */}
                            {userDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50">
                                    <div className="px-3 py-2 border-b border-slate-100">
                                        <p className="text-xs font-bold text-slate-900">{fullName}</p>
                                        <p className="text-[10px] text-slate-700 font-semibold truncate">{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setUserDropdownOpen(false);
                                            navigate('/school/settings');
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                    >
                                        <Settings size={14} /> School Settings
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 text-xs text-rose-700 font-bold hover:bg-rose-50 flex items-center gap-2"
                                    >
                                        <LogOut size={14} /> Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content Viewport */}
                <main className="flex-1 overflow-y-auto pb-16 lg:pb-0 bg-[#f8fafc]">
                    {children}
                </main>

                {/* Mobile Bottom Navigation */}
                <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around z-30 shadow-lg">
                    {filteredMobileNav.map(({ to, label, Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${isActive
                                    ? 'text-blue-600 font-bold scale-105'
                                    : 'text-slate-600 hover:text-slate-900 font-semibold'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                                    <span className="text-[10px] mt-0.5 tracking-tight">{label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
}
