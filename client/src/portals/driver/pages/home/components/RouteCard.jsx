import React from 'react';
import { Clock } from 'lucide-react';

const STOPS = [
    { name: 'Sector 7 Stop', color: 'bg-emerald-500' },
    { name: 'Outer Ring Road', color: 'bg-amber-500' },
    { name: 'School Gate A', color: 'bg-blue-500' },
];

export default function RouteCard() {
    const hour = new Date().getHours();
    const tripType = hour < 12 ? 'Morning Pickup' : 'Evening Drop';
    return (
        <div className="rounded-2xl bg-slate-800/80 border border-slate-700/60 p-4">
            <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-amber-400" />
                <span className="text-xs font-bold text-amber-400">{tripType} Route</span>
                <span className="ml-auto text-[10px] text-slate-700 font-semibold">06:30 – 08:45 AM</span>
            </div>
            <div className="space-y-2">
                {STOPS.map(({ name, color }, i) => (
                    <div key={name} className="flex items-center gap-2.5">
                        <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${color}shadow-sm`} />
                        <p className="text-xs text-slate-300">{name}</p>
                        {i < STOPS.length - 1 && <div className="ml-[4px] mt-0.5 h-full w-px bg-slate-700 absolute" />}
                    </div>
                ))}
            </div>
        </div>
    );
}
