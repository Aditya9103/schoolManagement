import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    BookOpen,
    Plus,
    Search,
    RotateCcw,
    Layers,
    Users,
    Clock,
    Sparkles,
    CheckCircle2,
    MoreVertical,
    Edit2,
    Trash2,
    UserCheck,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight,
    Download,
    Filter,
    Check,
    PieChart,
    Calendar,
    Award,
    Hash,
} from 'lucide-react';
import {
    useGetClassesQuery,
    useGetSubjectsQuery,
    useDeleteSubjectMutation,
    useGetStaffTeachersQuery,
} from '../../../../store/api/classApi';
import SubjectFormModal from './components/SubjectFormModal';
import AssignSubjectTeachersModal from './components/AssignSubjectTeachersModal';
import toast from 'react-hot-toast';

export default function ClassSubjectsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClassId = searchParams.get('classId') || '';

    // Active filters
    const [selectedTab, setSelectedTab] = useState('ALL'); // 'ALL' | 'Core' | 'Elective' | 'Assignment' | 'Categories'
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [selectedClassId, setSelectedClassId] = useState(queryClassId);
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // Modals
    const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
    const [subjectToEdit, setSubjectToEdit] = useState(null);
    const [assignTargetSubject, setAssignTargetSubject] = useState(null);
    const [activeActionMenuId, setActiveActionMenuId] = useState(null);

    // Queries
    const { data: classesRes } = useGetClassesQuery();
    const classes = classesRes?.data || [];

    const queryParams = useMemo(() => {
        const p = {};
        if (selectedClassId) p.classId = selectedClassId;
        if (selectedCategory !== 'ALL') p.category = selectedCategory;
        if (selectedTab === 'Core' || selectedTab === 'Elective') p.type = selectedTab;
        if (selectedStatus !== 'ALL') p.status = selectedStatus;
        if (searchQuery.trim()) p.search = searchQuery.trim();
        return p;
    }, [selectedClassId, selectedCategory, selectedTab, selectedStatus, searchQuery]);

    const { data: subjectsRes, isLoading, refetch } = useGetSubjectsQuery(queryParams);
    const { data: staffTeachersRes } = useGetStaffTeachersQuery();
    const staffTeachers = staffTeachersRes?.data || [];

    const [deleteSubject, { isLoading: isDeleting }] = useDeleteSubjectMutation();

    const subjectsData = subjectsRes?.data || {};
    const subjectsList = subjectsData.subjects || [];
    const stats = subjectsData.stats || {
        totalSubjects: subjectsList.length,
        coreSubjects: subjectsList.filter((s) => s.type === 'Core').length,
        electiveSubjects: subjectsList.filter((s) => s.type === 'Elective').length,
        assignedTeachers: staffTeachers.length,
        classesCovered: '100%',
        avgPeriodsPerWeek: 5,
    };
    const categoriesBreakdown = subjectsData.categoriesBreakdown || [];
    const recentlyAdded = subjectsData.recentlyAdded || [];

    // Distinct categories for filter
    const CATEGORIES = [
        'ALL',
        'Languages',
        'Mathematics',
        'Science',
        'Humanities',
        'Technology',
        'Arts',
        'Sports',
        'Other',
    ];

    const handleResetFilters = () => {
        setSelectedTab('ALL');
        setSelectedCategory('ALL');
        setSelectedClassId('');
        setSelectedStatus('ALL');
        setSearchQuery('');
        setSearchParams({});
    };

    const handleDeleteSubject = async (subId, subName) => {
        if (!window.confirm(`Are you sure you want to delete "${subName}"? This action cannot be undone.`)) return;
        try {
            await deleteSubject(subId).unwrap();
            toast.success(`Subject "${subName}" deleted successfully`);
            setActiveActionMenuId(null);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to delete subject');
        }
    };

    // Pagination for bottom table
    const totalPages = Math.ceil(subjectsList.length / pageSize) || 1;
    const paginatedSubjects = useMemo(() => {
        const start = (page - 1) * pageSize;
        return subjectsList.slice(start, start + pageSize);
    }, [subjectsList, page, pageSize]);

    // Donut chart stroke math
    const totalCategoriesCount = categoriesBreakdown.reduce((sum, c) => sum + c.count, 0) || 1;
    let accumulatedOffset = 0;

    return (
        <div className="space-y-6 pb-12">
            {/* Top Header Banner with Quote */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-7 sm:p-9 shadow-xl border border-white/10">
                {/* Background ambient lighting */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
                <div className="absolute left-1/3 -bottom-20 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-2xl space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-blue-200 text-xs font-semibold">
                            <Sparkles size={13} className="text-amber-400" />
                            <span>Curriculum & Academic Subjects Directory</span>
                        </div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
                            "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
                        </h1>
                        <p className="text-xs sm:text-sm text-blue-200/80 font-medium">
                            — Malcolm X • Empowering academic excellence through structured modular learning
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            onClick={() => setIsAddSubjectOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
                        >
                            <Plus size={18} />
                            <span>+ Add Subject</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 6 Metric Cards with Sparklines */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {/* Total Subjects */}
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-200 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Total Subjects</span>
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <BookOpen size={16} />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-2xl font-black text-slate-900">{stats.totalSubjects}</span>
                        <span className="text-[11px] font-bold text-emerald-700 ml-1.5">+100% active</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: '100%' }} />
                    </div>
                </div>

                {/* Active Subjects */}
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-200 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Active Subjects</span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center">
                            <CheckCircle2 size={16} />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-2xl font-black text-emerald-700">{stats.totalSubjects}</span>
                        <span className="text-[11px] font-semibold text-slate-600 ml-1.5">In curriculum</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
                    </div>
                </div>

                {/* Total Classes */}
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Classes Covered</span>
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Layers size={16} />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-2xl font-black text-indigo-700">{classes.length} Classes</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: '100%' }} />
                    </div>
                </div>

                {/* Assigned Teachers */}
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-200 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Faculty Assigned</span>
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center">
                            <Users size={16} />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-2xl font-black text-purple-700">{stats.assignedTeachers}</span>
                        <span className="text-[11px] font-semibold text-slate-600 ml-1.5">Educators</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-purple-600 h-full rounded-full" style={{ width: '85%' }} />
                    </div>
                </div>

                {/* Periods per Week */}
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-200 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Avg Periods/Wk</span>
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 font-bold flex items-center justify-center">
                            <Clock size={16} />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-2xl font-black text-amber-700">{stats.avgPeriodsPerWeek}</span>
                        <span className="text-[11px] font-semibold text-slate-600 ml-1.5">Periods / Sub</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '70%' }} />
                    </div>
                </div>

                {/* Elective Subjects */}
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-pink-200 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Electives</span>
                        <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                            <Sparkles size={16} />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-2xl font-black text-pink-700">{stats.electiveSubjects}</span>
                        <span className="text-[11px] font-semibold text-slate-600 ml-1.5">({stats.coreSubjects} Core)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-pink-500 h-full rounded-full" style={{ width: '40%' }} />
                    </div>
                </div>
            </div>


            {/* Filter Bar & Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
                {/* Tabs */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
                        {[
                            { key: 'ALL', label: 'All Subjects', count: stats.totalSubjects },
                            { key: 'Core', label: 'Core Curriculum', count: stats.coreSubjects },
                            { key: 'Elective', label: 'Electives', count: stats.electiveSubjects },
                            { key: 'Assignment', label: 'Faculty Assignments', count: stats.assignedTeachers },
                            { key: 'Categories', label: 'Categories Matrix', count: categoriesBreakdown.length },
                        ].map((tab) => {
                            const isSelected = selectedTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setSelectedTab(tab.key)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                                        isSelected
                                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span
                                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-700'
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={handleResetFilters}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 font-medium hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <RotateCcw size={13} />
                        <span>Reset Filters</span>
                    </button>
                </div>

                {/* Filter Controls Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-1">
                    {/* Category Selector */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-1">
                            Category
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                    {c === 'ALL' ? 'All Categories' : c}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Class Selector */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-1">
                            Assigned Class
                        </label>
                        <select
                            value={selectedClassId}
                            onChange={(e) => {
                                setSelectedClassId(e.target.value);
                                if (e.target.value) setSearchParams({ classId: e.target.value });
                                else setSearchParams({});
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                            <option value="">All Classes</option>
                            {classes.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-1">
                            Status
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                            <option value="ALL">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Search */}
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-1">
                            Search Subjects
                        </label>
                        <div className="relative">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by title, code (e.g. MATH, SCI)..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout: 8-Card Grid (Left) + Right Widgets (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Subjects Grid (Takes 2 Columns on desktop) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 tracking-tight">Active Curriculum Subjects</h2>
                            <p className="text-xs text-slate-600 font-medium">
                                Showing {subjectsList.length} subjects matching current filters
                            </p>
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                            Page {page} of {totalPages}
                        </span>
                    </div>


                    {isLoading ? (
                        <div className="py-24 text-center bg-white rounded-3xl border border-slate-200/80">
                            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-xs font-semibold text-slate-700 font-medium">Loading curriculum subjects...</p>
                        </div>
                    ) : subjectsList.length === 0 ? (
                        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                                <BookOpen size={28} />
                            </div>
                            <h3 className="text-base font-bold text-slate-800">No subjects found</h3>
                            <p className="text-xs text-slate-700 font-medium max-w-sm mx-auto">
                                There are no subjects matching your filters. Try resetting filters or add a new subject.
                            </p>
                            <button
                                onClick={() => setIsAddSubjectOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm"
                            >
                                <Plus size={15} /> Add Subject
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {subjectsList.map((subject) => {
                                const teachers = subject.teachersAssigned?.length
                                    ? subject.teachersAssigned
                                    : subject.teacherId
                                    ? [subject.teacherId]
                                    : [];
                                const assignedClasses = subject.classesAssigned?.length
                                    ? subject.classesAssigned
                                    : subject.classId
                                    ? [subject.classId]
                                    : [];
                                const isActionOpen = activeActionMenuId === subject._id;

                                return (
                                    <div
                                        key={subject._id}
                                        className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300/80 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between relative group"
                                    >
                                        {/* Card Top: Code Pill, Category & 3-Dot Menu */}
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider text-white shadow-xs"
                                                    style={{ backgroundColor: subject.color || '#3B82F6' }}
                                                >
                                                    {subject.code || 'SUB'}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">
                                                    {subject.category || 'General'}
                                                </span>
                                            </div>

                                            <div className="relative">
                                                <button
                                                    onClick={() => setActiveActionMenuId(isActionOpen ? null : subject._id)}
                                                    className="p-1 text-slate-600 font-medium hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                                                >
                                                    <MoreVertical size={16} />
                                                </button>

                                                {/* Action Menu Dropdown */}
                                                {isActionOpen && (
                                                    <div className="absolute right-0 top-7 z-30 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 animate-in fade-in zoom-in-95 duration-150">
                                                        <button
                                                            onClick={() => {
                                                                setSubjectToEdit(subject);
                                                                setActiveActionMenuId(null);
                                                            }}
                                                            className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                                                        >
                                                            <Edit2 size={13} />
                                                            <span>Edit Subject</span>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setAssignTargetSubject(subject);
                                                                setActiveActionMenuId(null);
                                                            }}
                                                            className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
                                                        >
                                                            <UserCheck size={13} />
                                                            <span>Assign Faculty</span>
                                                        </button>
                                                        <div className="my-1 border-t border-slate-100" />
                                                        <button
                                                            onClick={() => handleDeleteSubject(subject._id, subject.name)}
                                                            className="w-full px-3.5 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                        >
                                                            <Trash2 size={13} />
                                                            <span>Delete Subject</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Subject Name & Description */}
                                        <div className="mt-3.5 space-y-1">
                                            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                {subject.name}
                                            </h3>
                                            <p className="text-xs text-slate-700 font-medium line-clamp-2 leading-relaxed">
                                                {subject.description || 'Comprehensive curriculum module for student intellectual development.'}
                                            </p>
                                        </div>

                                        {/* Classes Assigned Pills */}
                                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                                            <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                                                <span>Target Classes</span>
                                                <span className="text-slate-600 font-bold">{assignedClasses.length} Classes</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
                                                {assignedClasses.length === 0 ? (
                                                    <span className="text-[11px] text-slate-600 font-semibold italic">No classes linked</span>
                                                ) : (
                                                    assignedClasses.slice(0, 4).map((c, idx) => (
                                                        <span
                                                            key={c._id || idx}
                                                            className="px-2 py-0.5 rounded-md bg-blue-50/70 border border-blue-100 text-blue-700 text-[10px] font-bold"
                                                        >
                                                            {c.name || `Class ${idx + 1}`}
                                                        </span>
                                                    ))
                                                )}
                                                {assignedClasses.length > 4 && (
                                                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                                                        +{assignedClasses.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Assigned Educators Avatars */}
                                        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2 overflow-hidden">
                                                    {teachers.length === 0 ? (
                                                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-white text-slate-600 font-semibold flex items-center justify-center text-[10px] font-bold">
                                                            ?
                                                        </div>
                                                    ) : (
                                                        teachers.slice(0, 3).map((t, idx) => (
                                                            <div
                                                                key={t._id || idx}
                                                                title={`${t.firstName || ''} ${t.lastName || ''}`.trim()}
                                                                className="w-7 h-7 rounded-full border-2 border-white bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] overflow-hidden"
                                                            >
                                                                {t.profilePhotoUrl ? (
                                                                    <img src={t.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <span>{t.firstName?.[0] || 'T'}</span>
                                                                )}
                                                            </div>
                                                        ))
                                                    )}
                                                    {teachers.length > 3 && (
                                                        <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                                                            +{teachers.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-700">
                                                    {teachers.length === 0
                                                        ? 'No faculty'
                                                        : teachers.length === 1
                                                        ? `${teachers[0].firstName || ''} ${teachers[0].lastName || ''}`.trim()
                                                        : `${teachers.length} Faculty`}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => setAssignTargetSubject(subject)}
                                                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                Assign
                                            </button>
                                        </div>

                                        {/* Card Footer: Periods & Type */}
                                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                            <span className="flex items-center gap-1.5 text-slate-600 font-bold">
                                                <Clock size={13} className="text-slate-600 font-medium" />
                                                <span>{subject.periodsPerWeek || 5} Periods / Wk</span>
                                            </span>

                                            <span
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    subject.type === 'Elective'
                                                        ? 'bg-pink-50 text-pink-700 border border-pink-200'
                                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                }`}
                                            >
                                                {subject.type || 'Core'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right Column: Widgets */}
                <div className="space-y-5">
                    {/* Widget 1: Subject Distribution by Category (Visual SVG Donut) */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <PieChart size={17} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">Subject Distribution</h3>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 font-extrabold">By Category</span>
                        </div>

                        {/* Visual SVG Donut Chart */}
                        <div className="flex items-center justify-center py-2">
                            <div className="relative w-40 h-40">
                                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                    {categoriesBreakdown.length === 0 ? (
                                        <circle
                                            cx="18"
                                            cy="18"
                                            r="15.91549430918954"
                                            fill="transparent"
                                            stroke="#E2E8F0"
                                            strokeWidth="3.5"
                                        />
                                    ) : (
                                        categoriesBreakdown.map((cat, idx) => {
                                            const pct = cat.percentage || 0;
                                            const strokeDash = `${pct} ${100 - pct}`;
                                            const currentOffset = accumulatedOffset;
                                            accumulatedOffset += pct;

                                            return (
                                                <circle
                                                    key={cat.name}
                                                    cx="18"
                                                    cy="18"
                                                    r="15.91549430918954"
                                                    fill="transparent"
                                                    stroke={cat.color || '#3B82F6'}
                                                    strokeWidth="3.8"
                                                    strokeDasharray={strokeDash}
                                                    strokeDashoffset={-currentOffset}
                                                    className="transition-all duration-500 hover:stroke-width-5 cursor-pointer"
                                                />
                                            );
                                        })
                                    )}
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-2xl font-black text-slate-900">{stats.totalSubjects}</span>
                                    <span className="text-[10px] font-bold text-slate-700 font-extrabold uppercase tracking-wider">Subjects</span>
                                </div>
                            </div>
                        </div>

                        {/* Breakdown Key List */}
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                            {categoriesBreakdown.slice(0, 5).map((cat) => (
                                <div key={cat.name} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span className="font-semibold text-slate-700">{cat.name}</span>
                                    </div>
                                    <span className="font-bold text-slate-900">
                                        {cat.count} ({cat.percentage}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Widget 2: Quick Actions */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-5 text-white shadow-lg shadow-blue-500/20 space-y-4">
                        <div className="flex items-center gap-2">
                            <Sparkles size={18} className="text-amber-300" />
                            <h3 className="text-sm font-bold text-white">Curriculum Quick Actions</h3>
                        </div>
                        <p className="text-xs text-blue-100 leading-relaxed">
                            Quickly allocate curriculum across classes, assign faculty, or download syllabus roster.
                        </p>
                        <div className="space-y-2 pt-1">
                            <button
                                onClick={() => setIsAddSubjectOpen(true)}
                                className="w-full py-2.5 px-3 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between"
                            >
                                <span>+ Add New Subject Module</span>
                                <Plus size={15} />
                            </button>
                            <button
                                onClick={() => {
                                    if (subjectsList[0]) setAssignTargetSubject(subjectsList[0]);
                                }}
                                className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between border border-white/15"
                            >
                                <span>Assign Faculty to Subjects</span>
                                <UserCheck size={15} />
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedTab('Core');
                                    toast.success('Filtered to Core curriculum');
                                }}
                                className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between border border-white/15"
                            >
                                <span>Inspect Core Subjects Only</span>
                                <ArrowUpRight size={15} />
                            </button>
                        </div>
                    </div>

                    {/* Widget 3: Recently Added Subjects */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-3.5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">Recently Added</h3>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Latest</span>
                        </div>

                        <div className="space-y-3">
                            {recentlyAdded.length === 0 ? (
                                <p className="text-xs text-slate-600 font-semibold py-4 text-center">No recent subjects</p>
                            ) : (
                                recentlyAdded.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-black flex items-center justify-center text-xs">
                                                {item.code?.slice(0, 3) || 'SUB'}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">{item.name}</p>
                                                <p className="text-[10px] text-slate-600 font-semibold">{item.category} • {item.type}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-semibold text-slate-600">
                                            {item.addedDate}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Table: Full Subjects Roster */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Complete Subjects Directory</h3>
                        <p className="text-xs text-slate-700 font-medium">Comprehensive tabular overview with direct educator assignments</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                const headers = ['Name', 'Code', 'Category', 'Type', 'PeriodsPerWeek', 'Status'];
                                const rows = subjectsList.map((s) => [s.name, s.code, s.category, s.type, s.periodsPerWeek, s.status]);
                                const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
                                const encodedUri = encodeURI(csvContent);
                                const link = document.createElement('a');
                                link.setAttribute('href', encodedUri);
                                link.setAttribute('download', 'curriculum_subjects.csv');
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                toast.success('Curriculum exported to CSV');
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                        >
                            <Download size={14} />
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-100/80 text-slate-700 font-extrabold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                                <th className="py-3.5 px-5">Subject & Code</th>
                                <th className="py-3.5 px-4">Category</th>
                                <th className="py-3.5 px-4">Curriculum Type</th>
                                <th className="py-3.5 px-4">Assigned Educators</th>
                                <th className="py-3.5 px-4">Classes Count</th>
                                <th className="py-3.5 px-4">Periods/Wk</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                            {paginatedSubjects.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-12 text-center text-slate-600 font-semibold">
                                        No subjects found in this view.
                                    </td>
                                </tr>
                            ) : (
                                paginatedSubjects.map((subject) => {
                                    const teachers = subject.teachersAssigned?.length
                                        ? subject.teachersAssigned
                                        : subject.teacherId
                                        ? [subject.teacherId]
                                        : [];
                                    const classesCount = subject.classesAssigned?.length || (subject.classId ? 1 : 0);

                                    return (
                                        <tr key={subject._id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-3.5 px-5">
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-xs"
                                                        style={{ backgroundColor: subject.color || '#3B82F6' }}
                                                    >
                                                        {subject.code?.slice(0, 3) || 'SUB'}
                                                    </span>
                                                    <div>
                                                        <span className="font-extrabold text-slate-900 block">{subject.name}</span>
                                                        <span className="text-[10px] text-slate-600 font-bold font-mono">Code: {subject.code}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-slate-800">
                                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold">
                                                    {subject.category || 'Other'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                        subject.type === 'Elective'
                                                            ? 'bg-pink-50 text-pink-700 border border-pink-200'
                                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    }`}
                                                >
                                                    {subject.type || 'Core'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {teachers.length === 0 ? (
                                                    <button
                                                        onClick={() => setAssignTargetSubject(subject)}
                                                        className="text-amber-800 font-bold font-semibold hover:underline text-[11px]"
                                                    >
                                                        + Assign Educator
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="flex -space-x-1.5 overflow-hidden">
                                                            {teachers.slice(0, 2).map((t, idx) => (
                                                                <div
                                                                    key={t._id || idx}
                                                                    className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] border border-white"
                                                                >
                                                                    {t.firstName?.[0] || 'T'}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <span className="text-slate-800 font-bold">
                                                            {teachers.map((t) => `${t.firstName || ''} ${t.lastName || ''}`.trim()).join(', ')}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-slate-800">
                                                {classesCount} Classes
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-blue-600">
                                                {subject.periodsPerWeek || 5} Periods
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                                    {subject.status || 'Active'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => setAssignTargetSubject(subject)}
                                                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-colors"
                                                        title="Assign Educators"
                                                    >
                                                        Assign
                                                    </button>
                                                    <button
                                                        onClick={() => setSubjectToEdit(subject)}
                                                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                                        title="Edit Subject"
                                                    >
                                                        <Edit2 size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSubject(subject._id, subject.name)}
                                                        className="p-1.5 text-slate-600 font-medium hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                                        title="Delete Subject"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 px-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700 font-medium">
                        <span>
                            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, subjectsList.length)} of {subjectsList.length} subjects
                        </span>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                            >
                                <ChevronLeft size={15} />
                            </button>
                            {Array.from({ length: totalPages }).map((_, idx) => (
                                <button
                                    key={idx + 1}
                                    onClick={() => setPage(idx + 1)}
                                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                                        page === idx + 1
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                            >
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <SubjectFormModal
                isOpen={isAddSubjectOpen}
                onClose={() => setIsAddSubjectOpen(false)}
            />

            {subjectToEdit && (
                <SubjectFormModal
                    isOpen={!!subjectToEdit}
                    onClose={() => setSubjectToEdit(null)}
                    initialData={subjectToEdit}
                />
            )}

            {assignTargetSubject && (
                <AssignSubjectTeachersModal
                    isOpen={!!assignTargetSubject}
                    onClose={() => setAssignTargetSubject(null)}
                    subject={assignTargetSubject}
                />
            )}
        </div>
    );
}
