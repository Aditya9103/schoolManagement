import React, { useState } from 'react';
import {
    X,
    Filter,
    BarChart3,
    TrendingUp,
    CheckCircle2,
    Clock,
    Award,
    Calendar,
    ChevronDown
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    LineChart,
    Line
} from 'recharts';

export default function AssignmentAnalyticsModal({
    isOpen,
    onClose,
    analyticsData = null,
}) {
    if (!isOpen) return null;

    const [timeframe, setTimeframe] = useState('30d');

    // Default analytics matching Screen 8
    const overview = analyticsData?.overview || {
        totalAssignments: 124,
        submissionRate: 86,
        averageScore: 78,
        onTimeRate: 92,
    };

    const donutData = analyticsData?.submissionStatusBreakdown || [
        { name: 'Submitted', value: 104, percentage: 84, color: '#10b981' },
        { name: 'Pending', value: 14, percentage: 11, color: '#ef4444' },
        { name: 'Late', value: 6, percentage: 5, color: '#f59e0b' },
    ];

    const subjectScores = analyticsData?.subjectAverages || [
        { subject: 'Maths', score: 88, fill: '#3b82f6' },
        { subject: 'English', score: 76, fill: '#8b5cf6' },
        { subject: 'Science', score: 82, fill: '#06b6d4' },
        { subject: 'S. Science', score: 74, fill: '#f59e0b' },
        { subject: 'Arts', score: 91, fill: '#ec4899' },
        { subject: 'Life Skills', score: 85, fill: '#10b981' },
    ];

    const classPerf = analyticsData?.classPerformance || [
        { className: 'Class 6', score: 86 },
        { className: 'Class 7', score: 79 },
        { className: 'Class 8', score: 82 },
        { className: 'Class 9', score: 74 },
        { className: 'Class 10', score: 80 },
    ];

    const trends = analyticsData?.submissionTrends || [
        { date: '16 Apr', submitted: 85, pending: 15, late: 4 },
        { date: '17 Apr', submitted: 90, pending: 12, late: 5 },
        { date: '18 Apr', submitted: 78, pending: 20, late: 8 },
        { date: '19 Apr', submitted: 94, pending: 8, late: 2 },
        { date: '20 Apr', submitted: 88, pending: 10, late: 6 },
        { date: '21 Apr', submitted: 96, pending: 5, late: 3 },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-6xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
                {/* Header matching Screen 8 */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-0.5">
                            <span>Academic</span>
                            <span>&gt;</span>
                            <span>Homework & Assignments</span>
                            <span>&gt;</span>
                            <span className="text-blue-600">Analytics</span>
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            Assignment Analytics
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Track submission rates and academic performance across classes and subjects.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className="bg-white border border-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="90d">Last 90 Days</option>
                        </select>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-xl hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* 4 Metric Cards Row (Screen 8) */}
                <div className="p-5 border-b border-slate-100 grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white">
                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-slate-500">Total Assignments</span>
                            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{overview.totalAssignments}</p>
                        </div>
                        <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                            Active
                        </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-slate-500">Submissions Rate</span>
                            <p className="text-2xl font-extrabold text-emerald-700 mt-0.5">{overview.submissionRate}%</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            ↑ 4%
                        </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-slate-500">Average Score</span>
                            <p className="text-2xl font-extrabold text-purple-700 mt-0.5">{overview.averageScore}%</p>
                        </div>
                        <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                            Grade B+
                        </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-slate-500">On-Time Submissions</span>
                            <p className="text-2xl font-extrabold text-amber-700 mt-0.5">{overview.onTimeRate}%</p>
                        </div>
                        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            ↑ 6%
                        </span>
                    </div>
                </div>

                {/* Charts Grid matching Screen 8 */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50/40">
                    {/* Donut Chart: Submission Status */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                        <h4 className="text-sm font-bold text-slate-900 mb-3">Submission Status</h4>
                        <div className="flex items-center justify-between gap-4">
                            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={donutData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={68}
                                            paddingAngle={3}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {donutData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                                    <span className="text-2xl font-extrabold text-slate-900 leading-none">124</span>
                                    <span className="text-[10px] text-slate-400 mt-0.5">Students</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-2 text-xs">
                                {donutData.map((d, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                                            <span className="font-semibold text-slate-700">{d.name}</span>
                                        </div>
                                        <span className="font-extrabold text-slate-900">
                                            {d.value} <span className="text-slate-400 font-normal">({d.percentage}%)</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bar Chart: Average Scores by Subject */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                        <h4 className="text-sm font-bold text-slate-900 mb-3">Average Scores by Subject</h4>
                        <div className="h-44 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={subjectScores} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                                    <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={22} fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Progress Bars: Class-wise Performance */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                        <h4 className="text-sm font-bold text-slate-900 mb-3">Class-wise Performance</h4>
                        <div className="space-y-3">
                            {classPerf.map((c, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs font-semibold">
                                        <span className="text-slate-700">{c.className}</span>
                                        <span className="text-blue-600 font-bold">{c.score}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                            style={{ width: `${c.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Line Chart: Submission Trends */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                        <h4 className="text-sm font-bold text-slate-900 mb-3">Submission Trend (Last 7 Days)</h4>
                        <div className="h-44 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                                    <Line type="monotone" dataKey="submitted" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                                    <Line type="monotone" dataKey="pending" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} />
                                    <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
