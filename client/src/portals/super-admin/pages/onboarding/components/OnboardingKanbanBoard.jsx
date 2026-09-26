import React from 'react';
import { Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import OnboardingSchoolCard from './OnboardingSchoolCard';

const COLUMNS = [
    {
        key: 'pendingSetup',
        title: 'Setup & Configuration',
        desc: 'Branding & preliminary profile setup',
        icon: Clock,
        accent: 'amber',
        headerBg: 'bg-amber-50/70 text-amber-900 border-amber-200/80',
        badgeBg: 'bg-amber-100 text-amber-800',
    },
    {
        key: 'awaitingInvite',
        title: 'Admin Activation',
        desc: 'Ready for admin invitation via Brevo SMTP',
        icon: Send,
        accent: 'blue',
        headerBg: 'bg-blue-50/70 text-blue-900 border-blue-200/80',
        badgeBg: 'bg-blue-100 text-blue-800',
    },
    {
        key: 'completed',
        title: 'Operational & Live',
        desc: 'Provisioned, verified and active tenants',
        icon: CheckCircle2,
        accent: 'emerald',
        headerBg: 'bg-emerald-50/70 text-emerald-900 border-emerald-200/80',
        badgeBg: 'bg-emerald-100 text-emerald-800',
    },
];

export default function OnboardingKanbanBoard({ pipeline = {}, onInviteAdmin }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {COLUMNS.map((col) => {
                const schools = pipeline[col.key] || [];
                const Icon = col.icon;

                return (
                    <div
                        key={col.key}
                        className="bg-slate-50/60 rounded-3xl p-4 border border-slate-200/80 flex flex-col min-h-[480px]"
                    >
                        {/* Column Header */}
                        <div
                            className={`p-3.5 rounded-2xl border mb-3 flex items-center justify-between ${col.headerBg}`}
                        >
                            <div className="flex items-center gap-2">
                                <Icon size={16} />
                                <div>
                                    <h3 className="text-xs font-black tracking-tight font-display">
                                        {col.title}
                                    </h3>
                                    <p className="text-[10px] opacity-75">{col.desc}</p>
                                </div>
                            </div>
                            <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${col.badgeBg}`}
                            >
                                {schools.length}
                            </span>
                        </div>

                        {/* Column Items */}
                        <div className="flex-1 space-y-3 overflow-y-auto">
                            {schools.length > 0 ? (
                                schools.map((school) => (
                                    <OnboardingSchoolCard
                                        key={school._id}
                                        school={school}
                                        stageKey={col.key}
                                        onInviteAdmin={onInviteAdmin}
                                    />
                                ))
                            ) : (
                                <div className="h-40 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 text-center text-slate-600 font-medium">
                                    <AlertCircle size={20} className="mb-1 text-slate-300" />
                                    <p className="text-xs font-semibold">No schools in this stage</p>
                                    <p className="text-[10px] text-slate-600 font-semibold mt-0.5">
                                        Schools will appear here as they progress.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
