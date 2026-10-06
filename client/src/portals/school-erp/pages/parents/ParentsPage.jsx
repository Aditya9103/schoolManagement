import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Plus, Search, Filter, Grid, List, Phone, Mail,
    MapPin, Briefcase, GraduationCap, ChevronLeft, ChevronRight,
    RefreshCw, ShieldCheck, CheckCircle2, MoreVertical, Eye, HeartHandshake,
    Sparkles, UserCheck, ShieldAlert, Download
} from 'lucide-react';
import { useGetParentsQuery } from '../../../../store/api/peopleApi';
import usePermissions from '../../../../hooks/usePermissions';
import AddParentModal from './components/AddParentModal';

export default function ParentsPage() {
    const navigate = useNavigate();
    const { canAccess, hasAction, isAdmin } = usePermissions();

    const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
    const [search, setSearch] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedPickup, setSelectedPickup] = useState('All');
    const [page, setPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const queryParams = useMemo(() => ({
        page,
        limit: 10,
        search,
        status: selectedStatus !== 'All' ? selectedStatus : undefined
    }), [page, search, selectedStatus]);

    const { data: resData, isLoading, refetch } = useGetParentsQuery(queryParams);

    const rawParents = resData?.data?.parents || [];
    const parents = useMemo(() => {
        if (selectedPickup === 'All') return rawParents;
        if (selectedPickup === 'AUTHORIZED') {
            return rawParents.filter(p => p.canPickupStudent !== false);
        }
        return rawParents.filter(p => p.canPickupStudent === false);
    }, [rawParents, selectedPickup]);

    const kpis = resData?.data?.kpis || {
        totalParents: rawParents.length,
        activeGuardians: rawParents.filter(p => p.status === 'ACTIVE').length,
        multiChildFamilies: rawParents.filter(p => (p.childrenCount || 0) > 1).length,
        portalActiveRate: rawParents.length ? Math.round((rawParents.filter(p => p.status === 'ACTIVE').length / rawParents.length) * 100) : 0
    };
    const pagination = resData?.data?.pagination || { page: 1, totalPages: 1, total: rawParents.length };

    const canCreate = isAdmin || hasAction('parents_directory', 'create');

    const handleResetFilters = () => {
        setSearch('');
        setSelectedStatus('All');
        setSelectedPickup('All');
        setPage(1);
    };

    const handleExportCSV = () => {
        if (!parents.length) {
            alert('No parent records available to export.');
            return;
        }

        const headers = [
            'Parent / Guardian Name',
            'Relationship',
            'Email',
            'Phone',
            'Children Count',
            'Occupation',
            'Can Pickup Student',
            'Emergency Contact'
        ];

        const rows = parents.map((p) => [
            `"${p.name || ''}"`,
            `"${p.relationship || 'Guardian'}"`,
            `"${p.email || ''}"`,
            `"${p.phone || ''}"`,
            `"${p.childrenCount || 0}"`,
            `"${p.occupation || ''}"`,
            `"${p.canPickupStudent !== false ? 'Authorized' : 'Restricted'}"`,
            `"${p.isEmergencyContact ? 'Yes' : 'No'}"`
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Parents_Directory_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 pb-12">
            {/* ── Enterprise Header Hub ────────────────────────────────────── */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-2xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0">
                            <Users className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200/70">
                                    Family Linkage Hub
                                </span>
                                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Active Academic Term 2026-27
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                                Parents & Guardians
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-2xl">
                                Complete parent profiles, student ↔ family relationships, verified emergency contacts, and campus pickup authorizations.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
                        <button
                            type="button"
                            onClick={handleExportCSV}
                            className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                            title="Export parents registry to CSV"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export CSV</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                            title="Refresh registry"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>

                        {canCreate && (
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(true)}
                                className="px-4 sm:px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 rounded-xl shadow-md shadow-purple-500/25 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <Plus className="w-4 h-4 stroke-[2.5]" />
                                <span>Register Parent</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── 4-Card Stats Summary Row ─────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-bold text-slate-600">Total Guardians</span>
                        <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200/80 text-purple-700 flex items-center justify-center">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                        {kpis.totalParents}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center gap-1">
                        <span className="text-purple-600 font-bold">100%</span> mapped in portal database
                    </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-bold text-slate-600">Verified Contacts</span>
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-display">
                        {kpis.activeGuardians}
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Active phone & email channels
                    </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-bold text-slate-600">Multi-Child Families</span>
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-700 flex items-center justify-center">
                            <HeartHandshake className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700 font-display">
                        {kpis.multiChildFamilies}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 mt-1">
                        2 or more enrolled students
                    </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-bold text-slate-600">Portal Adoption</span>
                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-700 flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 font-display">
                        {kpis.portalActiveRate}%
                    </div>
                    <div className="text-[11px] font-semibold text-blue-700 mt-1">
                        Mobile app authenticated
                    </div>
                </div>
            </div>

            {/* ── Search & Filter Controls Bar ─────────────────────────────── */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by guardian name, mobile, child name, or guardian ID..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                        {/* Status Filter */}
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5">
                            <Filter className="w-3.5 h-3.5 text-slate-600" />
                            <select
                                value={selectedStatus}
                                onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
                                className="text-xs font-bold bg-transparent text-slate-800 border-none focus:outline-none cursor-pointer pr-1"
                            >
                                <option value="All">All Statuses</option>
                                <option value="ACTIVE">Active Guardians</option>
                                <option value="INACTIVE">Inactive Guardians</option>
                            </select>
                        </div>

                        {/* Pickup Auth Filter */}
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                            <select
                                value={selectedPickup}
                                onChange={(e) => setSelectedPickup(e.target.value)}
                                className="text-xs font-bold bg-transparent text-slate-800 border-none focus:outline-none cursor-pointer pr-1"
                            >
                                <option value="All">All Pickup Authorizations</option>
                                <option value="AUTHORIZED">Authorized Pickup Only</option>
                                <option value="RESTRICTED">Restricted Pickup</option>
                            </select>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                    viewMode === 'list'
                                        ? 'bg-white text-purple-700 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                                title="List View"
                            >
                                <List className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Table</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('grid')}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                    viewMode === 'grid'
                                        ? 'bg-white text-purple-700 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                                title="Grid View"
                            >
                                <Grid className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Cards</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Parents List / Grid Views ──────────────────────────────────── */}
            {isLoading ? (
                <div className="p-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                    <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-3 text-purple-600" />
                    <p className="text-xs font-bold text-slate-700">Loading guardians directory...</p>
                    <p className="text-[11px] text-slate-500 mt-1">Connecting to family registry and relationship matrix</p>
                </div>
            ) : parents.length === 0 ? (
                <div className="p-16 text-center bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center mx-auto mb-3">
                        <Users className="w-7 h-7" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">No guardian records match your query</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        We couldn't find any parents matching the specified search or filter criteria.
                    </p>
                    <button
                        type="button"
                        onClick={handleResetFilters}
                        className="mt-4 px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-200 cursor-pointer"
                    >
                        Reset All Filters
                    </button>
                </div>
            ) : viewMode === 'list' ? (
                /* ── Table List View ── */
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                                    <th className="py-3.5 px-4">Guardian Profile</th>
                                    <th className="py-3.5 px-4">Direct Contact</th>
                                    <th className="py-3.5 px-4">Profession & Employer</th>
                                    <th className="py-3.5 px-4">Enrolled Students</th>
                                    <th className="py-3.5 px-4">Pickup Security</th>
                                    <th className="py-3.5 px-4">Account Status</th>
                                    <th className="py-3.5 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                                {parents.map((p) => {
                                    const children = p.children || [];
                                    const isAuthorized = p.canPickupStudent !== false;
                                    return (
                                        <tr
                                            key={p.id || p._id}
                                            onClick={() => navigate(`/school/parents/${p.id || p._id}`)}
                                            className="hover:bg-purple-50/30 transition-colors cursor-pointer group"
                                        >
                                            {/* Guardian Name */}
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-purple-100/80 text-purple-800 border border-purple-200 font-extrabold text-sm flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                                        {p.fullName ? p.fullName.charAt(0) : 'P'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 flex items-center gap-2">
                                                            <span>{p.fullName}</span>
                                                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                                                                {p.relationship || 'Guardian'}
                                                            </span>
                                                        </div>
                                                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                                                            ID: {p.parentId || 'PAR-AUTO'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact */}
                                            <td className="py-3.5 px-4">
                                                <div className="space-y-0.5">
                                                    <div className="text-slate-900 font-bold flex items-center gap-1.5">
                                                        <Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                                        <span>{p.phone}</span>
                                                    </div>
                                                    {p.email && (
                                                        <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                                                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                            <span className="truncate max-w-[180px]">{p.email}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Profession & Employer */}
                                            <td className="py-3.5 px-4">
                                                <div className="font-bold text-slate-900">{p.occupation || 'Self-Employed'}</div>
                                                <div className="text-[11px] font-medium text-slate-500">{p.employer || 'Private Sector'}</div>
                                            </td>

                                            {/* Enrolled Children */}
                                            <td className="py-3.5 px-4">
                                                {children.length === 0 ? (
                                                    <span className="text-slate-400 italic font-normal text-xs">No linked child</span>
                                                ) : (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {children.map((c, i) => (
                                                            <span
                                                                key={i}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 text-[11px] font-bold border border-indigo-200/80 shadow-2xs"
                                                            >
                                                                <GraduationCap className="w-3 h-3 text-indigo-600" />
                                                                {c.name} {c.class && <span className="text-indigo-600 font-semibold">({c.class})</span>}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Pickup Auth */}
                                            <td className="py-3.5 px-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                                    isAuthorized
                                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                        : 'bg-rose-50 text-rose-800 border-rose-200'
                                                }`}>
                                                    {isAuthorized ? (
                                                        <>
                                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                                            <span>Authorized</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                                                            <span>Restricted</span>
                                                        </>
                                                    )}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="py-3.5 px-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                                    p.status === 'ACTIVE'
                                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                        : 'bg-slate-100 text-slate-700 border-slate-200'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                                    {p.status || 'ACTIVE'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/school/parents/${p.id || p._id}`)}
                                                    className="px-3 py-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200/90 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                                                >
                                                    <Eye className="w-3.5 h-3.5 text-purple-600" />
                                                    <span>360° Profile</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* ── Card Grid View ── */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {parents.map((p) => {
                        const children = p.children || [];
                        const isAuthorized = p.canPickupStudent !== false;
                        return (
                            <div
                                key={p.id || p._id}
                                onClick={() => navigate(`/school/parents/${p.id || p._id}`)}
                                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group hover:border-purple-300"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-purple-100/90 text-purple-800 border border-purple-200 font-extrabold text-base flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                {p.fullName ? p.fullName.charAt(0) : 'P'}
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-slate-900 text-sm">
                                                    {p.fullName}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                                                        {p.relationship || 'Guardian'}
                                                    </span>
                                                    <span className="text-[11px] font-mono text-slate-500">{p.parentId}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                            p.status === 'ACTIVE'
                                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                : 'bg-slate-100 text-slate-700 border-slate-200'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                            {p.status || 'ACTIVE'}
                                        </span>
                                    </div>

                                    {/* Occupation & Employer */}
                                    <div className="text-xs mb-3.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                            <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                                            <span>{p.occupation || 'Professional / Business'}</span>
                                        </div>
                                        <div className="text-[11px] font-medium text-slate-600 pl-5 mt-0.5">
                                            {p.employer || 'Private Sector Enterprise'}
                                        </div>
                                    </div>

                                    {/* Linked Children */}
                                    <div className="mb-4">
                                        <div className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
                                            <span>Linked Students</span>
                                            <span className="text-purple-700 font-bold">({children.length})</span>
                                        </div>
                                        {children.length === 0 ? (
                                            <span className="text-xs text-slate-400 italic">No linked children</span>
                                        ) : (
                                            <div className="flex flex-wrap gap-1.5">
                                                {children.map((c, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-200/80"
                                                    >
                                                        <GraduationCap className="w-3 h-3 text-indigo-600" />
                                                        {c.name} {c.class && <span className="text-indigo-600 font-semibold">({c.class})</span>}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Card Footer details */}
                                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                        <Phone className="w-3.5 h-3.5 text-purple-600" />
                                        <span>{p.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                            isAuthorized ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                                        }`}>
                                            <ShieldCheck className="w-3 h-3" />
                                            {isAuthorized ? 'Pickup OK' : 'Restricted'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Modern Pagination Bar ────────────────────────────────────── */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 font-medium">
                <div>
                    Showing <strong className="text-slate-900 font-bold">{parents.length}</strong> of <strong className="text-slate-900 font-bold">{pagination.total}</strong> registered guardians
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={pagination.page <= 1}
                        className="px-3.5 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors flex items-center gap-1 font-bold cursor-pointer disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Previous
                    </button>
                    <span className="px-3 font-extrabold text-slate-900">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                        type="button"
                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                        disabled={pagination.page >= pagination.totalPages}
                        className="px-3.5 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors flex items-center gap-1 font-bold cursor-pointer disabled:cursor-not-allowed"
                    >
                        Next
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Add Parent Modal */}
            <AddParentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => refetch()}
            />
        </div>
    );
}
