import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown } from 'lucide-react';

const DONUT_DATA = [
    { name: 'Active', value: 128, percent: 82, color: '#10B981' },
    { name: 'Trial', value: 12, percent: 8, color: '#3B82F6' },
    { name: 'Expiring Soon', value: 10, percent: 6, color: '#F59E0B' },
    { name: 'Expired', value: 6, percent: 4, color: '#EF4444' },
];

export default function SubscriptionDonut() {
    const [selectedPlan, setSelectedPlan] = useState('All Plans');

    return (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 border-b border-slate-200/80 pb-3">
                <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">Subscription Overview</h3>
                    <p className="text-xs text-slate-600 font-medium">Status distribution</p>
                </div>
                <div className="relative">
                    <select
                        value={selectedPlan}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                        className="appearance-none bg-white border border-slate-300 text-slate-800 text-xs font-bold pl-3 pr-8 py-2 rounded-xl cursor-pointer outline-none focus:border-blue-600 shadow-2xs"
                    >
                        <option value="All Plans">All Plans</option>
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                        <option value="Enterprise">Enterprise</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-1">
                {/* Donut Chart with Centered Total */}
                <div className="sm:col-span-6 relative h-44 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={DONUT_DATA}
                                innerRadius={48}
                                outerRadius={68}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {DONUT_DATA.map((entry) => (
                                    <Cell key={entry.name} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: '#0F172A',
                                    border: 'none',
                                    borderRadius: 12,
                                    color: '#fff',
                                    fontSize: 11,
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-base font-black text-slate-900 font-display">156</span>
                        <span className="text-[9px] font-bold text-slate-700 font-extrabold uppercase tracking-wider">Schools</span>
                    </div>
                </div>

                {/* Legend matching Image 1 */}
                <div className="sm:col-span-6 space-y-2 text-xs">
                    {DONUT_DATA.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="font-semibold text-slate-700">{item.name}</span>
                            </div>
                            <span className="font-bold text-slate-900">
                                {item.value} <span className="text-slate-600 font-medium font-normal">({item.percent}%)</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
