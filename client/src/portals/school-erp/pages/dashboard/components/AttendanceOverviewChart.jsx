import React, { useState } from 'react';
import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';

export default function AttendanceOverviewChart({ data }) {
    const [timeframe, setTimeframe] = useState('Weekly'); // 'Daily' | 'Weekly' | 'Monthly'

    const attendanceData = data || [
        { day: 'Mon', present: 1120, absent: 85, leave: 43, total: 1248 },
        { day: 'Tue', present: 1135, absent: 78, leave: 35, total: 1248 },
        { day: 'Wed', present: 1110, absent: 95, leave: 43, total: 1248 },
        { day: 'Thu', present: 1145, absent: 68, leave: 24, total: 1237 },
        { day: 'Fri', present: 1150, absent: 65, leave: 33, total: 1248 },
        { day: 'Sat', present: 1080, absent: 110, leave: 58, total: 1248 },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null;
        const pVal = payload.find((p) => p.dataKey === 'present')?.value || 0;
        const aVal = payload.find((p) => p.dataKey === 'absent')?.value || 0;
        const lVal = payload.find((p) => p.dataKey === 'leave')?.value || 0;
        const total = payload.find((p) => p.dataKey === 'total')?.value || (pVal + aVal + lVal);

        return (
            <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl border border-slate-700 text-xs min-w-[140px] space-y-1 font-sans">
                <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">
                    {label}
                </p>
                <div className="flex items-center justify-between gap-2 text-blue-400">
                    <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        Present:
                    </span>
                    <span className="font-bold">{pVal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-rose-400">
                    <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        Absent:
                    </span>
                    <span className="font-bold">{aVal}</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-amber-400">
                    <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        Leave:
                    </span>
                    <span className="font-bold">{lVal}</span>
                </div>
                <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-slate-300 font-bold">
                    <span>Total:</span>
                    <span>{total.toLocaleString()}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-4 sm:p-5 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
            {/* Header with Title & Filter Buttons */}
            <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight whitespace-nowrap">
                    Attendance Overview
                </h3>

                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg shrink-0">
                    {['Daily', 'Weekly', 'Monthly'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setTimeframe(tab)}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                                timeframe === tab
                                    ? 'bg-white text-blue-600 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Compact Legend */}
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 font-semibold mb-2">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" /> Present
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" /> Absent
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" /> Leave
                    </span>
                </div>
                <span className="flex items-center gap-1 text-slate-600 font-bold text-[10px]">
                    <span className="h-0.5 w-3 bg-slate-700 inline-block" /> Total
                </span>
            </div>

            {/* Composed Chart */}
            <div className="h-44 sm:h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={attendanceData}
                        margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
                        barGap={2}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 10, fontWeight: 500 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94A3B8', fontSize: 9 }}
                            domain={[0, 1300]}
                            ticks={[0, 350, 700, 1050, 1300]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="present"
                            fill="#2563EB"
                            radius={[3, 3, 0, 0]}
                            maxBarSize={12}
                        />
                        <Bar
                            dataKey="absent"
                            fill="#F43F5E"
                            radius={[3, 3, 0, 0]}
                            maxBarSize={8}
                        />
                        <Bar
                            dataKey="leave"
                            fill="#FBBF24"
                            radius={[3, 3, 0, 0]}
                            maxBarSize={8}
                        />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#1E293B"
                            strokeWidth={2}
                            dot={{ fill: '#1E293B', r: 3 }}
                            activeDot={{ r: 4 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
