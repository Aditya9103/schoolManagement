import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Home,
    Calendar,
    ClipboardList,
    FileText,
    Award,
    Wallet,
    Bell,
    LogOut
} from 'lucide-react';
import { logout } from '../../../store/slices/authSlice';
import ChildSwitcher from './ChildSwitcher';

export const FAMILY_NAV = [
    { to: '/portal', label: 'Home', Icon: Home, end: true },
    { to: '/portal/timetable', label: 'Schedule', Icon: Calendar },
    { to: '/portal/attendance', label: 'Attendance', Icon: ClipboardList },
    { to: '/portal/homework', label: 'Homework', Icon: FileText },
    { to: '/portal/results', label: 'Report Cards', Icon: Award },
    { to: '/portal/fees', label: 'Fees & Pay', Icon: Wallet },
    { to: '/portal/notices', label: 'Notices', Icon: Bell },
];

export default function FamilyPortalLayout({
    children,
    childrenList,
    selectedChildIndex,
    onSelectChild
}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((s) => s.auth);
    const isParent = user?.role === 'PARENT';

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
            {/* ── Top Header ────────────────────────────────────────────── */}
            <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-blue-500/20 text-lg">
                            P
                        </div>
                        <div>
                            <span className="text-xs font-bold text-blue-400 tracking-wider uppercase block">PrimeSchoolOS</span>
                            <span className="text-sm font-extrabold text-white">Family Portal</span>
                        </div>
                    </div>

                    {/* Active Child Switcher (Only visible for Parents) */}
                    {isParent && childrenList && (
                        <ChildSwitcher
                            childrenList={childrenList}
                            activeIndex={selectedChildIndex}
                            onSelectChild={onSelectChild}
                        />
                    )}

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Sign out"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Body with Desktop Sidebar ─────────────────────────────── */}
            <div className="flex-1 max-w-6xl w-full mx-auto flex pb-20 md:pb-6">
                <aside className="hidden md:flex flex-col w-60 py-6 pr-6 space-y-1 shrink-0">
                    {FAMILY_NAV.map(({ to, label, Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </aside>

                <main className="flex-1 p-4 md:py-6 md:pl-6 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* ── Mobile Sticky Bottom Bar ───────────────────────────────── */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex items-center justify-around z-40">
                {FAMILY_NAV.slice(0, 5).map(({ to, label, Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[10px] font-bold transition-colors ${
                                isActive ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                            }`
                        }
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}
