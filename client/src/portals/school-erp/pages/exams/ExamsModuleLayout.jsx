import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutGrid,
    Calendar,
    PlusCircle,
    Edit3,
    FileText,
    Award,
    Table,
    Printer,
    BarChart3,
    Sliders,
    Sparkles,
    CalendarDays,
} from 'lucide-react';

const EXAM_NAV_ITEMS = [
    { to: '/school/exams', label: 'Overview', icon: LayoutGrid, end: true },
    { to: '/school/exams/manage', label: 'Exam Management', icon: Calendar },
    { to: '/school/exams/create', label: 'Create Exam', icon: PlusCircle },
    { to: '/school/exams/marks', label: 'Mark Entry', icon: Edit3 },
    { to: '/school/exams/question-papers', label: 'Question Papers', icon: FileText },
    { to: '/school/exams/process', label: 'Result Processing', icon: Award },
    { to: '/school/exams/results', label: 'View Results', icon: Table },
    { to: '/school/exams/report-cards', label: 'Report Cards', icon: Printer },
    { to: '/school/exams/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/school/exams/settings', label: 'Settings', icon: Sliders },
];

export default function ExamsModuleLayout() {
    const location = useLocation();

    return (
        <div className="min-h-full bg-slate-50/70 flex flex-col">
            {/* Sub-Header Navigation Banner */}
            <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-2xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20">
                                <Award size={20} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-lg font-extrabold text-slate-900 tracking-tight font-display">
                                        Exams & Results
                                    </h1>
                                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200/60">
                                        <Sparkles className="w-3 h-3 text-blue-600" /> Enterprise Subsystem
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">
                                    Examination scheduling, marks entry terminal, grade processing and official report cards
                                </p>
                            </div>
                        </div>

                        {/* Academic Year Pill */}
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-2xs">
                                <CalendarDays size={13} className="text-blue-600" />
                                <span>Academic Year: <span className="font-extrabold text-blue-800">2026 - 27</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Sub-Tabs Nav Bar matching Image 1 composite sidebar */}
                    <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
                        {EXAM_NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) => `
                                        flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer
                                        ${isActive
                                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 scale-[1.02]'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                        }
                                    `}
                                >
                                    <Icon size={14} />
                                    <span>{item.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>
            </header>

            {/* Outlet for full subpages */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
                <Outlet />
            </main>
        </div>
    );
}
