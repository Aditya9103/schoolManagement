import React, { useState, useEffect } from 'react';
import {
    X,
    Users,
    UserPlus,
    Calendar,
    Phone,
    Mail,
    ArrowRight,
    CheckCircle2,
    Clock,
    Plus,
    Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
    useGetEnquiriesQuery,
    useCreateEnquiryMutation,
    useConvertEnquiryMutation,
    useCreateWalkInApplicationMutation
} from '../../../../../store/api/admissionsApi';
import { useGetAcademicYearsQuery } from '../../../../../store/api/classApi';

export default function EnquiryAndWalkInModal({ onClose, onApplicationCreated }) {
    const [activeTab, setActiveTab] = useState('enquiries'); // 'enquiries' | 'walk-in' | 'new-enquiry'

    const { data: res, isLoading: isEnquiriesLoading } = useGetEnquiriesQuery();
    const [createEnquiry, { isLoading: isCreatingEnquiry }] = useCreateEnquiryMutation();
    const [convertEnquiry, { isLoading: isConverting }] = useConvertEnquiryMutation();
    const [createWalkIn, { isLoading: isSubmittingWalkIn }] = useCreateWalkInApplicationMutation();

    const enquiries = res?.data || [];

    const { data: yearsRes } = useGetAcademicYearsQuery();
    const rawYears = yearsRes?.data;
    const academicYears = Array.isArray(rawYears) ? rawYears : (rawYears?.academicYears || []);
    const currentYear = rawYears?.currentAcademicYear || academicYears.find((y) => y.isCurrent) || academicYears[0];

    // New Enquiry Form State
    const [enquiryForm, setEnquiryForm] = useState({
        applicantName: '',
        parentName: '',
        phone: '',
        email: '',
        classInterest: 'Class 1',
        academicYear: '',
        academicYearId: '',
        source: 'Walk-in',
        priority: 'High',
        nextFollowUpDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
        notes: 'Parent visited campus and requested prospectus.',
    });

    // Walk-In Fast Registration Form State
    const [walkInForm, setWalkInForm] = useState({
        firstName: '',
        lastName: '',
        gender: 'Male',
        dateOfBirth: '2019-05-15',
        targetClassName: 'Class 1',
        fatherName: '',
        fatherPhone: '',
        fatherEmail: '',
        academicYear: '',
        academicYearId: '',
    });

    useEffect(() => {
        if (currentYear) {
            setEnquiryForm((prev) => ({
                ...prev,
                academicYear: prev.academicYear || currentYear.name,
                academicYearId: prev.academicYearId || currentYear._id,
            }));
            setWalkInForm((prev) => ({
                ...prev,
                academicYear: prev.academicYear || currentYear.name,
                academicYearId: prev.academicYearId || currentYear._id,
            }));
        }
    }, [currentYear]);

    const handleCreateEnquiry = async (e) => {
        e.preventDefault();
        try {
            await createEnquiry(enquiryForm).unwrap();
            toast.success('Enquiry lead captured successfully');
            setActiveTab('enquiries');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to capture enquiry');
        }
    };

    const handleConvert = async (enquiryId) => {
        try {
            const converted = await convertEnquiry(enquiryId).unwrap();
            toast.success('Converted to official application!');
            if (onApplicationCreated) {
                onApplicationCreated(converted.data);
            }
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to convert enquiry');
        }
    };

    const handleWalkInSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                targetClassName: walkInForm.targetClassName,
                academicYear: walkInForm.academicYear,
                academicYearId: walkInForm.academicYearId || undefined,
                source: 'Walk-in',
                student: {
                    firstName: walkInForm.firstName,
                    lastName: walkInForm.lastName,
                    gender: walkInForm.gender,
                    dateOfBirth: walkInForm.dateOfBirth,
                    targetClassName: walkInForm.targetClassName,
                    academicYear: walkInForm.academicYear,
                    academicYearId: walkInForm.academicYearId || undefined,
                },
                parent: {
                    fatherName: walkInForm.fatherName,
                    fatherPhone: walkInForm.fatherPhone,
                    fatherEmail: walkInForm.fatherEmail,
                    primaryContact: 'FATHER',
                },
            };

            const created = await createWalkIn(payload).unwrap();
            toast.success('Walk-in application registered successfully!');
            if (onApplicationCreated) {
                onApplicationCreated(created.data);
            }
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to register walk-in application');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-200 font-sans max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
                            Admissions Front Office
                        </span>
                        <h3 className="text-lg font-black text-slate-900">
                            Enquiry Desk &amp; Walk-In Registration
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-600 font-medium hover:text-slate-600 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Subtabs */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2 shrink-0">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('enquiries')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                activeTab === 'enquiries'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Enquiries ({enquiries.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('walk-in')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                activeTab === 'walk-in'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Walk-In Registration
                        </button>
                    </div>

                    {activeTab === 'enquiries' && (
                        <button
                            type="button"
                            onClick={() => setActiveTab('new-enquiry')}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                            <Plus size={14} />
                            Add Enquiry
                        </button>
                    )}
                </div>

                {/* Content Container */}
                <div className="flex-1 overflow-y-auto space-y-4">
                    {/* TAB: ENQUIRIES TABLE (Matches UI 2 Step 10) */}
                    {activeTab === 'enquiries' && (
                        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-100/90 text-[11px] font-black uppercase tracking-wider text-slate-700 font-extrabold border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3">Applicant Name</th>
                                        <th className="px-4 py-3">Class</th>
                                        <th className="px-4 py-3">Source</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Next Follow-up</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                    {enquiries.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-slate-600 font-medium">
                                                No enquiry leads found. Click "+ Add Enquiry" to record an enquiry.
                                            </td>
                                        </tr>
                                    ) : (
                                        enquiries.map((enq) => (
                                            <tr key={enq._id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-4 py-3">
                                                    <span className="font-bold text-slate-900 block">{enq.applicantName}</span>
                                                    <span className="text-[10px] text-slate-600 font-semibold">{enq.phone}</span>
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-blue-600">{enq.classInterest}</td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                                                        {enq.source}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                            enq.status === 'Converted'
                                                                ? 'bg-emerald-100 text-emerald-800'
                                                                : enq.status === 'Open'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-amber-100 text-amber-800'
                                                        }`}
                                                    >
                                                        {enq.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500">
                                                    {enq.nextFollowUpDate
                                                        ? new Date(enq.nextFollowUpDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                                                        : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {enq.status !== 'Converted' ? (
                                                        <button
                                                            type="button"
                                                            disabled={isConverting}
                                                            onClick={() => handleConvert(enq._id)}
                                                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold transition-colors cursor-pointer"
                                                        >
                                                            Convert
                                                        </button>
                                                    ) : (
                                                        <span className="text-[11px] text-slate-600 font-semibold">Converted</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* TAB: WALK-IN REGISTRATION FORM */}
                    {activeTab === 'walk-in' && (
                        <form onSubmit={handleWalkInSubmit} className="space-y-4 text-xs font-medium">
                            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                                ⚡ Fast-entry for parents visiting the admissions office in-person. Generates instant application record.
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">Student First Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Rohan"
                                        value={walkInForm.firstName}
                                        onChange={(e) => setWalkInForm({ ...walkInForm, firstName: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs font-semibold outline-hidden"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">Student Last Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Verma"
                                        value={walkInForm.lastName}
                                        onChange={(e) => setWalkInForm({ ...walkInForm, lastName: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs font-semibold outline-hidden"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">Academic Session *</label>
                                    <select
                                        value={walkInForm.academicYearId || ''}
                                        onChange={(e) => {
                                            const id = e.target.value;
                                            const found = academicYears.find((y) => (y._id || y.id) === id);
                                            setWalkInForm((prev) => ({
                                                ...prev,
                                                academicYearId: id,
                                                academicYear: found ? found.name : prev.academicYear,
                                            }));
                                        }}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs font-semibold outline-hidden bg-white"
                                    >
                                        {academicYears.map((yr) => {
                                            const id = yr._id || yr.id;
                                            return (
                                                <option key={id} value={id}>
                                                    Academic Year {yr.name} {yr.isCurrent ? '★ (Current)' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">Class *</label>
                                    <select
                                        value={walkInForm.targetClassName}
                                        onChange={(e) => setWalkInForm({ ...walkInForm, targetClassName: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs font-semibold outline-hidden bg-white"
                                    >
                                        {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={walkInForm.dateOfBirth}
                                        onChange={(e) => setWalkInForm({ ...walkInForm, dateOfBirth: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs outline-hidden"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">Gender</label>
                                    <select
                                        value={walkInForm.gender}
                                        onChange={(e) => setWalkInForm({ ...walkInForm, gender: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs outline-hidden bg-white"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">Parent Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Ramesh Verma"
                                        value={walkInForm.fatherName}
                                        onChange={(e) => setWalkInForm({ ...walkInForm, fatherName: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs font-semibold outline-hidden"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">Mobile Phone *</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+91 98765 43210"
                                        value={walkInForm.fatherPhone}
                                        onChange={(e) => setWalkInForm({ ...walkInForm, fatherPhone: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs font-semibold outline-hidden"
                                    />
                                </div>
                            </div>

                            <div className="pt-3">
                                <button
                                    type="submit"
                                    disabled={isSubmittingWalkIn}
                                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    {isSubmittingWalkIn ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <CheckCircle2 size={16} />
                                            <span>Register Walk-In Application</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* TAB: ADD ENQUIRY FORM */}
                    {activeTab === 'new-enquiry' && (
                        <form onSubmit={handleCreateEnquiry} className="space-y-4 text-xs font-medium">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">Applicant / Child Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Sneha Jain"
                                        value={enquiryForm.applicantName}
                                        onChange={(e) => setEnquiryForm({ ...enquiryForm, applicantName: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs font-semibold outline-hidden"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">Parent Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Alok Jain"
                                        value={enquiryForm.parentName}
                                        onChange={(e) => setEnquiryForm({ ...enquiryForm, parentName: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs outline-hidden"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">Phone Number *</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+91 98765 43210"
                                        value={enquiryForm.phone}
                                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs font-semibold outline-hidden"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">Class of Interest</label>
                                    <select
                                        value={enquiryForm.classInterest}
                                        onChange={(e) => setEnquiryForm({ ...enquiryForm, classInterest: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs outline-hidden bg-white"
                                    >
                                        {['Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">Academic Session *</label>
                                    <select
                                        value={enquiryForm.academicYearId || ''}
                                        onChange={(e) => {
                                            const id = e.target.value;
                                            const found = academicYears.find((y) => (y._id || y.id) === id);
                                            setEnquiryForm((prev) => ({
                                                ...prev,
                                                academicYearId: id,
                                                academicYear: found ? found.name : prev.academicYear,
                                            }));
                                        }}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs font-semibold outline-hidden bg-white"
                                    >
                                        {academicYears.map((yr) => {
                                            const id = yr._id || yr.id;
                                            return (
                                                <option key={id} value={id}>
                                                    Academic Year {yr.name} {yr.isCurrent ? '★ (Current)' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">Lead Source</label>
                                    <select
                                        value={enquiryForm.source}
                                        onChange={(e) => setEnquiryForm({ ...enquiryForm, source: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs outline-hidden bg-white"
                                    >
                                        {['Walk-in', 'Phone', 'Website', 'Referral', 'Advertisement'].map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">Follow-up Date</label>
                                    <input
                                        type="date"
                                        value={enquiryForm.nextFollowUpDate}
                                        onChange={(e) => setEnquiryForm({ ...enquiryForm, nextFollowUpDate: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs outline-hidden"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('enquiries')}
                                    className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreatingEnquiry}
                                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                                >
                                    Save Enquiry Lead
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
