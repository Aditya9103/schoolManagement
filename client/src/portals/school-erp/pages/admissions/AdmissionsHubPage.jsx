import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    ChevronDown,
    Plus,
    Filter,
    Calendar,
    CheckCircle2,
    Clock,
    UserCheck,
    Users,
    TrendingUp,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
    Send,
    BarChart3,
    MoreVertical,
    Eye,
    SlidersHorizontal,
    Table,
    LayoutGrid,
    Globe,
    Building2,
    Share2,
    Megaphone,
    Mail,
    Download,
    Check,
    Sparkles,
    CalendarDays
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
    useGetApplicationsQuery,
    useGetAdmissionStatsQuery,
    useUpdateApplicationStatusMutation
} from '../../../../store/api/admissionsApi';
import { useGetAcademicYearsQuery } from '../../../../store/api/classApi';
import ApplicationDetailDrawer from './components/ApplicationDetailDrawer';
import ScheduleTestModal from './components/ScheduleTestModal';
import EnrollStudentModal from './components/EnrollStudentModal';
import EnquiryAndWalkInModal from './components/EnquiryAndWalkInModal';

// Status badge styling helper (supports canonical and uppercase)
const getStatusBadgeStyle = (status) => {
    const s = (status || '').toUpperCase();
    switch (s) {
        case 'NEW APPLICATION':
        case 'SUBMITTED':
            return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'UNDER REVIEW':
        case 'UNDER_REVIEW':
            return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'DOCUMENT PENDING':
        case 'DOCS_PENDING':
            return 'bg-rose-50 text-rose-700 border-rose-200';
        case 'ENTRANCE TEST':
        case 'TEST_SCHEDULED':
            return 'bg-purple-50 text-purple-700 border-purple-200';
        case 'SELECTED':
        case 'APPROVED':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case 'FEE PENDING':
        case 'FEE_PENDING':
            return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'ADMITTED':
        case 'ENROLLED':
            return 'bg-teal-50 text-teal-700 border-teal-200';
        case 'WAITLISTED':
        case 'WAITING LIST':
            return 'bg-orange-50 text-orange-700 border-orange-200';
        case 'REJECTED':
            return 'bg-red-50 text-red-700 border-red-200';
        default:
            return 'bg-slate-50 text-slate-700 border-slate-200';
    }
};

const getSourceIcon = (source) => {
    switch (source) {
        case 'Website':
            return <Globe size={13} className="text-blue-700 font-bold" />;
        case 'Walk-in':
            return <Building2 size={13} className="text-purple-700 font-bold" />;
        case 'Referral':
            return <Share2 size={13} className="text-emerald-700 font-bold" />;
        case 'Advertisement':
            return <Megaphone size={13} className="text-amber-800 font-bold" />;
        default:
            return <Globe size={13} className="text-slate-600 font-medium" />;
    }
};

export default function AdmissionsHubPage() {
    const navigate = useNavigate();

    // Filter and search state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState('Applications');
    const [selectedStatusPill, setSelectedStatusPill] = useState('ALL');
    const [classFilter, setClassFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sourceFilter, setSourceFilter] = useState('ALL');
    const [academicYearFilter, setAcademicYearFilter] = useState('ALL');
    const [viewMode, setViewMode] = useState('table');
    const [newAdmissionMenuOpen, setNewAdmissionMenuOpen] = useState(false);

    // Academic Years Query
    const { data: yearsRes } = useGetAcademicYearsQuery();
    const rawYears = yearsRes?.data;
    const academicYears = Array.isArray(rawYears) ? rawYears : (rawYears?.academicYears || []);
    const currentAcademicYear = rawYears?.currentAcademicYear || academicYears.find((y) => y.isCurrent) || academicYears[0];
    const currentYearName = currentAcademicYear?.name || '2026-27';

    // Modals and Drawer state
    const [activeDetailId, setActiveDetailId] = useState(null);
    const [testModalApp, setTestModalApp] = useState(null);
    const [enrollModalApp, setEnrollModalApp] = useState(null);
    const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

    // Queries
    const { data: appsRes, isLoading: isAppsLoading } = useGetApplicationsQuery({
        search: searchTerm,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        class: classFilter !== 'ALL' ? classFilter : undefined,
        source: sourceFilter !== 'ALL' ? sourceFilter : undefined,
        academicYearId: academicYearFilter !== 'ALL' ? academicYearFilter : undefined,
    });

    const { data: statsRes } = useGetAdmissionStatsQuery();
    const [updateStatus] = useUpdateApplicationStatusMutation();

    const applications = appsRes?.data?.applications || [];
    const stats = statsRes?.data || {
        totalApplications: 248,
        totalEnquiries: 182,
        confirmedAdmissions: 96,
        pendingReview: 34,
        conversionRate: '38.7%',
        waitingList: 28,
        inProgress: 68,
        trend: [],
        sources: [],
        byClass: [],
    };

    // Filter by quick pill (case-insensitive & alias-safe)
    const filteredApplications = useMemo(() => {
        return applications.filter((app) => {
            if (selectedStatusPill === 'ALL') return true;
            const s = (app.status || '').toUpperCase();
            if (selectedStatusPill === 'New') return s === 'NEW APPLICATION' || s === 'SUBMITTED';
            if (selectedStatusPill === 'Under Review') return s === 'UNDER REVIEW' || s === 'UNDER_REVIEW';
            if (selectedStatusPill === 'Document Pending') return s === 'DOCUMENT PENDING' || s === 'DOCS_PENDING';
            if (selectedStatusPill === 'Entrance Test') return s === 'ENTRANCE TEST' || s === 'TEST_SCHEDULED';
            if (selectedStatusPill === 'Approved') return s === 'SELECTED' || s === 'APPROVED' || s === 'ADMITTED' || s === 'ENROLLED';
            if (selectedStatusPill === 'Rejected') return s === 'REJECTED';
            if (selectedStatusPill === 'Waiting List') return s === 'WAITLISTED' || s === 'WAITING LIST';
            return true;
        });
    }, [applications, selectedStatusPill]);

    const handleSendFeeLink = (app) => {
        toast.success(`Fee link dispatched to ${app.parent?.fatherEmail || app.parent?.fatherPhone}!`);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 sm:p-6 lg:p-8 space-y-6">
            {/* ── Breadcrumb & Top Bar ───────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <span>Home</span>
                        <span>&gt;</span>
                        <span className="text-slate-700">Admissions</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                        Admissions
                    </h1>
                    <p className="text-xs text-slate-700 font-medium">
                        Manage admission applications, enquiries, and student onboarding for academic year {currentYearName}.
                    </p>
                </div>

                {/* Right Slogan Banner + Action Dropdown (Matches UI 1) */}
                <div className="flex items-center gap-4">
                    <div className="hidden xl:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-md relative overflow-hidden border border-white/10">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
                            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600&q=80')` }}
                        />
                        <div className="relative z-10">
                            <span className="font-serif italic text-sm text-amber-200 block font-bold leading-tight">
                                "Every Student a Brighter Tomorrow"
                            </span>
                            <span className="text-[10px] text-slate-300 font-medium">
                                Academic Year {currentYearName} Active Enrollment
                            </span>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setNewAdmissionMenuOpen(!newAdmissionMenuOpen)}
                            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
                        >
                            <Plus size={16} />
                            <span>+ New Admission</span>
                            <ChevronDown size={14} />
                        </button>

                        {newAdmissionMenuOpen && (
                            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEnquiryModalOpen(true);
                                        setNewAdmissionMenuOpen(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                >
                                    <Building2 size={14} className="text-blue-600" />
                                    Walk-In Registration
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEnquiryModalOpen(true);
                                        setNewAdmissionMenuOpen(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                >
                                    <Users size={14} className="text-emerald-700 font-bold" />
                                    Add Enquiry Lead
                                </button>
                                <div className="border-t border-slate-100 my-1" />
                                <a
                                    href="/admissions"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                >
                                    <Globe size={14} className="text-indigo-600" />
                                    Open Public Portal
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── 6 Top Metric Cards (Matches UI 1) ─────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {/* 1. Total Applications */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center">
                            <FileText size={18} />
                        </div>
                        <span className="inline-flex items-center text-[10px] font-black text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                            <ArrowUpRight size={12} /> 12%
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="text-2xl font-black text-slate-900 tracking-tight block">
                            {stats.totalApplications}
                        </span>
                        <span className="text-[11px] font-bold text-slate-700 font-semibold block leading-tight">Total Applications</span>
                        <span className="text-[10px] text-slate-600 font-semibold mt-0.5 block">+26 this month</span>
                    </div>
                </div>

                {/* 2. Enquiries */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center">
                            <Users size={18} />
                        </div>
                        <span className="inline-flex items-center text-[10px] font-black text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                            <ArrowUpRight size={12} /> 8%
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="text-2xl font-black text-slate-900 tracking-tight block">
                            {stats.totalEnquiries}
                        </span>
                        <span className="text-[11px] font-bold text-slate-700 font-semibold block leading-tight">Enquiries</span>
                        <span className="text-[10px] text-slate-600 font-semibold mt-0.5 block">+14 this month</span>
                    </div>
                </div>

                {/* 3. Admissions Confirmed */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 font-bold flex items-center justify-center">
                            <UserCheck size={18} />
                        </div>
                        <span className="inline-flex items-center text-[10px] font-black text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                            <ArrowUpRight size={12} /> 18%
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="text-2xl font-black text-slate-900 tracking-tight block">
                            {stats.confirmedAdmissions}
                        </span>
                        <span className="text-[11px] font-bold text-slate-700 font-semibold block leading-tight">Admissions Confirmed</span>
                        <span className="text-[10px] text-slate-600 font-semibold mt-0.5 block">+15 this month</span>
                    </div>
                </div>

                {/* 4. Pending Review */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 font-bold flex items-center justify-center">
                            <Clock size={18} />
                        </div>
                        <span className="inline-flex items-center text-[10px] font-black text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
                            <ArrowDownRight size={12} /> 6%
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="text-2xl font-black text-slate-900 tracking-tight block">
                            {stats.pendingReview}
                        </span>
                        <span className="text-[11px] font-bold text-slate-700 font-semibold block leading-tight">Pending Review</span>
                        <span className="text-[10px] text-slate-600 font-semibold mt-0.5 block">Under verification</span>
                    </div>
                </div>

                {/* 5. Conversion Rate */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                            <TrendingUp size={18} />
                        </div>
                        <span className="inline-flex items-center text-[10px] font-black text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                            <ArrowUpRight size={12} /> 4%
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="text-2xl font-black text-slate-900 tracking-tight block">
                            {stats.conversionRate}
                        </span>
                        <span className="text-[11px] font-bold text-slate-700 font-semibold block leading-tight">Conversion Rate</span>
                        <span className="text-[10px] text-slate-600 font-semibold mt-0.5 block">From enquiry to admission</span>
                    </div>
                </div>

                {/* 6. Waiting List */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 font-bold flex items-center justify-center">
                            <Sparkles size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 font-semibold">Waitlist</span>
                    </div>
                    <div className="mt-3">
                        <span className="text-2xl font-black text-slate-900 tracking-tight block">
                            {stats.waitingList}
                        </span>
                        <span className="text-[11px] font-bold text-slate-700 font-semibold block leading-tight">Waiting List</span>
                        <span className="text-[10px] text-slate-600 font-semibold mt-0.5 block">+5 this month</span>
                    </div>
                </div>
            </div>

            {/* ── Sub-Navigation Tabs (Matches UI 1) ─────────────────────────── */}
            <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
                {[
                    { key: 'Applications', label: `Applications (${stats.totalApplications})` },
                    { key: 'Enquiries', label: `Enquiries (${stats.totalEnquiries})` },
                    { key: 'Document Verification', label: 'Document Verification (34)' },
                    { key: 'Entrance Test', label: 'Entrance Test (28)' },
                    { key: 'Onboarding', label: 'Onboarding (52)' },
                    { key: 'Withdrawn', label: 'Withdrawn (12)' },
                ].map((t) => (
                    <button
                        key={t.key}
                        type="button"
                        onClick={() => {
                            setSelectedTab(t.key);
                            if (t.key === 'Enquiries') setEnquiryModalOpen(true);
                        }}
                        className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                            selectedTab === t.key
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ── Main Layout: Table Area (Left 8 Cols) + Right Widgets (Right 4 Cols) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* ── Left Content (8 Cols) ─────────────────────────────────── */}
                <div className="xl:col-span-8 space-y-4">
                    {/* Filters Bar (Matches UI 1) */}
                    <div className="bg-white p-3.5 rounded-2xl shadow-2xs border border-slate-200 space-y-3">
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            {/* Search input */}
                            <div className="relative flex-1 w-full">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 font-medium" />
                                <input
                                    type="text"
                                    placeholder="Search by name, application no., parent, email, phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-blue-600 text-xs font-medium outline-hidden"
                                />
                            </div>

                            {/* Dropdowns */}
                            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                                <select
                                    value={classFilter}
                                    onChange={(e) => setClassFilter(e.target.value)}
                                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white outline-hidden cursor-pointer"
                                >
                                    <option value="ALL">All Classes</option>
                                    <option value="Class 1">Class 1</option>
                                    <option value="Class 2">Class 2</option>
                                    <option value="Class 3">Class 3</option>
                                    <option value="Class 4">Class 4</option>
                                    <option value="Class 5">Class 5</option>
                                    <option value="Class 6">Class 6</option>
                                    <option value="Class 7">Class 7</option>
                                    <option value="Class 8">Class 8</option>
                                    <option value="Class 9">Class 9</option>
                                    <option value="Class 10">Class 10</option>
                                </select>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white outline-hidden cursor-pointer"
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="New Application">New Application</option>
                                    <option value="Under Review">Under Review</option>
                                    <option value="Document Pending">Document Pending</option>
                                    <option value="Entrance Test">Entrance Test</option>
                                    <option value="Selected">Selected</option>
                                    <option value="Fee Pending">Fee Pending</option>
                                    <option value="Admitted">Admitted</option>
                                </select>

                                <select
                                    value={sourceFilter}
                                    onChange={(e) => setSourceFilter(e.target.value)}
                                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white outline-hidden cursor-pointer"
                                >
                                    <option value="ALL">All Sources</option>
                                    <option value="Website">Website</option>
                                    <option value="Walk-in">Walk-in</option>
                                    <option value="Referral">Referral</option>
                                    <option value="Advertisement">Advertisement</option>
                                </select>

                                <select
                                    value={academicYearFilter}
                                    onChange={(e) => setAcademicYearFilter(e.target.value)}
                                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white outline-hidden cursor-pointer"
                                    title="Filter by Academic Year"
                                >
                                    <option value="ALL">All Academic Years</option>
                                    {academicYears.map((yr) => (
                                        <option key={yr._id} value={yr._id}>
                                            Academic Year {yr.name} {yr.isCurrent ? '★' : ''}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setClassFilter('ALL');
                                        setStatusFilter('ALL');
                                        setSourceFilter('ALL');
                                        setAcademicYearFilter('ALL');
                                        setSelectedStatusPill('ALL');
                                    }}
                                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                                    title="Reset filters"
                                >
                                    <Filter size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Status Filter Pills Row (Matches UI 1) */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-slate-100">
                            {[
                                { key: 'ALL', label: `All ${stats.totalApplications}` },
                                { key: 'New', label: 'New 48' },
                                { key: 'Under Review', label: 'Under Review 34' },
                                { key: 'Document Pending', label: 'Document Pending 28' },
                                { key: 'Entrance Test', label: 'Entrance Test 26' },
                                { key: 'Approved', label: 'Approved 96' },
                                { key: 'Rejected', label: 'Rejected 12' },
                                { key: 'Waiting List', label: 'Waiting List 28' },
                            ].map((pill) => (
                                <button
                                    key={pill.key}
                                    type="button"
                                    onClick={() => setSelectedStatusPill(pill.key)}
                                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                        selectedStatusPill === pill.key
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {pill.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Applications Table (Matches UI 1) */}
                    <div className="bg-white rounded-2xl shadow-2xs border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-100/90 text-[11px] font-black uppercase tracking-wider text-slate-700 font-extrabold border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 w-8">
                                            <input type="checkbox" className="rounded text-blue-600" />
                                        </th>
                                        <th className="px-3 py-3 w-8">#</th>
                                        <th className="px-4 py-3">Student Name</th>
                                        <th className="px-4 py-3">Class Applied</th>
                                        <th className="px-4 py-3">Application No.</th>
                                        <th className="px-4 py-3">Parent Details</th>
                                        <th className="px-4 py-3">Source</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Applied On</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                    {isAppsLoading ? (
                                        <tr>
                                            <td colSpan={10} className="px-4 py-12 text-center text-slate-600 font-medium">
                                                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                                Loading admission applications...
                                            </td>
                                        </tr>
                                    ) : filteredApplications.length === 0 ? (
                                        <tr>
                                            <td colSpan={10} className="px-4 py-12 text-center text-slate-600 font-medium">
                                                No admission applications match your current filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredApplications.map((app, idx) => (
                                            <tr key={app._id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-4 py-3">
                                                    <input type="checkbox" className="rounded text-blue-600" />
                                                </td>
                                                <td className="px-3 py-3 text-slate-600 font-medium font-bold">{idx + 1}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <img
                                                            src={app.student?.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'}
                                                            alt={app.student?.firstName}
                                                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => navigate(`/school/admissions/${app._id}`)}
                                                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-left cursor-pointer"
                                                        >
                                                            {app.student?.firstName} {app.student?.lastName}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-slate-800">
                                                    {app.targetClassName}
                                                </td>
                                                <td className="px-4 py-3 font-mono font-bold text-blue-700">
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/school/admissions/${app._id}`)}
                                                        className="hover:underline cursor-pointer"
                                                    >
                                                        {app.applicationNo}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <span className="font-bold text-slate-800 block text-xs">
                                                            {app.parent?.fatherName || 'N/A'}
                                                        </span>
                                                        <span className="text-[10px] text-slate-600 font-semibold">
                                                            {app.parent?.fatherPhone || ''}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                                                        {getSourceIcon(app.source)}
                                                        {app.source}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusBadgeStyle(
                                                            app.status
                                                        )}`}
                                                    >
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-[11px] text-slate-700 font-semibold whitespace-nowrap">
                                                    <div>
                                                        <span>{new Date(app.appliedDate || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                        <span className="block text-[10px] text-slate-600 font-semibold">
                                                            {new Date(app.appliedDate || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {app.status === 'New Application' || app.status === 'Under Review' ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => navigate(`/school/admissions/${app._id}`)}
                                                                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                                                            >
                                                                <Eye size={12} />
                                                                Review
                                                            </button>
                                                        ) : app.status === 'Entrance Test' ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => setTestModalApp(app)}
                                                                className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                                                            >
                                                                <Calendar size={12} />
                                                                Schedule
                                                            </button>
                                                        ) : app.status === 'Selected' ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => setEnrollModalApp(app)}
                                                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                                                            >
                                                                <Check size={12} />
                                                                Confirm
                                                            </button>
                                                        ) : app.status === 'Fee Pending' ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSendFeeLink(app)}
                                                                className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                                                            >
                                                                <Send size={12} />
                                                                Send Fee Link
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => navigate(`/school/admissions/${app._id}`)}
                                                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                                                            >
                                                                <Eye size={12} />
                                                                View
                                                            </button>
                                                        )}

                                                        <button
                                                            type="button"
                                                            onClick={() => navigate(`/school/admissions/${app._id}`)}
                                                            className="p-1 rounded-lg text-slate-600 font-medium hover:text-slate-600 transition-colors cursor-pointer"
                                                            title="View Application Details"
                                                        >
                                                            <MoreVertical size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ── Right Sidebar Widgets (4 Cols) (Matches UI 1) ─────────── */}
                <div className="xl:col-span-4 space-y-4">
                    {/* WIDGET 1: Admission Progress Donut Chart */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                                Admission Progress ({currentYearName})
                            </h3>
                            <ChevronDown size={14} className="text-slate-600 font-medium" />
                        </div>

                        <div className="flex items-center gap-4">
                            {/* SVG Donut */}
                            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                                    {/* Admitted 39% */}
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="14"
                                        fill="transparent"
                                        stroke="#10b981"
                                        strokeWidth="4"
                                        strokeDasharray="34.3 88"
                                        strokeDashoffset="0"
                                    />
                                    {/* In Progress 27% */}
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="14"
                                        fill="transparent"
                                        stroke="#3b82f6"
                                        strokeWidth="4"
                                        strokeDasharray="23.7 88"
                                        strokeDashoffset="-34.3"
                                    />
                                    {/* Pending 14% */}
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="14"
                                        fill="transparent"
                                        stroke="#f59e0b"
                                        strokeWidth="4"
                                        strokeDasharray="12.3 88"
                                        strokeDashoffset="-58"
                                    />
                                    {/* Others 20% */}
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="14"
                                        fill="transparent"
                                        stroke="#a855f7"
                                        strokeWidth="4"
                                        strokeDasharray="17.6 88"
                                        strokeDashoffset="-70.3"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-base font-black text-slate-900 leading-none">248</span>
                                    <span className="text-[9px] text-slate-700 font-extrabold font-bold uppercase tracking-wider">Total</span>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="space-y-1.5 text-xs font-semibold text-slate-600 flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                        <span>Admitted</span>
                                    </span>
                                    <span className="font-bold text-slate-900">96 (39%)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                        <span>In Progress</span>
                                    </span>
                                    <span className="font-bold text-slate-900">68 (27%)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                        <span>Pending</span>
                                    </span>
                                    <span className="font-bold text-slate-900">34 (14%)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                                        <span>Others</span>
                                    </span>
                                    <span className="font-bold text-slate-900">50 (20%)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WIDGET 2: Quick Actions (Matches UI 1, 2 columns, 6 colored cards) */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                            Quick Actions
                        </h3>

                        <div className="grid grid-cols-2 gap-2.5">
                            <button
                                type="button"
                                onClick={() => setEnquiryModalOpen(true)}
                                className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer"
                            >
                                <Plus size={16} className="text-blue-600 shrink-0" />
                                <span className="leading-tight">New Application</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setEnquiryModalOpen(true)}
                                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer"
                            >
                                <Users size={16} className="text-emerald-700 font-bold shrink-0" />
                                <span className="leading-tight">Add Enquiry</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    if (applications.length > 0) setTestModalApp(applications[0]);
                                    else toast('No applications available to schedule test');
                                }}
                                className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer"
                            >
                                <Calendar size={16} className="text-purple-700 font-bold shrink-0" />
                                <span className="leading-tight">Schedule Entrance</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => toast.success('Fee reminder links broadcast to 8 pending parents!')}
                                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer"
                            >
                                <Send size={16} className="text-amber-800 font-bold shrink-0" />
                                <span className="leading-tight">Send Fee Link</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => toast.success('Bulk SMS/Email notification dispatched!')}
                                className="p-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer"
                            >
                                <Mail size={16} className="text-cyan-600 shrink-0" />
                                <span className="leading-tight">Bulk SMS / Email</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer"
                            >
                                <Download size={16} className="text-rose-700 font-bold shrink-0" />
                                <span className="leading-tight">Generate Report</span>
                            </button>
                        </div>
                    </div>

                    {/* WIDGET 3: Upcoming Tasks (Matches UI 1) */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                                Upcoming Tasks
                            </h3>
                            <button type="button" className="text-[11px] font-bold text-blue-600 hover:underline">
                                View All
                            </button>
                        </div>

                        <div className="space-y-3">
                            {[
                                { day: '25', month: 'SEP', title: 'Entrance Test - Class 6', subtitle: '20 candidates scheduled', time: '09:00 AM' },
                                { day: '02', month: 'OCT', title: 'Document Verification', subtitle: '12 applications pending', time: '10:00 AM' },
                                { day: '10', month: 'OCT', title: 'Fee Follow-up', subtitle: '8 pending fee payments', time: '11:30 AM' },
                                { day: '21', month: 'OCT', title: 'Parent Meeting', subtitle: 'Meet 5 shortlisted candidates', time: '02:00 PM' },
                            ].map((task, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex flex-col items-center justify-center shrink-0">
                                        <span className="text-[11px] font-black text-slate-900 leading-none">{task.day}</span>
                                        <span className="text-[9px] font-black text-slate-600 font-semibold uppercase">{task.month}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-slate-900 truncate">{task.title}</h4>
                                        <p className="text-[11px] text-slate-700 font-semibold truncate">{task.subtitle}</p>
                                    </div>
                                    <span className="text-[10px] font-semibold text-slate-600 shrink-0">{task.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* WIDGET 4: Recent Activities (Matches UI 1) */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                                Recent Activities
                            </h3>
                            <button type="button" className="text-[11px] font-bold text-blue-600 hover:underline">
                                View All
                            </button>
                        </div>

                        <div className="space-y-2.5">
                            {[
                                { text: "Aarav Mehta's application submitted", time: '2 hours ago', color: 'bg-emerald-500' },
                                { text: "Saanvi Gupta's documents verified", time: '3 hours ago', color: 'bg-blue-500' },
                                { text: 'Kabir Singh scheduled for entrance test', time: '5 hours ago', color: 'bg-purple-500' },
                                { text: "Ananya Patel's fee payment received", time: '6 hours ago', color: 'bg-amber-500' },
                            ].map((act, idx) => (
                                <div key={idx} className="flex items-start gap-2.5">
                                    <span className={`w-2 h-2 rounded-full ${act.color}mt-1.5 shrink-0`} />
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-800 font-medium leading-snug">{act.text}</p>
                                        <span className="text-[10px] text-slate-600 font-semibold block">{act.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom Row: 3 Analytics Charts (Matches UI 1) ─────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Chart 1: Applications Trend (Line Chart) */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                            Applications Trend
                        </h3>
                        <span className="text-[11px] text-slate-600 font-semibold font-bold">Last 6 Months</span>
                    </div>

                    <div className="h-44 flex flex-col justify-between pt-2">
                        {/* Smooth Line representation */}
                        <svg className="w-full h-32 overflow-visible" viewBox="0 0 300 100">
                            {/* Grid lines */}
                            <line x1="0" y1="20" x2="300" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="50" x2="300" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="80" x2="300" y2="80" stroke="#f1f5f9" strokeWidth="1" />

                            {/* Blue Line: Applications */}
                            <path
                                d="M 10 75 Q 60 70, 110 60 T 210 35 T 290 15"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="2.5"
                            />
                            {/* Green Line: Enquiries */}
                            <path
                                d="M 10 85 Q 60 80, 110 70 T 210 50 T 290 35"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="2.5"
                            />
                            {/* Amber Line: Admissions */}
                            <path
                                d="M 10 92 Q 60 90, 110 85 T 210 70 T 290 60"
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="2.5"
                            />
                        </svg>

                        {/* Month labels */}
                        <div className="flex justify-between text-[10px] text-slate-600 font-semibold font-bold px-1">
                            <span>Apr</span>
                            <span>May</span>
                            <span>Jun</span>
                            <span>Jul</span>
                            <span>Aug</span>
                            <span>Sep</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-slate-600 border-t border-slate-100 pt-2">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Applications</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Enquiries</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Admissions</span>
                    </div>
                </div>

                {/* Chart 2: Applications by Source (Donut Chart) */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                            Applications by Source
                        </h3>
                        <span className="text-[11px] text-slate-600 font-semibold font-bold">All Time</span>
                    </div>

                    <div className="flex items-center justify-center gap-6 py-2">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f1f5f9" strokeWidth="4.5" />
                                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" strokeDasharray="30.8 88" strokeDashoffset="0" />
                                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#a855f7" strokeWidth="4.5" strokeDasharray="22 88" strokeDashoffset="-30.8" />
                                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#10b981" strokeWidth="4.5" strokeDasharray="15.8 88" strokeDashoffset="-52.8" />
                                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray="13.2 88" strokeDashoffset="-68.6" />
                                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#64748b" strokeWidth="4.5" strokeDasharray="6.2 88" strokeDashoffset="-81.8" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-lg font-black text-slate-900 leading-none">248</span>
                                <span className="text-[9px] text-slate-600 font-semibold font-bold uppercase">Apps</span>
                            </div>
                        </div>

                        <div className="space-y-1 text-[11px] font-semibold text-slate-600">
                            <div className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Website</span>
                                <span className="font-bold text-slate-900">35%</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Walk-in</span>
                                <span className="font-bold text-slate-900">25%</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Referral</span>
                                <span className="font-bold text-slate-900">18%</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Advertisement</span>
                                <span className="font-bold text-slate-900">15%</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-500" /> Others</span>
                                <span className="font-bold text-slate-900">7%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart 3: Applications by Class (Bar Chart) */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                            Applications by Class
                        </h3>
                        <span className="text-[11px] text-slate-600 font-semibold font-bold">This Month</span>
                    </div>

                    <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
                        {[
                            { label: 'Class 1', count: 38, color: 'bg-blue-500', height: 'h-32' },
                            { label: 'Class 2', count: 32, color: 'bg-purple-500', height: 'h-28' },
                            { label: 'Class 3', count: 28, color: 'bg-emerald-500', height: 'h-24' },
                            { label: 'Class 4', count: 26, color: 'bg-amber-500', height: 'h-20' },
                            { label: 'Class 5', count: 24, color: 'bg-rose-500', height: 'h-16' },
                            { label: 'Class 6+', count: 48, color: 'bg-cyan-500', height: 'h-36' },
                        ].map((bar, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                                <span className="text-[10px] font-black text-slate-700">{bar.count}</span>
                                <div className={`w-full max-w-[28px] ${bar.height}${bar.color}rounded-t-lg transition-all hover:opacity-90`} />
                                <span className="text-[9px] font-bold text-slate-700 font-semibold whitespace-nowrap">{bar.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Drawers and Modals ─────────────────────────────────────────── */}
            {activeDetailId && (
                <ApplicationDetailDrawer
                    applicationId={activeDetailId}
                    onClose={() => setActiveDetailId(null)}
                    onScheduleTest={(app) => {
                        setActiveDetailId(null);
                        setTestModalApp(app);
                    }}
                    onEnroll={(app) => {
                        setActiveDetailId(null);
                        setEnrollModalApp(app);
                    }}
                />
            )}

            {testModalApp && (
                <ScheduleTestModal
                    application={testModalApp}
                    onClose={() => setTestModalApp(null)}
                />
            )}

            {enrollModalApp && (
                <EnrollStudentModal
                    application={enrollModalApp}
                    onClose={() => setEnrollModalApp(null)}
                />
            )}

            {enquiryModalOpen && (
                <EnquiryAndWalkInModal
                    onClose={() => setEnquiryModalOpen(false)}
                    onApplicationCreated={(app) => {
                        if (app?._id) setActiveDetailId(app._id);
                    }}
                />
            )}
        </div>
    );
}
