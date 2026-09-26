import React, { useState, useEffect } from 'react';
import { X, UserCheck, AlertCircle, BookOpen, Layers } from 'lucide-react';
import {
    useAssignSubjectTeachersMutation,
    useGetClassesQuery,
    useGetStaffTeachersQuery,
} from '../../../../../store/api/classApi';
import toast from 'react-hot-toast';

export default function AssignSubjectTeachersModal({
    isOpen,
    onClose,
    subject = null,
}) {
    const { data: classesRes } = useGetClassesQuery();
    const classes = classesRes?.data || [];

    const { data: staffRes } = useGetStaffTeachersQuery();
    const staffList = staffRes?.data || [];

    const [assignTeachers, { isLoading }] = useAssignSubjectTeachersMutation();

    const [selectedClassIds, setSelectedClassIds] = useState([]);
    const [selectedTeacherIds, setSelectedTeacherIds] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (subject) {
            setSelectedClassIds(
                (subject.classesAssigned || []).map((c) => (typeof c === 'object' ? c._id : c))
            );
            setSelectedTeacherIds(
                (subject.teachersAssigned || []).map((t) => (typeof t === 'object' ? t._id : t))
            );
        }
    }, [subject, isOpen]);

    if (!isOpen || !subject) return null;

    const handleToggleTeacher = (tId) => {
        setSelectedTeacherIds((prev) =>
            prev.includes(tId) ? prev.filter((id) => id !== tId) : [...prev, tId]
        );
    };

    const handleToggleClass = (cId) => {
        setSelectedClassIds((prev) =>
            prev.includes(cId) ? prev.filter((id) => id !== cId) : [...prev, cId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await assignTeachers({
                subjectId: subject._id,
                classIds: selectedClassIds,
                teacherIds: selectedTeacherIds,
            }).unwrap();

            toast.success(`Assigned educators to ${subject.name}!`);
            onClose();
        } catch (err) {
            setError(err?.data?.message || err?.message || 'Failed to assign teachers');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                            <UserCheck size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Assign Teachers: {subject.name}</h2>
                            <p className="text-xs text-blue-100">
                                Select qualified teachers and assigned grade levels
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600 font-semibold">
                            <AlertCircle size={15} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Teachers selection */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-slate-800">
                                Select Educators
                            </label>
                            <span className="text-[11px] text-blue-600 font-semibold">
                                {selectedTeacherIds.length} assigned
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-semibold mb-2">
                            Teachers selected here will be eligible to teach {subject.name} in timetables:
                        </p>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto p-1">
                            {staffList.map((teacher) => {
                                const isChecked = selectedTeacherIds.includes(teacher._id);
                                return (
                                    <div
                                        key={teacher._id}
                                        onClick={() => handleToggleTeacher(teacher._id)}
                                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                                            isChecked
                                                ? 'bg-blue-50/80 border-blue-400'
                                                : 'bg-white border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <img
                                                src={teacher.profilePhotoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80'}
                                                alt={teacher.name}
                                                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                            />
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">{teacher.name}</p>
                                                <p className="text-[10px] text-slate-700 font-semibold">{teacher.designation || 'Educator'} • {teacher.email}</p>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => {}}
                                            className="rounded text-blue-600 focus:ring-blue-500"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Classes assigned */}
                    <div className="pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-slate-800">
                                Assigned Classes (Grades)
                            </label>
                            <span className="text-[11px] text-blue-600 font-semibold">
                                {selectedClassIds.length} classes
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                            {classes.map((cls) => {
                                const isChecked = selectedClassIds.includes(cls._id);
                                return (
                                    <button
                                        key={cls._id}
                                        type="button"
                                        onClick={() => handleToggleClass(cls._id)}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                                            isChecked
                                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        {cls.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : 'Save Assignments'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
