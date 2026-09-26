import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, Eye, Send, Copy, Check } from 'lucide-react';
import { useInviteSchoolAdminMutation } from '../../../../../store/api/superAdminApi';

export default function InviteAdminModal({ school, onClose, onOpenEmailPreview }) {
    const [name, setName] = useState('Rohit Sharma');
    const [email, setEmail] = useState(`admin@${school?.code?.toLowerCase() || 'school'}.edu.in`);
    const [role, setRole] = useState('SCHOOL_ADMIN');
    const [message, setMessage] = useState(
        `Welcome to PrimeSchoolOs! You have been invited to manage ${school?.name || 'the school'}.`
    );
    const [isSent, setIsSent] = useState(false);
    const [inviteResult, setInviteResult] = useState(null);
    const [copiedLink, setCopiedLink] = useState(false);

    const [inviteAdmin, { isLoading }] = useInviteSchoolAdminMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await inviteAdmin({
                schoolId: school._id,
                name: name.trim(),
                email: email.trim(),
                role,
                message,
            }).unwrap();
            setInviteResult(res);
            setIsSent(true);
        } catch (err) {
            alert(err?.data?.message || 'Failed to send invitation');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-slate-600 font-medium hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                    <X size={18} />
                </button>

                {!isSent ? (
                    <div>
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-xs">
                                <UserPlus size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-slate-900 font-display">
                                    Invite School Admin
                                </h3>
                                <p className="text-xs text-slate-600 font-medium">
                                    Send an invitation to the school administrator.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                                    Admin Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Rohit Sharma"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full h-11 px-3.5 text-sm font-semibold border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 bg-white text-slate-900 placeholder:text-slate-500 font-medium shadow-2xs"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="admin@school.edu.in"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-11 px-3.5 text-sm font-semibold border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 bg-white text-slate-900 placeholder:text-slate-500 font-medium shadow-2xs"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-800 block mb-1.5">Role <span className="text-red-500">*</span></label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full h-11 px-3.5 text-sm font-bold border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 bg-white text-slate-900 cursor-pointer shadow-2xs"
                                >
                                    <option value="SCHOOL_ADMIN">School Admin</option>
                                    <option value="FRONT_OFFICE">Front Office / Registrar</option>
                                    <option value="ACCOUNTANT">Accountant</option>
                                </select>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="text-xs font-bold text-slate-800">
                                        Personal Message (Optional)
                                    </label>
                                    <span className="text-[11px] font-semibold text-slate-700">
                                        {message.length}/300
                                    </span>
                                </div>
                                <textarea
                                    rows={2}
                                    maxLength={300}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm font-medium border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 bg-white text-slate-900 shadow-2xs"
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="h-11 px-5 text-xs font-bold text-slate-700 border border-slate-300 hover:bg-slate-100 rounded-xl transition-all shadow-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center gap-2 h-11 px-6 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-xl shadow-md shadow-blue-600/25 transition-all disabled:opacity-50"
                                >
                                    <Send size={15} />
                                    {isLoading ? 'Sending via Brevo...' : 'Send Invitation'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    /* Invitation Sent Success View */
                    <div className="text-center py-4 space-y-3">
                        <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mx-auto shadow-inner">
                            <CheckCircle2 size={36} strokeWidth={2.5} />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 font-display">
                            Invitation Sent!
                        </h4>
                        <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                            An invitation email has been dispatched to{' '}
                            <span className="font-bold text-slate-900">{email}</span> via Brevo SMTP.
                        </p>
                        <p className="text-xs text-slate-700 font-medium">
                            The school admin can now set their password and access the platform.
                        </p>

                        <div className="pt-3 flex flex-col gap-2.5">
                            <button
                                onClick={() => {
                                    const link =
                                        inviteResult?.activationLink ||
                                        `${window.location.origin}/auth/login?invitedSchool=${encodeURIComponent(school?.name || '')}&email=${encodeURIComponent(email)}`;
                                    navigator.clipboard.writeText(link);
                                    setCopiedLink(true);
                                    setTimeout(() => setCopiedLink(false), 2000);
                                }}
                                className="w-full h-11 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-xs"
                            >
                                {copiedLink ? <Check size={15} className="text-emerald-700 font-bold" /> : <Copy size={15} />}
                                {copiedLink ? 'Activation Link Copied!' : 'Copy Activation Link'}
                            </button>
                            <button
                                onClick={() =>
                                    onOpenEmailPreview?.({
                                        schoolName: school.name,
                                        recipientName: name,
                                        recipientEmail: email,
                                        activationLink: inviteResult?.activationLink,
                                        temporaryPassword: inviteResult?.temporaryPassword || 'Password@123',
                                    })
                                }
                                className="w-full h-11 rounded-xl border border-blue-300 bg-blue-50 text-blue-800 font-bold text-xs hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 shadow-xs"
                            >
                                <Eye size={15} /> Preview Invitation Email
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full h-11 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-xs"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
