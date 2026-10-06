import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    GraduationCap,
    Star,
    Award,
    Medal,
    TrendingUp,
    TrendingDown,
    Calendar,
    ChevronDown,
    Plus,
    FileSpreadsheet,
    FileText,
    Printer,
    Download,
    BarChart3,
    ArrowRight,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

export default function ExamsSidebar({
    stats = {},
    upcomingExams = [],
    onNavigateAction,
}) {
    const navigate = useNavigate();

    const resultStats = stats.resultStatistics || {
        term: 'Term 1 (Half Yearly)',
        passRate: 92.4,
        passRateDelta: '+5%',
        distinction: 33,
        distinctionDelta: '+6%',
        firstDivision: 41,
        firstDivisionDelta: '+3%',
        secondDivision: 20,
        secondDivisionDelta: '-2%',
    };

    // Chart data matching Image 2
    const chartData = stats.classPerformance || [
        { class: 'C1', passRate: 98, firstDiv: 45, distinction: 38 },
        { class: 'C2', passRate: 96, firstDiv: 44, distinction: 36 },
        { class: 'C3', passRate: 95, firstDiv: 42, distinction: 34 },
        { class: 'C4', passRate: 94, firstDiv: 40, distinction: 32 },
        { class: 'C5', passRate: 93, firstDiv: 39, distinction: 30 },
        { class: 'C6', passRate: 91, firstDiv: 41, distinction: 28 },
        { class: 'C7', passRate: 92, firstDiv: 43, distinction: 31 },
        { class: 'C8', passRate: 90, firstDiv: 38, distinction: 29 },
        { class: 'C9', passRate: 88, firstDiv: 36, distinction: 27 },
        { class: 'C10', passRate: 92, firstDiv: 42, distinction: 35 },
        { class: 'C11', passRate: 86, firstDiv: 35, distinction: 25 },
        { class: 'C12', passRate: 94, firstDiv: 44, distinction: 38 },
    ];

    const defaultDeadlines = [
        { id: '1', title: 'Unit Test 2', month: 'AUG', day: '15', classes: 'Classes 1 - 12 • Periodic Test', status: 'Ongoing' },
        { id: '2', title: 'Pre-Board Exam', month: 'SEP', day: '10', classes: 'Classes 9 - 12 • Board Pattern', status: 'Upcoming' },
        { id: '3', title: 'Annual Examination', month: 'MAR', day: '15', classes: 'Classes 1 - 12 • Term Exam', status: 'Upcoming' },
    ];

    const deadlines = upcomingExams.length > 0 ? upcomingExams : defaultDeadlines;

    const quickActions = [
        {
            title: 'Create New Exam',
            subtitle: 'Set up exam details',
            icon: Plus,
            to: '/school/exams/create',
            iconBg: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'Generate Results',
            subtitle: 'Process and publish',
            icon: FileSpreadsheet,
            to: '/school/exams/process',
            iconBg: 'bg-rose-50 text-rose-600',
        },
        {
            title: 'Create Question Paper',
            subtitle: 'Manage question bank',
            icon: FileText,
            to: '/school/exams/question-papers',
            iconBg: 'bg-purple-50 text-purple-600',
        },
        {
            title: 'View Report Cards',
            subtitle: 'Generate student reports',
            icon: Printer,
            to: '/school/exams/report-cards',
            iconBg: 'bg-emerald-50 text-emerald-600',
        },
        {
            title: 'Export Results',
            subtitle: 'Download Excel / PDF',
            icon: Download,
            to: '/school/exams/results',
            iconBg: 'bg-sky-50 text-sky-600',
        },
        {
            title: 'Exam Analytics',
            subtitle: 'Performance insights',
            icon: BarChart3,
            to: '/school/exams/analytics',
            iconBg: 'bg-amber-50 text-amber-600',
        },
    ];

    return (
        <div className="space-y-5">
            {/* Card 1: Result Statistics */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        Result Statistics
                    </h3>
                    <div className="relative">
                        <select className="appearance-none bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-700 rounded-xl px-2.5 py-1 pr-6 focus:outline-none cursor-pointer">
                            <option>Term 1 (Half Yearly)</option>
                            <option>Unit Test 1</option>
                            <option>Unit Test 2</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                    {/* Pass Rate */}
                    <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100/80">
                        <div className="flex items-center justify-between">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                <GraduationCap className="w-4 h-4" />
                            </div>
                            <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-700">
                                <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                                {resultStats.passRateDelta}
                            </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500 mt-2">Pass Rate</p>
                        <p className="text-lg font-extrabold text-slate-900 tracking-tight font-display">
                            {resultStats.passRate}%
                        </p>
                    </div>

                    {/* Distinction */}
                    <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100/80">
                        <div className="flex items-center justify-between">
                            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                                <Star className="w-4 h-4" />
                            </div>
                            <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-700">
                                <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                                {resultStats.distinctionDelta}
                            </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500 mt-2">Distinction</p>
                        <p className="text-lg font-extrabold text-slate-900 tracking-tight font-display">
                            {resultStats.distinction}%
                        </p>
                    </div>

                    {/* First Division */}
                    <div className="p-3 rounded-2xl bg-sky-50/60 border border-sky-100/80">
                        <div className="flex items-center justify-between">
                            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                                <Award className="w-4 h-4" />
                            </div>
                            <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-700">
                                <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                                {resultStats.firstDivisionDelta}
                            </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500 mt-2">First Division</p>
                        <p className="text-lg font-extrabold text-slate-900 tracking-tight font-display">
                            {resultStats.firstDivision}%
                        </p>
                    </div>

                    {/* Second Division */}
                    <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100/80">
                        <div className="flex items-center justify-between">
                            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                                <Medal className="w-4 h-4" />
                            </div>
                            <span className="inline-flex items-center text-[10px] font-extrabold text-rose-700">
                                <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                                {resultStats.secondDivisionDelta}
                            </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500 mt-2">Second Division</p>
                        <p className="text-lg font-extrabold text-slate-900 tracking-tight font-display">
                            {resultStats.secondDivision}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Card 2: Class-wise Performance Bar Chart (Image 2) */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        Class-wise Performance
                    </h3>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500" /> Pass %
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> First Div %
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-purple-500" /> Distinction %
                    </span>
                </div>

                <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="class" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '11px',
                                }}
                            />
                            <Bar dataKey="passRate" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                            <Bar dataKey="firstDiv" fill="#10b981" radius={[3, 3, 0, 0]} />
                            <Bar dataKey="distinction" fill="#a855f7" radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Card 3: Upcoming Exams */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-3.5">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        Upcoming Exams
                    </h3>
                    <button
                        type="button"
                        onClick={() => navigate('/school/exams/manage')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                        View All
                    </button>
                </div>

                <div className="space-y-3">
                    {deadlines.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => navigate('/school/exams/manage')}
                            className="flex items-center justify-between gap-3 p-1.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-center gap-3 min-w-0">
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
                                        {item.classes}
                                    </p>
                                </div>
                            </div>

                            <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                    item.status === 'Ongoing'
                                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                                }`}
                            >
                                {item.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Card 4: Quick Actions Grid */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-3">
                    Quick Actions
                </h3>

                <div className="grid grid-cols-2 gap-2.5">
                    {quickActions.map((qa, i) => {
                        const Icon = qa.icon;
                        return (
                            <button
                                key={i}
                                type="button"
                                onClick={() => navigate(qa.to)}
                                className="p-3 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 text-left transition-all group cursor-pointer"
                            >
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 ${qa.iconBg}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {qa.title}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                    {qa.subtitle}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
