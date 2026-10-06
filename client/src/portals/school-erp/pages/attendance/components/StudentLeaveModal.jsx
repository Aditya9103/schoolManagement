import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Clock, Calendar, Plus, UserMinus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentLeaveModal({
    isOpen,
    onClose,
    leaves = [],
    onApproveLeave,
    onRejectLeave,
    onCreateLeave,
}) {
    if (!isOpen) return null;

    const [activeTab, setActiveTab] = useState('list'); // 'list' | 'new'
    const [filterStatus, setFilterStatus] = useState('ALL');

    // New leave form state
    const [studentName, setStudentName] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [leaveType, setLeaveType] = useState('SICK');
    const [reason, setReason] = useState('');

    const defaultLeaves = leaves.length > 0 ? leaves : [
        {
            _id: 'leave-1',
            studentName: 'Diya Sharma',
            rollNo: '6A010',
            className: 'Class 6',
            sectionName: 'Section A',
            startDate: '2026-04-21',
            endDate: '2026-04-23',
            leaveType: 'MEDICAL',
            reason: 'Viral fever diagnosed by physician, advised 3 days rest.',
            status: 'APPROVED',
            reviewNote: 'Medical certificate verified',
        },
        {
            _id: 'leave-2',
            studentName: 'Kunal Kapoor',
            rollNo: '6A020',
            className: 'Class 6',
            sectionName: 'Section A',
            startDate: '2026-04-21',
            endDate: '2026-04-21',
            leaveType: 'FAMILY_EVENT',
            reason: 'Elder sister wedding ceremony out of station.',
            status: 'PENDING',
            reviewNote: '',
        },
    ];

    const [leaveList, setLeaveList] = useState(defaultLeaves);

    const filtered = leaveList.filter((l) =>
        filterStatus === 'ALL' ? true : l.status === filterStatus
    );

    const handleApprove = (id) => {
        setLeaveList((prev) =>
            prev.map((l) => (l._id === id ? { ...l, status: 'APPROVED' } : l))
        );
        toast.success('Leave request approved');
        if (onApproveLeave) onApproveLeave(id);
    };

    const handleReject = (id) => {
        setLeaveList((prev) =>
            prev.map((l) => (l._id === id ? { ...l, status: 'REJECTED' } : l))
        );
        toast.error('Leave request rejected');
        if (onRejectLeave) onRejectLeave(id);
    };

    const handleSubmitNew = (e) => {
        e.preventDefault();
        if (!studentName || !reason) {
            toast.error('Please fill student name and reason');
            return;
        }

        const newLeaveItem = {
            _id: `leave-${Date.now()}`,
            studentName,
            rollNo: rollNo || '6A033',
            className: 'Class 6',
            sectionName: 'Section A',
            startDate,
            endDate,
            leaveType,
            reason,
            status: 'PENDING',
            reviewNote: '',
        };

        setLeaveList([newLeaveItem, ...leaveList]);
        toast.success('Leave application submitted');
        setActiveTab('list');
        setStudentName('');
        setReason('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                            <UserMinus className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Student Leave Management</h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Review, approve, and record student absence requests
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

                {/* Sub Nav */}
                <div className="px-5 pt-3 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('list')}
                            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                                activeTab === 'list'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            All Requests ({leaveList.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('new')}
                            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                                activeTab === 'new'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            + Apply Leave
                        </button>
                    </div>

                    {activeTab === 'list' && (
                        <div className="flex items-center gap-1.5 pb-2">
                            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
                                <button
                                    key={st}
                                    onClick={() => setFilterStatus(st)}
                                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                                        filterStatus === st
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {st}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5">
                    {activeTab === 'list' ? (
                        <div className="space-y-3">
                            {filtered.length === 0 ? (
                                <div className="text-center py-10 text-slate-400 text-xs">
                                    No leave requests found for this filter.
                                </div>
                            ) : (
                                filtered.map((req) => (
                                    <div
                                        key={req._id}
                                        className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white shadow-2xs transition-all space-y-2.5"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="font-bold text-slate-900 text-sm">
                                                    {req.studentName}
                                                </span>
                                                <span className="text-xs text-slate-400 ml-2">
                                                    (Roll {req.rollNo} • {req.className} - {req.sectionName})
                                                </span>
                                            </div>

                                            <span
                                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                                    req.status === 'APPROVED'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : req.status === 'REJECTED'
                                                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                }`}
                                            >
                                                {req.status}
                                            </span>
                                        </div>

                                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                            "{req.reason}"
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                                            <span className="inline-flex items-center gap-1.5 font-medium">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                {req.startDate} to {req.endDate}
                                            </span>

                                            {req.status === 'PENDING' && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleApprove(req._id)}
                                                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(req._id)}
                                                        className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" /> Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitNew} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Student Name
                                </label>
                                <input
                                    type="text"
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    placeholder="e.g. Diya Sharma"
                                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Roll No
                                    </label>
                                    <input
                                        type="text"
                                        value={rollNo}
                                        onChange={(e) => setRollNo(e.target.value)}
                                        placeholder="e.g. 6A010"
                                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Leave Type
                                    </label>
                                    <select
                                        value={leaveType}
                                        onChange={(e) => setLeaveType(e.target.value)}
                                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer"
                                    >
                                        <option value="SICK">Sick Leave</option>
                                        <option value="CASUAL">Casual Leave</option>
                                        <option value="MEDICAL">Medical Leave</option>
                                        <option value="FAMILY_EVENT">Family Event</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Reason
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={3}
                                    placeholder="Explain reason for student absence..."
                                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                            >
                                Submit Leave Application
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
