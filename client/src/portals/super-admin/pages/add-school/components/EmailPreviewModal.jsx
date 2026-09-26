import React, { useState } from 'react';
import { X, Mail, ShieldCheck, ExternalLink, Copy, Check, Sparkles } from 'lucide-react';

export default function EmailPreviewModal({ emailData, onClose }) {
    const [copied, setCopied] = useState(false);
    if (!emailData) return null;

    const {
        schoolName = 'Delhi Public School',
        recipientName = 'Rohit Sharma',
        recipientEmail = 'admin@dps.edu.in',
        temporaryPassword = 'Password@123',
        activationLink,
    } = emailData;

    const setupLink =
        activationLink ||
        `${window.location.origin}/auth/login?invitedSchool=${encodeURIComponent(schoolName)}&email=${encodeURIComponent(recipientEmail)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(setupLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center">
                            <Mail size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 font-display">
                                Transactional Email Preview
                            </h3>
                            <p className="text-[11px] text-slate-700 font-semibold">
                                Dispatched via Brevo SMTP to <span className="font-semibold text-slate-700">{recipientEmail}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full text-slate-600 font-medium hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Email Body / Mock Client View */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                    {/* Fake Email Envelope Header */}
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 text-[11px] space-y-1.5 font-mono text-slate-600">
                        <div className="flex justify-between">
                            <span className="text-slate-600 font-medium">From:</span>
                            <span className="font-semibold text-slate-800">PrimeSchoolOs Notifications &lt;no-reply@primeschoolos.edu&gt;</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600 font-medium">To:</span>
                            <span className="font-semibold text-slate-800">{recipientName} &lt;{recipientEmail}&gt;</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600 font-medium">Subject:</span>
                            <span className="font-bold text-blue-600">Welcome to PrimeSchoolOs – Set Up Your Administrator Portal for {schoolName}</span>
                        </div>
                    </div>

                    {/* Rendered HTML Email Card */}
                    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
                        {/* Email Top Bar */}
                        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 p-6 text-white text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold tracking-wide uppercase text-blue-200 mb-3">
                                <Sparkles size={12} className="text-amber-300" />
                                Multi-Tenant School OS
                            </div>
                            <h2 className="text-2xl font-black tracking-tight font-display">
                                PrimeSchoolOs
                            </h2>
                            <p className="text-xs text-blue-200/80 mt-1">
                                Enterprise Multi-Tenant School Management Platform
                            </p>
                        </div>

                        {/* Email Content Body */}
                        <div className="p-6 sm:p-7 space-y-4 text-xs text-slate-700 leading-relaxed">
                            <div>
                                <h4 className="text-base font-bold text-slate-900">
                                    Hello {recipientName},
                                </h4>
                                <p className="mt-1.5 text-slate-600">
                                    You have been officially invited by the platform super administrator to onboard and manage{' '}
                                    <strong className="text-slate-900">{schoolName}</strong> on PrimeSchoolOs.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100/80 space-y-2">
                                <p className="text-xs font-semibold text-blue-900">
                                    Your Tenant Access Details:
                                </p>
                                <ul className="text-[11px] text-blue-800 space-y-1 list-disc list-inside">
                                    <li><strong>Assigned Role:</strong> School Administrator (Tenant Root)</li>
                                    <li><strong>Dedicated Portal:</strong> School ERP &amp; Management Dashboard</li>
                                    <li><strong>Primary Login ID:</strong> {recipientEmail}</li>
                                    <li><strong>Initial Temporary Password:</strong> <span className="font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">{temporaryPassword}</span></li>
                                    <li><strong>Multi-Tenant Isolation:</strong> Isolated partition &amp; RBAC enabled</li>
                                </ul>
                            </div>

                            <div className="py-2 text-center">
                                <a
                                    href={setupLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
                                >
                                    Activate Account &amp; Set Password
                                    <ExternalLink size={14} />
                                </a>
                                <p className="text-[10px] text-slate-600 font-semibold mt-2">
                                    This invitation link will remain active for 48 hours.
                                </p>
                            </div>

                            <div className="border-t border-slate-100 pt-4 flex items-center gap-2 text-[10px] text-slate-600 font-semibold">
                                <ShieldCheck size={14} className="text-emerald-700 font-bold shrink-0" />
                                <span>Secured by Brevo Transactional SMTP &amp; 256-bit encrypted authentication.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between shrink-0">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 h-11 px-5 rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-100 text-xs font-bold transition-all shadow-xs"
                    >
                        {copied ? <Check size={15} className="text-emerald-700 font-bold" /> : <Copy size={15} />}
                        {copied ? 'Link Copied!' : 'Copy Activation Link'}
                    </button>
                    <button
                        onClick={onClose}
                        className="h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
