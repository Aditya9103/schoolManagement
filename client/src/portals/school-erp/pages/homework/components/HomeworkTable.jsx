import React, { useState, useRef, useEffect } from 'react';
import {
    MoreVertical,
    FileText,
    BookOpen,
    Layers,
    Laptop,
    CheckCircle2,
    Clock,
    ChevronLeft,
    ChevronRight,
    Eye,
    Award,
    Edit3,
    Trash2,
    Calendar,
    Sparkles,
    Check
} from 'lucide-react';

export default function HomeworkTable({
    assignments = [],
    totalCount = 124,
    currentPage = 1,
    totalPages = 13,
    onPageChange,
    rowsPerPage = 10,
    onRowsPerPageChange,
    onViewSubmissions,
    onGradeAssignment,
    onEditAssignment,
    onDeleteAssignment,
}) {
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [activeActionId, setActiveActionId] = useState(null);
    const actionMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
                setActiveActionId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(new Set(assignments.map((a) => a._id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleToggle = (id) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const isAllSelected = assignments.length > 0 && selectedIds.size === assignments.length;
    const isIndeterminate = selectedIds.size > 0 && selectedIds.size < assignments.length;

    // Type badge renderer matching screenshot
    const renderTypeBadge = (type) => {
        switch ((type || 'HOMEWORK').toUpperCase()) {
            case 'HOMEWORK':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <FileText className="w-3 h-3 text-blue-600" /> Homework
                    </span>
                );
            case 'ASSIGNMENT':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        <BookOpen className="w-3 h-3 text-purple-600" /> Assignment
                    </span>
                );
            case 'PROJECT':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Layers className="w-3 h-3 text-amber-600" /> Project
                    </span>
                );
            case 'PRACTICAL':
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-pink-50 text-pink-700 border border-pink-200">
                        <Laptop className="w-3 h-3 text-pink-600" /> Practical
                    </span>
                );
        }
    };

    // Status pill renderer
    const renderStatusBadge = (status) => {
        switch ((status || 'ACTIVE').toUpperCase()) {
            case 'ACTIVE':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                    </span>
                );
            case 'COMPLETED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Check className="w-3 h-3 text-emerald-600" /> Completed
                    </span>
                );
            case 'GRADED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        <Award className="w-3 h-3 text-purple-600" /> Graded
                    </span>
                );
            case 'DRAFT':
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        Draft
                    </span>
                );
        }
    };

    // Subject icon color
    const getSubjectIconBg = (subjectName = '') => {
        const s = subjectName.toLowerCase();
        if (s.includes('math')) return 'bg-purple-100 text-purple-600';
        if (s.includes('eng')) return 'bg-rose-100 text-rose-600';
        if (s.includes('sci') && !s.includes('soc')) return 'bg-teal-100 text-teal-600';
        if (s.includes('soc')) return 'bg-blue-100 text-blue-600';
        if (s.includes('life')) return 'bg-pink-100 text-pink-600';
        if (s.includes('comp')) return 'bg-indigo-100 text-indigo-600';
        if (s.includes('art')) return 'bg-amber-100 text-amber-600';
        if (s.includes('phys')) return 'bg-purple-100 text-purple-600';
        if (s.includes('music')) return 'bg-fuchsia-100 text-fuchsia-600';
        return 'bg-emerald-100 text-emerald-600';
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
            {/* Table Container */}
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[880px]">
                    <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                            <th className="py-3 px-3.5 w-10 text-center shrink-0">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    ref={(input) => {
                                        if (input) input.indeterminate = isIndeterminate;
                                    }}
                                    onChange={handleSelectAll}
                                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                />
                            </th>
                            <th className="py-3 px-3 w-10 text-slate-400 text-center shrink-0">#</th>
                            <th className="py-3 px-3.5 min-w-[240px]">Assignment Title</th>
                            <th className="py-3 px-3.5 min-w-[130px]">Subject</th>
                            <th className="py-3 px-3.5 min-w-[110px]">Class</th>
                            <th className="py-3 px-3.5 min-w-[125px]">Type</th>
                            <th className="py-3 px-3.5 min-w-[130px]">Deadline</th>
                            <th className="py-3 px-3.5 min-w-[140px]">Submissions</th>
                            <th className="py-3 px-3.5 min-w-[110px]">Status</th>
                            <th className="py-3 px-3 w-12 text-center shrink-0">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {assignments.map((item, index) => {
                            const globalIndex = (currentPage - 1) * rowsPerPage + index + 1;
                            const isChecked = selectedIds.has(item._id);
                            const totalSt = item.statistics?.totalStudents || 32;
                            const submittedSt = item.statistics?.submittedCount || 0;
                            const pct = Math.min(100, Math.round((submittedSt / totalSt) * 100));

                            return (
                                <tr
                                    key={item._id || index}
                                    className={`hover:bg-slate-50/80 transition-colors ${
                                        isChecked ? 'bg-blue-50/30' : ''
                                    }`}
                                >
                                    {/* Checkbox */}
                                    <td className="py-3.5 px-3.5 text-center shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleToggle(item._id)}
                                            className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </td>

                                    {/* Index */}
                                    <td className="py-3.5 px-3 text-xs font-semibold text-slate-400 text-center shrink-0">
                                        {globalIndex}
                                    </td>

                                    {/* Title with Subject Icon */}
                                    <td className="py-3.5 px-3.5">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${getSubjectIconBg(
                                                    item.subjectName
                                                )}`}
                                            >
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <button
                                                    onClick={() => onViewSubmissions(item)}
                                                    className="font-bold text-slate-900 text-xs sm:text-sm hover:text-blue-600 transition-colors text-left truncate block max-w-xs cursor-pointer"
                                                >
                                                    {item.title}
                                                </button>
                                                {item.category && (
                                                    <span className="text-[11px] text-slate-400 block truncate">
                                                        {item.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Subject */}
                                    <td className="py-3.5 px-3.5 whitespace-nowrap text-xs font-semibold text-slate-700">
                                        {item.subjectName}
                                    </td>

                                    {/* Class */}
                                    <td className="py-3.5 px-3.5 whitespace-nowrap text-xs font-medium text-slate-600">
                                        {item.className}
                                    </td>

                                    {/* Type Badge */}
                                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                                        {renderTypeBadge(item.type)}
                                    </td>

                                    {/* Deadline */}
                                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                                        <div className="text-xs">
                                            <p className="font-semibold text-slate-800">
                                                {item.deadlineFormatted?.split(' ')?.[0] || '21 Apr'} {item.deadlineFormatted?.split(' ')?.[1] || '2026'}
                                            </p>
                                            <p className="text-[11px] text-slate-400">
                                                {item.deadlineFormatted?.split(' ')?.slice(2)?.join(' ') || '11:59 PM'}
                                            </p>
                                        </div>
                                    </td>

                                    {/* Submissions Progress Bar */}
                                    <td className="py-3.5 px-3.5">
                                        <div className="w-full max-w-[120px]">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="font-bold text-slate-900">
                                                    {submittedSt} / {totalSt}
                                                </span>
                                                <span className="text-[11px] text-slate-400 font-medium">
                                                    {pct}%
                                                </span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${pct}%`,
                                                        backgroundColor: pct === 100 ? '#10b981' : pct >= 50 ? '#059669' : '#3b82f6',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                                        {renderStatusBadge(item.status)}
                                    </td>

                                    {/* Actions menu */}
                                    <td className="py-3.5 px-3 text-center relative whitespace-nowrap shrink-0">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveActionId(activeActionId === item._id ? null : item._id);
                                            }}
                                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>

                                        {activeActionId === item._id && (
                                            <div
                                                ref={actionMenuRef}
                                                className="absolute right-3 top-10 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 py-1.5 text-xs text-left animate-in fade-in zoom-in-95 duration-100"
                                            >
                                                <button
                                                    onClick={() => {
                                                        setActiveActionId(null);
                                                        onViewSubmissions(item);
                                                    }}
                                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium cursor-pointer"
                                                >
                                                    <Eye className="w-3.5 h-3.5 text-blue-500" /> View Submissions
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setActiveActionId(null);
                                                        onGradeAssignment(item);
                                                    }}
                                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium cursor-pointer"
                                                >
                                                    <Award className="w-3.5 h-3.5 text-purple-500" /> Grade Submissions
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setActiveActionId(null);
                                                        onEditAssignment(item);
                                                    }}
                                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium cursor-pointer"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5 text-slate-400" /> Edit Assignment
                                                </button>
                                                <div className="border-t border-slate-100 my-1" />
                                                <button
                                                    onClick={() => {
                                                        setActiveActionId(null);
                                                        onDeleteAssignment(item);
                                                    }}
                                                    className="w-full px-3.5 py-2 hover:bg-rose-50 flex items-center gap-2.5 text-rose-600 font-medium cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Delete Assignment
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 sm:px-5 py-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 bg-white">
                <div className="whitespace-nowrap">
                    Showing <span className="font-semibold text-slate-700">1</span> to{' '}
                    <span className="font-semibold text-slate-700">10</span> of{' '}
                    <span className="font-semibold text-slate-700">{totalCount}</span> assignments
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    {[1, 2, 3, 4, 5].map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`w-7 h-7 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                                pageNum === currentPage
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'hover:bg-slate-100 text-slate-700'
                            }`}
                        >
                            {pageNum}
                        </button>
                    ))}
                    <span className="px-1 text-slate-400">...</span>
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className={`w-7 h-7 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                            totalPages === currentPage
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'hover:bg-slate-100 text-slate-700'
                        }`}
                    >
                        {totalPages}
                    </button>
                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <span className="whitespace-nowrap">Rows per page</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
