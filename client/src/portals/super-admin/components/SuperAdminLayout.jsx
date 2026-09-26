/**
 * SuperAdminLayout.jsx — Desktop sidebar layout for Super Admin.
 * Pixel-accurate match to the provided Super Admin screenshot.
 */
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, Bell, ChevronDown, HelpCircle, Search, Crown } from 'lucide-react';
import { logout } from '../../../store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

export default function SuperAdminLayout({ nav, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useSelector((s) => s.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/auth/login');
    };

    const initials = `${user?.firstName?.[0] ?? 'S'}${user?.lastName?.[0] ?? 'A'}`;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* ── Sidebar ─────────────────────────────────────────────── */}
            {/* Mobile overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={`fixed inset-y-0 left-0 z-40 w-60 flex flex-col bg-white border-r border-slate-200 shadow-sm transition-transform duration-300 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 lg:static lg:flex`}>
                {/* Brand */}
                <div className="flex items-center gap-2.5 h-16 px-4 border-b border-slate-100 flex-shrink-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-md shadow-blue-500/30">
                        <span className="text-lg">🎓</span>
                    </div>
                    <div>
                        <p className="text-sm font-extrabold text-slate-900 leading-tight font-display">PrimeSchoolOs</p>
                        <p className="text-[10px] text-slate-700 font-semibold font-medium">SaaS Super Admin</p>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-slate-600 font-medium hover:text-slate-600">
                        <X size={18} />
                    </button>
                </div>

                {/* Nav Scroll Area */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
                    {nav.map(({ group, items }) => (
                        <div key={group}>
                            <p className="text-[10px] font-bold text-slate-700 font-extrabold uppercase tracking-wider px-2 mb-1.5">{group}</p>
                            <div className="space-y-0.5">
                                {items.map(({ to, label, Icon, end, badge }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        end={end}
                                        onClick={() => setSidebarOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                                                isActive
                                                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/70 shadow-xs'
                                                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <Icon size={16} className={isActive ? 'text-blue-600' : 'text-slate-500'} />
                                                <span className="flex-1 truncate">{label}</span>
                                                {badge && (
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                        isActive ? 'bg-blue-200/90 text-blue-950' : 'bg-slate-200 text-slate-700'
                                                    }`}>
                                                        {badge}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Bottom: Upgrade to Enterprise Card matching Image 1 */}
                <div className="p-3 border-t border-slate-100">
                    <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-3.5 text-white shadow-md border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-1">
                            <Crown size={15} className="text-amber-400" />
                            <span className="text-xs font-bold text-white">Upgrade to Enterprise</span>
                        </div>
                        <p className="text-[10px] text-blue-200/80 leading-snug">
                            Unlock advanced features for unlimited growth.
                        </p>
                        <button className="mt-2.5 w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1">
                            Upgrade Plan →
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── Main Content ─────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="flex items-center h-16 px-6 bg-white border-b border-slate-200 gap-4 flex-shrink-0">
                    {/* Mobile Menu */}
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 hover:text-slate-900">
                        <Menu size={20} />
                    </button>

                    {/* Search */}
                    <div className="relative flex-1 max-w-sm hidden md:block">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search schools, users, invoices..."
                            className="w-full h-10 pl-9 pr-4 text-sm bg-slate-100/80 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                        />
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        {/* Date */}
                        <button className="hidden md:flex items-center gap-2 h-10 px-3.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-800 font-semibold hover:bg-slate-50 shadow-xs transition-colors">
                            📅 This Month <ChevronDown size={14} />
                        </button>

                        {/* Notifications */}
                        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-colors">
                            <Bell size={17} />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                        </button>

                        {/* Help */}
                        <button className="hidden md:flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-colors">
                            <HelpCircle size={17} />
                        </button>

                        {/* User */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 h-10 pl-2 pr-3.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 shadow-xs transition-colors"
                        >
                            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                                {initials}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-xs font-bold text-slate-900">{user?.firstName} {user?.lastName}</p>
                                <p className="text-[10px] font-semibold text-slate-600">Super Admin</p>
                            </div>
                            <ChevronDown size={14} className="text-slate-500 hidden md:block" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
