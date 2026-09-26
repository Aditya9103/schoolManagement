import React from 'react';
import { ArrowLeft, Check, Edit3, School, ShieldCheck, Sparkles, Building, Layers } from 'lucide-react';

export default function StepReviewCreate({ form, onJumpToStep, onBack, onSubmit, isSubmitting }) {
    return (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
            <div>
                <h3 className="text-lg font-black text-slate-900 font-display">Review & Launch</h3>
                <p className="text-xs font-medium text-slate-600 mt-0.5">
                    Review all details before creating and activating this school on PrimeSchoolOs.
                </p>
            </div>

            <div className="space-y-4">
                {/* 1. School Information Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3.5">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <School size={15} className="text-blue-600" />
                            School Information
                        </span>
                        <button
                            type="button"
                            onClick={() => onJumpToStep(0)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                            <Edit3 size={12} /> Edit
                        </button>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="h-14 w-14 rounded-full bg-white shadow-xs border border-slate-300 overflow-hidden flex items-center justify-center shrink-0">
                            {form.logoUrl ? (
                                <img
                                    src={form.logoUrl}
                                    alt="Logo"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <School size={22} className="text-slate-500" />
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs flex-1">
                            <div>
                                <span className="text-slate-700 font-semibold block text-[11px] mb-0.5">School Name</span>
                                <span className="font-black text-slate-900 text-sm">{form.name}</span>
                            </div>
                            <div>
                                <span className="text-slate-700 font-semibold block text-[11px] mb-0.5">Short Code / Type</span>
                                <span className="font-bold text-slate-800 text-sm">
                                    {form.code} • {form.schoolType || 'K-12 School'}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-700 font-semibold block text-[11px] mb-0.5">Contact Email & Phone</span>
                                <span className="font-semibold text-slate-800">
                                    {form.contactEmail} • {form.contactPhone}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-700 font-semibold block text-[11px] mb-0.5">Location</span>
                                <span className="font-semibold text-slate-800">
                                    {form.address?.city}, {form.address?.state} ({form.address?.pincode})
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Branding & Appearance */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3.5">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Sparkles size={15} className="text-amber-800 font-bold" />
                            Branding & Appearance
                        </span>
                        <button
                            type="button"
                            onClick={() => onJumpToStep(1)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                            <Edit3 size={12} /> Edit
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-slate-600">Primary:</span>
                                <span
                                    className="h-4 w-4 rounded-full border border-slate-300 shadow-2xs"
                                    style={{ backgroundColor: form.primaryColor || '#2563EB' }}
                                />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-slate-600">Secondary:</span>
                                <span
                                    className="h-4 w-4 rounded-full border border-slate-300 shadow-2xs"
                                    style={{ backgroundColor: form.secondaryColor || '#10B981' }}
                                />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-slate-600">Accent:</span>
                                <span
                                    className="h-4 w-4 rounded-full border border-slate-300 shadow-2xs"
                                    style={{ backgroundColor: form.accentColor || '#F59E0B' }}
                                />
                            </div>
                        </div>
                        <span className="text-xs font-bold text-slate-800 bg-white px-3 py-1 rounded-lg border border-slate-300 shadow-2xs">
                            Theme: {form.theme || 'Modern'}
                        </span>
                    </div>
                </div>

                {/* 3. Subscription Plan */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3.5">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Building size={15} className="text-purple-700 font-bold" />
                            Subscription Plan
                        </span>
                        <button
                            type="button"
                            onClick={() => onJumpToStep(2)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                            <Edit3 size={12} /> Edit
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <div>
                            <span className="text-base font-black text-slate-900">
                                {form.plan || 'Standard'} Plan
                            </span>
                            <span className="text-xs text-slate-600 font-medium block mt-0.5">
                                Full access for up to 1,500 students with priority support
                            </span>
                        </div>
                        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-lg border border-blue-200">
                            Active 1 Year
                        </span>
                    </div>
                </div>

                {/* 4. Enabled Modules */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3.5">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Layers size={15} className="text-emerald-700 font-bold" />
                            Enabled Modules ({(form.modulesEnabled || []).length})
                        </span>
                        <button
                            type="button"
                            onClick={() => onJumpToStep(2)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                            <Edit3 size={12} /> Edit
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {(form.modulesEnabled || []).map((modId) => (
                            <span
                                key={modId}
                                className="px-3 py-1 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-bold shadow-2xs"
                            >
                                {modId.replace(/_/g, ' ')}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Notice Box */}
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 font-medium flex items-start gap-2.5">
                    <ShieldCheck size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                        Once created, the school will be immediately activated and an invitation email will be prepared for the school administrator.
                    </p>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 h-11 px-5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 text-xs transition-all shadow-xs"
                >
                    <ArrowLeft size={15} /> Back
                </button>
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 h-11 px-7 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all disabled:opacity-50"
                >
                    <Check size={16} strokeWidth={2.5} />
                    {isSubmitting ? 'Creating School...' : 'Create School'}
                </button>
            </div>
        </div>
    );
}
