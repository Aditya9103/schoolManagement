import React, { useState } from 'react';
import {
    CalendarCheck,
    UploadCloud,
    FileSpreadsheet,
    UserMinus,
    ChevronDown,
    FileText,
    Calendar,
    ArrowUpRight,
    CheckCircle2,
    XCircle,
    Clock
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from 'recharts';

export default function AttendanceSidebar({
    onOpenTakeModal,
    onOpenImportModal,
    onOpenReportsModal,
    onOpenLeaveModal,
    trendDays = [],
    activities = [],
    onViewAllActivities,
}) {
    const [trendRange, setTrendRange] = useState('7d');

    // Default trend data matching the screenshot
    const chartData = trendDays.length > 0 ? trendDays : [
        { day: '15 Apr', present: 70, absent: 35, late: 12 },
        { day: '16 Apr', present: 88, absent: 24, late: 10 },
        { day: '17 Apr', present: 68, absent: 32, late: 18 },
        { day: '18 Apr', present: 52, absent: 16, late: 8 },
        { day: '19 Apr', present: 74, absent: 30, late: 14 },
        { day: '20 Apr', present: 82, absent: 22, late: 11 },
        { day: '21 Apr', present: 88, absent: 14, late: 6 },
    ];

    // Default activities matching screenshot
    const activityItems = activities.length > 0 ? activities : [
        {
            id: 'act-1',
            type: 'ABSENT',
            studentName: 'Sneha Gupta',
            action: 'marked Absent',
            details: 'Class 6 - Section A • 21 Apr 2026, 09:15 AM',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            icon: 'calendar-red',
        },
        {
            id: 'act-2',
            type: 'LATE',
            studentName: 'Kavya Joshi',
            action: 'marked Late',
            details: 'Class 6 - Section A • 21 Apr 2026, 09:30 AM',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
            icon: 'clock-amber',
        },
        {
            id: 'act-3',
            type: 'IMPORT',
            studentName: 'System Admin',
            action: 'Attendance updated via CSV Import',
            details: 'Class 7 - Section B • 21 Apr 2026, 08:45 AM',
            avatar: null,
            icon: 'import-blue',
        },
    ];

    return (
        <div className="space-y-4">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3.5 tracking-tight">
                    Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {/* Take Attendance */}
                    <button
                        onClick={onOpenTakeModal}
                        type="button"
                        className="flex flex-col text-left p-3 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-100 transition-all group cursor-pointer"
                    >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
                            <CalendarCheck className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 leading-tight">
                            Take Attendance
                        </span>
                        <span className="text-[11px] text-slate-500 mt-0.5">
                            Mark for selected class
                        </span>
                    </button>

                    {/* Import Attendance */}
                    <button
                        onClick={onOpenImportModal}
                        type="button"
                        className="flex flex-col text-left p-3 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-100 transition-all group cursor-pointer"
                    >
                        <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
                            <UploadCloud className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 leading-tight">
                            Import Attendance
                        </span>
                        <span className="text-[11px] text-slate-500 mt-0.5">
                            From CSV/Excel
                        </span>
                    </button>

                    {/* View Reports */}
                    <button
                        onClick={onOpenReportsModal}
                        type="button"
                        className="flex flex-col text-left p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-100 transition-all group cursor-pointer"
                    >
                        <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
                            <FileSpreadsheet className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 leading-tight">
                            View Reports
                        </span>
                        <span className="text-[11px] text-slate-500 mt-0.5">
                            Generate attendance reports
                        </span>
                    </button>

                    {/* Student Leave */}
                    <button
                        onClick={onOpenLeaveModal}
                        type="button"
                        className="flex flex-col text-left p-3 rounded-xl bg-purple-50/70 hover:bg-purple-100/70 border border-purple-100 transition-all group cursor-pointer"
                    >
                        <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
                            <UserMinus className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 leading-tight">
                            Student Leave
                        </span>
                        <span className="text-[11px] text-slate-500 mt-0.5">
                            Manage leave requests
                        </span>
                    </button>
                </div>
            </div>

            {/* Attendance Trends Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        Attendance Trends
                    </h3>
                    <div className="relative">
                        <select
                            value={trendRange}
                            onChange={(e) => setTrendRange(e.target.value)}
                            className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg px-2.5 py-1 pr-6 cursor-pointer focus:outline-none"
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="14d">Last 14 Days</option>
                            <option value="30d">Last 30 Days</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748b' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 100]}
                                ticks={[0, 25, 50, 75, 100]}
                                tick={{ fontSize: 10, fill: '#64748b' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    fontSize: '11px',
                                }}
                            />
                            <Bar dataKey="present" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={10} />
                            <Bar dataKey="absent" fill="#ef4444" radius={[3, 3, 0, 0]} maxBarSize={10} />
                            <Bar dataKey="late" fill="#f59e0b" radius={[3, 3, 0, 0]} maxBarSize={10} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Bottom Chart Legend */}
                <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Present
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" /> Absent
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" /> Late
                    </span>
                </div>
            </div>

            {/* Recent Attendance Activity Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        Recent Attendance Activity
                    </h3>
                    <button
                        onClick={onViewAllActivities}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                        View All
                    </button>
                </div>

                <div className="space-y-3">
                    {activityItems.map((act) => (
                        <div key={act.id} className="flex items-start gap-3">
                            {act.avatar ? (
                                <img
                                    src={act.avatar}
                                    alt={act.studentName}
                                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 flex-shrink-0"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
                                    <FileSpreadsheet className="w-4 h-4" />
                                </div>
                            )}

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-slate-900 leading-snug">
                                    {act.avatar ? (
                                        <>
                                            <span className="font-bold">{act.studentName}</span>{' '}
                                            <span className="text-slate-600">{act.action}</span>
                                        </>
                                    ) : (
                                        <span className="font-bold text-slate-800">{act.action}</span>
                                    )}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                    {act.details}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
