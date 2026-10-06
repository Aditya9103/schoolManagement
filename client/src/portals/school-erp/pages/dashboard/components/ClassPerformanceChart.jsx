import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList
} from 'recharts';

const CLASS_COLORS = ['#818cf8', '#c084fc', '#fde047', '#86efac', '#fcd34d', '#a5b4fc', '#7dd3fc', '#fca5a5'];

export default function ClassPerformanceChart({ data }) {
    const [term, setTerm] = useState('Term 1');

    const performanceData = Array.isArray(data)
        ? data.map((item, idx) => ({
            className: item.className || item.class || `Class ${idx + 1}`,
            avg: Number(item.avg) || 0,
            color: item.color || CLASS_COLORS[idx % CLASS_COLORS.length]
        }))
        : [];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-4 sm:p-5 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight whitespace-nowrap">
                        Class Performance
                    </h3>
                    <span className="text-[11px] text-slate-600 font-semibold font-medium hidden sm:inline">
                        (Average %)
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        className="text-[11px] bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                    >
                        <option value="Term 1">Term 1</option>
                        <option value="Term 2">Term 2</option>
                        <option value="Final">Final</option>
                    </select>
                    <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline whitespace-nowrap">
                        View Details
                    </button>
                </div>
            </div>

            <div className="h-44 w-full mt-2 flex items-center justify-center">
                {performanceData.length === 0 ? (
                    <div className="text-center py-6 text-slate-400">
                        <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                        <p className="text-xs font-semibold text-slate-600">No exam results recorded yet</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Class average percentages will populate once exams are evaluated</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={performanceData}
                            margin={{ top: 20, right: 5, left: -28, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="className"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 100]}
                                ticks={[0, 25, 50, 75, 100]}
                                tick={{ fill: '#94a3b8', fontSize: 9 }}
                                tickFormatter={(v) => `${v}%`}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null;
                                    const item = payload[0].payload;
                                    return (
                                        <div className="bg-slate-900 text-white p-2 rounded-lg text-xs shadow-lg">
                                            <p className="font-semibold">{item.className}</p>
                                            <p className="text-indigo-300">Average: {item.avg}%</p>
                                        </div>
                                    );
                                }}
                            />
                            <Bar dataKey="avg" radius={[6, 6, 0, 0]} maxBarSize={28}>
                                <LabelList
                                    dataKey="avg"
                                    position="top"
                                    formatter={(val) => `${val}%`}
                                    style={{ fill: '#1e293b', fontSize: '10px', fontWeight: 700 }}
                                />
                                {performanceData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
