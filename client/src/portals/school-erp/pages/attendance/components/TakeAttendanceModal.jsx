import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, Clock, Search, Save, CheckCheck, Users, ShieldAlert } from 'lucide-react';

export default function TakeAttendanceModal({
    isOpen,
    onClose,
    records = [],
    classNameDisplay = 'Class 6 - Section A',
    onSaveBatch,
}) {
    if (!isOpen) return null;

    const [modalRecords, setModalRecords] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Synchronize modal records whenever opened or when records prop changes
    useEffect(() => {
        if (records && records.length > 0) {
            setModalRecords(records.map((r) => ({ ...r })));
        }
    }, [records, isOpen]);

    const filteredRecords = modalRecords.filter((r) =>
        (r.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.rollNo || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Live counts
    const presentCount = modalRecords.filter((r) => r.status === 'PRESENT').length;
    const absentCount = modalRecords.filter((r) => r.status === 'ABSENT').length;
    const lateCount = modalRecords.filter((r) => r.status === 'LATE').length;
    const excusedCount = modalRecords.filter((r) => r.status === 'EXCUSED' || r.status === 'HALF_DAY').length;

    const updateStatus = (studentId, status) => {
        setModalRecords((prev) =>
            prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
        );
    };

    const markAll = (status) => {
        setModalRecords((prev) => prev.map((r) => ({ ...r, status })));
    };

    const handleSave = () => {
        onSaveBatch(modalRecords);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-150">
                {/* Modal Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">Take Rapid Attendance</h3>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                {classNameDisplay}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Click hot-keys P / A / L / E to mark rapid attendance
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Toolbar & Live Stats Counter */}
                <div className="p-4 border-b border-slate-100 bg-white space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search student or roll number..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => markAll('PRESENT')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                            >
                                <CheckCheck className="w-3.5 h-3.5" /> All Present
                            </button>
                            <button
                                type="button"
                                onClick={() => markAll('ABSENT')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                            >
                                <XCircle className="w-3.5 h-3.5" /> All Absent
                            </button>
                        </div>
                    </div>

                    {/* Live Stats Pills */}
                    <div className="flex items-center gap-3 pt-1 text-xs">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-100">
                            Present: <strong>{presentCount}</strong>
                        </span>
                        <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50/80 px-2 py-0.5 rounded-md border border-rose-100">
                            Absent: <strong>{absentCount}</strong>
                        </span>
                        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-100">
                            Late: <strong>{lateCount}</strong>
                        </span>
                        <span className="inline-flex items-center gap-1 text-blue-700 font-semibold bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-100">
                            Excused: <strong>{excusedCount}</strong>
                        </span>
                    </div>
                </div>

                {/* Students Rapid List */}
                <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
                    {filteredRecords.length === 0 ? (
                        <div className="text-center py-10 text-xs text-slate-400">
                            No students match "{searchQuery}"
                        </div>
                    ) : (
                        filteredRecords.map((st, idx) => (
                            <div key={st.studentId || idx} className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 px-2 rounded-xl transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-xs font-bold text-slate-400 w-5 text-right shrink-0">{idx + 1}</span>
                                    <img
                                        src={st.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${st.studentName}`}
                                        alt={st.studentName}
                                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-900 truncate">{st.studentName}</p>
                                        <p className="text-[11px] text-slate-400 font-mono">{st.rollNo}</p>
                                    </div>
                                </div>

                                {/* Rapid Actions: P / A / L / E */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        type="button"
                                        title="Mark Present"
                                        onClick={() => updateStatus(st.studentId, 'PRESENT')}
                                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                            st.status === 'PRESENT'
                                                ? 'bg-emerald-600 text-white shadow-xs scale-105 ring-2 ring-emerald-600/30'
                                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                                        }`}
                                    >
                                        P
                                    </button>
                                    <button
                                        type="button"
                                        title="Mark Absent"
                                        onClick={() => updateStatus(st.studentId, 'ABSENT')}
                                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                            st.status === 'ABSENT'
                                                ? 'bg-rose-600 text-white shadow-xs scale-105 ring-2 ring-rose-600/30'
                                                : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                                        }`}
                                    >
                                        A
                                    </button>
                                    <button
                                        type="button"
                                        title="Mark Late"
                                        onClick={() => updateStatus(st.studentId, 'LATE')}
                                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                            st.status === 'LATE'
                                                ? 'bg-amber-500 text-white shadow-xs scale-105 ring-2 ring-amber-500/30'
                                                : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                                        }`}
                                    >
                                        L
                                    </button>
                                    <button
                                        type="button"
                                        title="Mark Excused"
                                        onClick={() => updateStatus(st.studentId, 'EXCUSED')}
                                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                            st.status === 'EXCUSED' || st.status === 'HALF_DAY'
                                                ? 'bg-blue-600 text-white shadow-xs scale-105 ring-2 ring-blue-600/30'
                                                : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                                        }`}
                                    >
                                        E
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                        Total: <strong>{modalRecords.length}</strong> students
                    </span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                            <Save className="w-4 h-4" /> Save Attendance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
