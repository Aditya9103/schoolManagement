import React from 'react';

export default function BusCard({ busNo = 'DL 05 AB 1234', route = 'Route 12', students = 42, area = 'Rohini', status = 'On Duty' }) {
    return (
        <div className="rounded-2xl bg-gradient-to-br from-orange-600 to-amber-700 p-5 shadow-2xl shadow-orange-500/30">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="text-orange-200 text-xs font-medium">Assigned Vehicle</p>
                    <p className="text-2xl font-extrabold text-white mt-0.5 font-display">🚌 Bus #{busNo}</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-400/30 backdrop-blur-sm">
                    {status}
                </span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
                {[[route, 'Route'], [`${students} Students`, 'Capacity'], [area, 'Area']].map(([val, lbl]) => (
                    <div key={lbl} className="rounded-xl bg-white/10 p-2.5 text-center border border-white/10 backdrop-blur-sm">
                        <p className="text-xs font-extrabold text-white">{val}</p>
                        <p className="text-[9px] text-orange-200 mt-0.5">{lbl}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
