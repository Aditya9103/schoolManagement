import React, { useState, useEffect } from 'react';
import { X, BookOpen, AlertCircle } from 'lucide-react';
import { useCreateSubjectMutation, useUpdateSubjectMutation, useGetClassesQuery } from '../../../../../store/api/classApi';
import toast from 'react-hot-toast';

const COLOR_OPTIONS = [
    { label: 'Blue', value: '#3B82F6' },
    { label: 'Emerald', value: '#10B981' },
    { label: 'Amber', value: '#F59E0B' },
    { label: 'Purple', value: '#8B5CF6' },
    { label: 'Rose', value: '#F43F5E' },
    { label: 'Indigo', value: '#6366F1' },
    { label: 'Teal', value: '#14B8A6' },
];

export default function AssignSubjectModal({
    isOpen,
    onClose,
    defaultClassId = '',
    subjectToEdit = null,
}) {
    const { data: classesRes } = useGetClassesQuery();
    const classes = classesRes?.data || [];

    const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation();
    const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation();

    const [formData, setFormData] = useState({
        classId: defaultClassId,
        name: '',
        code: '',
        periodsPerWeek: 6,
        color: '#3B82F6',
        teacherName: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (subjectToEdit) {
            setFormData({
                classId: subjectToEdit.classId?._id || subjectToEdit.classId || defaultClassId,
                name: subjectToEdit.name || '',
                code: subjectToEdit.code || '',
                periodsPerWeek: subjectToEdit.periodsPerWeek || 6,
                color: subjectToEdit.color || '#3B82F6',
                teacherName: subjectToEdit.teacherId?.firstName
                    ? `${subjectToEdit.teacherId.firstName} ${subjectToEdit.teacherId.lastName || ''}`.trim()
                    : (subjectToEdit.teacherName || ''),
            });
        } else {
            setFormData({
                classId: defaultClassId || (classes[0]?._id || ''),
                name: '',
                code: '',
                periodsPerWeek: 6,
                color: '#3B82F6',
                teacherName: '',
            });
        }
    }, [subjectToEdit, defaultClassId, classes]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('Subject Name is required');
            return;
        }

        try {
            if (subjectToEdit) {
                await updateSubject({
                    id: subjectToEdit._id,
                    ...formData,
                    periodsPerWeek: Number(formData.periodsPerWeek) || 6,
                }).unwrap();
                toast.success(`Subject ${formData.name} updated successfully!`);
            } else {
                await createSubject({
                    ...formData,
                    periodsPerWeek: Number(formData.periodsPerWeek) || 6,
                }).unwrap();
                toast.success(`Subject ${formData.name} assigned successfully!`);
            }
            onClose();
        } catch (err) {
            setError(err?.data?.message || err?.message || 'Failed to save subject');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">
                                {subjectToEdit ? 'Edit Subject' : 'Assign Subject'}
                            </h2>
                            <p className="text-xs text-blue-100">Configure curriculum subject and weekly periods</p>
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
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600 font-medium">
                            <AlertCircle size={15} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-slate-800 font-bold mb-1">
                            Class <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.classId}
                            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                            required
                        >
                            <option value="">Select a class</option>
                            {classes.map((c) => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-800 font-bold mb-1">
                                Subject Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Mathematics"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-800 font-bold mb-1">
                                Subject Code
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. MATH, ENG"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium uppercase"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-800 font-bold mb-1">
                                Periods / Week
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={formData.periodsPerWeek}
                                onChange={(e) => setFormData({ ...formData, periodsPerWeek: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-800 font-bold mb-1">
                                Color Tag
                            </label>
                            <div className="flex items-center gap-2 pt-1.5">
                                {COLOR_OPTIONS.map((c) => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, color: c.value })}
                                        className={`w-6 h-6 rounded-full transition-transform ${
                                            formData.color === c.value ? 'scale-125 ring-2 ring-offset-2 ring-blue-500' : 'hover:scale-110'
                                        }`}
                                        style={{ backgroundColor: c.value }}
                                        title={c.label}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-800 font-bold mb-1">
                            Assigned Teacher (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Priya Sharma"
                            value={formData.teacherName}
                            onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                        />
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
                            {isCreating || isUpdating ? 'Saving...' : (subjectToEdit ? 'Update Subject' : 'Assign Subject')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
