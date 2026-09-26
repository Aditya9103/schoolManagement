import React from 'react';
import { CheckCircle2, GraduationCap, Wallet, Users } from 'lucide-react';

const STATS = [
    { label: "Today's Attendance", value: '87%', sub: '1,042 / 1,200 students', Icon: CheckCircle2, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    { label: 'Total Students', value: '1,248', sub: '+12 this week', Icon: GraduationCap, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: 'Fee Collected', value: '₹4.2L', sub: 'September 2026', Icon: Wallet, iconBg: 'bg-violet-100', iconColor: 'text-violet-600' },
    { label: 'Total Staff', value: '84', sub: '6 on leave today', Icon: Users, iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
];

export default function ErpStatsRow() {
    return (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {STATS.map(({ label, value, sub, Icon, iconBg, iconColor }) => (
                <div key={label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl mb-3 ${iconBg}`}>
                        <Icon size={17} className={iconColor} />
                    </div>
                    <p className="text-xl font-extrabold text-slate-900 font-display">{value}</p>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">{label}</p>
                    <p className="text-[10px] text-slate-600 font-semibold mt-0.5">{sub}</p>
                </div>
            ))}
        </div>
    );
}
