import React, { useState } from 'react';
import { X, UserCheck, AlertCircle, Search, Mail, Phone, Check, Loader2 } from 'lucide-react';
import { useAssignTeacherMutation, useGetStaffTeachersQuery } from '../../../../../store/api/classApi';
import toast from 'react-hot-toast';

export default function AssignTeacherModal({
    isOpen,
    onClose,
    targetType = 'class', // 'class' or 'section'
    targetId = null,
    targetName = '',
    currentTeacherId = null,
}) {
    const { data: teachersRes, isLoading: isLoadingTeachers } = useGetStaffTeachersQuery(undefined, {
        skip: !isOpen,
    });
    const teachers = teachersRes?.data || [];

    const [assignTeacher, { isLoading: isAssigning }] = useAssignTeacherMutation();
    const [selectedTeacherId, setSelectedTeacherId] = useState(currentTeacherId || '');
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');

    React.useEffect(() => {
        if (currentTeacherId) {
            setSelectedTeacherId(currentTeacherId);
        } else if (teachers.length > 0 && !selectedTeacherId) {
            setSelectedTeacherId(teachers[0]._id);
        }
    }, [currentTeacherId, teachers]);

    if (!isOpen) return null;

    const filteredTeachers = teachers.filter((t) => {
        const full = `${t.firstName || ''} ${t.lastName || ''} ${t.email || ''} ${t.designation || ''}`.toLowerCase();
        return full.includes(searchQuery.toLowerCase());
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!selectedTeacherId) {
            setError('Please select a teacher to assign');
            return;
        }

        try {
            const payload = targetType === 'class'
                ? { classId: targetId, teacherId: selectedTeacherId }
                : { sectionId: targetId, teacherId: selectedTeacherId };

            await assignTeacher(payload).unwrap();
            const teacherObj = teachers.find((t) => t._id === selectedTeacherId);
            toast.success(`Assigned ${teacherObj ? `${teacherObj.firstName} ${teacherObj.lastName || ''}`.trim() : 'Teacher'} successfully!`);
            onClose();
        } catch (err) {
            setError(err?.data?.message || err?.message || 'Failed to assign teacher');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 flex items-center justify-between text-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner">
                            <UserCheck size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white tracking-tight">Assign Educator</h2>
                            <p className="text-xs text-blue-100 font-medium">
                                Assign teacher to {targetType === 'class' ? 'Class' : 'Section'} {targetName}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/60 shrink-0">
                    <div className="relative">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search educator by name, email, or designation..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Form & Educator List */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 space-y-4 overflow-y-auto flex-1">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600 font-medium">
                                <AlertCircle size={15} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-slate-700 font-bold px-1">
                            <span>Available Faculty ({filteredTeachers.length})</span>
                            <span>Select 1 Educator</span>
                        </div>

                        {isLoadingTeachers ? (
                            <div className="py-12 text-center">
                                <Loader2 size={24} className="animate-spin text-blue-600 mx-auto mb-2" />
                                <p className="text-xs text-slate-600 font-semibold">Loading faculty members...</p>
                            </div>
                        ) : filteredTeachers.length === 0 ? (
                            <div className="py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-xs font-bold text-slate-700">No educators found</p>
                                <p className="text-[11px] text-slate-700 font-semibold font-medium mt-0.5">Try searching with a different term</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {filteredTeachers.map((teacher) => {
                                    const isSelected = selectedTeacherId === teacher._id;
                                    const fullName = `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() || 'Educator';
                                    const initials = `${teacher.firstName?.[0] || 'T'}${teacher.lastName?.[0] || ''}`;

                                    return (
                                        <div
                                            key={teacher._id}
                                            onClick={() => setSelectedTeacherId(teacher._id)}
                                            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                                                isSelected
                                                    ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-2 ring-blue-500/10'
                                                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {teacher.profilePhotoUrl ? (
                                                    <img
                                                        src={teacher.profilePhotoUrl}
                                                        alt={fullName}
                                                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                                                        {initials}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs font-bold text-slate-900">{fullName}</p>
                                                        {isSelected && (
                                                            <span className="px-1.5 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold">
                                                                Selected
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] font-semibold text-slate-700">
                                                        {teacher.designation || 'Faculty Member'}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-600 font-medium">
                                                        {teacher.email && (
                                                            <span className="flex items-center gap-1">
                                                                <Mail size={11} className="text-slate-500" /> {teacher.email}
                                                            </span>
                                                        )}
                                                        {teacher.phone && (
                                                            <span className="flex items-center gap-1">
                                                                <Phone size={11} className="text-slate-500" /> {teacher.phone}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                                                    isSelected
                                                        ? 'bg-blue-600 border-blue-600 text-white'
                                                        : 'border-slate-300 bg-white'
                                                }`}
                                            >
                                                {isSelected && <Check size={13} strokeWidth={3} />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isAssigning || !selectedTeacherId}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isAssigning ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>Assigning...</span>
                                </>
                            ) : (
                                <span>Save Educator Assignment</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
