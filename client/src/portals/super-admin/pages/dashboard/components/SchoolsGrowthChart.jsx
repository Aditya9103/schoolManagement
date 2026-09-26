import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronDown } from 'lucide-react';

const DATA_12M = [
    { month: 'Jan', count: 35 },
    { month: 'Feb', count: 48 },
    { month: 'Mar', count: 58 },
    { month: 'Apr', count: 65 },
    { month: 'May', count: 78 },
    { month: 'Jun', count: 90 },
    { month: 'Jul', count: 105 },
    { month: 'Aug', count: 120 },
    { month: 'Sep', count: 156, isPeak: true },
    { month: 'Oct', count: 140 },
    { month: 'Nov', count: 148 },
    { month: 'Dec', count: 156 },
];

export default function SchoolsGrowthChart() {
    const [timeframe, setTimeframe] = useState('Last 12 Months');

    return (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 pb-3">
                <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">Schools Growth</h3>
                    <p className="text-xs text-slate-600 font-medium">Total schools added over time</p>
                </div>
                <div className="relative">
                    <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="appearance-none bg-white border border-slate-300 text-slate-800 text-xs font-bold pl-3 pr-8 py-2 rounded-xl cursor-pointer outline-none focus:border-blue-600 shadow-2xs"
                    >
                        <option value="Last 12 Months">Last 12 Months</option>
                        <option value="Last 6 Months">Last 6 Months</option>
                        <option value="Year to Date">Year to Date</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
            </div>

            <div className="h-52 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DATA_12M} barSize={16}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 200]}
                        />
                        <Tooltip
                            formatter={(val) => [`${val} Schools`, 'Total']}
                            contentStyle={{
                                background: '#0F172A',
                                border: 'none',
                                borderRadius: 12,
                                color: '#fff',
                                fontSize: 11,
                                fontWeight: 'bold',
                            }}
                        />
                        <defs>
                            <linearGradient id="growthBarGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#93C5FD" />
                            </linearGradient>
                            <linearGradient id="peakBarGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#1D4ED8" />
                                <stop offset="100%" stopColor="#3B82F6" />
                            </linearGradient>
                        </defs>
                        <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                            {DATA_12M.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.isPeak ? 'url(#peakBarGrad)' : 'url(#growthBarGrad)'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
