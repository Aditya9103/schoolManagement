import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, Mail, Sparkles, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEnrollStudentMutation } from '../../../../../store/api/admissionsApi';

export default function EnrollStudentModal({ application, onClose }) {
    const [enrollStudent, { isLoading }] = useEnrollStudentMutation();

    const [selectedClass, setSelectedClass] = useState(application?.targetClassName || 'Class 1');
    const [selectedSection, setSelectedSection] = useState('Section A');
    const [admissionNo, setAdmissionNo] = useState(`ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    const [rollNo, setRollNo] = useState(Math.floor(1 + Math.random() * 35).toString());
    const [createUserAccounts, setCreateUserAccounts] = useState(true);
    const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);

    if (!application) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await enrollStudent({
                id: application._id,
                admissionNo,
                rollNo,
                createUserAccounts,
                sendWelcomeEmail,
            }).unwrap();

            toast.success(`🎉 ${application.student?.firstName} has been officially enrolled!`);
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to complete student enrollment');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-200 font-sans">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
                            1-Click Enrollment
                        </span>
                        <h3 className="text-lg font-black text-slate-900">
                            Enroll Student — {application.applicationNo}
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

                {/* Candidate Overview */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center gap-3">
                    <img
                        src={application.student?.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'}
                        alt="Student"
                        className="w-12 h-12 rounded-xl object-cover border border-white/20"
                    />
                    <div>
                        <h4 className="text-sm font-black text-white">
                            {application.student?.firstName} {application.student?.lastName}
                        </h4>
                        <p className="text-xs text-indigo-200">
                            Applied: <span className="font-bold text-white">{application.targetClassName}</span> • {application.academicYear}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
                    {/* Class & Section selection */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">Assign Class *</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs font-semibold outline-hidden bg-white"
                            >
                                {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-bold text-slate-800">Assign Section *</label>
                                <span className="text-[10px] text-emerald-700 font-bold">12 / 25 Available</span>
                            </div>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 text-xs font-semibold outline-hidden bg-white"
                            >
                                <option value="Section A">Section A (Morning)</option>
                                <option value="Section B">Section B (Day)</option>
                            </select>
                        </div>
                    </div>

                    {/* Official Admission & Roll Number */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">Official Admission No *</label>
                            <input
                                type="text"
                                required
                                value={admissionNo}
                                onChange={(e) => setAdmissionNo(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 font-mono font-bold text-blue-900 text-xs outline-hidden"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">Roll Number</label>
                            <input
                                type="text"
                                value={rollNo}
                                onChange={(e) => setRollNo(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-600 font-mono font-bold text-slate-800 text-xs outline-hidden"
                            />
                        </div>
                    </div>

                    {/* Automation Checkboxes */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="createAccount"
                                checked={createUserAccounts}
                                onChange={(e) => setCreateUserAccounts(e.target.checked)}
                                className="w-4 h-4 rounded text-blue-600 border-slate-300 cursor-pointer"
                            />
                            <label htmlFor="createAccount" className="text-xs text-slate-800 font-bold font-medium cursor-pointer select-none">
                                Create Student and Parent login accounts automatically
                            </label>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="sendEmail"
                                checked={sendWelcomeEmail}
                                onChange={(e) => setSendWelcomeEmail(e.target.checked)}
                                className="w-4 h-4 rounded text-blue-600 border-slate-300 cursor-pointer"
                            />
                            <label htmlFor="sendEmail" className="text-xs text-slate-800 font-bold font-medium cursor-pointer select-none">
                                Dispatch Welcome Email &amp; SMS with credentials
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <UserCheck size={14} />
                                    <span>Confirm Enrollment</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
