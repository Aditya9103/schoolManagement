import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Mail, Phone, Calendar, Clock, Award, Briefcase,
    CheckCircle2, AlertCircle, RefreshCw, FileText, CheckSquare, Square,
    DollarSign, ShieldAlert, Lock, Edit3, MessageSquare, Check,
    Building2, UserCheck, ShieldCheck
} from 'lucide-react';
import { useGetStaffByIdQuery, useGetStaffPayrollQuery } from '../../../../store/api/peopleApi';
import usePermissions from '../../../../hooks/usePermissions';

export default function StaffDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin, hasAction } = usePermissions();

    const [activeTab, setActiveTab] = useState('overview'); // overview, attendance, documents, leave, salary, tasks

    const { data: resData, isLoading } = useGetStaffByIdQuery(id);
    const data = resData?.data;

    const canViewSalary = isAdmin || hasAction('staff_management', 'edit');
    const { data: payrollData, isLoading: payrollLoading } = useGetStaffPayrollQuery(id, {
        skip: !canViewSalary,
    });

    const user = data?.user || {
        firstName: 'Suresh',
        lastName: 'Kumar',
        email: 'suresh.kumar@greenwood.edu.in',
        phone: '+91 98765 43210',
        profilePhotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
        isActive: true,
    };

    const profile = data?.profile || {
        employeeId: 'STF001',
        department: 'Administration',
        designation: 'Accountant',
        qualification: 'B.Com',
        experienceYears: 5,
        status: 'ACTIVE',
        joiningDate: '2021-03-10',
        shiftTiming: '9:00 AM - 5:00 PM',
    };

    const [tasks, setTasks] = useState([
        { id: 1, title: 'Manage student fee receipts and ledger records', completed: true },
        { id: 2, title: 'Generate monthly institutional financial reports', completed: true },
        { id: 3, title: 'Audit administrative expense bills and petty cash', completed: false },
        { id: 4, title: 'Maintain supplier invoicing and tax compliance records', completed: false },
    ]);

    const toggleTask = (taskId) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
        );
    };

    if (isLoading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center text-slate-500 bg-white rounded-3xl border border-slate-200/90 shadow-2xs">
                <RefreshCw size={36} className="animate-spin text-blue-600 mb-3" />
                <p className="text-sm font-bold text-slate-800">Loading staff 360° profile...</p>
                <p className="text-xs text-slate-500 mt-0.5">Retrieving staff employment credentials and duty allocations</p>
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
                        onClick={() => navigate('/school/staff')}
                        className="p-2.5 rounded-xl border border-slate-200/90 hover:bg-slate-50 text-slate-700 bg-white shadow-2xs cursor-pointer transition-colors"
                        title="Back to Staff"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <span onClick={() => navigate('/school/staff')} className="hover:text-blue-600 cursor-pointer">People</span>
                            <span>/</span>
                            <span onClick={() => navigate('/school/staff')} className="hover:text-blue-600 cursor-pointer">Staff Management</span>
                            <span>/</span>
                            <span className="text-blue-600 font-extrabold">{user.firstName} {user.lastName}</span>
                        </div>
                        <h2 className="text-sm font-bold text-slate-800 mt-0.5">Staff 360° Profile</h2>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-[11px] font-bold text-slate-500">Staff ID:</span>
                    <span className="text-xs font-mono font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/80">
                        {profile.employeeId || 'STF001'}
                    </span>
                </div>
            </div>

            {/* ── Staff Header Hero Card ───────────────────────────────────── */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        <div className="relative shrink-0">
                            <img
                                src={user.profilePhotoUrl || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80'}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-md shrink-0"
                            />
                            <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Active Employee">
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
                                    Active Staff
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                                    {profile.department || 'Administration'} Department
                                </span>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1.5">
                                {profile.designation || 'Accountant'} • Qualification: <span className="text-slate-900 font-extrabold">{profile.qualification || 'B.Com'}</span>
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
                                    <span>Joined 10 Mar 2021</span>
                                </span>
                                <span className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                                    <Award size={14} className="text-amber-600" />
                                    <span className="font-bold">{profile.experienceYears || 5}+ Years Exp.</span>
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
                            <span>Actions</span>
                        </button>
                    </div>
                </div>

                {/* ── Segmented Navigation Tabs ───────────────────────────── */}
                <div className="flex items-center gap-2 border-t border-slate-200 mt-6 pt-3.5 overflow-x-auto text-xs font-bold">
                    {[
                        { id: 'overview', label: '360° Overview' },
                        { id: 'attendance', label: 'Staff Attendance' },
                        { id: 'documents', label: 'KYC & Documents' },
                        { id: 'leave', label: 'Leave Balance' },
                        { id: 'salary', label: 'Salary & Payroll' },
                        { id: 'tasks', label: 'Assigned Duties' },
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
                    {/* Left: Basic Information */}
                    <div className="lg:col-span-1 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-display">
                                Personal & Official Info
                            </h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                                Verified Staff
                            </span>
                        </div>

                        <div className="space-y-3.5 text-xs">
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Full Name</span>
                                <span className="font-extrabold text-slate-900 text-sm">{user.firstName} {user.lastName}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Employee ID</span>
                                <span className="font-mono font-extrabold text-blue-700 text-sm">{profile.employeeId || 'STF001'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Department</span>
                                <span className="font-bold text-slate-800">{profile.department || 'Administration'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Designation / Role</span>
                                <span className="font-bold text-slate-800">{profile.designation || 'Accountant'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Qualification</span>
                                <span className="font-bold text-slate-800">{profile.qualification || 'B.Com'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Date of Birth</span>
                                <span className="font-bold text-slate-800">12 Aug 1988 (38 yrs)</span>
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
                                <span className="font-bold text-slate-800">Ghaziabad, Uttar Pradesh 201001</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Appointment Date</span>
                                <span className="font-bold text-slate-800">10 Mar 2021</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Work Details & Assigned Tasks */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Work Details Card */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-display pb-3 border-b border-slate-100">
                                Institutional Work Parameters
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                                    <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block">Standard Working Shift</span>
                                    <span className="font-extrabold text-slate-900 text-sm mt-1 block">9:00 AM – 5:00 PM</span>
                                    <span className="text-[11px] text-slate-500 mt-0.5 block">Monday through Saturday</span>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                                    <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block">Reporting Authority</span>
                                    <span className="font-extrabold text-blue-700 text-sm mt-1 block">School Principal</span>
                                    <span className="text-[11px] text-slate-500 mt-0.5 block">Administrative Office</span>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                                    <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block">Monthly Gross Salary</span>
                                    <span className="font-extrabold text-slate-900 text-sm mt-1 block">
                                        {canViewSalary ? '₹35,000 / month' : '•••••••• (Confidential)'}
                                    </span>
                                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                                        {canViewSalary ? 'Direct Bank Disbursal' : 'Requires payroll permission'}
                                    </span>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                                    <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block">Employment Contract</span>
                                    <span className="font-extrabold text-slate-900 text-sm mt-1 block">Permanent Full Time</span>
                                    <span className="text-[11px] text-emerald-700 font-bold mt-0.5 block">Probation Completed</span>
                                </div>
                            </div>
                        </div>

                        {/* Assigned Tasks Card */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-display">
                                    Operational Tasks & Daily Duties
                                </h3>
                                <span className="text-xs text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                                    {tasks.filter(t => t.completed).length} of {tasks.length} Completed
                                </span>
                            </div>

                            <div className="space-y-2.5">
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        onClick={() => toggleTask(task.id)}
                                        className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer text-xs ${
                                            task.completed
                                                ? 'bg-slate-50/60 border-slate-200 text-slate-500 line-through'
                                                : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300 shadow-2xs'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {task.completed ? (
                                                <CheckSquare size={18} className="text-blue-600 shrink-0" />
                                            ) : (
                                                <Square size={18} className="text-slate-400 shrink-0" />
                                            )}
                                            <span className={`font-bold ${task.completed ? 'text-slate-500' : 'text-slate-900'}`}>{task.title}</span>
                                        </div>
                                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                                            Daily
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab 5: Salary & Payroll (Isolated Security) ────────────────── */}
            {activeTab === 'salary' && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900 font-display">Salary Structure & Payroll</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Isolated compensation record with strict role-based access</p>
                        </div>
                        {canViewSalary && (
                            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-200">
                                Authorized Access
                            </span>
                        )}
                    </div>

                    {!canViewSalary ? (
                        <div className="p-10 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-3">
                            <Lock size={40} className="mx-auto text-amber-700" />
                            <h4 className="text-base font-extrabold text-amber-950">Confidential Compensation Record</h4>
                            <p className="text-xs text-amber-800 max-w-md mx-auto font-medium">
                                Salary and payroll records are restricted to School Administrators, HR Directors, and Finance Heads under data scope governance.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                                    <span className="text-xs text-slate-600 font-extrabold uppercase tracking-wider">Basic Pay</span>
                                    <div className="text-2xl font-black text-slate-900 mt-1 font-display">₹21,000</div>
                                    <span className="text-[11px] text-slate-500 mt-1 block">Monthly base remuneration</span>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                                    <span className="text-xs text-slate-600 font-extrabold uppercase tracking-wider">Allowances (HRA + Special)</span>
                                    <div className="text-2xl font-black text-slate-900 mt-1 font-display">₹14,000</div>
                                    <span className="text-[11px] text-slate-500 mt-1 block">Housing & utility benefits</span>
                                </div>
                                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200">
                                    <span className="text-xs text-blue-900 font-extrabold uppercase tracking-wider">Net Monthly Disbursal</span>
                                    <div className="text-2xl font-black text-blue-900 mt-1 font-display">₹35,000</div>
                                    <span className="text-[11px] text-blue-700 font-semibold mt-1 block">Take-home post statutory deductions</span>
                                </div>
                            </div>

                            <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-slate-50/50">
                                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Bank & Disbursal Information</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                    <div>
                                        <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Bank Name</span>
                                        <span className="font-extrabold text-slate-900">HDFC Bank Ltd</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Account Number</span>
                                        <span className="font-mono font-extrabold text-slate-900">••••••••3210</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider block mb-0.5">Payment Mode</span>
                                        <span className="font-extrabold text-emerald-700">Direct Electronic NEFT/RTGS</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Other Tabs: Attendance, Documents, Leave ──────────────────── */}
            {activeTab === 'attendance' && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900 font-display">Staff Attendance Record</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Monthly presence tracking and shift punctuality</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-sm">April 2026: 26 Present Days • 1 Absent • 0 Late</span>
                        <span className="text-emerald-800 font-extrabold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                            96.3% Rate
                        </span>
                    </div>
                </div>
            )}

            {activeTab === 'documents' && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900 font-display">Verified Employment Documents</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Statutory identity, agreement contracts, and background check files</p>
                    </div>
                    <div className="space-y-2.5 text-xs">
                        <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50/50">
                            <span className="font-extrabold text-slate-900">Employment Contract (Full Time Permanent)</span>
                            <span className="text-emerald-800 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                                Verified
                            </span>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50/50">
                            <span className="font-extrabold text-slate-900">National ID & Residential Address Verification</span>
                            <span className="text-emerald-800 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                                Verified
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'leave' && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900 font-display">Leave Balance & Requests</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Approved annual leave quota and available balance</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                        <span className="font-extrabold text-slate-900 text-sm">Casual Leave Remaining: 8 Days • Sick Leave: 5 Days</span>
                    </div>
                </div>
            )}

            {activeTab === 'tasks' && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900 font-display">Assigned Responsibilities</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Periodic duties assigned by administration department</p>
                    </div>
                    <div className="space-y-2.5">
                        {tasks.map((task) => (
                            <div key={task.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs bg-slate-50/50">
                                <span className="font-bold text-slate-900">{task.title}</span>
                                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200">
                                    Assigned
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
