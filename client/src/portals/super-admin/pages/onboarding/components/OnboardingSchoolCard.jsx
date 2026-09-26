import React from 'react';
import {
    MapPin,
    Mail,
    UserPlus,
    CheckCircle2,
    Clock,
    Sparkles,
    ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PLAN_BADGES = {
    BASIC: 'bg-slate-100 text-slate-700 border-slate-200',
    STANDARD: 'bg-blue-50 text-blue-700 border-blue-200',
    PRO: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    PREMIUM: 'bg-purple-50 text-purple-700 border-purple-200',
    ENTERPRISE: 'bg-amber-50 text-amber-800 border-amber-200',
};

export default function OnboardingSchoolCard({ school, stageKey, onInviteAdmin }) {
    const navigate = useNavigate();
    const planKey = (school.plan || 'STANDARD').toUpperCase();
    const city = school.address?.city || 'Noida';
    const state = school.address?.state || 'Uttar Pradesh';

    return (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-200 transition-all space-y-3 group">
            {/* Header: Logo, Name, Plan */}
            <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center text-xs overflow-hidden shrink-0 shadow-xs">
                        {school.logoUrl ? (
                            <img
                                src={school.logoUrl}
                                alt={school.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span>{school.code?.slice(0, 3) || 'SCH'}</span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                            {school.name}
                        </h4>
                        <p className="text-[10px] text-slate-600 font-semibold font-mono">
                            {school.code} • {school.board || 'CBSE'}
                        </p>
                    </div>
                </div>

                <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[9px] font-bold shrink-0 ${
                        PLAN_BADGES[planKey] || 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                >
                    {planKey === 'ENTERPRISE' && <Sparkles size={9} className="text-amber-800 font-bold" />}
                    {planKey}
                </span>
            </div>

            {/* School Details */}
            <div className="space-y-1 text-[11px] text-slate-700 font-semibold border-t border-slate-100 pt-2.5">
                <div className="flex items-center gap-1.5 truncate">
                    <MapPin size={12} className="text-slate-600 font-medium shrink-0" />
                    <span>{city}, {state}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                    <Mail size={12} className="text-slate-600 font-medium shrink-0" />
                    <span className="font-mono text-[10px]">{school.contactEmail || 'No contact email'}</span>
                </div>
            </div>

            {/* Action Bar based on Stage */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                {stageKey === 'pendingSetup' && (
                    <>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                            <Clock size={11} /> Config Pending
                        </span>
                        <button
                            onClick={() => onInviteAdmin?.(school)}
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                        >
                            <UserPlus size={12} /> Invite Admin
                        </button>
                    </>
                )}

                {stageKey === 'awaitingInvite' && (
                    <>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            <Clock size={11} /> Ready to Invite
                        </span>
                        <button
                            onClick={() => onInviteAdmin?.(school)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs transition-colors"
                        >
                            <UserPlus size={11} /> Send Invite
                        </button>
                    </>
                )}

                {stageKey === 'completed' && (
                    <>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            <CheckCircle2 size={11} /> Live &amp; Active
                        </span>
                        <button
                            onClick={() => navigate('/super-admin/schools')}
                            className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
                        >
                            View Directory <ArrowRight size={11} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
