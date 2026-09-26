import React from 'react';
import { Search, Plus, RefreshCw, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BOARDS = ['ALL', 'CBSE', 'ICSE', 'STATE', 'IB', 'CAMBRIDGE'];
const PLANS = ['ALL', 'BASIC', 'STANDARD', 'PRO', 'PREMIUM', 'ENTERPRISE'];
const STATUSES = ['ALL', 'ACTIVE', 'INACTIVE'];

export default function SchoolsFilterBar({
    search,
    onSearchChange,
    boardFilter,
    onBoardChange,
    planFilter,
    onPlanChange,
    statusFilter,
    onStatusChange,
    onReset,
    onRefresh,
    isFetching,
}) {
    const navigate = useNavigate();

    const hasActiveFilters =
        search || boardFilter !== 'ALL' || planFilter !== 'ALL' || statusFilter !== 'ALL';

    return (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 min-w-[240px]">
                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search by school name, short code, city or state..."
                        className="w-full h-11 pl-10 pr-9 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 transition-all font-medium text-slate-900 placeholder:text-slate-500 shadow-2xs"
                    />
                    {search && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Filters Group */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Board Select */}
                    <div className="flex items-center gap-2 h-11 bg-white border border-slate-300 rounded-xl px-3.5 shadow-2xs">
                        <span className="text-xs font-bold text-slate-600">Board:</span>
                        <select
                            value={boardFilter}
                            onChange={(e) => onBoardChange(e.target.value)}
                            className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer text-xs"
                        >
                            {BOARDS.map((b) => (
                                <option key={b} value={b}>
                                    {b === 'ALL' ? 'All Boards' : b}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Plan Select */}
                    <div className="flex items-center gap-2 h-11 bg-white border border-slate-300 rounded-xl px-3.5 shadow-2xs">
                        <span className="text-xs font-bold text-slate-600">Plan:</span>
                        <select
                            value={planFilter}
                            onChange={(e) => onPlanChange(e.target.value)}
                            className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer text-xs"
                        >
                            {PLANS.map((p) => (
                                <option key={p} value={p}>
                                    {p === 'ALL' ? 'All Plans' : p}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Select */}
                    <div className="flex items-center gap-2 h-11 bg-white border border-slate-300 rounded-xl px-3.5 shadow-2xs">
                        <span className="text-xs font-bold text-slate-600">Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => onStatusChange(e.target.value)}
                            className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer text-xs"
                        >
                            {STATUSES.map((s) => (
                                <option key={s} value={s}>
                                    {s === 'ALL' ? 'All Statuses' : s}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Refresh & Reset Buttons */}
                    {hasActiveFilters && (
                        <button
                            onClick={onReset}
                            className="h-11 px-3 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
                            title="Reset filters"
                        >
                            <X size={15} /> Clear
                        </button>
                    )}

                    <button
                        onClick={onRefresh}
                        disabled={isFetching}
                        className="h-11 w-11 flex items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs disabled:opacity-50"
                        title="Refresh schools"
                    >
                        <RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} />
                    </button>

                    {/* Add School Button */}
                    <button
                        onClick={() => navigate('/super-admin/schools/new')}
                        className="flex items-center gap-2 h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-sm font-bold shadow-md shadow-blue-600/25 transition-all ml-auto lg:ml-2"
                    >
                        <Plus size={16} /> Add School
                    </button>
                </div>
            </div>
        </div>
    );
}
