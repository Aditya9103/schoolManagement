import React, { useState, useEffect } from 'react';
import { X, Edit3, AlertCircle, Save } from 'lucide-react';
import { useUpdateTeacherMutation } from '../../../../../store/api/peopleApi';

export default function EditTeacherModal({ isOpen, onClose, teacher, onSuccess }) {
    if (!isOpen || !teacher) return null;

    const [updateTeacher, { isLoading }] = useUpdateTeacherMutation();
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        gender: 'FEMALE',
        employeeId: '',
        department: 'Mathematics',
        designation: 'Teacher',
        qualification: '',
        experienceYears: 0,
        specialization: '',
        status: 'ACTIVE',
    });

    useEffect(() => {
        if (teacher) {
            // Support both flat format from teachers list and nested format from teacher detail
            const user = teacher.user || teacher;
            const profile = teacher.profile || teacher;

            const nameParts = (user.name || '').split(' ');
            const firstName = user.firstName || nameParts[0] || '';
            const lastName = user.lastName || nameParts.slice(1).join(' ') || '';

            const isLeave = teacher.status === 'On Leave' || teacher.status === 'ON_LEAVE' || profile.status === 'ON_LEAVE';

            setFormData({
                firstName,
                lastName,
                phone: user.phone || teacher.phone || '',
                gender: user.gender || 'FEMALE',
                employeeId: profile.employeeId || teacher.employeeId || '',
                department: profile.department || teacher.department || 'Mathematics',
                designation: profile.designation || teacher.designation || 'Teacher',
                qualification: profile.qualification || teacher.qualification || '',
                experienceYears: profile.experienceYears ?? teacher.experienceYears ?? 0,
                specialization: Array.isArray(profile.specialization)
                    ? profile.specialization.join(', ')
                    : (profile.specialization || teacher.specialization || ''),
                status: isLeave ? 'ON_LEAVE' : 'ACTIVE',
            });
            setErrorMsg('');
        }
    }, [teacher]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setErrorMsg('First Name and Last Name are required.');
            return;
        }

        const teacherId = teacher.id || teacher._id || teacher.user?._id;

        try {
            await updateTeacher({
                id: teacherId,
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                phone: formData.phone.trim(),
                gender: formData.gender,
                employeeId: formData.employeeId.trim(),
                department: formData.department,
                designation: formData.designation.trim(),
                qualification: formData.qualification.trim(),
                experienceYears: Number(formData.experienceYears) || 0,
                specialization: formData.specialization
                    ? formData.specialization.split(',').map((s) => s.trim()).filter(Boolean)
                    : [],
                status: formData.status,
            }).unwrap();

            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            setErrorMsg(err?.data?.message || err?.message || 'Failed to update teacher.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
                {/* Header */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                            <Edit3 size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 font-display">Edit Faculty Profile</h3>
                            <p className="text-[11px] text-slate-500">Update teacher details and academic credentials</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {errorMsg && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                            <AlertCircle size={15} />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="e.g. +91 98765 43210"
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 bg-white"
                            >
                                <option value="FEMALE">Female</option>
                                <option value="MALE">Male</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Employee ID</label>
                            <input
                                type="text"
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Operational Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 bg-white"
                            >
                                <option value="ACTIVE">Active & Teaching</option>
                                <option value="ON_LEAVE">On Leave</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 bg-white"
                            >
                                <option value="Mathematics">Mathematics</option>
                                <option value="Science">Science</option>
                                <option value="English">English</option>
                                <option value="Social Studies">Social Studies</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Physical Education">Physical Education</option>
                                <option value="Arts & Music">Arts & Music</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                            <input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                placeholder="e.g. Senior Mathematics Teacher"
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Qualification</label>
                            <input
                                type="text"
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                placeholder="e.g. M.Sc., B.Ed."
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Years)</label>
                            <input
                                type="number"
                                name="experienceYears"
                                value={formData.experienceYears}
                                onChange={handleChange}
                                min="0"
                                max="50"
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Specialization (comma-separated)</label>
                        <input
                            type="text"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            placeholder="e.g. Calculus, Algebra, Statistics"
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                        />
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                            <Save size={14} />
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
