import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ChevronDown } from 'lucide-react';

export default function StudentsByClassDonut({ data: propData, classesDistribution, total, totalStudents }) {
    const [selectedFilter, setSelectedFilter] = useState('All Classes');

    const rawData = propData || classesDistribution;
    const resolvedTotal = total || totalStudents || 1248;

    const data = rawData && rawData.length > 0 ? rawData : [
        { name: 'Class 1', students: 180, percentage: 14, color: '#3B82F6' },
        { name: 'Class 2', students: 176, percentage: 14, color: '#10B981' },
        { name: 'Class 3', students: 168, percentage: 13, color: '#06B6D4' },
        { name: 'Class 4', students: 162, percentage: 13, color: '#F59E0B' },
        { name: 'Class 5', students: 158, percentage: 13, color: '#8B5CF6' },
        { name: 'Class 6', students: 152, percentage: 12, color: '#EC4899' },
        { name: 'Class 7', students: 132, percentage: 11, color: '#6366F1' },
        { name: 'Class 8', students: 120, percentage: 10, color: '#F97316' },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-4 sm:p-5 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
            {/* Top Bar with Filter */}
            <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight whitespace-nowrap">
                    Students by Class
                </h3>

                <div className="relative">
                    <button
                        type="button"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                        <span>{selectedFilter}</span>
                        <ChevronDown size={12} className="text-slate-600 font-medium" />
                    </button>
                </div>
            </div>

            {/* Donut Chart with Center Metric */}
            <div className="relative h-40 sm:h-44 w-full flex items-center justify-center my-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={48}
                            outerRadius={68}
                            paddingAngle={2}
                            dataKey="students"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [`${value} students`, name]}
                            contentStyle={{ borderRadius: '12px', background: '#0F172A', color: '#FFF', fontSize: '11px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-base sm:text-lg font-black text-slate-900 font-display leading-tight">
                        {resolvedTotal?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] font-bold text-slate-700 font-extrabold uppercase tracking-wider">
                        Total Students
                    </span>
                </div>
            </div>

            {/* Breakdown Legend Grid without ugly truncate */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-2 border-t border-slate-100 text-[11px]">
                {data.slice(0, 8).map((item) => (
                    <div key={item.name} className="flex items-center justify-between py-0.5">
                        <span className="flex items-center gap-1 text-slate-600 font-medium whitespace-nowrap">
                            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <span>{item.name}</span>
                        </span>
                        <span className="font-bold text-slate-800 text-[10px] shrink-0">
                            {item.students} <span className="text-slate-600 font-medium font-normal">({item.percentage}%)</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
