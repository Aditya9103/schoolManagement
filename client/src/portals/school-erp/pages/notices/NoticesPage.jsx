import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    Megaphone, Plus, Search, Filter, Grid, List, RefreshCw,
    Calendar, Users, Paperclip, Pin, CheckCircle2, AlertTriangle,
    Eye, Trash2, ArrowUpRight, Clock, ShieldAlert, Sparkles,
    ChevronLeft, ChevronRight, FileText, Star, AlertCircle
} from 'lucide-react';
import {
    useGetNoticesQuery,
    useTogglePinNoticeMutation,
    useDeleteNoticeMutation
} from '../../../../store/api/noticeApi';
import usePermissions from '../../../../hooks/usePermissions';
import CreateNoticeModal from './components/CreateNoticeModal';
import NoticeDetailModal from './components/NoticeDetailModal';

export default function NoticesPage() {
    const { user } = useSelector((state) => state.auth);
    const { isAdmin, hasAction } = usePermissions();
    const canCreate = isAdmin || hasAction('notices', 'create');
    const canDelete = isAdmin || hasAction('notices', 'delete');
    const userRole = user?.role;

    const [viewMode, setViewMode] = useState('feed'); // 'feed' | 'table'
    const [categoryTab, setCategoryTab] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [audienceFilter, setAudienceFilter] = useState('ALL');

    const audienceOptions = useMemo(() => {
        if (isAdmin) {
            return [
                { value: 'ALL', label: 'All Target Audiences' },
                { value: 'STUDENTS', label: 'Students Only' },
                { value: 'PARENTS', label: 'Parents Only' },
                { value: 'TEACHERS', label: 'Teachers Only' },
                { value: 'STAFF', label: 'Staff Only' },
                { value: 'SPECIFIC_CLASSES', label: 'Specific Classes' },
            ];
        }
        if (userRole === 'TEACHER') {
            return [
                { value: 'ALL', label: 'All My Notices' },
                { value: 'TEACHERS', label: 'Teachers & Faculty' },
                { value: 'STAFF', label: 'All Staff' },
                { value: 'SPECIFIC_CLASSES', label: 'My Assigned Classes' },
            ];
        }
        return [
            { value: 'ALL', label: 'All My Notices' },
            { value: 'STAFF', label: 'Staff Bulletins' },
        ];
    }, [isAdmin, userRole]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    // Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedNoticeForView, setSelectedNoticeForView] = useState(null);
    const [noticeToDelete, setNoticeToDelete] = useState(null);
    const [actionMsg, setActionMsg] = useState(null);

    const [togglePinNotice] = useTogglePinNoticeMutation();
    const [deleteNotice, { isLoading: isDeleting }] = useDeleteNoticeMutation();

    const queryParams = useMemo(() => ({
        page,
        limit: 10,
        search,
        category: categoryTab !== 'ALL' ? categoryTab : undefined,
        priority: priorityFilter !== 'ALL' ? priorityFilter : undefined,
        targetAudience: audienceFilter !== 'ALL' ? audienceFilter : undefined,
    }), [page, search, categoryTab, priorityFilter, audienceFilter]);

    const { data: resData, isLoading, refetch } = useGetNoticesQuery(queryParams);

    const notices = resData?.data?.notices || [];
    const kpis = resData?.data?.kpis || {
        totalNotices: notices.length,
        urgentNotices: notices.filter(n => n.priority === 'URGENT' || n.priority === 'HIGH').length,
        pinnedNotices: notices.filter(n => n.isPinned).length,
        totalAcknowledgements: 0,
    };
    const pagination = resData?.data?.pagination || { page: 1, totalPages: 1, total: notices.length };

    const handleReset = () => {
        setSearch('');
        setCategoryTab('ALL');
        setPriorityFilter('ALL');
        setAudienceFilter('ALL');
        setPage(1);
    };

    const handleTogglePin = async (noticeId, e) => {
        e?.stopPropagation();
        try {
            await togglePinNotice(noticeId).unwrap();
            setActionMsg({ type: 'success', text: 'Notice pinned status updated.' });
            setTimeout(() => setActionMsg(null), 3000);
        } catch (err) {
            setActionMsg({ type: 'error', text: 'Failed to update pin state.' });
            setTimeout(() => setActionMsg(null), 3000);
        }
    };

    const confirmDeleteNotice = async () => {
        if (!noticeToDelete) return;
        try {
            await deleteNotice(noticeToDelete._id || noticeToDelete.id).unwrap();
            setActionMsg({ type: 'success', text: 'Notice circular removed successfully.' });
            setNoticeToDelete(null);
            setTimeout(() => setActionMsg(null), 3000);
        } catch (err) {
            setActionMsg({ type: 'error', text: 'Failed to delete notice.' });
            setNoticeToDelete(null);
            setTimeout(() => setActionMsg(null), 3000);
        }
    };

    const statCards = [
        {
            title: 'Active Circulars',
            value: kpis.totalNotices ?? 0,
            subtext: 'Campus-wide notices',
            Icon: Megaphone,
            iconBg: 'bg-blue-100 text-blue-600',
        },
        {
            title: 'Urgent & High Priority',
            value: kpis.urgentNotices ?? 0,
            subtext: 'Action required alerts',
            Icon: AlertTriangle,
            iconBg: 'bg-rose-100 text-rose-600',
        },
        {
            title: 'Pinned Bulletins',
            value: kpis.pinnedNotices ?? 0,
            subtext: 'Featured on portals',
            Icon: Pin,
            iconBg: 'bg-amber-100 text-amber-600',
        },
        {
            title: 'Read Receipts',
            value: kpis.totalAcknowledgements ?? 0,
            subtext: 'Verified acknowledgments',
            Icon: CheckCircle2,
            iconBg: 'bg-emerald-100 text-emerald-600',
        },
    ];

    const categoryTabs = [
        { id: 'ALL', label: 'All Notices' },
        { id: 'ACADEMIC', label: 'Academic' },
        { id: 'EVENT', label: 'Events' },
        { id: 'EXAMINATION', label: 'Exams' },
        { id: 'HOLIDAY', label: 'Holidays' },
        { id: 'ADMINISTRATIVE', label: 'Administrative' },
        { id: 'EMERGENCY', label: 'Emergency' },
    ];

    const priorityBadge = (priority) => {
        switch (priority) {
            case 'URGENT':
                return 'bg-rose-50 text-rose-700 border-rose-300';
            case 'HIGH':
                return 'bg-amber-50 text-amber-700 border-amber-300';
            case 'LOW':
                return 'bg-slate-100 text-slate-700 border-slate-300';
            default:
                return 'bg-blue-50 text-blue-700 border-blue-200';
        }
    };

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
                        <Megaphone size={24} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">
                                Notice Board & Circulars
                            </h1>
                            <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider">
                                Campus Communication
                            </span>
                            <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold inline-flex items-center gap-1 font-mono">
                                {kpis.totalNotices} Circulars
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                            Publish administrative notices, academic circulars, exam guidelines, and emergency alerts across the school.
                        </p>
                    </div>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap shrink-0 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="p-2.5 text-slate-600 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-2xs hover:border-slate-400 cursor-pointer"
                        title="Refresh notices"
                    >
                        <RefreshCw size={15} />
                    </button>

                    {canCreate && (
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
                        >
                            <Plus size={16} />
                            <span>Publish Notice</span>
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
                {/* Category Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 overflow-x-auto">
                        {categoryTabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => { setCategoryTab(tab.id); setPage(1); }}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                                    categoryTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button
                            type="button"
                            onClick={() => setViewMode('feed')}
                            className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                viewMode === 'feed' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                            }`}
                            title="Cards Feed View"
                        >
                            <Grid size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('table')}
                            className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                viewMode === 'table' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                            }`}
                            title="Table View"
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>

                {/* Search & Selectors */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search notices by title or content keywords..."
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-500 shadow-2xs transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                        <select
                            value={priorityFilter}
                            onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
                            className="px-3.5 py-2.5 bg-slate-50 hover:bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition-colors cursor-pointer"
                        >
                            <option value="ALL">All Priorities</option>
                            <option value="URGENT">Urgent Alerts</option>
                            <option value="HIGH">High Priority</option>
                            <option value="NORMAL">Normal Priority</option>
                            <option value="LOW">Low Priority</option>
                        </select>

                        <select
                            value={audienceFilter}
                            onChange={(e) => { setAudienceFilter(e.target.value); setPage(1); }}
                            className="px-3.5 py-2.5 bg-slate-50 hover:bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition-colors cursor-pointer"
                        >
                            {audienceOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>

                        {(search || categoryTab !== 'ALL' || priorityFilter !== 'ALL' || audienceFilter !== 'ALL') && (
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

            {/* ── Tier 4: Main Content (Feed vs. Table) ────────────────────────── */}
            {isLoading ? (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-16 shadow-2xs text-center space-y-3">
                    <RefreshCw size={28} className="animate-spin text-blue-600 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">Loading campus circulars...</p>
                </div>
            ) : notices.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-16 shadow-2xs text-center space-y-3">
                    <Megaphone size={36} className="text-slate-300 mx-auto" />
                    <h3 className="text-sm font-bold text-slate-900">No notices published</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                        No circulars match your selected filters. Publish a new notice or reset your search criteria.
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-2">
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
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer"
                            >
                                Publish First Notice
                            </button>
                        )}
                    </div>
                </div>
            ) : viewMode === 'feed' ? (
                /* ── Cards Feed View ────────────────────────────────────────── */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notices.map((n) => {
                        const noticeId = n._id || n.id;
                        const dateFormatted = n.publishedAt
                            ? new Date(n.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                            : 'Recently';

                        return (
                            <div
                                key={noticeId}
                                onClick={() => setSelectedNoticeForView(n)}
                                className={`bg-white rounded-2xl border p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group ${
                                    n.priority === 'URGENT'
                                        ? 'border-rose-300 hover:border-rose-400 bg-gradient-to-b from-rose-50/20 to-white'
                                        : n.isPinned
                                        ? 'border-amber-300 hover:border-amber-400 bg-gradient-to-b from-amber-50/20 to-white'
                                        : 'border-slate-200/90 hover:border-blue-400'
                                }`}
                            >
                                <div>
                                    {/* Top badges bar */}
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border uppercase tracking-wider ${
                                                priorityBadge(n.priority)
                                            }`}>
                                                {n.priority}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                                                {n.category}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                type="button"
                                                onClick={(e) => handleTogglePin(noticeId, e)}
                                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                                    n.isPinned
                                                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                        : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                                                }`}
                                                title={n.isPinned ? 'Unpin circular' : 'Pin to top'}
                                            >
                                                <Pin size={14} className={n.isPinned ? 'fill-amber-600' : ''} />
                                            </button>

                                            {canDelete && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setNoticeToDelete(n);
                                                    }}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Delete circular"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Title & snippet */}
                                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm line-clamp-2 leading-snug">
                                        {n.title}
                                    </h3>

                                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed font-normal">
                                        {n.content}
                                    </p>
                                </div>

                                {/* Bottom meta bar */}
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-slate-500 font-semibold text-[11px]">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} className="text-blue-600" />
                                            {dateFormatted}
                                        </span>
                                        {n.attachments && n.attachments.length > 0 && (
                                            <span className="inline-flex items-center gap-0.5 text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                                <Paperclip size={10} />
                                                {n.attachments.length} doc
                                            </span>
                                        )}
                                    </div>

                                    <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                                        {n.targetAudience}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* ── High-Contrast Table View ─────────────────────────────── */
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-700 text-[11px] font-extrabold uppercase tracking-wider">
                                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                                    <th className="py-3.5 px-4 min-w-[280px]">Notice Title</th>
                                    <th className="py-3.5 px-4">Category</th>
                                    <th className="py-3.5 px-4">Priority</th>
                                    <th className="py-3.5 px-4">Target Audience</th>
                                    <th className="py-3.5 px-4">Published Date</th>
                                    <th className="py-3.5 px-4 text-center">Attachments</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {notices.map((n, idx) => {
                                    const noticeId = n._id || n.id;
                                    const dateFormatted = n.publishedAt
                                        ? new Date(n.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                        : 'Recently';

                                    return (
                                        <tr
                                            key={noticeId}
                                            onClick={() => setSelectedNoticeForView(n)}
                                            className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                                        >
                                            <td className="py-3.5 px-4 text-center text-slate-400 font-bold">
                                                {(page - 1) * 10 + idx + 1}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-2">
                                                    {n.isPinned && (
                                                        <Pin size={13} className="text-amber-500 fill-amber-500 shrink-0" />
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm line-clamp-1">
                                                            {n.title}
                                                        </div>
                                                        <div className="text-[11px] text-slate-500 line-clamp-1 font-normal mt-0.5">
                                                            {n.content}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 font-bold text-slate-800">
                                                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px]">
                                                    {n.category}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold border uppercase ${
                                                    priorityBadge(n.priority)
                                                }`}>
                                                    {n.priority}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 font-semibold text-slate-700">
                                                {n.targetAudience}
                                            </td>

                                            <td className="py-3.5 px-4 font-medium text-slate-600">
                                                {dateFormatted}
                                            </td>

                                            <td className="py-3.5 px-4 text-center">
                                                {n.attachments && n.attachments.length > 0 ? (
                                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px] inline-flex items-center gap-1">
                                                        <Paperclip size={11} />
                                                        {n.attachments.length}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">—</span>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleTogglePin(noticeId, e)}
                                                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                                            n.isPinned
                                                                ? 'text-amber-600 bg-amber-50'
                                                                : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                                                        }`}
                                                        title="Pin / Unpin"
                                                    >
                                                        <Pin size={14} className={n.isPinned ? 'fill-amber-600' : ''} />
                                                    </button>

                                                    {canDelete && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setNoticeToDelete(n);
                                                            }}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                            title="Delete notice"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedNoticeForView(n)}
                                                        className="px-2.5 py-1 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200/80 transition-all inline-flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <Eye size={13} />
                                                        <span>View</span>
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
            )}

            {/* ── Tier 5: Pagination Controls ─────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 font-medium">
                <div>
                    Showing <strong>{notices.length}</strong> of <strong>{pagination.total}</strong> circulars
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
            <CreateNoticeModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => refetch()}
            />

            <NoticeDetailModal
                isOpen={Boolean(selectedNoticeForView)}
                notice={selectedNoticeForView}
                onClose={() => setSelectedNoticeForView(null)}
                onUpdated={() => refetch()}
            />

            {/* Deletion confirmation modal */}
            {noticeToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-6 space-y-4">
                        <div className="flex items-center gap-3 text-rose-600">
                            <div className="p-2.5 rounded-xl bg-rose-100">
                                <Trash2 size={20} />
                            </div>
                            <h3 className="text-base font-bold text-slate-900">Delete Circular</h3>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                            Are you sure you want to permanently delete circular <strong className="text-slate-900">"{noticeToDelete.title}"</strong>?
                            This will remove it from all student, parent, and faculty noticeboards.
                        </p>

                        <div className="pt-2 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setNoticeToDelete(null)}
                                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteNotice}
                                disabled={isDeleting}
                                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
                            >
                                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
