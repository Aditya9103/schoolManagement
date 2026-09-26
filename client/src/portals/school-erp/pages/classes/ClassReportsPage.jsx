import React, { useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    Layers,
    Download,
    Printer,
    CheckCircle2,
    Calendar,
    ArrowUpRight,
} from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import {
    useGetClassReportsQuery,
    useGetClassesQuery,
} from '../../../../store/api/classApi';

const REPORT_TABS = [
    'Class Strength',
    'Section Report',
    'Gender Distribution',
    'Subject Load',
    'Enrollment Trends',
];

const DONUT_COLORS = ['#3B82F6', '#6366F1', '#38BDF8', '#10B981', '#F59E0B'];

export default function ClassReportsPage() {
    const { data: classesRes } = useGetClassesQuery();
    const classes = classesRes?.data || [];

    const [selectedClassId, setSelectedClassId] = useState(classes[0]?._id || '');
    const [selectedTab, setSelectedTab] = useState('Class Strength');

    const activeClass = classes.find((c) => c._id === selectedClassId) || classes[0];

    const { data: reportsRes, isLoading } = useGetClassReportsQuery(
        { classId: activeClass?._id },
        { skip: !activeClass?._id }
    );
    const reports = reportsRes?.data || {
        enrollmentTrend: [
            { month: 'Apr', enrolled: 68, capacity: 90 },
            { month: 'May', enrolled: 72, capacity: 90 },
            { month: 'Jun', enrolled: 74, capacity: 90 },
            { month: 'Jul', enrolled: 75, capacity: 90 },
            { month: 'Aug', enrolled: 78, capacity: 90 },
            { month: 'Sep', enrolled: 78, capacity: 90 },
        ],
        sectionWiseDistribution: [
            { name: 'Section A', count: 28, capacity: 30 },
            { name: 'Section B', count: 26, capacity: 30 },
            { name: 'Section C', count: 24, capacity: 30 },
        ],
        subjectPeriodsLoad: [
            { subject: 'Math', periods: 6 },
            { subject: 'English', periods: 6 },
            { subject: 'EVS', periods: 5 },
            { subject: 'Hindi', periods: 5 },
            { subject: 'Computer', periods: 4 },
            { subject: 'Art', periods: 3 },
            { subject: 'PE', periods: 3 },
            { subject: 'Library', periods: 2 },
        ],
        totalEnrolled: 78,
        totalCapacity: 90,
    };

    const occupancyPct = reports.totalCapacity > 0 ? Math.round(((reports.totalEnrolled || 0) / reports.totalCapacity) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <BarChart3 size={22} />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Academic Analytics & Class Reports</h2>
                        <p className="text-xs text-slate-700 font-medium">Student enrollment trends, capacity distribution and curriculum workload</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {classes.length > 0 && (
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                        >
                            {classes.map((c) => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    )}

                    <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                    >
                        <Printer size={14} />
                        <span>Print</span>
                    </button>
                    <button
                        onClick={() => alert('Exporting report as CSV...')}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                    >
                        <Download size={14} />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-xs font-semibold text-slate-700 font-medium uppercase">Enrolled Students</p>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">{reports.totalEnrolled}</h3>
                    <p className="text-[11px] text-emerald-700 font-bold font-semibold mt-0.5">
                        {reports.totalCapacity} Max Capacity ({occupancyPct}%)
                    </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-xs font-semibold text-slate-700 font-medium uppercase">Average Attendance</p>
                    <h3 className="text-2xl font-black text-blue-600 mt-1">94.2%</h3>
                    <p className="text-[11px] text-slate-600 font-semibold mt-0.5">+1.8% from last month</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-xs font-semibold text-slate-700 font-medium uppercase">Teacher-Student Ratio</p>
                    <h3 className="text-2xl font-black text-indigo-600 mt-1">1 : 18</h3>
                    <p className="text-[11px] text-slate-600 font-semibold mt-0.5">Ideal pedagogic threshold</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-xs font-semibold text-slate-700 font-medium uppercase">Total Divisions</p>
                    <h3 className="text-2xl font-black text-purple-700 font-bold mt-1">{reports.sectionWiseDistribution?.length || 3} Sections</h3>
                    <p className="text-[11px] text-slate-600 font-semibold mt-0.5">Under {activeClass?.name || 'Class'}</p>
                </div>
            </div>

            {/* Report Sub-Tabs */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-1 overflow-x-auto scrollbar-none">
                {REPORT_TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                            selectedTab === tab
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Enrollment Growth Trend */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Monthly Enrollment Trend</h3>
                            <p className="text-xs text-slate-700 font-medium">Students enrolled vs maximum capacity over academic session</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                            2026-27 Session
                        </span>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reports.enrollmentTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                <Bar dataKey="enrolled" name="Enrolled" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="capacity" name="Max Capacity" fill="#E2E8F0" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Section-wise Donut Distribution */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Section-wise Distribution</h3>
                            <p className="text-xs text-slate-700 font-medium">Division balance and strength allocation</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            Balanced
                        </span>
                    </div>

                    <div className="h-64 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={reports.sectionWiseDistribution}
                                    dataKey="count"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={5}
                                >
                                    {reports.sectionWiseDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Subject Load Horizontal Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Weekly Subject Period Loads</h3>
                        <p className="text-xs text-slate-700 font-medium">Scheduled classroom teaching periods per subject in weekly timetable</p>
                    </div>
                    <span className="text-xs font-bold text-blue-600">34 Total Periods / Week</span>
                </div>

                <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={reports.subjectPeriodsLoad}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                            <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="subject" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                            />
                            <Bar dataKey="periods" name="Periods per Week" fill="#6366F1" radius={[0, 6, 6, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
