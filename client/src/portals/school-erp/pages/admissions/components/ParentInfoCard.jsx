import React from 'react';
import { Users, Phone, Mail, MessageSquare, Edit3, Briefcase, BadgeCheck } from 'lucide-react';

export default function ParentInfoCard({ parent = {}, onEdit }) {
    const {
        fatherName,
        fatherPhone,
        fatherEmail,
        fatherOccupation,
        fatherAnnualIncome,
        motherName,
        motherPhone,
        motherEmail,
        motherOccupation,
        primaryContact = 'FATHER'
    } = parent;

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6 transition-all">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Users size={18} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-black text-slate-900">Parent / Guardian Information</h2>
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
                                {primaryContact === 'FATHER' ? "Father (Primary)" : "Mother (Primary)"}
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-semibold">Emergency &amp; guardian contact coordinates</p>
                    </div>
                </div>
                {onEdit && (
                    <button
                        type="button"
                        onClick={onEdit}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                        <Edit3 size={13} />
                        Edit
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Father's Column */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Father's Details</h3>
                        {primaryContact === 'FATHER' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700">
                                <BadgeCheck size={13} /> Primary Guardian
                            </span>
                        )}
                    </div>

                    <div className="space-y-2 text-xs">
                        <div>
                            <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Full Name</span>
                            <span className="font-bold text-slate-900">{fatherName || 'Not specified'}</span>
                        </div>

                        <div>
                            <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Phone &amp; WhatsApp</span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-mono font-bold text-slate-900">{fatherPhone || '-'}</span>
                                {fatherPhone && (
                                    <>
                                        <a
                                            href={`tel:${fatherPhone}`}
                                            className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-blue-600 transition-colors"
                                            title="Call"
                                        >
                                            <Phone size={12} />
                                        </a>
                                        <a
                                            href={`https://wa.me/${fatherPhone.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors"
                                            title="WhatsApp"
                                        >
                                            <MessageSquare size={12} />
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Email Address</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-medium text-slate-800">{fatherEmail || 'Not provided'}</span>
                                {fatherEmail && (
                                    <a
                                        href={`mailto:${fatherEmail}`}
                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                        title="Send Email"
                                    >
                                        <Mail size={12} />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                            <div>
                                <span className="text-[10px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Occupation</span>
                                <span className="font-semibold text-slate-800 text-[11px]">{fatherOccupation || 'Private Sector'}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Annual Income</span>
                                <span className="font-semibold text-slate-800 text-[11px]">{fatherAnnualIncome || '₹5L - ₹10L'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mother's Column */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Mother's Details</h3>
                        {primaryContact === 'MOTHER' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700">
                                <BadgeCheck size={13} /> Primary Guardian
                            </span>
                        )}
                    </div>

                    <div className="space-y-2 text-xs">
                        <div>
                            <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Full Name</span>
                            <span className="font-bold text-slate-900">{motherName || 'Not specified'}</span>
                        </div>

                        <div>
                            <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Phone &amp; WhatsApp</span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-mono font-bold text-slate-900">{motherPhone || '-'}</span>
                                {motherPhone && (
                                    <>
                                        <a
                                            href={`tel:${motherPhone}`}
                                            className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-blue-600 transition-colors"
                                            title="Call"
                                        >
                                            <Phone size={12} />
                                        </a>
                                        <a
                                            href={`https://wa.me/${motherPhone.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors"
                                            title="WhatsApp"
                                        >
                                            <MessageSquare size={12} />
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Email Address</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-medium text-slate-800">{motherEmail || 'Not provided'}</span>
                                {motherEmail && (
                                    <a
                                        href={`mailto:${motherEmail}`}
                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                        title="Send Email"
                                    >
                                        <Mail size={12} />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="pt-1 border-t border-slate-200/60">
                            <span className="text-[10px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Occupation</span>
                            <span className="font-semibold text-slate-800 text-[11px]">{motherOccupation || 'Homemaker / Professional'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
