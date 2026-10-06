import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts';
import {
    Clock,
    FileSpreadsheet,
    FileText,
    CheckCircle2,
    Calendar,
    ChevronRight,
    Sparkles,
    Award
} from 'lucide-react';

export default function HomeworkSidebar({
    typeDistribution = [],
    upcomingDeadlines = [],
    recentActivities = [],
    onViewAllDeadlines,
    onViewAllActivities,
    onSelectDeadline,
}) {
    // Default donut data matching screenshot Image 2
    const donutData = typeDistribution.length > 0 ? typeDistribution : [
        { name: 'Homework', count: 48, percentage: 39, color: '#3b82f6' },
        { name: 'Assignment', count: 32, percentage: 26, color: '#a855f7' },
        { name: 'Project', count: 18, percentage: 15, color: '#f59e0b' },
        { name: 'Practical', count: 14, percentage: 11, color: '#ec4899' },
        { name: 'Other', count: 12, percentage: 9, color: '#64748b' },
    ];

    // Default deadlines matching screenshot Image 2
    const deadlines = upcomingDeadlines.length > 0 ? upcomingDeadlines : [
        {
            id: 'dl-1',
            day: '21',
            month: 'APR',
            title: 'Chapter 1 - Exercise Questions',
            classSubject: 'Class 6 - A | Mathematics',
            time: '11:59 PM',
        },
        {
            id: 'dl-2',
            day: '22',
            month: 'APR',
            title: 'Essay on Save Trees',
            classSubject: 'Class 7 - B | English',
            time: '11:59 PM',
        },
        {
            id: 'dl-3',
            day: '25',
            month: 'APR',
            title: 'Science Project - Water Cycle',
            classSubject: 'Class 8 - A | Science',
            time: '11:59 PM',
        },
        {
            id: 'dl-4',
            day: '27',
            month: 'APR',
            title: 'Computer Practical - MS Word',
            classSubject: 'Class 8 - B | Computer',
            time: '11:59 PM',
        },
    ];

    // Default activities matching screenshot Image 2
    const activities = recentActivities.length > 0 ? recentActivities : [
        {
            id: 'act-1',
            studentName: 'Riya Sharma submitted',
            subjectAssignment: 'Science Project - Water Cycle',
            timeAgo: '2 hours ago',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
            iconBg: 'bg-emerald-100 text-emerald-600',
        },
        {
            id: 'act-2',
            studentName: 'Aarav Patel submitted',
            subjectAssignment: 'Chapter 1 - Exercise Questions',
            timeAgo: '3 hours ago',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
            iconBg: 'bg-blue-100 text-blue-600',
        },
        {
            id: 'act-3',
            studentName: 'Teacher graded',
            subjectAssignment: 'Essay on Save Trees',
            timeAgo: '5 hours ago',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            iconBg: 'bg-purple-100 text-purple-600',
        },
        {
            id: 'act-4',
            studentName: 'New assignment created',
            subjectAssignment: 'Environmental Awareness',
            timeAgo: '1 day ago',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            iconBg: 'bg-amber-100 text-amber-600',
        },
    ];

    return (
        <div className="space-y-4">
            {/* Card 1: Assignment Overview Donut */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        Assignment Overview
                    </h3>
                </div>

                <div className="flex items-center gap-3">
                    {/* Donut Chart */}
                    <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={donutData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={46}
                                    outerRadius={64}
                                    paddingAngle={3}
                                    dataKey="count"
                                    stroke="none"
                                >
                                    {donutData.map((entry, index) => (
                                        <Cell key={`cell-hw-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                            <span className="text-xl font-extrabold text-slate-900 leading-none">
                                124
                            </span>
                            <span className="text-[10px] font-medium text-slate-500 mt-0.5">
                                Assignments
                            </span>
                        </div>
                    </div>

                    {/* Breakdown list */}
                    <div className="flex-1 space-y-1.5 w-full">
                        {donutData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-slate-600 font-medium truncate">{item.name}</span>
                                </div>
                                <span className="text-slate-900 font-bold shrink-0 ml-1">
                                    {item.count} <span className="text-slate-400 font-normal">({item.percentage}%)</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Card 2: Upcoming Deadlines */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        Upcoming Deadlines
                    </h3>
                    <button
                        onClick={onViewAllDeadlines}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                        View All
                    </button>
                </div>

                <div className="space-y-3">
                    {deadlines.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => (onSelectDeadline ? onSelectDeadline(item) : onViewAllDeadlines && onViewAllDeadlines())}
                            className="flex items-center justify-between gap-3 p-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                {/* Date pill */}
                                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex flex-col items-center justify-center shrink-0 text-center group-hover:bg-rose-100/60 transition-colors">
                                    <span className="text-[9px] font-bold text-rose-500 uppercase leading-none">
                                        {item.month}
                                    </span>
                                    <span className="text-sm font-extrabold text-rose-700 leading-tight">
                                        {item.day}
                                    </span>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </p>
                                    <p className="text-[11px] text-slate-400 truncate">
                                        {item.classSubject}
                                    </p>
                                </div>
                            </div>

                            <span className="text-xs font-bold text-slate-700 shrink-0">
                                {item.time}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Card 3: Recent Activity */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        Recent Activity
                    </h3>
                    <button
                        onClick={onViewAllActivities}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                        View All
                    </button>
                </div>

                <div className="space-y-3.5">
                    {activities.map((act) => (
                        <div key={act.id} className="flex items-start justify-between gap-2.5">
                            <div className="flex items-start gap-3 min-w-0">
                                <img
                                    src={act.avatar}
                                    alt={act.studentName}
                                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0 mt-0.5"
                                />
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-900 truncate">
                                        {act.studentName}
                                    </p>
                                    <p className="text-[11px] text-slate-500 truncate">
                                        {act.subjectAssignment}
                                    </p>
                                </div>
                            </div>

                            <span className="text-[11px] text-slate-400 shrink-0 mt-0.5 whitespace-nowrap">
                                {act.timeAgo}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
