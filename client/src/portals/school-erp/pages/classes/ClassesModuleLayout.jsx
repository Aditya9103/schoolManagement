import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutGrid,
    Layers,
    UserCheck,
    BookOpen,
    Clock,
    BarChart3,
    Settings,
    Calendar,
    Sparkles,
} from 'lucide-react';
import { useGetAcademicYearsQuery } from '../../../../store/api/classApi';

const NAV_ITEMS = [
    { to: '/school/classes', label: 'Overview', icon: LayoutGrid, end: true },
    { to: '/school/classes/sections', label: 'Sections', icon: Layers },
    { to: '/school/classes/teachers', label: 'Class Teachers', icon: UserCheck },
    { to: '/school/classes/subjects', label: 'Subjects', icon: BookOpen },
    { to: '/school/classes/timetable', label: 'Timetable', icon: Clock },
    { to: '/school/classes/reports', label: 'Reports', icon: BarChart3 },
    { to: '/school/classes/settings', label: 'Settings', icon: Settings },
];

export default function ClassesModuleLayout() {
    const location = useLocation();
    const { data: yearsRes } = useGetAcademicYearsQuery();
    const rawYears = yearsRes?.data;
    const academicYears = Array.isArray(rawYears) ? rawYears : (rawYears?.academicYears || []);
    const currentAcademicYear = rawYears?.currentAcademicYear || academicYears.find((y) => y.isCurrent) || academicYears[0];
    const currentYearName = currentAcademicYear?.name || '2026-27';

    return (
        <div className="min-h-full bg-slate-50 flex flex-col">
            {/* Sub-Header Navigation Banner */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-15 shadow-2xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20">
                                <LayoutGrid size={20} />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-900 tracking-tight">Classes & Sections</h1>
                                <p className="text-xs text-slate-700 font-medium">Curriculum structuring, sections, educators and schedules</p>
                            </div>
                        </div>

                        {/* Academic Year Pill */}
                        <div className="flex items-center gap-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
                                <Calendar size={13} className="text-blue-700 font-bold" />
                                <span>Academic Year: <span className="font-bold text-blue-800">{currentYearName}</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Sub-Tabs Nav Bar */}
                    <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) => `
                                        flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150
                                        ${isActive
                                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                        }
                                    `}
                                >
                                    <Icon size={15} />
                                    <span>{item.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>
            </header>

            {/* Page Content Outlet */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
            </main>
        </div>
    );
}
