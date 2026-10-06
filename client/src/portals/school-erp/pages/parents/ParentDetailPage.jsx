import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Users, Phone, Mail, MapPin, Briefcase,
    ShieldCheck, Calendar, FileText, CheckCircle2, AlertCircle,
    GraduationCap, Clock, MessageSquare, Download, Share2,
    Eye, HeartHandshake, Award, BookOpen, Wallet, ChevronRight,
    Check, Sparkles, UserCheck, ShieldAlert
} from 'lucide-react';
import { useGetParentByIdQuery } from '../../../../store/api/peopleApi';

export default function ParentDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const { data: resData, isLoading, error } = useGetParentByIdQuery(id);

    const parent = resData?.data?.parent || {};
    const relations = resData?.data?.relations || [];
    const communications = resData?.data?.recentCommunications || [
        { id: '1', title: 'Q2 Tuition Fee Receipt Generated & E-mailed', time: '10:30 AM', date: 'Today', type: 'PAYMENT', channel: 'SMS & Email' },
        { id: '2', title: 'Term 1 Parent-Teacher Meeting Confirmation for Class 6-A', time: '02:15 PM', date: 'Yesterday', type: 'MEETING', channel: 'Portal App' },
        { id: '3', title: 'Mathematics Homework Incomplete Notice Sent to Guardian', time: '04:45 PM', date: '03 Oct 2026', type: 'HOMEWORK', channel: 'SMS' }
    ];

    if (isLoading) {
        return (
            <div className="py-24 flex items-center justify-center min-h-[400px] bg-white rounded-3xl border border-slate-200/90 shadow-2xs">
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm font-bold text-slate-800">Loading guardian 360° profile...</p>
                    <p className="text-xs text-slate-500">Retrieving student linkages and campus pickup permissions</p>
                </div>
            </div>
        );
    }

    if (error || !parent) {
        return (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs max-w-lg mx-auto mt-12">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                <h3 className="text-base font-extrabold text-slate-900">Guardian Record Not Found</h3>
                <p className="text-xs text-slate-600 mt-1">The requested guardian profile could not be loaded or has been archived.</p>
                <button
                    type="button"
                    onClick={() => navigate('/school/parents')}
                    className="mt-4 px-5 py-2.5 text-xs font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors cursor-pointer"
                >
                    Back to Parents Directory
                </button>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: '360° Overview', icon: Users },
        { id: 'children', label: `Enrolled Students (${relations.length})`, icon: GraduationCap },
        { id: 'communication', label: 'Communication Log', icon: MessageSquare },
        { id: 'ptm', label: 'PTM & Interactions', icon: Calendar },
        { id: 'documents', label: 'Documents & KYC', icon: FileText },
    ];

    const isAuthorized = parent.canPickupStudent !== false;

    return (
        <div className="space-y-6 pb-16">
            {/* ── Top Bar & Breadcrumb ────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={() => navigate('/school/parents')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-purple-700 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-2xs w-fit cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Parents Directory</span>
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500">Guardian ID:</span>
                    <span className="text-xs font-mono font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200/80">
                        {parent.parentId || 'PAR001'}
                    </span>
                </div>
            </div>

            {/* ── 360° Hero Profile Header ───────────────────────────────── */}
            <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-2xs relative overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-indigo-700 text-white font-black text-3xl sm:text-4xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                            {parent.fullName ? parent.fullName.charAt(0) : 'P'}
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                                    {parent.title || 'Mr.'} {parent.fullName}
                                </h1>
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider">
                                    {parent.relationship || 'Guardian'}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border flex items-center gap-1.5 ${
                                    parent.status === 'ACTIVE'
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                        : 'bg-rose-50 text-rose-800 border-rose-200'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${parent.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    {parent.status || 'ACTIVE'}
                                </span>
                            </div>

                            <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1.5 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-purple-600 shrink-0" />
                                <span>{parent.occupation || 'Professional'} • {parent.employer || 'Private Sector Enterprise'}</span>
                            </p>

                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs font-semibold text-slate-700">
                                <a
                                    href={`tel:${parent.phone}`}
                                    className="flex items-center gap-1.5 text-slate-700 hover:text-purple-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                                >
                                    <Phone className="w-3.5 h-3.5 text-purple-600" />
                                    <span>{parent.phone}</span>
                                </a>
                                {parent.email && (
                                    <a
                                        href={`mailto:${parent.email}`}
                                        className="flex items-center gap-1.5 text-slate-700 hover:text-purple-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                                    >
                                        <Mail className="w-3.5 h-3.5 text-indigo-600" />
                                        <span>{parent.email}</span>
                                    </a>
                                )}
                                <div className="flex items-center gap-1.5 text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                    <span>{parent.address?.city || 'Noida'}, {parent.address?.state || 'UP'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Pickup Auth Badge */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                        <div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold border ${
                            isAuthorized
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                            {isAuthorized ? (
                                <>
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    <span>Campus Authorized Pickup Contact</span>
                                </>
                            ) : (
                                <>
                                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                                    <span>Restricted Campus Pickup</span>
                                </>
                            )}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-500">
                            Registered with <strong className="text-slate-900 font-bold">{relations.length}</strong> enrolled student{relations.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-2 border-t border-slate-200 mt-6 pt-3.5 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                                    isActive
                                        ? 'bg-purple-600 text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── TAB 1: OVERVIEW ────────────────────────────────────────── */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Linked Children Cards */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-display">
                                    <GraduationCap className="w-4 h-4 text-purple-600" />
                                    Enrolled Children ({relations.length})
                                </h3>
                                <span className="text-xs text-slate-500 font-semibold">Active school linkages</span>
                            </div>

                            {relations.length === 0 ? (
                                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
                                    No students are currently linked to this parent profile.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {relations.map((rel) => {
                                        const stu = rel.studentId || {};
                                        return (
                                            <div
                                                key={rel._id || stu._id}
                                                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-purple-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                            >
                                                <div className="flex items-center gap-3.5">
                                                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 font-extrabold flex items-center justify-center shrink-0 text-base border border-purple-200">
                                                        {stu.photoUrl ? (
                                                            <img src={stu.photoUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                                                        ) : (
                                                            stu.firstName?.charAt(0) || 'S'
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-extrabold text-slate-900 text-sm">
                                                            {stu.firstName} {stu.lastName}
                                                        </h4>
                                                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1">
                                                            <span className="font-bold text-slate-800">
                                                                Class: {stu.classId?.name || 'Class 6'} - {stu.sectionId?.name || 'A'}
                                                            </span>
                                                            <span>•</span>
                                                            <span>Adm No: <strong className="text-slate-900 font-bold">{stu.admissionNo || 'STU001'}</strong></span>
                                                            <span>•</span>
                                                            <span>Roll: <strong className="text-slate-900 font-bold">{stu.rollNo || '12'}</strong></span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 self-start sm:self-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/school/students/${stu._id}`)}
                                                        className="px-3.5 py-2 text-xs font-bold text-purple-700 bg-white hover:bg-purple-50 border border-purple-200 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                                                    >
                                                        <Eye className="w-3.5 h-3.5 text-purple-600" />
                                                        <span>Student 360° Profile</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Recent Communication Log */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 shadow-2xs space-y-3">
                            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-display pb-3 border-b border-slate-100">
                                <MessageSquare className="w-4 h-4 text-purple-600" />
                                Recent Broadcasts & Messages
                            </h3>
                            <div className="space-y-2.5">
                                {communications.map((c) => (
                                    <div key={c.id} className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 border border-purple-200">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-900">{c.title}</div>
                                                <div className="text-[11px] font-medium text-slate-500 mt-0.5">{c.date} at {c.time} • via {c.channel}</div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                            Delivered
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Guardian Details & Address */}
                    <div className="space-y-4">
                        {/* Contact & Address Details */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 shadow-2xs space-y-4">
                            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-display pb-3 border-b border-slate-100">
                                Contact & Residential Address
                            </h3>

                            <div className="space-y-3 text-xs">
                                <div>
                                    <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Primary Mobile</span>
                                    <span className="font-extrabold text-slate-900 text-sm">{parent.phone || '+91 98765 43210'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Email Address</span>
                                    <span className="font-bold text-blue-700">{parent.email || 'Not registered'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Street Address</span>
                                    <span className="font-bold text-slate-800">{parent.address?.street || '12-A Civil Lines'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">City</span>
                                        <span className="font-bold text-slate-800">{parent.address?.city || 'Noida'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Pincode</span>
                                        <span className="font-mono font-bold text-slate-800">{parent.address?.pincode || '201301'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Employment & Profession */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 shadow-2xs space-y-4">
                            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-display pb-3 border-b border-slate-100">
                                Employment Background
                            </h3>

                            <div className="space-y-3 text-xs">
                                <div>
                                    <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Profession / Occupation</span>
                                    <span className="font-extrabold text-slate-900">{parent.occupation || 'Business Owner'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Organization / Employer</span>
                                    <span className="font-bold text-slate-800">{parent.employer || 'Private Enterprise'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Annual Income Bracket</span>
                                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">₹ 15,00,000 - 25,00,000</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── TAB 2: CHILDREN & ACADEMIC ──────────────────────────────── */}
            {activeTab === 'children' && (
                <div className="space-y-4">
                    {relations.map((rel) => {
                        const s = rel.studentId || {};
                        return (
                            <div key={rel._id} className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 shadow-2xs space-y-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-lg border border-purple-200">
                                            {s.firstName?.charAt(0) || 'S'}
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-slate-900 text-base">{s.firstName} {s.lastName}</h3>
                                            <div className="text-xs font-semibold text-slate-600 mt-0.5">
                                                Class {s.classId?.name || 'Class 6'} - Section {s.sectionId?.name || 'A'} • Admission No: <span className="text-slate-900 font-bold">{s.admissionNo || 'STU001'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/school/students/${s._id}`)}
                                        className="px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                                    >
                                        <span>Full Student Record</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                                        <span className="text-[11px] text-slate-500 block font-extrabold uppercase tracking-wider">Overall Attendance</span>
                                        <span className="text-lg font-black text-emerald-700 font-display mt-0.5 block">96.4%</span>
                                    </div>
                                    <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                                        <span className="text-[11px] text-slate-500 block font-extrabold uppercase tracking-wider">Outstanding Fee Dues</span>
                                        <span className="text-lg font-black text-slate-900 font-display mt-0.5 block">₹ 0 (Clear)</span>
                                    </div>
                                    <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                                        <span className="text-[11px] text-slate-500 block font-extrabold uppercase tracking-wider">Last Exam Grade</span>
                                        <span className="text-lg font-black text-purple-700 font-display mt-0.5 block">A+ (92.5%)</span>
                                    </div>
                                    <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                                        <span className="text-[11px] text-slate-500 block font-extrabold uppercase tracking-wider">Class Teacher</span>
                                        <span className="text-xs font-extrabold text-slate-900 mt-1 block">Mrs. Sunita Sharma</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── TAB 3: COMMUNICATION LOG ─────────────────────────────────── */}
            {activeTab === 'communication' && (
                <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 shadow-2xs space-y-4">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900 font-display">Parent Communication & Notification Log</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Historical record of messages and alerts dispatched to this guardian</p>
                    </div>
                    <div className="space-y-3">
                        {communications.map((c) => (
                            <div key={c.id} className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center font-bold">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-900">{c.title}</div>
                                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">{c.date} at {c.time} • Sent via {c.channel}</div>
                                    </div>
                                </div>
                                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                    Delivered
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── TAB 4: PTM & MEETINGS ────────────────────────────────────── */}
            {activeTab === 'ptm' && (
                <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 shadow-2xs space-y-4">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900 font-display">Parent-Teacher Meeting History</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Log of physical and virtual parent-faculty conferences</p>
                    </div>
                    <div className="space-y-3">
                        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <div className="text-xs font-bold text-slate-900">Mid-Term Academic Progress Review (Term 1)</div>
                                <div className="text-[11px] font-medium text-slate-600 mt-0.5">Attended with Class Teacher • Discussed Mathematics and Science performance</div>
                            </div>
                            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 self-start sm:self-auto">
                                Completed on 15 Sep 2026
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── TAB 5: DOCUMENTS & KYC ───────────────────────────────────── */}
            {activeTab === 'documents' && (
                <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 shadow-2xs space-y-4">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900 font-display">Verification & Identity Documents</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Approved guardian credentials and authorization cards</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-6 h-6 text-blue-600" />
                                <div>
                                    <div className="text-xs font-bold text-slate-900">Aadhaar / National Identity Document</div>
                                    <div className="text-[11px] font-medium text-slate-500">Verified KYC on student admission</div>
                                </div>
                            </div>
                            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                                Verified
                            </span>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-purple-600" />
                                <div>
                                    <div className="text-xs font-bold text-slate-900">Campus Pickup Authorization Pass</div>
                                    <div className="text-[11px] font-medium text-slate-500">Issued for Security Gate Access</div>
                                </div>
                            </div>
                            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
