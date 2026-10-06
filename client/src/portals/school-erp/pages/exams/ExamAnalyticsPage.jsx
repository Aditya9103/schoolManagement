import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    BarChart3,
    PieChart as PieIcon,
    TrendingUp,
    Award,
    Sparkles,
    Calendar,
    Users,
    CheckCircle2,
    Download,
    Filter,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend,
} from 'recharts';
import toast from 'react-hot-toast';
import { generateAnalyticsPdf } from '../../../../utils/pdfGenerator';

const CLASS_PERFORMANCE_DATA = [
    { class: 'Class 1', avg: 84.5, passRate: 98 },
    { class: 'Class 2', avg: 82.1, passRate: 96 },
    { class: 'Class 3', avg: 79.4, passRate: 95 },
    { class: 'Class 4', avg: 81.0, passRate: 94 },
    { class: 'Class 5', avg: 77.8, passRate: 92 },
    { class: 'Class 6', avg: 76.5, passRate: 91 },
    { class: 'Class 7', avg: 78.9, passRate: 93 },
    { class: 'Class 8', avg: 75.2, passRate: 90 },
    { class: 'Class 9', avg: 74.0, passRate: 88 },
    { class: 'Class 10', avg: 78.6, passRate: 92 },
    { class: 'Class 11', avg: 71.5, passRate: 86 },
    { class: 'Class 12', avg: 76.8, passRate: 91 },
];

const GRADE_DISTRIBUTION_DATA = [
    { name: 'A1 (91-100%)', value: 12, color: '#2563eb' },
    { name: 'A2 (81-90%)', value: 14, color: '#3b82f6' },
    { name: 'B1 (71-80%)', value: 10, color: '#10b981' },
    { name: 'B2 (61-70%)', value: 6, color: '#f59e0b' },
    { name: 'C1 (51-60%)', value: 4, color: '#8b5cf6' },
    { name: 'C2 (41-50%)', value: 1, color: '#ec4899' },
    { name: 'D (33-40%)', value: 1, color: '#f97316' },
];

const SUBJECT_COMPARISON_DATA = [
    { subject: 'Mathematics', avgScore: 82.4, highest: 98, passRate: 94 },
    { subject: 'Science', avgScore: 78.6, highest: 95, passRate: 91 },
    { subject: 'English', avgScore: 81.2, highest: 94, passRate: 96 },
    { subject: 'Social Science', avgScore: 79.8, highest: 96, passRate: 93 },
    { subject: 'Hindi', avgScore: 84.1, highest: 96, passRate: 98 },
    { subject: 'Computer', avgScore: 86.5, highest: 100, passRate: 97 },
];

export default function ExamAnalyticsPage() {
    const navigate = useNavigate();

    const [selectedExam, setSelectedExam] = useState('Half Yearly Examination');
    const [selectedClass, setSelectedClass] = useState('Class 10');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [activeTab, setActiveTab] = useState('Class Performance');

    return (
        <div className="space-y-6">
            {/* Header matching Screen 11 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                        <span>Academic</span>
                        <span>&gt;</span>
                        <span>Exams & Results</span>
                        <span>&gt;</span>
                        <span className="text-blue-600">Exam Analytics</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                            Exam Analytics
                        </h1>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                            <Sparkles className="w-3.5 h-3.5" /> Realtime Insights
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Detailed performance metrics, grade distributions and cohort comparative analytics.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => navigate('/school/exams')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => generateAnalyticsPdf(selectedExam, selectedClass)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export Analytics</span>
                    </button>
                </div>
            </div>

            {/* Filter Bar matching Screen 11 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div>
                        <span className="text-xs font-bold text-slate-500 mr-2">Exam:</span>
                        <select
                            value={selectedExam}
                            onChange={(e) => setSelectedExam(e.target.value)}
                            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none cursor-pointer"
                        >
                            <option value="Half Yearly Examination">Half Yearly Examination</option>
                            <option value="Unit Test 1">Unit Test 1</option>
                            <option value="Unit Test 2">Unit Test 2</option>
                            <option value="Pre-Board Exam">Pre-Board Exam</option>
                        </select>
                    </div>

                    <div>
                        <span className="text-xs font-bold text-slate-500 mr-2">Class:</span>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none cursor-pointer"
                        >
                            <option value="Class 10">Class 10</option>
                            <option value="Class 9">Class 9</option>
                            <option value="Class 8">Class 8</option>
                            <option value="Class 7">Class 7</option>
                            <option value="Class 6">Class 6</option>
                        </select>
                    </div>

                    <div>
                        <span className="text-xs font-bold text-slate-500 mr-2">Subject:</span>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none cursor-pointer"
                        >
                            <option value="all">All Subjects</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Science">Science</option>
                            <option value="English">English</option>
                            <option value="Social Science">Social Science</option>
                            <option value="Hindi">Hindi</option>
                        </select>
                    </div>
                </div>

                {/* Tabs matching Screen 11 */}
                <div className="flex items-center gap-1 overflow-x-auto">
                    {['Class Performance', 'Subject Analysis', 'Grade Distribution', 'Pass/Fail Trend'].map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setActiveTab(t)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                activeTab === t
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Visual Analytics Content matching Screen 11 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Primary Chart (7 cols) */}
                <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900">
                                {activeTab === 'Class Performance' && 'Class-wise Average Percentage'}
                                {activeTab === 'Subject Analysis' && 'Subject-wise Performance & Pass Rate'}
                                {activeTab === 'Grade Distribution' && 'Grade Tier Cohort Breakdown'}
                                {activeTab === 'Pass/Fail Trend' && 'Pass Rate Trend Across Classes'}
                            </h3>
                            <p className="text-xs text-slate-400">
                                Aggregated evaluation results across enrolled students
                            </p>
                        </div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                            2026 - 27
                        </span>
                    </div>

                    <div className="h-72 w-full pt-4">
                        {activeTab === 'Class Performance' && (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={CLASS_PERFORMANCE_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="class" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                                        formatter={(val) => [`${val}%`, 'Average']}
                                    />
                                    <Bar dataKey="avg" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}

                        {activeTab === 'Subject Analysis' && (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={SUBJECT_COMPARISON_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                                    />
                                    <Bar dataKey="avgScore" fill="#2563eb" name="Avg Score %" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="passRate" fill="#10b981" name="Pass Rate %" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}

                        {activeTab === 'Grade Distribution' && (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={GRADE_DISTRIBUTION_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                                    />
                                    <Bar dataKey="value" fill="#8b5cf6" name="Students" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}

                        {activeTab === 'Pass/Fail Trend' && (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={CLASS_PERFORMANCE_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="class" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis domain={[70, 100]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                                    />
                                    <Line type="monotone" dataKey="passRate" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Pass Rate %" />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Right: Grade Distribution Donut Chart matching Screen 11 (5 cols) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900">Grade Distribution</h3>
                            <p className="text-xs text-slate-400">Total 48 Students in Class 10</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                            91.7% Pass
                        </span>
                    </div>

                    <div className="h-56 relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={GRADE_DISTRIBUTION_DATA}
                                    innerRadius={65}
                                    outerRadius={88}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {GRADE_DISTRIBUTION_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-black text-slate-900">48</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Students</span>
                        </div>
                    </div>

                    {/* Donut Legend */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                        {GRADE_DISTRIBUTION_DATA.slice(0, 4).map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-slate-600 truncate text-[11px]">{item.name}:</span>
                                <strong className="text-slate-900 ml-auto">{item.value}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Key Insights Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-5 rounded-3xl border border-blue-100">
                    <span className="text-xs font-bold text-blue-700 uppercase">Strongest Subject</span>
                    <div className="text-lg font-extrabold text-slate-900 mt-1">Computer & Math</div>
                    <p className="text-xs text-slate-500 mt-1">Average cohort score above 84% with 0 failing grades.</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-5 rounded-3xl border border-amber-100">
                    <span className="text-xs font-bold text-amber-700 uppercase">Needs Focus Area</span>
                    <div className="text-lg font-extrabold text-slate-900 mt-1">Natural Science</div>
                    <p className="text-xs text-slate-500 mt-1">4 students scored marginal pass marks in practical inquiry.</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-5 rounded-3xl border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-700 uppercase">Cohort Distinction</span>
                    <div className="text-lg font-extrabold text-slate-900 mt-1">26 Distinction Holders</div>
                    <p className="text-xs text-slate-500 mt-1">54.2% of Class 10 secured aggregate marks &gt; 80%.</p>
                </div>
            </div>
        </div>
    );
}
