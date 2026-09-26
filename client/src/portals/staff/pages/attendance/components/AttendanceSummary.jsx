import React from 'react';

export default function AttendanceSummary({ presentCount, absentCount, lateCount, total }) {
    return (
        <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {[
                { label: `Present: ${presentCount}`, dot: 'bg-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
                { label: `Absent: ${absentCount}`, dot: 'bg-red-500', bg: 'bg-red-500/10 border-red-500/20 text-red-400' },
                { label: `Late: ${lateCount}`, dot: 'bg-amber-500', bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
                { label: `Total: ${total}`, dot: 'bg-slate-400', bg: 'bg-slate-800 border-slate-700 text-slate-400' },
            ].map(({ label, dot, bg }) => (
                <div key={label} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold flex-shrink-0 ${bg}`}>
                    <span className={`h-2 w-2 rounded-full ${dot}`} />
                    {label}
                </div>
            ))}
        </div>
    );
}
