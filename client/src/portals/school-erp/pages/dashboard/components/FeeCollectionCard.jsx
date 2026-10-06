import React, { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function FeeCollectionCard({ data, loading }) {
    const [period, setPeriod] = useState('This Month');

    const chartData = data?.monthly || [];
    const summary = data?.summary || {
        collected: '₹ 0',
        pending: '₹ 0',
        totalExpected: '₹ 0',
        collectedGrowth: '0%',
        pendingChange: '0%'
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-4 sm:p-5 flex flex-col justify-between hover:shadow-md transition-shadow h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 gap-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight whitespace-nowrap">
                    Fee Collection
                </h3>
                <div className="flex items-center gap-1.5 shrink-0">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="text-[11px] bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                    >
                        <option value="This Month">This Month</option>
                        <option value="Last Month">Last Month</option>
                        <option value="This Quarter">This Quarter</option>
                        <option value="This Year">This Year</option>
                    </select>
                    <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline whitespace-nowrap">
                        View Report
                    </button>
                </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-800">Collected</span>
                        <span className="text-[9px] font-bold text-emerald-700">
                            {summary.collectedGrowth || 'Live'}
                        </span>
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5 whitespace-nowrap">
                        {summary.collected}
                    </div>
                </div>

                <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-rose-800">Pending</span>
                        <span className="text-[9px] font-bold text-rose-700">
                            {summary.pendingChange || 'Live'}
                        </span>
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5 whitespace-nowrap">
                        {summary.pending}
                    </div>
                </div>

                <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-2">
                    <span className="text-[10px] font-bold text-blue-800 block">Total Expected</span>
                    <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5 whitespace-nowrap">
                        {summary.totalExpected}
                    </div>
                </div>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-4 mb-1 text-[11px] text-slate-700 font-semibold font-medium">
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-blue-600"></span>
                    <span>Collected</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-sky-200"></span>
                    <span>Pending</span>
                </div>
            </div>

            {/* Dual Bar Chart */}
            <div className="h-40 sm:h-44 w-full flex items-center justify-center">
                {chartData.length === 0 ? (
                    <div className="text-center text-slate-400 text-xs">
                        No fee collection records for this period
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                            barGap={3}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 9 }}
                                tickFormatter={(v) => `${v}L`}
                                domain={[0, 30]}
                                ticks={[0, 10, 20, 30]}
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (!active || !payload?.length) return null;
                                    return (
                                        <div className="bg-slate-900/90 backdrop-blur-md text-white p-2 rounded-xl shadow-lg text-xs space-y-1 border border-slate-700">
                                            <p className="font-bold text-slate-200">{label}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                <span className="text-slate-300">Collected:</span>
                                                <span className="font-semibold text-white">₹{payload[0]?.value} L</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-sky-300"></span>
                                                <span className="text-slate-300">Pending:</span>
                                                <span className="font-semibold text-white">₹{payload[1]?.value} L</span>
                                            </div>
                                        </div>
                                    );
                                }}
                            />
                            <Bar
                                dataKey="collected"
                                fill="#2563eb"
                                radius={[3, 3, 0, 0]}
                                maxBarSize={14}
                            />
                            <Bar
                                dataKey="pending"
                                fill="#bae6fd"
                                radius={[3, 3, 0, 0]}
                                maxBarSize={14}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
