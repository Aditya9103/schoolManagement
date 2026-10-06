import React, { useState, useEffect, useRef } from 'react';
import {
    Save,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    UserCheck,
    UserX,
    Clock,
    ShieldAlert,
    MoreVertical,
    Phone,
    Eye,
    History,
    Check,
    AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AttendanceRegisterTable({
    classNameDisplay = 'Class 6 - Section A',
    records = [],
    onUpdateRecordStatus,
    onUpdateRecordRemarks,
    onSave,
    onBulkMark,
    onMarkAll,
    isSaving = false,
    hasUnsavedChanges = false,
}) {
    const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showBulkMenu, setShowBulkMenu] = useState(false);
    const [showMarkByMenu, setShowMarkByMenu] = useState(false);
    const [activeActionRow, setActiveActionRow] = useState(null);

    const bulkMenuRef = useRef(null);
    const markByMenuRef = useRef(null);
    const actionsMenuRef = useRef(null);

    // Close menus on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (bulkMenuRef.current && !bulkMenuRef.current.contains(e.target)) {
                setShowBulkMenu(false);
            }
            if (markByMenuRef.current && !markByMenuRef.current.contains(e.target)) {
                setShowMarkByMenu(false);
            }
            if (actionsMenuRef.current && !actionsMenuRef.current.contains(e.target)) {
                setActiveActionRow(null);
            }
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setShowBulkMenu(false);
                setShowMarkByMenu(false);
                setActiveActionRow(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const totalStudents = records.length;
    const totalPages = Math.ceil(totalStudents / rowsPerPage) || 1;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentRecords = records.slice(startIndex, startIndex + rowsPerPage);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = new Set(records.map((r) => r.studentId));
            setSelectedStudentIds(allIds);
        } else {
            setSelectedStudentIds(new Set());
        }
    };

    const handleToggleStudent = (studentId) => {
        const next = new Set(selectedStudentIds);
        if (next.has(studentId)) {
            next.delete(studentId);
        } else {
            next.add(studentId);
        }
        setSelectedStudentIds(next);
    };

    const isAllSelected = records.length > 0 && selectedStudentIds.size === records.length;
    const isIndeterminate = selectedStudentIds.size > 0 && selectedStudentIds.size < records.length;

    // Status styling helpers matching screenshot
    const renderStatusBadge = (record) => {
        const currentStatus = (record.status || 'PRESENT').toUpperCase();

        const config = {
            PRESENT: {
                bg: 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 border-emerald-200 focus:ring-emerald-500/20',
                icon: UserCheck,
                iconColor: 'text-emerald-600',
            },
            ABSENT: {
                bg: 'bg-rose-50 hover:bg-rose-100/80 text-rose-700 border-rose-200 focus:ring-rose-500/20',
                icon: UserX,
                iconColor: 'text-rose-600',
            },
            LATE: {
                bg: 'bg-amber-50 hover:bg-amber-100/80 text-amber-700 border-amber-200 focus:ring-amber-500/20',
                icon: Clock,
                iconColor: 'text-amber-600',
            },
            EXCUSED: {
                bg: 'bg-blue-50 hover:bg-blue-100/80 text-blue-700 border-blue-200 focus:ring-blue-500/20',
                icon: ShieldAlert,
                iconColor: 'text-blue-600',
            },
            HALF_DAY: {
                bg: 'bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 border-indigo-200 focus:ring-indigo-500/20',
                icon: ShieldAlert,
                iconColor: 'text-indigo-600',
            },
        };

        const activeConfig = config[currentStatus] || config.PRESENT;
        const Icon = activeConfig.icon;

        return (
            <div className="relative inline-block text-left w-full max-w-[125px]">
                <select
                    value={currentStatus}
                    onChange={(e) => onUpdateRecordStatus(record.studentId, e.target.value)}
                    className={`w-full appearance-none cursor-pointer text-xs font-semibold py-1.5 pl-7 pr-6 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${activeConfig.bg}`}
                >
                    <option value="PRESENT">Present</option>
                    <option value="ABSENT">Absent</option>
                    <option value="LATE">Late</option>
                    <option value="EXCUSED">Excused</option>
                </select>
                <Icon className={`w-3.5 h-3.5 ${activeConfig.iconColor} absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none`} />
                <ChevronDown className={`w-3 h-3 ${activeConfig.iconColor} absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none`} />
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
            {/* Card Header with responsive alignment */}
            <div className="p-4 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
                        Students ({classNameDisplay})
                    </h3>
                    {hasUnsavedChanges && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 shrink-0 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Unsaved Changes
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                    {/* Bulk Actions Dropdown */}
                    <div className="relative" ref={bulkMenuRef}>
                        <button
                            type="button"
                            onClick={() => {
                                setShowBulkMenu(!showBulkMenu);
                                setShowMarkByMenu(false);
                            }}
                            className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
                        >
                            <span>Bulk Actions</span>
                            {selectedStudentIds.size > 0 && (
                                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                                    {selectedStudentIds.size}
                                </span>
                            )}
                            <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        {showBulkMenu && (
                            <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1.5 text-xs animate-in fade-in zoom-in-95 duration-100">
                                <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Apply to selected ({selectedStudentIds.size})
                                </div>
                                <button
                                    onClick={() => {
                                        onBulkMark(Array.from(selectedStudentIds), 'PRESENT');
                                        setShowBulkMenu(false);
                                    }}
                                    disabled={selectedStudentIds.size === 0}
                                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-emerald-700 font-medium disabled:opacity-40 cursor-pointer"
                                >
                                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Mark Selected Present
                                </button>
                                <button
                                    onClick={() => {
                                        onBulkMark(Array.from(selectedStudentIds), 'ABSENT');
                                        setShowBulkMenu(false);
                                    }}
                                    disabled={selectedStudentIds.size === 0}
                                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-rose-700 font-medium disabled:opacity-40 cursor-pointer"
                                >
                                    <UserX className="w-3.5 h-3.5 text-rose-600" /> Mark Selected Absent
                                </button>
                                <button
                                    onClick={() => {
                                        onBulkMark(Array.from(selectedStudentIds), 'LATE');
                                        setShowBulkMenu(false);
                                    }}
                                    disabled={selectedStudentIds.size === 0}
                                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-amber-700 font-medium disabled:opacity-40 cursor-pointer"
                                >
                                    <Clock className="w-3.5 h-3.5 text-amber-600" /> Mark Selected Late
                                </button>
                                <button
                                    onClick={() => {
                                        onBulkMark(Array.from(selectedStudentIds), 'EXCUSED');
                                        setShowBulkMenu(false);
                                    }}
                                    disabled={selectedStudentIds.size === 0}
                                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-blue-700 font-medium disabled:opacity-40 cursor-pointer"
                                >
                                    <ShieldAlert className="w-3.5 h-3.5 text-blue-600" /> Mark Selected Excused
                                </button>
                                <div className="border-t border-slate-100 my-1" />
                                <button
                                    onClick={() => {
                                        setSelectedStudentIds(new Set());
                                        setShowBulkMenu(false);
                                    }}
                                    disabled={selectedStudentIds.size === 0}
                                    className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 text-slate-500 font-medium disabled:opacity-40 cursor-pointer"
                                >
                                    Deselect All
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mark by Status Dropdown */}
                    <div className="relative" ref={markByMenuRef}>
                        <button
                            type="button"
                            onClick={() => {
                                setShowMarkByMenu(!showMarkByMenu);
                                setShowBulkMenu(false);
                            }}
                            className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
                        >
                            <span>Mark by</span>
                            <span className="text-slate-400 font-normal">Status</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        {showMarkByMenu && (
                            <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1.5 text-xs animate-in fade-in zoom-in-95 duration-100">
                                <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Class-wide Actions
                                </div>
                                <button
                                    onClick={() => {
                                        onMarkAll('PRESENT');
                                        setShowMarkByMenu(false);
                                    }}
                                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-emerald-700 font-medium cursor-pointer"
                                >
                                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Mark All Present
                                </button>
                                <button
                                    onClick={() => {
                                        onMarkAll('ABSENT');
                                        setShowMarkByMenu(false);
                                    }}
                                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-rose-700 font-medium cursor-pointer"
                                >
                                    <UserX className="w-3.5 h-3.5 text-rose-600" /> Mark All Absent
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Save Attendance Button */}
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors disabled:opacity-60 cursor-pointer shrink-0"
                    >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSaving ? 'Saving...' : 'Save Attendance'}</span>
                    </button>
                </div>
            </div>

            {/* Table with horizontal scroll container and min-width to prevent overflow */}
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[760px]">
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
                            <th className="py-3 px-3.5 min-w-[200px]">Student Details</th>
                            <th className="py-3 px-3.5 w-24 min-w-[90px] shrink-0">Roll No.</th>
                            <th className="py-3 px-3.5 w-36 min-w-[135px] shrink-0">Status</th>
                            <th className="py-3 px-3.5 min-w-[180px]">Remarks</th>
                            <th className="py-3 px-3 w-14 text-center shrink-0">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {currentRecords.map((record, index) => {
                            const globalIndex = startIndex + index + 1;
                            const isChecked = selectedStudentIds.has(record.studentId);

                            return (
                                <tr
                                    key={record.studentId || index}
                                    className={`hover:bg-slate-50/80 transition-colors ${
                                        isChecked ? 'bg-blue-50/30' : ''
                                    }`}
                                >
                                    {/* Checkbox */}
                                    <td className="py-3 px-3.5 text-center shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleToggleStudent(record.studentId)}
                                            className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </td>

                                    {/* Index */}
                                    <td className="py-3 px-3 text-xs font-semibold text-slate-400 text-center shrink-0">
                                        {globalIndex}
                                    </td>

                                    {/* Student Details (Avatar + Name) */}
                                    <td className="py-3 px-3.5">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img
                                                src={
                                                    record.avatar ||
                                                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${record.studentName}`
                                                }
                                                alt={record.studentName}
                                                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                                            />
                                            <span className="font-semibold text-slate-900 text-sm truncate whitespace-nowrap">
                                                {record.studentName}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Roll No */}
                                    <td className="py-3 px-3.5 whitespace-nowrap">
                                        <span className="text-xs font-semibold text-slate-600 uppercase font-mono tracking-tight">
                                            {record.rollNo}
                                        </span>
                                    </td>

                                    {/* Status Pill Dropdown */}
                                    <td className="py-3 px-3.5 whitespace-nowrap">
                                        {renderStatusBadge(record)}
                                    </td>

                                    {/* Remarks editable input */}
                                    <td className="py-3 px-3.5">
                                        <input
                                            type="text"
                                            value={record.remarks ?? ''}
                                            placeholder="Add remarks..."
                                            onChange={(e) =>
                                                onUpdateRecordRemarks(record.studentId, e.target.value)
                                            }
                                            className="w-full text-xs font-medium text-slate-700 bg-slate-50/80 hover:bg-white focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                                        />
                                    </td>

                                    {/* Actions menu */}
                                    <td className="py-3 px-3 text-center relative whitespace-nowrap shrink-0">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveActionRow(
                                                    activeActionRow === record.studentId ? null : record.studentId
                                                );
                                            }}
                                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                        {activeActionRow === record.studentId && (
                                            <div
                                                ref={actionsMenuRef}
                                                className="absolute right-3 top-10 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1.5 text-xs text-left animate-in fade-in zoom-in-95 duration-100"
                                            >
                                                <button
                                                    onClick={() => {
                                                        setActiveActionRow(null);
                                                        toast(`Viewing student profile: ${record.studentName}`);
                                                    }}
                                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                                                >
                                                    <Eye className="w-3.5 h-3.5 text-slate-500" /> View Profile
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setActiveActionRow(null);
                                                        toast.success(`Dialing parent contact for ${record.studentName}`);
                                                    }}
                                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                                                >
                                                    <Phone className="w-3.5 h-3.5 text-slate-500" /> Contact Parent
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setActiveActionRow(null);
                                                        toast(`Loading attendance history for ${record.studentName}`);
                                                    }}
                                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                                                >
                                                    <History className="w-3.5 h-3.5 text-slate-500" /> Attendance History
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
                <div className="whitespace-nowrap">
                    Showing <span className="font-semibold text-slate-700">{totalStudents === 0 ? 0 : startIndex + 1}</span> to{' '}
                    <span className="font-semibold text-slate-700">
                        {Math.min(startIndex + rowsPerPage, totalStudents)}
                    </span>{' '}
                    of <span className="font-semibold text-slate-700">{totalStudents}</span> students
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-7 h-7 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                                pageNum === currentPage
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'hover:bg-slate-100 text-slate-700'
                            }`}
                        >
                            {pageNum}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
                        onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
