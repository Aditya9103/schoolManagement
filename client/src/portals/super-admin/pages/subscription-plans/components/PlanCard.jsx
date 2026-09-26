import React from 'react';
import { Check } from 'lucide-react';

export default function PlanCard({ name, price, Icon, color, schools, features, badge }) {
    return (
        <div className="relative bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {badge && (
                <div className={`text-center py-1.5 bg-gradient-to-r ${color}text-white text-xs font-bold tracking-wide`}>
                    {badge}
                </div>
            )}
            <div className={`p-6 bg-gradient-to-br ${color}${badge ? '' : ''}`}>
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <Icon size={22} className="text-white" />
                    </div>
                    <div>
                        <p className="text-lg font-extrabold text-white">{name}</p>
                        <p className="text-white/70 text-xs">{schools} schools active</p>
                    </div>
                </div>
                <div className="mt-4">
                    <span className="text-4xl font-extrabold text-white font-display">₹{price.toLocaleString()}</span>
                    <span className="text-white/60 text-sm ml-1">/mo per school</span>
                </div>
            </div>
            <div className="p-6">
                <ul className="space-y-2.5">
                    {features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                            <Check size={14} className="text-emerald-700 font-bold flex-shrink-0" /> {f}
                        </li>
                    ))}
                </ul>
                <button className="mt-6 w-full py-2.5 rounded-xl border-2 border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                    Edit Plan
                </button>
            </div>
        </div>
    );
}
