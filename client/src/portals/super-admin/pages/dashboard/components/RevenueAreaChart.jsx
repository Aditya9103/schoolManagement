import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const REVENUE_DATA = [
    { month: 'Jan', amount: 24.5 },
    { month: 'Feb', amount: 32.0 },
    { month: 'Mar', amount: 41.2 },
    { month: 'Apr', amount: 48.6 },
    { month: 'May', amount: 44.0 },
    { month: 'Jun', amount: 48.6 },
];

export default function RevenueAreaChart() {
    const [timeframe, setTimeframe] = useState('Last 6 Months');

    return (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 pb-3">
                <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">Revenue Overview</h3>
                    <p className="text-xs text-slate-600 font-medium">Monthly collection trends</p>
                </div>
                <div className="relative">
                    <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="appearance-none bg-white border border-slate-300 text-slate-800 text-xs font-bold pl-3 pr-8 py-2 rounded-xl cursor-pointer outline-none focus:border-blue-600 shadow-2xs"
                    >
                        <option value="Last 6 Months">Last 6 Months</option>
                        <option value="Last 12 Months">Last 12 Months</option>
                        <option value="Current Fiscal Year">Current Fiscal Year</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
            </div>

            {/* Peak Callout & Area Chart */}
            <div className="relative h-44 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={REVENUE_DATA} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="revAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
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
                            tickFormatter={(v) => `${v}L`}
                        />
                        <Tooltip
                            formatter={(val) => [`₹ ${val} Lakhs`, 'Revenue']}
                            contentStyle={{
                                background: '#0F172A',
                                border: 'none',
                                borderRadius: 12,
                                color: '#fff',
                                fontSize: 11,
                                fontWeight: 'bold',
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#7C3AED"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#revAreaGrad)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Bottom 3 Summary Metrics matching Image 1 */}
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-50/60 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-600 font-semibold font-medium block">Total Revenue</span>
                    <span className="font-black text-slate-900 text-xs">₹ 2.48 Cr</span>
                    <span className="text-[9px] font-bold text-emerald-700 block mt-0.5 flex items-center justify-center gap-0.5">
                        <ArrowUpRight size={10} /> +24%
                    </span>
                </div>
                <div className="bg-slate-50/60 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-600 font-semibold font-medium block">This Month</span>
                    <span className="font-black text-slate-900 text-xs">₹ 18.2 L</span>
                    <span className="text-[9px] font-bold text-emerald-700 block mt-0.5 flex items-center justify-center gap-0.5">
                        <ArrowUpRight size={10} /> +12%
                    </span>
                </div>
                <div className="bg-slate-50/60 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-600 font-semibold font-medium block">Pending</span>
                    <span className="font-black text-slate-900 text-xs">₹ 12.6 L</span>
                    <span className="text-[9px] font-bold text-rose-700 block mt-0.5 flex items-center justify-center gap-0.5">
                        <ArrowDownRight size={10} /> -8%
                    </span>
                </div>
            </div>
        </div>
    );
}
