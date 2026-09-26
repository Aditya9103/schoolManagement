import React, { useState, useEffect } from 'react';
import { X, Clock, Coffee, BookOpen, UserCheck, AlertCircle, Building2 } from 'lucide-react';

export default function TimetableSlotModal({
    isOpen,
    onClose,
    slot = null,
    availableSubjects = [],
    availableTeachers = [],
    defaultRoomNumber = '',
    onSave,
}) {
    const [formData, setFormData] = useState({
        day: 'Monday',
        periodNumber: 1,
        startTime: '08:00 AM',
        endTime: '08:45 AM',
        isBreak: false,
        breakTitle: 'Recess Break',
        subjectId: '',
        subjectName: '',
        teacherId: '',
        teacherName: '',
        roomNumber: defaultRoomNumber || 'Room 101',
        color: '#3B82F6',
        note: '',
    });

    useEffect(() => {
        if (slot) {
            setFormData({
                day: slot.day || 'Monday',
                periodNumber: slot.periodNumber || 1,
                startTime: slot.startTime || '08:00 AM',
                endTime: slot.endTime || '08:45 AM',
                isBreak: !!slot.isBreak,
                breakTitle: slot.breakTitle || (slot.isBreak ? slot.subjectName : 'Recess Break'),
                subjectId: slot.subjectId?._id || slot.subjectId || '',
                subjectName: slot.subjectName || (slot.isBreak ? 'Recess Break' : (availableSubjects[0]?.name || '')),
                teacherId: slot.teacherId?._id || slot.teacherId || '',
                teacherName: slot.teacherName || (slot.teacherId?.firstName ? `${slot.teacherId.firstName} ${slot.teacherId.lastName || ''}`.trim() : ''),
                roomNumber: slot.roomNumber || defaultRoomNumber || 'Room 101',
                color: slot.color || (slot.isBreak ? '#64748B' : (availableSubjects[0]?.color || '#3B82F6')),
                note: slot.note || '',
            });
        }
    }, [slot, defaultRoomNumber, availableSubjects]);

    if (!isOpen) return null;

    const handleSubjectChange = (e) => {
        const subId = e.target.value;
        const sub = availableSubjects.find((s) => s._id === subId);
        if (sub) {
            // Check if subject has assigned teachers to suggest
            const assignedTeacher = sub.teachersAssigned?.[0] || sub.teacherId;
            setFormData((prev) => ({
                ...prev,
                subjectId: sub._id,
                subjectName: sub.name,
                color: sub.color || '#3B82F6',
                teacherId: assignedTeacher ? (assignedTeacher._id || assignedTeacher) : prev.teacherId,
                teacherName: assignedTeacher?.firstName ? `${assignedTeacher.firstName} ${assignedTeacher.lastName || ''}`.trim() : prev.teacherName,
                isBreak: false,
            }));
        } else {
            setFormData((prev) => ({ ...prev, subjectId: '', subjectName: '' }));
        }
    };

    const handleTeacherChange = (e) => {
        const tId = e.target.value;
        const t = availableTeachers.find((item) => item._id === tId);
        if (t) {
            setFormData((prev) => ({
                ...prev,
                teacherId: t._id,
                teacherName: `${t.firstName || ''} ${t.lastName || ''}`.trim(),
            }));
        } else {
            setFormData((prev) => ({ ...prev, teacherId: '', teacherName: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            subjectName: formData.isBreak ? (formData.breakTitle || 'Recess Break') : formData.subjectName,
            color: formData.isBreak ? '#64748B' : formData.color,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
                {/* Header */}
                <div className={`px-6 py-5 flex items-center justify-between text-white shrink-0 ${
                    formData.isBreak
                        ? 'bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900'
                        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700'
                }`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner">
                            {formData.isBreak ? <Coffee size={20} /> : <Clock size={20} />}
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white tracking-tight">
                                {formData.isBreak ? 'Configure Break / Recess Slot' : 'Configure Timetable Slot'}
                            </h2>
                            <p className="text-xs text-white/80 font-medium">
                                {formData.day} • Period {formData.periodNumber} ({formData.startTime} - {formData.endTime})
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                    {/* Toggle Break / Recess */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                                formData.isBreak ? 'bg-slate-200 text-slate-800' : 'bg-blue-100 text-blue-700'
                            }`}>
                                <Coffee size={16} />
                            </div>
                            <div>
                                <label htmlFor="isBreakToggle" className="text-xs font-bold text-slate-800 block cursor-pointer">
                                    Recess or Break Slot
                                </label>
                                <span className="text-[11px] text-slate-700 font-semibold">
                                    Mark this period as a break (Recess, Lunch, Assembly, Zero period)
                                </span>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            id="isBreakToggle"
                            checked={formData.isBreak}
                            onChange={(e) => setFormData({ ...formData, isBreak: e.target.checked })}
                            className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                    </div>

                    {/* If Break: Break Title */}
                    {formData.isBreak ? (
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                Break Title / Activity Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.breakTitle}
                                onChange={(e) => setFormData({ ...formData, breakTitle: e.target.value })}
                                placeholder="e.g. Morning Recess, Lunch Break, Assembly"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-500"
                                required
                            />
                        </div>
                    ) : (
                        <>
                            {/* Subject Dropdown */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                    Academic Subject <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.subjectId}
                                    onChange={handleSubjectChange}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                                    required
                                >
                                    <option value="">-- Select Subject from Curriculum --</option>
                                    {availableSubjects.map((sub) => (
                                        <option key={sub._id} value={sub._id}>
                                            {sub.name} ({sub.code || 'SUB'}) • {sub.category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Teacher Dropdown */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                    Assigned Educator / Faculty <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.teacherId}
                                    onChange={handleTeacherChange}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                                    required
                                >
                                    <option value="">-- Select Faculty Member --</option>
                                    {availableTeachers.map((teacher) => (
                                        <option key={teacher._id} value={teacher._id}>
                                            {teacher.firstName} {teacher.lastName || ''} ({teacher.designation || 'Faculty'})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {/* Start Time & End Time */}
                    <div className="grid grid-cols-2 gap-3.5">
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                Start Time
                            </label>
                            <input
                                type="text"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                placeholder="08:00 AM"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                End Time
                            </label>
                            <input
                                type="text"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                placeholder="08:45 AM"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Room & Color */}
                    <div className="grid grid-cols-2 gap-3.5">
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                Classroom / Room
                            </label>
                            <input
                                type="text"
                                value={formData.roomNumber}
                                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                placeholder="Room 101"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                Card Color
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="w-10 h-10 p-1 bg-slate-50 border border-slate-300 rounded-xl cursor-pointer"
                                />
                                <span className="text-xs font-mono font-bold text-slate-800">{formData.color}</span>
                            </div>
                        </div>
                    </div>

                    {/* Note / Remarks */}
                    <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                            Additional Note or Lab Instruction
                        </label>
                        <input
                            type="text"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            placeholder="e.g. Bring Practical Lab Coats, Computer Lab 2"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-500"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 active:scale-95 transition-all"
                        >
                            Save Slot Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
