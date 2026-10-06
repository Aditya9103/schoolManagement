import React, { useState } from 'react';
import { X, User, Phone, Mail, Briefcase, MapPin, AlertCircle, CheckCircle2, Users } from 'lucide-react';
import { useGetStudentsQuery } from '../../../../../store/api/studentApi';
import { useCreateParentMutation } from '../../../../../store/api/peopleApi';

export default function AddParentModal({ isOpen, onClose, onSuccess }) {
    const [createParent, { isLoading: isSubmitting }] = useCreateParentMutation();
    const [formData, setFormData] = useState({
        title: 'Mr.',
        fullName: '',
        relationship: 'FATHER',
        phone: '',
        email: '',
        occupation: '',
        employer: '',
        annualIncome: '',
        street: '',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
        studentId: '',
        canPickupStudent: true,
        canReceiveNotifications: true
    });

    const [errorMsg, setErrorMsg] = useState('');

    // Fetch students list for dropdown linking
    const { data: studentsData } = useGetStudentsQuery({ limit: 50 }, { skip: !isOpen });
    const students = studentsData?.data?.students || studentsData?.data || [];

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            await createParent({
                fullName: formData.fullName,
                relationship: formData.relationship,
                title: formData.title,
                phone: formData.phone,
                email: formData.email,
                occupation: formData.occupation,
                employer: formData.employer,
                annualIncome: formData.annualIncome ? Number(formData.annualIncome) : undefined,
                address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode
                },
                studentId: formData.studentId || undefined,
                canPickupStudent: formData.canPickupStudent,
                canReceiveNotifications: formData.canReceiveNotifications
            }).unwrap();

            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            setErrorMsg(err?.data?.message || err?.message || 'Failed to register parent.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Add Parent / Guardian</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Register a new parent profile and link them to students</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {errorMsg && (
                        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* Section 1: Basic Information */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Guardian Details</h3>
                        <div className="grid grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1">Title</label>
                                <select
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-2.5 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
                                >
                                    <option value="Mr.">Mr.</option>
                                    <option value="Mrs.">Mrs.</option>
                                    <option value="Ms.">Ms.</option>
                                    <option value="Dr.">Dr.</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-800 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    placeholder="e.g. Ramesh Kumar"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 placeholder:text-slate-500 shadow-2xs"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1">Relation</label>
                                <select
                                    name="relationship"
                                    value={formData.relationship}
                                    onChange={handleChange}
                                    className="w-full px-2 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
                                >
                                    <option value="FATHER">Father</option>
                                    <option value="MOTHER">Mother</option>
                                    <option value="GUARDIAN">Guardian</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        placeholder="+91 98765 43210"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-8 pr-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 placeholder:text-slate-500 shadow-2xs"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="parent@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-8 pr-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 placeholder:text-slate-500 shadow-2xs"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Professional & Address */}
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Employment & Address</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1">Occupation</label>
                                <input
                                    type="text"
                                    name="occupation"
                                    placeholder="e.g. Senior Software Engineer"
                                    value={formData.occupation}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 placeholder:text-slate-500 shadow-2xs"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1">Employer / Organization</label>
                                <input
                                    type="text"
                                    name="employer"
                                    placeholder="e.g. Infosys Ltd."
                                    value={formData.employer}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 placeholder:text-slate-500 shadow-2xs"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">Residential Street Address</label>
                            <input
                                type="text"
                                name="street"
                                placeholder="House / Flat No, Street Name, Area"
                                value={formData.street}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 placeholder:text-slate-500 shadow-2xs"
                            />
                        </div>
                    </div>

                    {/* Section 3: Student Linking */}
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Link Student (Child)</h3>
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">Select Student</label>
                            <select
                                name="studentId"
                                value={formData.studentId}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
                            >
                                <option value="">-- Link to existing student (Optional) --</option>
                                {students.map((s) => (
                                    <option key={s._id || s.id} value={s._id || s.id}>
                                        {s.firstName} {s.lastName} ({s.admissionNo || 'Student'})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-6 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                                <input
                                    type="checkbox"
                                    name="canPickupStudent"
                                    checked={formData.canPickupStudent}
                                    onChange={handleChange}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>Authorized for Gate Pickup</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                                <input
                                    type="checkbox"
                                    name="canReceiveNotifications"
                                    checked={formData.canReceiveNotifications}
                                    onChange={handleChange}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>Receive SMS/App Alerts</span>
                            </label>
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
                            disabled={isSubmitting}
                            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
                        >
                            {isSubmitting ? (
                                <>Saving...</>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Save Parent Profile
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
