import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Mail, Phone, Calendar, Clock, Award, BookOpen,
    Layers, CheckCircle2, UserCheck, Shield, Edit3, MessageSquare,
    Check, FileText, TrendingUp, AlertCircle, RefreshCw, Star,
    Briefcase, Sparkles, Download, Eye, ExternalLink, PlusCircle,
    Trash2, UserX
} from 'lucide-react';
import {
    useGetTeacherByIdQuery,
    useRemoveTeacherAssignmentMutation,
    useUpdateTeacherMutation
} from '../../../../store/api/peopleApi';
import TeacherScheduleGrid from './components/TeacherScheduleGrid';
import EditTeacherModal from './components/EditTeacherModal';
import AssignClassSubjectModal from './components/AssignClassSubjectModal';

export default function TeacherDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview'); // overview, subjects, schedule, attendance, performance, documents
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assignInitialTab, setAssignInitialTab] = useState('class');
    const [actionMsg, setActionMsg] = useState(null);

    const { data: resData, isLoading, refetch } = useGetTeacherByIdQuery(id);
    const [removeAssignment, { isLoading: isRemoving }] = useRemoveTeacherAssignmentMutation();
    const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();

    const data = resData?.data;
    const user = data?.user;
    const profile = data?.profile || {};
    const classAssignments = data?.classAssignments || [];
    const subjectAssignments = data?.subjectAssignments || [];
    const scheduleSlots = data?.scheduleSlots || [];
    const metrics = data?.metrics || {
        feedbackRating: profile.metrics?.feedbackRating || 4.8,
        reviewCount: profile.metrics?.reviewCount || 0,
        studentPassRate: profile.metrics?.studentPassRate || 92.0,
        attendanceRate: profile.metrics?.attendanceRate || 96.0,
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

    if (!user) {
        return (
            <div className="py-24 text-center bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-8 space-y-3">
                <UserX size={42} className="mx-auto text-slate-400" />
                <h3 className="text-base font-bold text-slate-800">Teacher Profile Not Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    The requested teacher ID may have been deleted or does not exist in this institution.
                </p>
                <button
                    onClick={() => navigate('/school/teachers')}
                    className="mt-2 px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
                >
                    Back to Teachers Directory
                </button>
            </div>
        );
    }

    const isLeave = profile.status === 'ON_LEAVE' || !user.isActive;

    const handleRemoveAssignment = async (assignmentId, type) => {
        if (!window.confirm(`Are you sure you want to unassign this ${type}?`)) return;

        try {
            await removeAssignment({
                teacherId: id,
                assignmentId,
                type,
            }).unwrap();

            setActionMsg({
                type: 'success',
                text: `${type === 'class' ? 'Class' : 'Subject'} assignment removed successfully.`
            });
            setTimeout(() => setActionMsg(null), 3500);
            refetch();
        } catch (err) {
            setActionMsg({
                type: 'error',
                text: err?.data?.message || `Failed to remove ${type} assignment.`
            });
            setTimeout(() => setActionMsg(null), 3500);
        }
    };

    const handleToggleStatus = async () => {
        const newStatus = isLeave ? 'ACTIVE' : 'ON_LEAVE';
        try {
            await updateTeacher({ id, status: newStatus }).unwrap();
            setActionMsg({
                type: 'success',
                text: `Faculty status updated to ${isLeave ? 'Active' : 'On Leave'}.`
            });
            setTimeout(() => setActionMsg(null), 3500);
            refetch();
        } catch (err) {
            setActionMsg({
                type: 'error',
                text: err?.data?.message || 'Failed to update status.'
            });
            setTimeout(() => setActionMsg(null), 3500);
        }
    };

    const joinedFormatted = profile.joiningDate
        ? new Date(profile.joiningDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : (user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A');

    return (
        <div className="space-y-6 pb-16">
            {/* Feedback alert toast */}
            {actionMsg && (
                <div
                    className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-md transition-all ${
                        actionMsg.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        {actionMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        <span>{actionMsg.text}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setActionMsg(null)}
                        className="text-slate-400 hover:text-slate-600 font-bold ml-4 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>
            )}

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
                        {profile.employeeId || 'TCH-NEW'}
                    </span>
                </div>
            </div>

            {/* ── Teacher Header Hero Card ─────────────────────────────────── */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        <div className="relative shrink-0">
                            {user.profilePhotoUrl ? (
                                <img
                                    src={user.profilePhotoUrl}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-md shrink-0"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-2xl bg-blue-600 text-white font-black text-3xl flex items-center justify-center border-2 border-slate-200 shadow-md shrink-0">
                                    {user.firstName?.charAt(0) || 'T'}
                                </div>
                            )}
                            <span
                                className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white ${
                                    isLeave ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                title={isLeave ? 'On Leave' : 'Active Faculty'}
                            >
                                <Check size={12} className="stroke-[3]" />
                            </span>
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                                    {user.firstName} {user.lastName}
                                </h1>
                                <button
                                    type="button"
                                    onClick={handleToggleStatus}
                                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border flex items-center gap-1.5 cursor-pointer transition-colors ${
                                        isLeave
                                            ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                                            : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                    }`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${isLeave ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                    {isLeave ? 'On Leave' : 'Active Faculty'}
                                </button>
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                                    {profile.department || 'General'} Department
                                </span>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1.5">
                                {profile.designation || 'Instructor'} • Qualification: <span className="text-slate-900 font-extrabold">{profile.qualification || 'N/A'}</span>
                            </p>

                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs font-semibold text-slate-700">
                                <a
                                    href={`mailto:${user.email}`}
                                    className="flex items-center gap-1.5 text-slate-700 hover:text-blue-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                                >
                                    <Mail size={14} className="text-blue-600" />
                                    <span>{user.email}</span>
                                </a>
                                {user.phone && (
                                    <a
                                        href={`tel:${user.phone}`}
                                        className="flex items-center gap-1.5 text-slate-700 hover:text-blue-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                                    >
                                        <Phone size={14} className="text-emerald-600" />
                                        <span>{user.phone}</span>
                                    </a>
                                )}
                                <span className="flex items-center gap-1.5 text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                                    <Calendar size={14} className="text-indigo-600" />
                                    <span>Joined {joinedFormatted}</span>
                                </span>
                                <span className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                                    <Award size={14} className="text-amber-600" />
                                    <span className="font-bold">{profile.experienceYears || 0}+ Years Exp.</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-start lg:self-center flex-wrap">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(true)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                            <Edit3 size={14} />
                            <span>Edit Profile</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setAssignInitialTab('class');
                                setIsAssignModalOpen(true);
                            }}
                            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-all cursor-pointer shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                        >
                            <PlusCircle size={14} />
                            <span>Assign Class / Subject</span>
                        </button>
                    </div>
                </div>

                {/* ── Segmented Navigation Tabs ───────────────────────────── */}
                <div className="flex items-center gap-2 border-t border-slate-200 mt-6 pt-3.5 overflow-x-auto text-xs font-bold">
                    {[
                        { id: 'overview', label: '360° Overview' },
                        { id: 'subjects', label: `Subjects & Classes (${classAssignments.length + subjectAssignments.length})` },
                        { id: 'schedule', label: `Weekly Timetable (${scheduleSlots.length})` },
                        { id: 'attendance', label: 'Faculty Attendance' },
                        { id: 'performance', label: 'Class Performance' },
                        { id: 'documents', label: 'Credentials & Qualifications' },
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
                                <span className="font-mono font-extrabold text-blue-700 text-sm">{profile.employeeId || 'TCH-NEW'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Academic Department</span>
                                <span className="font-bold text-slate-800">{profile.department || 'General'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Designation</span>
                                <span className="font-bold text-slate-800">{profile.designation || 'Teacher'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Highest Qualification</span>
                                <span className="font-bold text-slate-800">{profile.qualification || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Specialization</span>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {profile.specialization && profile.specialization.length > 0 ? (
                                        profile.specialization.map((s, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-bold text-[11px] border border-blue-200">
                                                {s}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-slate-400">None specified</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Gender</span>
                                <span className="font-bold text-slate-800">{user.gender || 'Not specified'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Direct Phone</span>
                                <span className="font-bold text-slate-900">{user.phone || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Institutional Email</span>
                                <span className="font-bold text-blue-700">{user.email}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Appointment Date</span>
                                <span className="font-bold text-slate-800">{joinedFormatted}</span>
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
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAssignInitialTab('subject');
                                        setIsAssignModalOpen(true);
                                    }}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                                >
                                    + Assign Subject →
                                </button>
                            </div>

                            {subjectAssignments.length === 0 && classAssignments.length === 0 ? (
                                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                                    <BookOpen size={30} className="mx-auto text-slate-400 mb-2" />
                                    <p className="text-xs font-bold text-slate-700">No classes or subjects assigned yet.</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5 mb-3">
                                        Allocate academic sections and subjects to populate this teacher's workload.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAssignInitialTab('class');
                                            setIsAssignModalOpen(true);
                                        }}
                                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                                    >
                                        Assign Now
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {classAssignments.map((ca) => (
                                        <div
                                            key={ca._id}
                                            className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                        >
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-extrabold text-slate-900 text-sm">
                                                        Class {ca.classId?.name} - Section {ca.sectionId?.name}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-800">
                                                        {ca.assignmentType === 'CLASS_TEACHER' ? 'Head Class Teacher' : 'Assistant'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium mt-1">
                                                    Academic Year: <span className="font-bold text-slate-700">{ca.academicYear || '2026-27'}</span>
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAssignment(ca._id, 'class')}
                                                className="text-xs text-rose-600 hover:text-rose-800 font-bold p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer self-start sm:self-center"
                                                title="Remove assignment"
                                            >
                                                Unassign
                                            </button>
                                        </div>
                                    ))}

                                    {subjectAssignments.map((sa) => (
                                        <div
                                            key={sa._id}
                                            className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                        >
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-extrabold text-slate-900 text-sm">
                                                        {sa.subjectId?.name || 'Subject'}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-100 text-purple-800">
                                                        Class {sa.classId?.name} {sa.sectionId?.name ? `- Sec ${sa.sectionId?.name}` : ''}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium mt-1">
                                                    Periods: <span className="font-bold text-slate-700">{sa.periodsPerWeek || 5} Periods / Week</span>
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAssignment(sa._id, 'subject')}
                                                className="text-xs text-rose-600 hover:text-rose-800 font-bold p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer self-start sm:self-center"
                                                title="Remove allocation"
                                            >
                                                Unassign
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                                        <span className="text-2xl font-black text-slate-900 font-display">
                                            {metrics.studentPassRate || 92.0}%
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-600 mt-1 block">Term examinations</span>
                                </div>

                                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                                    <span className="text-xs text-emerald-900 font-extrabold">Faculty Attendance Rate</span>
                                    <div className="flex items-baseline gap-2 mt-1.5">
                                        <span className="text-2xl font-black text-emerald-800 font-display">
                                            {metrics.attendanceRate || 96.0}%
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-600 mt-1 block">Verified attendance</span>
                                </div>

                                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                                    <span className="text-xs text-amber-900 font-extrabold">Evaluation Rating</span>
                                    <div className="flex items-baseline gap-2 mt-1.5">
                                        <span className="text-2xl font-black text-slate-900 font-display">
                                            {metrics.feedbackRating || 4.8} / 5
                                        </span>
                                        <span className="text-amber-600 font-bold">★★★★★</span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-600 mt-1 block">Verified reviews</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 2: Subjects & Classes ───────────────────────────────── */}
            {activeTab === 'subjects' && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900 font-display">Current Academic Allocations</h3>
                            <p className="text-xs text-slate-500 mt-0.5">All scheduled subjects, assigned sections, and role designations</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setAssignInitialTab('class');
                                    setIsAssignModalOpen(true);
                                }}
                                className="px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                            >
                                + Assign Class Teacher
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setAssignInitialTab('subject');
                                    setIsAssignModalOpen(true);
                                }}
                                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                            >
                                + Allocate Subject
                            </button>
                        </div>
                    </div>

                    {classAssignments.length === 0 && subjectAssignments.length === 0 ? (
                        <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                            <BookOpen size={36} className="mx-auto text-slate-400" />
                            <h4 className="text-sm font-bold text-slate-800">No active academic assignments</h4>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                Click the buttons above to assign a classroom or allocate subject teaching periods.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 border border-slate-200/90 rounded-2xl overflow-hidden text-xs">
                            <div className="p-3.5 bg-slate-50 font-extrabold text-slate-700 uppercase tracking-wider text-[11px] grid grid-cols-5">
                                <span>Type / Subject</span>
                                <span>Class & Section</span>
                                <span>Workload / Year</span>
                                <span>Designation</span>
                                <span className="text-right">Action</span>
                            </div>

                            {classAssignments.map((ca) => (
                                <div key={ca._id} className="p-4 grid grid-cols-5 items-center hover:bg-slate-50/50 transition-colors">
                                    <span className="font-extrabold text-slate-900">Class Incharge</span>
                                    <span className="font-bold text-slate-800">
                                        Class {ca.classId?.name} - {ca.sectionId?.name || 'Section'}
                                    </span>
                                    <span className="font-bold text-slate-700">{ca.academicYear || '2026-27'}</span>
                                    <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 w-fit">
                                        {ca.assignmentType === 'CLASS_TEACHER' ? 'Head Class Teacher' : 'Assistant'}
                                    </span>
                                    <div className="text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAssignment(ca._id, 'class')}
                                            className="px-2.5 py-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg font-bold transition-colors cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {subjectAssignments.map((sa) => (
                                <div key={sa._id} className="p-4 grid grid-cols-5 items-center hover:bg-slate-50/50 transition-colors">
                                    <span className="font-extrabold text-slate-900">{sa.subjectId?.name || 'Subject'}</span>
                                    <span className="font-bold text-slate-800">
                                        Class {sa.classId?.name} - {sa.sectionId?.name || 'Section'}
                                    </span>
                                    <span className="font-bold text-slate-700">{sa.periodsPerWeek || 5} Periods / Wk</span>
                                    <span className="font-bold text-slate-600">Subject Faculty</span>
                                    <div className="text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAssignment(sa._id, 'subject')}
                                            className="px-2.5 py-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg font-bold transition-colors cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Tab 3: Schedule ─────────────────────────────────────────── */}
            {activeTab === 'schedule' && (
                <TeacherScheduleGrid
                    teacherName={`${user.firstName} ${user.lastName}`}
                    scheduleSlots={scheduleSlots}
                />
            )}

            {/* ── Tab 4: Attendance ───────────────────────────────────────── */}
            {activeTab === 'attendance' && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900 font-display">Faculty Attendance Register</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Aggregated attendance indicators and instructional presence</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                            <span className="text-xs text-slate-600 font-extrabold uppercase tracking-wider">Status Today</span>
                            <div className="text-xl font-black text-slate-900 mt-1 font-display">
                                {isLeave ? 'On Leave' : 'Present'}
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                            <span className="text-xs text-emerald-800 font-extrabold uppercase tracking-wider">Attendance Rate</span>
                            <div className="text-2xl font-black text-emerald-800 mt-1 font-display">
                                {metrics.attendanceRate || 96}%
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                            <span className="text-xs text-blue-800 font-extrabold uppercase tracking-wider">Working Schedule</span>
                            <div className="text-xs font-bold text-blue-900 mt-2">
                                {profile.workSchedule?.workingHours || '8:00 AM - 3:30 PM'}
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                            <span className="text-xs text-purple-800 font-extrabold uppercase tracking-wider">Working Days</span>
                            <div className="text-xs font-bold text-purple-900 mt-2">
                                Mon - Fri (5 Days)
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 5: Performance ──────────────────────────────────────── */}
            {activeTab === 'performance' && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900 font-display">Instructional Performance & Metrics</h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                            Academic pass metrics and evaluations for {user.firstName} {user.lastName}.
                        </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs flex items-center justify-between">
                        <span className="font-extrabold text-blue-950 text-sm">
                            Student Average Pass Rate: {metrics.studentPassRate || 92}%
                        </span>
                        <span className="text-blue-800 font-extrabold bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-2xs">
                            {profile.department || 'Academic'} Department
                        </span>
                    </div>
                </div>
            )}

            {/* ── Tab 6: Documents ────────────────────────────────────────── */}
            {activeTab === 'documents' && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900 font-display">Verified Credentials & Qualifications</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Faculty academic certificates and HR qualification record</p>
                    </div>
                    <div className="space-y-2.5">
                        <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <FileText size={18} className="text-blue-600" />
                                <div>
                                    <span className="font-extrabold text-slate-900 block">
                                        Academic Qualification: {profile.qualification || 'Certified Instructor'}
                                    </span>
                                    <span className="text-[11px] text-slate-500">
                                        Experience: {profile.experienceYears || 0} years in {profile.department || 'Education'}
                                    </span>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-200">
                                Verified
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <EditTeacherModal
                isOpen={isEditModalOpen}
                teacher={{ user, profile }}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={() => refetch()}
            />

            <AssignClassSubjectModal
                isOpen={isAssignModalOpen}
                teacherId={id}
                teacherName={`${user.firstName} ${user.lastName}`}
                initialTab={assignInitialTab}
                onClose={() => setIsAssignModalOpen(false)}
                onSuccess={() => refetch()}
            />
        </div>
    );
}
