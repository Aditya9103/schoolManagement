import React from 'react';
import { Layers, Users, Clock, CheckCircle2, FileText, Award } from 'lucide-react';

export default function TeacherKpiRow({ kpis, isLoading }) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs animate-pulse">
                        <div className="flex items-center justify-between mb-3">
                            <div className="h-3 w-16 bg-slate-200 rounded" />
                            <div className="w-7 h-7 bg-slate-200 rounded-xl" />
                        </div>
                        <div className="h-7 w-12 bg-slate-200 rounded mb-2" />
                        <div className="h-2.5 w-20 bg-slate-100 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    const items = [
        {
            label: 'My Classes',
            value: kpis?.assignedClassesCount ?? 0,
            subtext: `${kpis?.assignedClassesCount ?? 0} Assigned section${kpis?.assignedClassesCount === 1 ? '' : 's'}`,
            icon: Layers,
            color: 'text-blue-600 bg-blue-50 border-blue-100'
        },
        {
            label: 'My Students',
            value: kpis?.totalStudentsCount ?? 0,
            subtext: 'Active enrolled',
            icon: Users,
            color: 'text-indigo-600 bg-indigo-50 border-indigo-100'
        },
        {
            label: "Today's Classes",
            value: kpis?.todayClassesCount ?? 0,
            subtext: 'Periods today',
            icon: Clock,
            color: 'text-amber-600 bg-amber-50 border-amber-100'
        },
        {
            label: 'Attendance Rate',
            value: kpis?.attendanceRate != null ? `${kpis.attendanceRate}%` : 'N/A',
            subtext: kpis?.attendanceRate != null ? 'Past 30 days avg' : 'No attendance data',
            icon: CheckCircle2,
            color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
        },
        {
            label: 'Active Homework',
            value: kpis?.pendingHomeworkCount ?? 0,
            subtext: 'Tasks in cycle',
            icon: FileText,
            color: 'text-rose-600 bg-rose-50 border-rose-100'
        },
        {
            label: 'Upcoming Exams',
            value: kpis?.upcomingExamsCount ?? 0,
            subtext: 'Scheduled assessments',
            icon: Award,
            color: 'text-purple-600 bg-purple-50 border-purple-100'
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {items.map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                    <div
                        key={idx}
                        className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-500">{kpi.label}</span>
                            <div className={`p-2 rounded-xl border ${kpi.color}`}>
                                <Icon size={16} />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-slate-900">{kpi.value}</div>
                        <p className="text-[11px] font-medium text-slate-500 mt-1 truncate">{kpi.subtext}</p>
                    </div>
                );
            })}
        </div>
    );
}
