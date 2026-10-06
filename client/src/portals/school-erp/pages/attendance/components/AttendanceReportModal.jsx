import React, { useState } from 'react';
import { X, Printer, Download, FileText, CheckCircle2, Calendar, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AttendanceReportModal({
    isOpen,
    onClose,
    classNameDisplay = 'Class 6 - Section A',
    records = [],
    selectedDate = '2026-04-21',
}) {
    if (!isOpen) return null;

    const [reportType, setReportType] = useState('daily'); // 'daily' | 'monthly'
    const [month, setMonth] = useState('April 2026');

    const handlePrint = () => {
        window.print();
    };

    const handleExportExcel = () => {
        const rows = [
            ['Roll No', 'Student Name', 'Status', 'Remarks'],
            ...records.map((r) => [r.rollNo, r.studentName, r.status, r.remarks || '-']),
        ];
        const csvContent =
            'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Attendance_Report_${classNameDisplay}_${selectedDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Attendance register exported to Excel / CSV');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                            <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Attendance Register & Reports</h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Official printable attendance register for {classNameDisplay}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/30 text-xs">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setReportType('daily')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                                reportType === 'daily'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            Daily Register ({selectedDate})
                        </button>
                        <button
                            onClick={() => setReportType('monthly')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                                reportType === 'monthly'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            Monthly Summary (April 2026)
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold shadow-2xs transition-colors cursor-pointer"
                        >
                            <Printer className="w-3.5 h-3.5" /> Print
                        </button>
                        <button
                            onClick={handleExportExcel}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-2xs transition-colors cursor-pointer"
                        >
                            <Download className="w-3.5 h-3.5" /> Export Excel
                        </button>
                    </div>
                </div>

                {/* Register Preview Sheet */}
                <div className="flex-1 overflow-y-auto p-5">
                    <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs text-xs space-y-4">
                        <div className="text-center border-b border-slate-100 pb-3">
                            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                                GREENWOOD INTERNATIONAL SCHOOL
                            </h2>
                            <p className="text-[11px] text-slate-500 font-medium">
                                Student Daily Attendance Register • Academic Year 2026-27
                            </p>
                            <div className="flex items-center justify-center gap-4 text-[11px] font-semibold text-slate-700 mt-2">
                                <span>Class: {classNameDisplay}</span>
                                <span>•</span>
                                <span>Date: {selectedDate}</span>
                                <span>•</span>
                                <span>Total Students: {records.length}</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-y border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                                        <th className="py-2 px-2 w-8">#</th>
                                        <th className="py-2 px-3">Roll No</th>
                                        <th className="py-2 px-3">Student Name</th>
                                        <th className="py-2 px-3">Status</th>
                                        <th className="py-2 px-3">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {records.slice(0, 15).map((r, idx) => (
                                        <tr key={r.studentId || idx} className="hover:bg-slate-50/50">
                                            <td className="py-1.5 px-2 text-slate-400 font-semibold">{idx + 1}</td>
                                            <td className="py-1.5 px-3 font-semibold text-slate-700">{r.rollNo}</td>
                                            <td className="py-1.5 px-3 font-bold text-slate-900">{r.studentName}</td>
                                            <td className="py-1.5 px-3">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                        r.status === 'PRESENT'
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : r.status === 'ABSENT'
                                                            ? 'bg-rose-50 text-rose-700'
                                                            : 'bg-amber-50 text-amber-700'
                                                    }`}
                                                >
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="py-1.5 px-3 text-slate-500">{r.remarks || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
