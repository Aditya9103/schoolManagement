import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, UserCheck, Plus, Search, Filter, Grid, List, BarChart3,
    Eye, Calendar, BookOpen, Layers, CheckCircle2, Clock, RefreshCw,
    Mail, Phone, ChevronLeft, ChevronRight, Award, GraduationCap,
    ArrowUpRight, ArrowRight, Star, Download, Edit3, Trash2,
    ToggleLeft, ToggleRight, AlertCircle, PlusCircle
} from 'lucide-react';
import {
    useGetTeachersQuery,
    useUpdateTeacherMutation,
    useDeleteTeacherMutation
} from '../../../../store/api/peopleApi';
import usePermissions from '../../../../hooks/usePermissions';
import AddTeacherModal from './components/AddTeacherModal';
import EditTeacherModal from './components/EditTeacherModal';
import AssignClassSubjectModal from './components/AssignClassSubjectModal';

export default function TeachersPage() {
    const navigate = useNavigate();
    const { canAccess, hasAction, isAdmin } = usePermissions();

    const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid' | 'analytics'
    const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'ON_LEAVE'
    const [search, setSearch] = useState('');
    const [selectedDept, setSelectedDept] = useState('All');
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [page, setPage] = useState(1);

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [assigningTeacher, setAssigningTeacher] = useState(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState(null);
    const [actionMsg, setActionMsg] = useState(null);

    const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();
    const [deleteTeacher, { isLoading: isDeleting }] = useDeleteTeacherMutation();

    const queryParams = useMemo(() => ({
        page,
        limit: 10,
        search,
        department: selectedDept !== 'All' ? selectedDept : undefined,
        subject: selectedSubject !== 'All' ? selectedSubject : undefined,
        status: activeTab === 'ACTIVE' ? 'ACTIVE' : activeTab === 'ON_LEAVE' ? 'ON_LEAVE' : undefined
    }), [page, search, selectedDept, selectedSubject, activeTab]);

    const { data: resData, isLoading, refetch } = useGetTeachersQuery(queryParams);

    const teachers = resData?.data?.teachers || [];
    const kpis = resData?.data?.kpis || {
        totalTeachers: teachers.length,
        activeTeachers: teachers.filter(t => t.status === 'Active').length,
        onLeaveTeachers: teachers.filter(t => t.status === 'On Leave').length,
        subjectExperts: 0,
        departmentsCount: 0
    };
    const pagination = resData?.data?.pagination || { page: 1, totalPages: 1, total: teachers.length };

    const canCreate = isAdmin || hasAction('teachers_directory', 'create');
    const canEdit = isAdmin || hasAction('teachers_directory', 'edit');
    const canDelete = isAdmin || hasAction('teachers_directory', 'delete');

    const handleReset = () => {
        setSearch('');
        setSelectedDept('All');
        setSelectedSubject('All');
        setActiveTab('ALL');
        setPage(1);
    };

    const handleToggleStatus = async (teacher, e) => {
        e?.stopPropagation();
        const teacherId = teacher.id || teacher._id;
        const isLeave = teacher.status === 'On Leave' || teacher.status === 'ON_LEAVE';
        const newStatus = isLeave ? 'ACTIVE' : 'ON_LEAVE';

        try {
            await updateTeacher({ id: teacherId, status: newStatus }).unwrap();
            setActionMsg({
                type: 'success',
                text: `${teacher.name} status updated to ${isLeave ? 'Active' : 'On Leave'}.`
            });
            setTimeout(() => setActionMsg(null), 3500);
        } catch (err) {
            setActionMsg({
                type: 'error',
                text: err?.data?.message || 'Failed to update teacher status.'
            });
            setTimeout(() => setActionMsg(null), 3500);
        }
    };

    const confirmDeleteTeacher = async () => {
        if (!teacherToDelete) return;
        const teacherId = teacherToDelete.id || teacherToDelete._id;

        try {
            await deleteTeacher(teacherId).unwrap();
            setActionMsg({
                type: 'success',
                text: `Faculty member ${teacherToDelete.name} has been deactivated.`
            });
            setTeacherToDelete(null);
            setTimeout(() => setActionMsg(null), 3500);
        } catch (err) {
            setActionMsg({
                type: 'error',
                text: err?.data?.message || 'Failed to deactivate teacher.'
            });
            setTeacherToDelete(null);
            setTimeout(() => setActionMsg(null), 3500);
        }
    };

    const handleExportCSV = () => {
        if (!teachers.length) {
            alert('No teacher records available to export.');
            return;
        }

        const headers = [
            'Name',
            'Employee ID',
            'Department',
            'Designation',
            'Qualification',
            'Experience',
            'Status',
            'Phone',
            'Email',
            'Subjects',
            'Classes'
        ];

        const rows = teachers.map((t) => [
            `"${t.name || ''}"`,
            `"${t.employeeId || ''}"`,
            `"${t.department || ''}"`,
            `"${t.designation || ''}"`,
            `"${t.qualification || ''}"`,
            `"${t.experience || ''}"`,
            `"${t.status || 'Active'}"`,
            `"${t.phone || ''}"`,
            `"${t.email || ''}"`,
            `"${t.subjects || ''}"`,
            `"${t.classes || ''}"`
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `teachers_directory_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const statCards = [
        {
            title: 'Total Faculty',
            value: kpis.totalTeachers ?? 0,
            change: '+6%',
            subtext: 'Appointed instructors',
            Icon: GraduationCap,
            iconBg: 'bg-blue-100 text-blue-600',
            trendBg: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        },
        {
            title: 'Active & Teaching',
            value: kpis.activeTeachers ?? 0,
            change: kpis.totalTeachers ? `${Math.round((kpis.activeTeachers / kpis.totalTeachers) * 100)}%` : '0%',
            subtext: 'Operational today',
            Icon: UserCheck,
            iconBg: 'bg-emerald-100 text-emerald-600',
            trendBg: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        },
        {
            title: 'Subject Specialists',
            value: kpis.subjectExperts ?? 0,
            change: null,
            subtext: 'Curriculum leads',
            Icon: Award,
            iconBg: 'bg-amber-100 text-amber-600',
            trendBg: null,
        },
        {
            title: 'Academic Depts',
            value: kpis.departmentsCount ?? 0,
            change: null,
            subtext: 'Science, Math, Arts...',
            Icon: Layers,
            iconBg: 'bg-purple-100 text-purple-600',
            trendBg: null,
        },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] p-3 sm:p-5 lg:p-6 space-y-5 max-w-[1720px] mx-auto pb-16">
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

            {/* ── Tier 1: Header & Top Actions Hub ────────────────────────────── */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0 mt-0.5 sm:mt-0">
                        <GraduationCap size={24} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">
                                Teachers Directory
                            </h1>
                            <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider">
                                Faculty Management
                            </span>
                            <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold inline-flex items-center gap-1 font-mono">
                                {kpis.totalTeachers} Teachers
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                            Manage instructional faculty, subject assignments, timetables, classroom workloads, and evaluations.
                        </p>
                    </div>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap shrink-0 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="p-2.5 text-slate-600 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-2xs hover:border-slate-400 cursor-pointer"
                        title="Refresh list"
                    >
                        <RefreshCw size={15} />
                    </button>

                    <button
                        type="button"
                        onClick={handleExportCSV}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer"
                        title="Download CSV spreadsheet"
                    >
                        <Download size={15} />
                        <span className="hidden sm:inline">Export CSV</span>
                    </button>

                    {canCreate && (
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
                        >
                            <Plus size={16} />
                            <span>Add Teacher</span>
                        </button>
                    )}
                </div>
            </div>

            {/* ── Tier 2: 4-Card Stats Summary Row ────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {statCards.map((card) => {
                    const { Icon } = card;
                    return (
                        <div
                            key={card.title}
                            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                        >
                            <div className="flex items-center justify-between gap-1.5 mb-2">
                                <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${card.iconBg}`}>
                                    <Icon size={20} />
                                </div>
                                {card.change && (
                                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${card.trendBg}`}>
                                        <ArrowUpRight size={10} />
                                        {card.change}
                                    </span>
                                )}
                            </div>

                            <div>
                                <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
                                    {card.value}
                                </p>
                                <p className="text-xs font-bold text-slate-600 mt-0.5">
                                    {card.title}
                                </p>
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 font-semibold truncate">
                                {card.subtext}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Tier 3: Search, Filters & View Toggle Hub ───────────────────── */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
                {/* Upper: Tab Switcher & View Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 overflow-x-auto">
                        <button
                            type="button"
                            onClick={() => { setActiveTab('ALL'); setPage(1); }}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                activeTab === 'ALL'
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            All Teachers ({kpis.totalTeachers ?? 0})
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab('ACTIVE'); setPage(1); }}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                activeTab === 'ACTIVE'
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            Active ({kpis.activeTeachers ?? 0})
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab('ON_LEAVE'); setPage(1); }}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                activeTab === 'ON_LEAVE'
                                    ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            On Leave ({kpis.onLeaveTeachers ?? 0})
                        </button>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button
                            type="button"
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                viewMode === 'list' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                            }`}
                            title="List Table View"
                        >
                            <List size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                            }`}
                            title="Card Grid View"
                        >
                            <Grid size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('analytics')}
                            className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                viewMode === 'analytics' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                            }`}
                            title="Performance Analytics"
                        >
                            <BarChart3 size={16} />
                        </button>
                    </div>
                </div>

                {/* Lower: Search Input and Department/Subject Selectors */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search by teacher name, subject, or employee ID..."
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-500 shadow-2xs transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                        <select
                            value={selectedDept}
                            onChange={(e) => { setSelectedDept(e.target.value); setPage(1); }}
                            className="px-3.5 py-2.5 bg-slate-50 hover:bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition-colors cursor-pointer"
                        >
                            <option value="All">All Departments</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Science">Science</option>
                            <option value="English">English</option>
                            <option value="Social Studies">Social Studies</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Physical Education">Physical Education</option>
                            <option value="Arts & Music">Arts & Music</option>
                        </select>

                        <select
                            value={selectedSubject}
                            onChange={(e) => { setSelectedSubject(e.target.value); setPage(1); }}
                            className="px-3.5 py-2.5 bg-slate-50 hover:bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition-colors cursor-pointer hidden md:inline-block"
                        >
                            <option value="All">All Subjects</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Biology">Biology</option>
                            <option value="English">English</option>
                            <option value="History">History</option>
                            <option value="Computer">Computer</option>
                        </select>

                        {(search || selectedDept !== 'All' || selectedSubject !== 'All' || activeTab !== 'ALL') && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-3.5 py-2 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
                            >
                                Reset Filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Tier 4: Main Content (List / Grid / Analytics) ───────────────── */}
            {isLoading ? (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-16 shadow-2xs text-center space-y-3">
                    <RefreshCw size={28} className="animate-spin text-blue-600 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">Loading faculty records...</p>
                </div>
            ) : teachers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-16 shadow-2xs text-center space-y-3">
                    <GraduationCap size={36} className="text-slate-300 mx-auto" />
                    <h3 className="text-sm font-bold text-slate-900">No teachers found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                        No faculty match your selected department or filter criteria. Try clearing search filters or add a new teacher.
                    </p>
                    <div className="flex items-center justify-center gap-2.5 pt-2">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                        >
                            Reset Filters
                        </button>
                        {canCreate && (
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(true)}
                                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer"
                            >
                                Add Teacher
                            </button>
                        )}
                    </div>
                </div>
            ) : viewMode === 'list' ? (
                /* ── High-Contrast Table View ─────────────────────────────── */
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-700 text-[11px] font-extrabold uppercase tracking-wider">
                                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                                    <th className="py-3.5 px-4 min-w-[220px]">Teacher Name</th>
                                    <th className="py-3.5 px-4">Employee ID</th>
                                    <th className="py-3.5 px-4">Department</th>
                                    <th className="py-3.5 px-4">Assigned Subjects</th>
                                    <th className="py-3.5 px-4">Classes</th>
                                    <th className="py-3.5 px-4 text-center">Status</th>
                                    <th className="py-3.5 px-4 text-right min-w-[180px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {teachers.map((t, idx) => {
                                    const isLeave = t.status === 'On Leave' || t.status === 'ON_LEAVE';
                                    const teacherId = t.id || t._id;
                                    return (
                                        <tr
                                            key={teacherId}
                                            onClick={() => navigate(`/school/teachers/${teacherId}`)}
                                            className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                                        >
                                            <td className="py-3.5 px-4 text-center text-slate-400 font-bold">
                                                {(page - 1) * 10 + idx + 1}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-blue-700 border border-slate-200 shadow-2xs">
                                                        {t.avatar ? (
                                                            <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            t.name?.charAt(0) || 'T'
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                                                            {t.name}
                                                        </div>
                                                        <div className="text-[11px] text-slate-500 font-medium">
                                                            {t.qualification || 'B.Ed.'} • {t.experience || '4+ Yrs'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                                                <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px]">
                                                    {t.employeeId}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span className="font-bold text-slate-900">{t.department}</span>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold">
                                                    {t.subjects || 'General'}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 font-semibold text-slate-700">
                                                {t.classes || 'None'}
                                            </td>

                                            <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleToggleStatus(t, e)}
                                                    title={`Click to switch to ${isLeave ? 'Active' : 'On Leave'}`}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                                                        isLeave
                                                            ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                                                            : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                                    }`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isLeave ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                                    <span>{isLeave ? 'On Leave' : 'Active'}</span>
                                                </button>
                                            </td>

                                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setAssigningTeacher(t);
                                                            setIsAssignModalOpen(true);
                                                        }}
                                                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                        title="Assign class or subject"
                                                    >
                                                        <PlusCircle size={15} />
                                                    </button>

                                                    {canEdit && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingTeacher(t);
                                                                setIsEditModalOpen(true);
                                                            }}
                                                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                                                            title="Edit teacher profile"
                                                        >
                                                            <Edit3 size={15} />
                                                        </button>
                                                    )}

                                                    {canDelete && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setTeacherToDelete(t)}
                                                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                            title="Deactivate teacher"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/school/teachers/${teacherId}`)}
                                                        className="px-2.5 py-1 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200/80 transition-all inline-flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <Eye size={13} />
                                                        <span>360°</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : viewMode === 'grid' ? (
                /* ── Card Grid View ─────────────────────────────────────────── */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teachers.map((t) => {
                        const isLeave = t.status === 'On Leave' || t.status === 'ON_LEAVE';
                        const teacherId = t.id || t._id;
                        return (
                            <div
                                key={teacherId}
                                onClick={() => navigate(`/school/teachers/${teacherId}`)}
                                className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 font-black text-base flex items-center justify-center shrink-0 shadow-2xs">
                                                {t.avatar ? (
                                                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover rounded-2xl" />
                                                ) : (
                                                    t.name?.charAt(0) || 'T'
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                                                    {t.name}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded font-mono border border-slate-200">
                                                        {t.employeeId}
                                                    </span>
                                                    <span className="text-[11px] text-slate-500 font-semibold">{t.department}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(e) => handleToggleStatus(t, e)}
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                                                isLeave
                                                    ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                                                    : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                            }`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${isLeave ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                            {isLeave ? 'On Leave' : 'Active'}
                                        </button>
                                    </div>

                                    {/* Subjects & Classes Banner */}
                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 mb-3 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 font-medium">Subjects</span>
                                            <span className="font-bold text-slate-900">{t.subjects || 'General'}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 font-medium">Classes</span>
                                            <span className="font-semibold text-slate-800">{t.classes || 'None'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAssigningTeacher(t);
                                                setIsAssignModalOpen(true);
                                            }}
                                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                                            title="Assign Class or Subject"
                                        >
                                            <PlusCircle size={15} />
                                        </button>
                                        {canEdit && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingTeacher(t);
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                                                title="Edit Profile"
                                            >
                                                <Edit3 size={15} />
                                            </button>
                                        )}
                                        {canDelete && (
                                            <button
                                                type="button"
                                                onClick={() => setTeacherToDelete(t)}
                                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                                title="Deactivate Teacher"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>
                                    <span
                                        onClick={() => navigate(`/school/teachers/${teacherId}`)}
                                        className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 cursor-pointer"
                                    >
                                        View 360° <ArrowRight size={13} />
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* ── Analytics View ─────────────────────────────────────────── */
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-6">
                    <div>
                        <h3 className="text-base font-bold text-slate-900 font-display">Faculty Performance & Workload Breakdown</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Summary metrics aggregated across all instructional departments</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200">
                            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Total Active Instructors</span>
                            <div className="text-3xl font-black text-blue-700 mt-2 font-display">{kpis.activeTeachers ?? 0}</div>
                            <p className="text-xs text-blue-600 mt-1 font-medium">Currently delivering curriculum</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Faculty Operational Rate</span>
                            <div className="text-3xl font-black text-emerald-700 mt-2 font-display">
                                {kpis.totalTeachers ? `${Math.round((kpis.activeTeachers / kpis.totalTeachers) * 100)}%` : '0%'}
                            </div>
                            <p className="text-xs text-emerald-600 mt-1 font-medium">Consistent instructional delivery</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200">
                            <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">Academic Departments</span>
                            <div className="text-3xl font-black text-purple-700 mt-2 font-display">{kpis.departmentsCount ?? 0}</div>
                            <p className="text-xs text-purple-600 mt-1 font-medium">Disciplines supported across school</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tier 5: Pagination Controls ─────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 font-medium">
                <div>
                    Showing <strong>{teachers.length}</strong> of <strong>{pagination.total}</strong> teachers
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={pagination.page <= 1}
                        className="px-3.5 py-1.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors font-bold flex items-center gap-1 cursor-pointer"
                    >
                        <ChevronLeft size={14} />
                        Previous
                    </button>
                    <span className="px-2 font-bold text-slate-900">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                        disabled={pagination.page >= pagination.totalPages}
                        className="px-3.5 py-1.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors font-bold flex items-center gap-1 cursor-pointer"
                    >
                        Next
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* Modals */}
            <AddTeacherModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => refetch()}
            />

            <EditTeacherModal
                isOpen={isEditModalOpen}
                teacher={editingTeacher}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingTeacher(null);
                }}
                onSuccess={() => refetch()}
            />

            <AssignClassSubjectModal
                isOpen={isAssignModalOpen}
                teacherId={assigningTeacher?.id || assigningTeacher?._id}
                teacherName={assigningTeacher?.name}
                onClose={() => {
                    setIsAssignModalOpen(false);
                    setAssigningTeacher(null);
                }}
                onSuccess={() => refetch()}
            />

            {/* Deactivation Confirmation Modal */}
            {teacherToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-6 space-y-4">
                        <div className="flex items-center gap-3 text-rose-600">
                            <div className="p-2.5 rounded-xl bg-rose-100">
                                <Trash2 size={20} />
                            </div>
                            <h3 className="text-base font-bold text-slate-900">Deactivate Teacher Profile</h3>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                            Are you sure you want to deactivate <strong className="text-slate-900">{teacherToDelete.name}</strong>?
                            Their teaching account and active class assignments will be marked as inactive.
                        </p>

                        <div className="pt-2 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setTeacherToDelete(null)}
                                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteTeacher}
                                disabled={isDeleting}
                                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
                            >
                                {isDeleting ? 'Deactivating...' : 'Confirm Deactivate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
