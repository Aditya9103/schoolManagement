import React from 'react';
import { ClipboardCheck, Clock, Send, CheckCircle2, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingHeader({ pipeline = {} }) {
    const navigate = useNavigate();

    const pendingSetupCount = pipeline.pendingSetup?.length || 0;
    const awaitingInviteCount = pipeline.awaitingInvite?.length || 0;
    const completedCount = pipeline.completed?.length || 0;
    const totalCount = pipeline.total || pendingSetupCount + awaitingInviteCount + completedCount;

    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="space-y-4">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold tracking-wide uppercase">
                            <ClipboardCheck size={11} className="text-blue-600" />
                            Tenant Lifecycle Management
                        </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display mt-0.5">
                        School Onboarding Pipeline
                    </h1>
                    <p className="text-xs text-slate-700 font-medium">
                        Monitor new institutional tenants from initial provisioning to full activation and admin onboarding.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={() => navigate('/super-admin/schools/new')}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
                    >
                        <Plus size={15} /> Onboard New School
                    </button>
                </div>
            </div>

            {/* Pipeline KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 1. Pending Setup */}
                <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-800 font-bold flex items-center justify-center shrink-0">
                        <Clock size={18} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-slate-600 truncate">Setup Pending</p>
                        <p className="text-lg font-black text-slate-900 font-display">{pendingSetupCount}</p>
                    </div>
                </div>

                {/* 2. Awaiting Invite */}
                <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Send size={18} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-slate-600 truncate">Awaiting Admin Invite</p>
                        <p className="text-lg font-black text-slate-900 font-display">{awaitingInviteCount}</p>
                    </div>
                </div>

                {/* 3. Completed / Active */}
                <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                        <CheckCircle2 size={18} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-slate-600 truncate">Fully Operational</p>
                        <p className="text-lg font-black text-slate-900 font-display">{completedCount}</p>
                    </div>
                </div>

                {/* 4. Completion Rate */}
                <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center shrink-0">
                        <TrendingUp size={18} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-slate-600 truncate">Activation Rate</p>
                        <p className="text-lg font-black text-purple-700 font-display">{completionRate}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
