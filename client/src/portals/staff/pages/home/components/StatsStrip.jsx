import React from 'react';

const STATS = [
    { val: '4', lbl: 'Classes Today', color: 'text-blue-400' },
    { val: '128', lbl: 'Students', color: 'text-emerald-400' },
    { val: '3', lbl: 'Assignments', color: 'text-amber-400' },
    { val: '2', lbl: 'Pending', color: 'text-violet-400' },
];

export default function StatsStrip() {
    return (
        <div className="grid grid-cols-4 gap-2">
            {STATS.map(({ val, lbl, color }) => (
                <div key={lbl} className="bg-slate-800/60 rounded-2xl p-3 text-center border border-slate-700/50">
                    <p className={`text-lg font-extrabold font-display ${color}`}>{val}</p>
                    <p className="text-[9px] text-slate-700 font-semibold mt-0.5 leading-tight">{lbl}</p>
                </div>
            ))}
        </div>
    );
}
