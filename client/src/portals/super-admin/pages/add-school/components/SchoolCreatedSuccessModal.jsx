import React from 'react';
import { CheckCircle2, ArrowRight, Plus, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SchoolCreatedSuccessModal({ school, onResetForm, onOpenInviteModal }) {
    const navigate = useNavigate();
    if (!school) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 text-center relative overflow-hidden flex flex-col items-center">
                {/* Decorative Top Accent */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500" />

                {/* Big Green Success Checkmark */}
                <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shadow-inner mb-3">
                    <CheckCircle2 size={36} strokeWidth={2.5} />
                </div>

                <h3 className="text-xl font-black text-slate-900 font-display">
                    School Created Successfully!
                </h3>
                <p className="text-xs text-slate-700 font-medium mt-1 max-w-xs">
                    <span className="font-bold text-slate-800">{school.name}</span> has been added to your multi-tenant ecosystem.
                </p>

                {/* School Summary Card */}
                <div className="w-full mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-left shadow-2xs">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-200">
                            {school.code?.slice(0, 3) || 'SCH'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{school.name}</p>
                            <p className="text-[11px] text-slate-600 font-medium truncate">
                                {school.code} • {school.schoolType || 'K-12 School'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/super-admin/schools')}
                        className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 shrink-0 shadow-2xs"
                    >
                        View School
                    </button>
                </div>

                {/* 4 Feature Badges */}
                <div className="grid grid-cols-2 gap-2 w-full mt-4 text-[11px] font-bold">
                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs">
                        <span className="h-2 w-2 rounded-full bg-emerald-600" />
                        <span>Subscription Active</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 shadow-2xs">
                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                        <span>Modules Enabled</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 shadow-2xs">
                        <span className="h-2 w-2 rounded-full bg-purple-600" />
                        <span>Ready to Use</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs">
                        <span className="h-2 w-2 rounded-full bg-amber-600" />
                        <span>Admin Ready</span>
                    </div>
                </div>

                {/* Modal Actions */}
                <div className="w-full mt-6 space-y-2.5">
                    <button
                        onClick={onOpenInviteModal}
                        className="w-full h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all"
                    >
                        <UserPlus size={16} />
                        Invite School Administrator
                    </button>

                    <div className="grid grid-cols-2 gap-2.5">
                        <button
                            onClick={onResetForm}
                            className="h-11 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                            <Plus size={14} />
                            Add Another
                        </button>
                        <button
                            onClick={() => navigate('/super-admin/schools')}
                            className="h-11 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                            View All Schools <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
