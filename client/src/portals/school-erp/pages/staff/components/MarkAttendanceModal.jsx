import React, { useState } from 'react';
import { X, Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { useMarkEmployeeAttendanceMutation } from '../../../../../store/api/peopleApi';

export default function MarkAttendanceModal({ isOpen, onClose, employee, defaultDate, onSuccess }) {
    const [markAttendance, { isLoading }] = useMarkEmployeeAttendanceMutation();

    const [status, setStatus] = useState(employee?.status || 'PRESENT');
    const [date, setDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
    const [checkInTime, setCheckInTime] = useState(employee?.checkInTime || '08:55 AM');
    const [checkOutTime, setCheckOutTime] = useState(employee?.checkOutTime || '05:00 PM');
    const [remarks, setRemarks] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    if (!isOpen || !employee) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            await markAttendance({
                employeeId: employee.id || employee._id,
                date,
                status,
                checkInTime: status === 'ABSENT' || status === 'ON_LEAVE' ? null : checkInTime,
                checkOutTime: status === 'ABSENT' || status === 'ON_LEAVE' ? null : checkOutTime,
                remarks
            }).unwrap();

            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            setErrorMsg(err?.data?.message || err?.message || 'Failed to update attendance record.');
        }
    };

    const statusOptions = [
        { id: 'PRESENT', label: 'Present', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
        { id: 'LATE', label: 'Late', color: 'bg-amber-50 text-amber-700 border-amber-300' },
        { id: 'HALF_DAY', label: 'Half Day', color: 'bg-blue-50 text-blue-700 border-blue-300' },
        { id: 'ON_LEAVE', label: 'On Leave', color: 'bg-purple-50 text-purple-700 border-purple-300' },
        { id: 'ABSENT', label: 'Absent', color: 'bg-rose-50 text-rose-700 border-rose-300' }
    ];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Mark Staff Attendance</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Updating punch log for <strong className="text-slate-700">{employee.name}</strong> ({employee.employeeId || 'Staff'})
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errorMsg && (
                        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* Date Selector */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date</label>
                        <div className="relative">
                            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Status Toggle Grid */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Attendance Status</label>
                        <div className="grid grid-cols-3 gap-2">
                            {statusOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setStatus(opt.id)}
                                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                                        status === opt.id
                                            ? `${opt.color} ring-2 ring-blue-500/30 shadow-sm`
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Check-in & Check-out Times (only if Present or Late) */}
                    {status !== 'ABSENT' && status !== 'ON_LEAVE' && (
                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Check In Time</label>
                                <div className="relative">
                                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="08:55 AM"
                                        value={checkInTime}
                                        onChange={(e) => setCheckInTime(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Check Out Time</label>
                                <div className="relative">
                                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="05:00 PM"
                                        value={checkOutTime}
                                        onChange={(e) => setCheckOutTime(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Remarks / Reason */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Remarks / Reason (Optional)</label>
                        <textarea
                            rows={2}
                            placeholder="Add reason for leave, late entry, or half day..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
                        >
                            {isLoading ? (
                                <>Saving...</>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Save Attendance
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
