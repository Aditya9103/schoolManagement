import React, { useState, useEffect } from 'react';
import { X, Layers, AlertCircle, UserCheck } from 'lucide-react';
import {
    useCreateSectionMutation,
    useUpdateSectionMutation,
    useGetClassesQuery,
    useGetStaffTeachersQuery,
} from '../../../../../store/api/classApi';
import toast from 'react-hot-toast';

export default function SectionFormModal({
    isOpen,
    onClose,
    defaultClassId = '',
    sectionToEdit = null,
}) {
    const { data: classesRes } = useGetClassesQuery();
    const classes = classesRes?.data || [];

    const { data: staffRes } = useGetStaffTeachersQuery();
    const staffList = staffRes?.data || [];

    const [createSection, { isLoading: isCreating }] = useCreateSectionMutation();
    const [updateSection, { isLoading: isUpdating }] = useUpdateSectionMutation();

    const isEditMode = !!sectionToEdit;

    const [formData, setFormData] = useState({
        classId: defaultClassId || '',
        name: '',
        code: '',
        roomNumber: '',
        capacity: 30,
        classTeacherId: '',
        status: 'Active',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (sectionToEdit) {
            setFormData({
                classId: sectionToEdit.classId?._id || sectionToEdit.classId || defaultClassId,
                name: sectionToEdit.name || '',
                code: sectionToEdit.code || '',
                roomNumber: sectionToEdit.roomNumber || '',
                capacity: sectionToEdit.capacity || 30,
                classTeacherId: sectionToEdit.classTeacherId?._id || sectionToEdit.classTeacherId || '',
                status: sectionToEdit.status || 'Active',
            });
        } else {
            setFormData({
                classId: defaultClassId || (classes[0]?._id || ''),
                name: '',
                code: '',
                roomNumber: '',
                capacity: 30,
                classTeacherId: '',
                status: 'Active',
            });
        }
    }, [sectionToEdit, defaultClassId, classes, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.classId) {
            setError('Please select a class');
            return;
        }
        if (!formData.name.trim()) {
            setError('Section Name is required');
            return;
        }

        try {
            if (isEditMode) {
                await updateSection({
                    classId: formData.classId,
                    sectionId: sectionToEdit._id,
                    name: formData.name.trim().toUpperCase(),
                    code: formData.code.trim().toUpperCase() || `${formData.name.trim().toUpperCase()}`,
                    roomNumber: formData.roomNumber.trim(),
                    capacity: Number(formData.capacity) || 30,
                    classTeacherId: formData.classTeacherId || null,
                    status: formData.status,
                }).unwrap();
                toast.success(`Section ${formData.name.toUpperCase()} updated successfully!`);
            } else {
                await createSection({
                    classId: formData.classId,
                    name: formData.name.trim().toUpperCase(),
                    code: formData.code.trim().toUpperCase() || `${formData.name.trim().toUpperCase()}`,
                    roomNumber: formData.roomNumber.trim(),
                    capacity: Number(formData.capacity) || 30,
                    classTeacherId: formData.classTeacherId || null,
                    status: formData.status,
                }).unwrap();
                toast.success(`Section ${formData.name.toUpperCase()} created successfully!`);
            }

            onClose();
        } catch (err) {
            setError(err?.data?.message || err?.message || 'Failed to save section');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                            <Layers size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">
                                {isEditMode ? `Edit Section: ${sectionToEdit.name}` : 'Add New Section'}
                            </h2>
                            <p className="text-xs text-blue-100">
                                {isEditMode ? 'Update section details, capacity and assigned educator' : 'Create a classroom division and assign educator'}
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
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600 font-semibold">
                            <AlertCircle size={15} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                            Class <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.classId}
                            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                            required
                            disabled={isEditMode}
                        >
                            <option value="">Select a class</option>
                            {classes.map((c) => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                Section Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. A, B, Rose"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 uppercase placeholder:text-slate-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                Classroom Room No.
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Room 101"
                                value={formData.roomNumber}
                                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    {/* Section Teacher Dropdown */}
                    <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                            Assigned Section Teacher
                        </label>
                        <select
                            value={formData.classTeacherId}
                            onChange={(e) => setFormData({ ...formData, classTeacherId: e.target.value })}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="">-- No Section Teacher Assigned --</option>
                            {staffList.map((teacher) => (
                                <option key={teacher._id} value={teacher._id}>
                                    {teacher.name} ({teacher.designation || 'Educator'})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                Section Capacity
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
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
                            {isCreating || isUpdating ? 'Saving...' : (isEditMode ? 'Update Section' : 'Create Section')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
