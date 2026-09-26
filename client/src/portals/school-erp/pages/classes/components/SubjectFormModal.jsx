import React, { useState, useEffect } from 'react';
import {
    X,
    BookOpen,
    AlertCircle,
    Check,
    Layers,
    UserCheck,
    Palette,
} from 'lucide-react';
import {
    useCreateSubjectMutation,
    useUpdateSubjectMutation,
    useGetClassesQuery,
    useGetStaffTeachersQuery,
} from '../../../../../store/api/classApi';
import toast from 'react-hot-toast';

const CATEGORIES = [
    'Languages',
    'Mathematics',
    'Science',
    'Humanities',
    'Technology',
    'Arts',
    'Sports',
    'Other',
];

const PRESET_COLORS = [
    '#EF4444', // Red (English / Languages)
    '#3B82F6', // Blue (Mathematics)
    '#10B981', // Green (Science)
    '#F97316', // Orange (Social Science)
    '#F59E0B', // Amber (Hindi)
    '#8B5CF6', // Purple (Computer / Tech)
    '#EC4899', // Pink (Art & Craft)
    '#06B6D4', // Cyan (Physical Education)
];

export default function SubjectFormModal({
    isOpen,
    onClose,
    subjectToEdit = null,
}) {
    const { data: classesRes } = useGetClassesQuery();
    const classes = classesRes?.data || [];

    const { data: staffRes } = useGetStaffTeachersQuery();
    const staffList = staffRes?.data || [];

    const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation();
    const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation();

    const isEditMode = !!subjectToEdit;

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        category: 'Languages',
        type: 'Core',
        description: '',
        periodsPerWeek: 5,
        color: '#3B82F6',
        classesAssigned: [],
        teachersAssigned: [],
        status: 'Active',
    });

    const [error, setError] = useState('');

    useEffect(() => {
        if (subjectToEdit) {
            setFormData({
                name: subjectToEdit.name || '',
                code: subjectToEdit.code || '',
                category: subjectToEdit.category || 'Languages',
                type: subjectToEdit.type || 'Core',
                description: subjectToEdit.description || '',
                periodsPerWeek: subjectToEdit.periodsPerWeek || 5,
                color: subjectToEdit.color || '#3B82F6',
                classesAssigned: (subjectToEdit.classesAssigned || []).map((c) => (typeof c === 'object' ? c._id : c)),
                teachersAssigned: (subjectToEdit.teachersAssigned || []).map((t) => (typeof t === 'object' ? t._id : t)),
                status: subjectToEdit.status || 'Active',
            });
        } else {
            setFormData({
                name: '',
                code: '',
                category: 'Languages',
                type: 'Core',
                description: '',
                periodsPerWeek: 5,
                color: '#3B82F6',
                classesAssigned: classes.slice(0, 10).map((c) => c._id),
                teachersAssigned: staffList.slice(0, 2).map((t) => t._id),
                status: 'Active',
            });
        }
    }, [subjectToEdit, isOpen, classes, staffList]);

    if (!isOpen) return null;

    const handleToggleClass = (classId) => {
        setFormData((prev) => ({
            ...prev,
            classesAssigned: prev.classesAssigned.includes(classId)
                ? prev.classesAssigned.filter((id) => id !== classId)
                : [...prev.classesAssigned, classId],
        }));
    };

    const handleToggleTeacher = (teacherId) => {
        setFormData((prev) => ({
            ...prev,
            teachersAssigned: prev.teachersAssigned.includes(teacherId)
                ? prev.teachersAssigned.filter((id) => id !== teacherId)
                : [...prev.teachersAssigned, teacherId],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('Subject Name is required');
            return;
        }
        if (!formData.code.trim()) {
            setError('Subject Code is required (e.g. ENG, MATH)');
            return;
        }

        try {
            const payload = {
                ...formData,
                name: formData.name.trim(),
                code: formData.code.trim().toUpperCase(),
                periodsPerWeek: Number(formData.periodsPerWeek) || 5,
                classId: formData.classesAssigned[0] || null,
                teacherId: formData.teachersAssigned[0] || null,
            };

            if (isEditMode) {
                await updateSubject({ id: subjectToEdit._id, ...payload }).unwrap();
                toast.success(`Subject ${formData.name} updated successfully!`);
            } else {
                await createSubject(payload).unwrap();
                toast.success(`Subject ${formData.name} created successfully!`);
            }

            onClose();
        } catch (err) {
            setError(err?.data?.message || err?.message || 'Failed to save subject');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8">
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">
                                {isEditMode ? `Edit Subject: ${subjectToEdit.name}` : 'Add New Subject'}
                            </h2>
                            <p className="text-xs text-blue-100">
                                Configure curriculum details, core/elective classification, and educators
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
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600 font-semibold">
                            <AlertCircle size={15} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Name & Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                Subject Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. English, Mathematics, Science"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                Subject Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. ENG, MATH, SCI, COMP"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 uppercase font-mono placeholder:text-slate-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Category & Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                Subject Type
                            </label>
                            <div className="flex items-center gap-2 pt-0.5">
                                {['Core', 'Elective'].map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: t })}
                                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                                            formData.type === t
                                                ? t === 'Core'
                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                                                    : 'bg-purple-50 text-purple-800 border-purple-300 shadow-xs'
                                                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100 font-semibold'
                                        }`}
                                    >
                                        {t} Subject
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                            Subject Description / Scope
                        </label>
                        <textarea
                            rows={2}
                            placeholder="e.g. Language and communication skills development through reading, writing, listening and speaking."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-500"
                        />
                    </div>

                    {/* Periods per Week & Color Badge */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                Periods per Week
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={formData.periodsPerWeek}
                                onChange={(e) => setFormData({ ...formData, periodsPerWeek: Number(e.target.value) })}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                Subject Theme Color
                            </label>
                            <div className="flex items-center gap-2 pt-1.5">
                                {PRESET_COLORS.map((col) => (
                                    <button
                                        key={col}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, color: col })}
                                        className={`w-7 h-7 rounded-full transition-transform ${
                                            formData.color === col
                                                ? 'scale-125 ring-2 ring-offset-2 ring-blue-500'
                                                : 'hover:scale-110'
                                        }`}
                                        style={{ backgroundColor: col }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Assigned Teachers (Multiple educators can be assigned) */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-slate-800">
                                Assigned Teachers (Educators)
                            </label>
                            <span className="text-[11px] text-blue-700 font-bold">
                                {formData.teachersAssigned.length} selected
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium mb-2">
                            Any teacher can teach multiple subjects. Select educators qualified for this curriculum:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                            {staffList.map((teacher) => {
                                const isChecked = formData.teachersAssigned.includes(teacher._id);
                                return (
                                    <div
                                        key={teacher._id}
                                        onClick={() => handleToggleTeacher(teacher._id)}
                                        className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                                            isChecked
                                                ? 'bg-blue-50/80 border-blue-400'
                                                : 'bg-white border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                                                {teacher.name[0]}
                                            </div>
                                            <span className="text-xs font-bold text-slate-800 truncate">{teacher.name}</span>
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

                    {/* Assigned Classes */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-slate-800">
                                Assigned Classes (Grades)
                            </label>
                            <span className="text-[11px] text-blue-700 font-bold">
                                {formData.classesAssigned.length} classes
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                            {classes.map((cls) => {
                                const isChecked = formData.classesAssigned.includes(cls._id);
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
                            disabled={isCreating || isUpdating}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isCreating || isUpdating ? 'Saving...' : (isEditMode ? 'Update Subject' : 'Create Subject')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
