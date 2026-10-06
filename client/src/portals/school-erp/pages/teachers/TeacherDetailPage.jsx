import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Mail, Phone, Calendar, Clock, Award, BookOpen,
    Layers, CheckCircle2, UserCheck, Shield, Edit3, MessageSquare,
    Check, FileText, TrendingUp, AlertCircle, RefreshCw, Star,
    Briefcase, Sparkles, Download, Eye, ExternalLink
} from 'lucide-react';
import { useGetTeacherByIdQuery } from '../../../../store/api/peopleApi';
import TeacherScheduleGrid from './components/TeacherScheduleGrid';

export default function TeacherDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview'); // overview, subjects, schedule, attendance, performance, documents

    const { data: resData, isLoading, refetch } = useGetTeacherByIdQuery(id);
    const data = resData?.data;

    const user = data?.user || {
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@greenwood.edu.in',
        phone: '+91 98765 43210',
        profilePhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        isActive: true,
    };

    const profile = data?.profile || {
        employeeId: 'TCH001',
        department: 'Mathematics',
        designation: 'Mathematics Teacher',
        qualification: 'M.Sc. Mathematics, B.Ed.',
        experienceYears: 4,
        status: 'ACTIVE',
        joiningDate: '2022-04-12',
        address: { city: 'Noida', state: 'Uttar Pradesh' },
    };

    const metrics = data?.metrics || {
        feedbackRating: 4.8,
        reviewCount: 120,
        studentPassRate: 92.0,
        attendanceRate: 96.0,
    };

    if (isLoading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center text-slate-500 bg-white rounded-3xl border border-slate-200/90 shadow-2xs">
                <RefreshCw size={36} className="animate-spin text-blue-600 mb-3" />
                <p className="text-sm font-bold text-slate-800">Loading faculty 360° profile...</p>
                <p className="text-xs text-slate-500 mt-0.5">Fetching academic allocations, schedule, and attendance records</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-16">
            {/* ── Top Bar & Breadcrumb ────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/school/teachers')}
                        className="p-2.5 rounded-xl border border-slate-200/90 hover:bg-slate-50 text-slate-700 bg-white shadow-2xs cursor-pointer transition-colors"
                        title="Back to Teachers"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <span onClick={() => navigate('/school/teachers')} className="hover:text-blue-600 cursor-pointer">People</span>
                            <span>/</span>
                            <span onClick={() => navigate('/school/teachers')} className="hover:text-blue-600 cursor-pointer">Teachers Directory</span>
                            <span>/</span>
                            <span className="text-blue-600 font-extrabold">{user.firstName} {user.lastName}</span>
                        </div>
                        <h2 className="text-sm font-bold text-slate-800 mt-0.5">Faculty 360° Profile</h2>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-[11px] font-bold text-slate-500">Faculty ID:</span>
                    <span className="text-xs font-mono font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/80">
                        {profile.employeeId || 'TCH001'}
                    </span>
                </div>
            </div>

            {/* ── Teacher Header Hero Card ─────────────────────────────────── */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        <div className="relative shrink-0">
                            <img
                                src={user.profilePhotoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-md shrink-0"
                            />
                            <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Active Account">
                                <Check size={12} className="stroke-[3]" />
                            </span>
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                                    {user.firstName} {user.lastName}
                                </h1>
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Active Faculty
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                                    {profile.department || 'Mathematics'} Department
                                </span>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1.5">
                                {profile.designation || 'Mathematics Teacher'} • Qualification: <span className="text-slate-900 font-extrabold">{profile.qualification || 'M.Sc., B.Ed.'}</span>
                            </p>

                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs font-semibold text-slate-700">
                                <a
                                    href={`mailto:${user.email}`}
                                    className="flex items-center gap-1.5 text-slate-700 hover:text-blue-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                                >
                                    <Mail size={14} className="text-blue-600" />
                                    <span>{user.email}</span>
                                </a>
                                <a
                                    href={`tel:${user.phone}`}
                                    className="flex items-center gap-1.5 text-slate-700 hover:text-blue-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                                >
                                    <Phone size={14} className="text-emerald-600" />
                                    <span>{user.phone || '+91 98765 43210'}</span>
                                </a>
                                <span className="flex items-center gap-1.5 text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                                    <Calendar size={14} className="text-indigo-600" />
                                    <span>Joined 12 Apr 2022</span>
                                </span>
                                <span className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                                    <Award size={14} className="text-amber-600" />
                                    <span className="font-bold">{profile.experienceYears || 4}+ Years Exp.</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-start lg:self-center">
                        <button
                            type="button"
                            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                            <Edit3 size={14} />
                            <span>Edit Profile</span>
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                        >
                            <MessageSquare size={14} />
                            <span>Send Message</span>
                        </button>
                    </div>
                </div>

                {/* ── Segmented Navigation Tabs ───────────────────────────── */}
                <div className="flex items-center gap-2 border-t border-slate-200 mt-6 pt-3.5 overflow-x-auto text-xs font-bold">
                    {[
                        { id: 'overview', label: '360° Overview' },
                        { id: 'subjects', label: 'Subjects & Classes' },
                        { id: 'schedule', label: 'Weekly Timetable' },
                        { id: 'attendance', label: 'Faculty Attendance' },
                        { id: 'performance', label: 'Class Performance' },
                        { id: 'documents', label: 'Credentials & Documents' },
                    ].map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap font-extrabold ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Tab 1: Overview ─────────────────────────────────────────── */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Basic Information Card */}
                    <div className="lg:col-span-1 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-display">
                                Personal & Official Info
                            </h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                                Verified
                            </span>
                        </div>

                        <div className="space-y-3.5 text-xs">
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Full Name</span>
                                <span className="font-extrabold text-slate-900 text-sm">{user.firstName} {user.lastName}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Employee ID</span>
                                <span className="font-mono font-extrabold text-blue-700 text-sm">{profile.employeeId || 'TCH001'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Academic Department</span>
                                <span className="font-bold text-slate-800">{profile.department || 'Mathematics'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Highest Qualification</span>
                                <span className="font-bold text-slate-800">{profile.qualification || 'M.Sc. Mathematics, B.Ed.'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Date of Birth</span>
                                <span className="font-bold text-slate-800">15 Jun 1992 (34 yrs)</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Gender</span>
                                <span className="font-bold text-slate-800">Female</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Direct Phone</span>
                                <span className="font-bold text-slate-900">{user.phone || '+91 98765 43210'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Institutional Email</span>
                                <span className="font-bold text-blue-700">{user.email}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Residential Address</span>
                                <span className="font-bold text-slate-800">Sector 62, Noida, Uttar Pradesh 201309</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Appointment Date</span>
                                <span className="font-bold text-slate-800">12 Apr 2022</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Subjects Allocation & Performance */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Subjects & Classes Allocation */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-display">
                                    Assigned Subjects & Sections
                                </h3>
                                <span className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer">
                                    Manage Allocation →
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-extrabold text-slate-900 text-sm">Mathematics (Primary)</span>
                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-800">Class Lead</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                                            {['Class 6-A', 'Class 6-B', 'Class 7-A', 'Class 8-A', '+2 more'].map(c => (
                                                <span key={c} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/90 text-xs font-bold text-slate-800 shadow-2xs">
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-xs font-extrabold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-center">
                                        18 Periods / Week
                                    </span>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-extrabold text-slate-900 text-sm">Advanced Mathematics</span>
                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-100 text-purple-800">Elective Faculty</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                                            {['Class 9-A', 'Class 10-A'].map(c => (
                                                <span key={c} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/90 text-xs font-bold text-slate-800 shadow-2xs">
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-xs font-extrabold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-center">
                                        8 Periods / Week
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Performance Metric Cards */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-display pb-3 border-b border-slate-100">
                                Teaching Analytics & Feedback
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80">
                                    <span className="text-xs text-blue-900 font-extrabold">Student Exam Pass Rate</span>
                                    <div className="flex items-baseline gap-2 mt-1.5">
                                        <span className="text-2xl font-black text-slate-900 font-display">92.0%</span>
                                        <span className="text-xs font-bold text-emerald-700">↑ 3.2% vs school avg</span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-600 mt-1 block">Term examinations</span>
                                </div>

                                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                                    <span className="text-xs text-emerald-900 font-extrabold">Faculty Attendance Rate</span>
                                    <div className="flex items-baseline gap-2 mt-1.5">
                                        <span className="text-2xl font-black text-emerald-800 font-display">96.0%</span>
                                        <span className="text-xs font-bold text-emerald-700">Present</span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-600 mt-1 block">Consistent availability</span>
                                </div>

                                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                                    <span className="text-xs text-amber-900 font-extrabold">Student & Parent Rating</span>
                                    <div className="flex items-baseline gap-2 mt-1.5">
                                        <span className="text-2xl font-black text-slate-900 font-display">4.8 / 5</span>
                                        <span className="text-amber-600 font-bold">★★★★★</span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-600 mt-1 block">Based on 120 reviews</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Bar */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                            <span className="text-xs font-extrabold text-slate-900">Faculty Shortcuts:</span>
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('schedule')}
                                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs"
                                >
                                    View Weekly Timetable
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('attendance')}
                                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs"
                                >
                                    Attendance Register
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('subjects')}
                                    className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 cursor-pointer"
                                >
                                    Assign Section
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 2: Subjects & Classes ───────────────────────────────── */}
            {activeTab === 'subjects' && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900 font-display">Current Academic Allocations</h3>
                            <p className="text-xs text-slate-500 mt-0.5">All scheduled subjects, assigned sections, and role designations</p>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100 border border-slate-200/90 rounded-2xl overflow-hidden text-xs">
                        <div className="p-3.5 bg-slate-50 font-extrabold text-slate-700 uppercase tracking-wider text-[11px] grid grid-cols-4">
                            <span>Subject Name</span>
                            <span>Class & Section</span>
                            <span>Periods / Week</span>
                            <span>Faculty Role</span>
                        </div>
                        <div className="p-4 grid grid-cols-4 items-center hover:bg-slate-50/50 transition-colors">
                            <span className="font-extrabold text-slate-900">Mathematics</span>
                            <span className="font-bold text-slate-800">Class 6 - Section A</span>
                            <span className="font-bold text-slate-700">5 Periods / Week</span>
                            <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 w-fit">Class Teacher</span>
                        </div>
                        <div className="p-4 grid grid-cols-4 items-center hover:bg-slate-50/50 transition-colors">
                            <span className="font-extrabold text-slate-900">Mathematics</span>
                            <span className="font-bold text-slate-800">Class 6 - Section B</span>
                            <span className="font-bold text-slate-700">5 Periods / Week</span>
                            <span className="font-bold text-slate-600">Subject Faculty</span>
                        </div>
                        <div className="p-4 grid grid-cols-4 items-center hover:bg-slate-50/50 transition-colors">
                            <span className="font-extrabold text-slate-900">Advanced Mathematics</span>
                            <span className="font-bold text-slate-800">Class 9 - Section A</span>
                            <span className="font-bold text-slate-700">4 Periods / Week</span>
                            <span className="font-bold text-slate-600">Subject Faculty</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 3: Schedule ─────────────────────────────────────────── */}
            {activeTab === 'schedule' && (
                <TeacherScheduleGrid
                    teacherName={`${user.firstName} ${user.lastName}`}
                    scheduleSlots={data?.scheduleSlots || []}
                />
            )}

            {/* ── Tab 4: Attendance ───────────────────────────────────────── */}
            {activeTab === 'attendance' && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900 font-display">Faculty Attendance Register</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Cumulative monthly attendance data and leave status</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                            <span className="text-xs text-slate-600 font-extrabold uppercase tracking-wider">Total Working Days</span>
                            <div className="text-2xl font-black text-slate-900 mt-1 font-display">26</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                            <span className="text-xs text-emerald-800 font-extrabold uppercase tracking-wider">Days Present</span>
                            <div className="text-2xl font-black text-emerald-800 mt-1 font-display">25</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                            <span className="text-xs text-amber-800 font-extrabold uppercase tracking-wider">Leave Taken</span>
                            <div className="text-2xl font-black text-amber-800 mt-1 font-display">1</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                            <span className="text-xs text-blue-800 font-extrabold uppercase tracking-wider">Attendance Rate</span>
                            <div className="text-2xl font-black text-blue-800 mt-1 font-display">96.1%</div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 5: Performance ──────────────────────────────────────── */}
            {activeTab === 'performance' && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900 font-display">Student Performance & Feedback</h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                            Historical metrics across examinations for sections instructed by {user.firstName} {user.lastName}.
                        </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs flex items-center justify-between">
                        <span className="font-extrabold text-blue-950 text-sm">Term 1 Mathematics Pass Rate: 94.2%</span>
                        <span className="text-blue-800 font-extrabold bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-2xs">
                            Rank #2 in Department
                        </span>
                    </div>
                </div>
            )}

            {/* ── Tab 6: Documents ────────────────────────────────────────── */}
            {activeTab === 'documents' && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900 font-display">Verified Credentials & Documents</h3>
                        <p className="text-xs text-slate-500 mt-0.5">HR compliance and qualification verification status</p>
                    </div>
                    <div className="space-y-2.5">
                        <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <FileText size={18} className="text-blue-600" />
                                <span className="font-extrabold text-slate-900">Master Degree Certificate (M.Sc. Mathematics)</span>
                            </div>
                            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-200">
                                Verified
                            </span>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <FileText size={18} className="text-blue-600" />
                                <span className="font-extrabold text-slate-900">Bachelor of Education (B.Ed.) Degree</span>
                            </div>
                            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-200">
                                Verified
                            </span>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <FileText size={18} className="text-blue-600" />
                                <span className="font-extrabold text-slate-900">Aadhaar / National ID Card</span>
                            </div>
                            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-200">
                                Verified
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
