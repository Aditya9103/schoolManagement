import React, { useState, useRef, useEffect } from 'react';
import {
    MoreVertical,
    FileText,
    Award,
    Edit3,
    Trash2,
    Plus,
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
    Printer,
    ChevronLeft,
    ChevronRight,
    BookOpen,
} from 'lucide-react';

export default function ExamsTable({
    exams = [],
    totalCount = 0,
    currentPage = 1,
    totalPages = 1,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    onCreateExam,
    onEnterMarks,
    onViewResults,
    onGenerateReportCards,
    onEditExam,
    onDeleteExam,
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

    const isAllSelected = exams.length > 0 && exams.every((e) => selectedIds.has(e._id || e.id));
    const isIndeterminate = exams.some((e) => selectedIds.has(e._id || e.id)) && !isAllSelected;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(exams.map((e) => e._id || e.id)));
        }
    };

    const handleToggleSelect = (id) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    // Render type badge matching Image 2
    const renderTypeBadge = (type) => {
        switch ((type || 'PERIODIC_TEST').toUpperCase()) {
            case 'PERIODIC_TEST':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                        Periodic Test
                    </span>
                );
            case 'TERM_EXAM':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        Term Exam
                    </span>
                );
            case 'BOARD_PATTERN':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                        Board Pattern
                    </span>
                );
            case 'MOCK_EXAM':
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Mock Exam
                    </span>
                );
        }
    };

    // Render status badge matching Image 2
    const renderStatusBadge = (status) => {
        switch ((status || 'UPCOMING').toUpperCase()) {
            case 'COMPLETED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed
                    </span>
                );
            case 'ONGOING':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" /> Ongoing
                    </span>
                );
            case 'UPCOMING':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        <Clock className="w-3.5 h-3.5 text-purple-600" /> Upcoming
                    </span>
                );
            case 'DRAFT':
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        Draft
                    </span>
                );
        }
    };

    // Icon colors matching Image 2
    const getExamIcon = (idx) => {
        const colors = [
            'bg-purple-100 text-purple-600',
            'bg-amber-100 text-amber-600',
            'bg-teal-100 text-teal-600',
            'bg-blue-100 text-blue-600',
            'bg-rose-100 text-rose-600',
            'bg-emerald-100 text-emerald-600',
            'bg-indigo-100 text-indigo-600',
        ];
        return colors[idx % colors.length];
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Header bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight font-display">
                        Exams ({totalCount})
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={onCreateExam}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Exam</span>
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left border-collapse min-w-[850px]">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
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
                            <th className="py-3 px-3.5 min-w-[220px]">Exam Name</th>
                            <th className="py-3 px-3.5 min-w-[100px]">Term</th>
                            <th className="py-3 px-3.5 min-w-[100px]">Classes</th>
                            <th className="py-3 px-3.5 min-w-[130px]">Type</th>
                            <th className="py-3 px-3.5 min-w-[120px]">Start Date</th>
                            <th className="py-3 px-3.5 min-w-[120px]">End Date</th>
                            <th className="py-3 px-3.5 min-w-[120px]">Status</th>
                            <th className="py-3 px-3 w-12 text-center shrink-0">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {exams.map((item, index) => {
                            const id = item._id || item.id || index;
                            const isChecked = selectedIds.has(id);
                            const globalIndex = (currentPage - 1) * rowsPerPage + index + 1;

                            return (
                                <tr
                                    key={id}
                                    className={`hover:bg-slate-50/80 transition-colors ${
                                        isChecked ? 'bg-blue-50/30' : ''
                                    }`}
                                >
                                    <td className="py-3.5 px-3.5 text-center shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleToggleSelect(id)}
                                            className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </td>
                                    <td className="py-3.5 px-3 text-center text-xs font-semibold text-slate-400">
                                        {globalIndex}
                                    </td>

                                    {/* Exam Name with Icon */}
                                    <td className="py-3.5 px-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${getExamIcon(index)}`}>
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                                {item.name}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-3.5 text-xs text-slate-600 font-medium">
                                        {item.term || 'Term 1'}
                                    </td>

                                    <td className="py-3.5 px-3.5 text-xs text-slate-600 font-medium">
                                        {item.classesApplicable || '1 - 12'}
                                    </td>

                                    <td className="py-3.5 px-3.5">
                                        {renderTypeBadge(item.type)}
                                    </td>

                                    <td className="py-3.5 px-3.5 text-xs text-slate-600 whitespace-nowrap">
                                        {item.startDate ? new Date(item.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '10 Apr 2026'}
                                    </td>

                                    <td className="py-3.5 px-3.5 text-xs text-slate-600 whitespace-nowrap">
                                        {item.endDate ? new Date(item.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '12 Apr 2026'}
                                    </td>

                                    <td className="py-3.5 px-3.5">
                                        {renderStatusBadge(item.status)}
                                    </td>

                                    {/* Action menu */}
                                    <td className="py-3.5 px-3 text-center relative whitespace-nowrap shrink-0">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveActionId(activeActionId === id ? null : id);
                                            }}
                                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>

                                        {activeActionId === id && (
                                            <div
                                                ref={actionMenuRef}
                                                className="absolute right-3 top-10 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 py-1.5 text-xs text-left animate-in fade-in zoom-in-95 duration-100"
                                            >
                                                <button
                                                    onClick={() => {
                                                        setActiveActionId(null);
                                                        onEnterMarks && onEnterMarks(item);
                                                    }}
                                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-semibold cursor-pointer"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5 text-blue-500" /> Enter Marks
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setActiveActionId(null);
                                                        onViewResults && onViewResults(item);
                                                    }}
                                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-semibold cursor-pointer"
                                                >
                                                    <Award className="w-3.5 h-3.5 text-purple-500" /> View Results
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setActiveActionId(null);
                                                        onGenerateReportCards && onGenerateReportCards(item);
                                                    }}
                                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-semibold cursor-pointer"
                                                >
                                                    <Printer className="w-3.5 h-3.5 text-emerald-500" /> Report Cards
                                                </button>
                                                <div className="border-t border-slate-100 my-1" />
                                                <button
                                                    onClick={() => {
                                                        setActiveActionId(null);
                                                        onEditExam && onEditExam(item);
                                                    }}
                                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-600 font-medium cursor-pointer"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5 text-slate-400" /> Edit Exam
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setActiveActionId(null);
                                                        onDeleteExam && onDeleteExam(item);
                                                    }}
                                                    className="w-full px-3.5 py-2 hover:bg-rose-50 flex items-center gap-2.5 text-rose-600 font-medium cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Delete Exam
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
            <div className="p-4 sm:px-5 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 bg-white">
                <div>
                    Showing <span className="font-bold text-slate-900">{exams.length}</span> of{' '}
                    <span className="font-bold text-slate-900">{totalCount}</span> exams
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onPageChange && onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage <= 1}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-slate-700">
                        Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                        type="button"
                        onClick={() => onPageChange && onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
