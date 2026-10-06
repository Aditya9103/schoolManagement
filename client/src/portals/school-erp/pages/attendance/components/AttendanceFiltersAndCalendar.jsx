import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search, Clock, ChevronDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function AttendanceFiltersAndCalendar({
    classes = [],
    selectedClassId,
    onSelectClass,
    selectedSectionId,
    onSelectSection,
    selectedDate,
    onSelectDate,
    selectedPeriod,
    onSelectPeriod,
    onLoadStudents,
    distribution = [],
    isLoading = false,
}) {
    // Current week dates centered around 2026-04-21
    const weekDays = [
        { dayName: 'Sun', dayNum: '19', dateStr: '2026-04-19', status: 'holiday', dots: ['#a855f7'] },
        { dayName: 'Mon', dayNum: '20', dateStr: '2026-04-20', status: 'marked', dots: ['#10b981', '#ef4444'] },
        { dayName: 'Tue', dayNum: '21', dateStr: '2026-04-21', status: 'current', dots: ['#10b981', '#f59e0b'] },
        { dayName: 'Wed', dayNum: '22', dateStr: '2026-04-22', status: 'upcoming', dots: ['#cbd5e1'] },
        { dayName: 'Thu', dayNum: '23', dateStr: '2026-04-23', status: 'upcoming', dots: ['#cbd5e1'] },
        { dayName: 'Fri', dayNum: '24', dateStr: '2026-04-24', status: 'upcoming', dots: ['#cbd5e1'] },
        { dayName: 'Sat', dayNum: '25', dateStr: '2026-04-25', status: 'upcoming', dots: ['#cbd5e1'] },
    ];

    // Color definitions for donut
    const donutData = distribution.length > 0 ? distribution : [
        { name: 'Present', value: 1102, percentage: 88.3, color: '#10b981' },
        { name: 'Absent', value: 146, percentage: 11.7, color: '#ef4444' },
        { name: 'Late', value: 28, percentage: 2.2, color: '#f59e0b' },
        { name: 'Excused', value: 12, percentage: 1.0, color: '#6366f1' },
        { name: 'Not Marked', value: 0, percentage: 0.0, color: '#cbd5e1' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Card 1: Filters (~3.5 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="space-y-3.5">
                    {/* Class & Section Selector */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Class & Section
                        </label>
                        <div className="relative">
                            <select
                                value={`${selectedClassId}_${selectedSectionId}`}
                                onChange={(e) => {
                                    const [cId, sId] = e.target.value.split('_');
                                    onSelectClass(cId);
                                    onSelectSection(sId);
                                }}
                                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                            >
                                <option value="class-6_sec-a">Class 6 - Section A</option>
                                <option value="class-6_sec-b">Class 6 - Section B</option>
                                <option value="class-7_sec-a">Class 7 - Section A</option>
                                <option value="class-7_sec-b">Class 7 - Section B</option>
                                <option value="class-8_sec-a">Class 8 - Section A</option>
                                <option value="class-9_sec-a">Class 9 - Section A</option>
                                <option value="class-10_sec-a">Class 10 - Section A</option>
                                {classes?.map((c) =>
                                    c.sections?.map((s) => (
                                        <option key={`${c._id}_${s._id}`} value={`${c._id}_${s._id}`}>
                                            {c.name} - {s.name}
                                        </option>
                                    ))
                                )}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Date Picker */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Date
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => onSelectDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Period Dropdown */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Period
                        </label>
                        <div className="relative">
                            <select
                                value={selectedPeriod}
                                onChange={(e) => onSelectPeriod(e.target.value)}
                                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                            >
                                <option value="FULL_DAY">Full Day (All Periods)</option>
                                <option value="PERIOD_1">Period 1 (08:30 AM - 09:15 AM)</option>
                                <option value="PERIOD_2">Period 2 (09:15 AM - 10:00 AM)</option>
                                <option value="PERIOD_3">Period 3 (10:15 AM - 11:00 AM)</option>
                                <option value="PERIOD_4">Period 4 (11:00 AM - 11:45 AM)</option>
                                <option value="PERIOD_5">Period 5 (12:30 PM - 01:15 PM)</option>
                                <option value="PERIOD_6">Period 6 (01:15 PM - 02:00 PM)</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Primary Button */}
                <button
                    onClick={onLoadStudents}
                    disabled={isLoading}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
                >
                    <Search className="w-4 h-4" />
                    <span>{isLoading ? 'Loading...' : 'Load Students'}</span>
                </button>
            </div>

            {/* Card 2: Week Calendar Strip (~4.5 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-bold text-slate-800 tracking-tight">
                            April 2026
                        </span>
                        <div className="flex items-center gap-1">
                            <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Day pills */}
                    <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
                        {weekDays.map((d) => {
                            const isSelected = d.dateStr === selectedDate;
                            return (
                                <button
                                    key={d.dateStr}
                                    type="button"
                                    onClick={() => onSelectDate(d.dateStr)}
                                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                                        isSelected
                                            ? 'bg-blue-900 text-white shadow-sm ring-2 ring-blue-900/20'
                                            : 'hover:bg-slate-100 text-slate-700'
                                    }`}
                                >
                                    <span className={`text-[10px] uppercase font-semibold mb-1 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                                        {d.dayName}
                                    </span>
                                    <span className={`text-base font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                                        {d.dayNum}
                                    </span>
                                    {/* Indicator Dots */}
                                    <div className="flex items-center gap-0.5 mt-1.5 h-1.5">
                                        {d.dots.map((dotColor, dotIdx) => (
                                            <span
                                                key={dotIdx}
                                                className="w-1 h-1 rounded-full"
                                                style={{ backgroundColor: dotColor }}
                                            />
                                        ))}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Legend */}
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 pt-4 mt-3 border-t border-slate-100 text-[11px] font-medium text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Present
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" /> Absent
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" /> Late
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-500" /> Holiday
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-300" /> Not Marked
                    </span>
                </div>
            </div>

            {/* Card 3: Attendance Statistics Donut (~4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-900">Attendance Statistics</h3>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-1">
                    {/* Donut Chart with center label */}
                    <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={donutData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={46}
                                    outerRadius={64}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {donutData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                            <span className="text-lg font-extrabold text-slate-900 leading-none">
                                88.3%
                            </span>
                            <span className="text-[10px] font-medium text-slate-500 mt-0.5">
                                Attendance
                            </span>
                        </div>
                    </div>

                    {/* Donut Legend Breakdown */}
                    <div className="flex-1 space-y-1.5 w-full">
                        {donutData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-slate-600 font-medium">{item.name}</span>
                                </div>
                                <span className="text-slate-900 font-bold">
                                    {item.value.toLocaleString()} <span className="text-slate-400 font-normal">({item.percentage}%)</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100">
                    Live updates across all 42 classes
                </div>
            </div>
        </div>
    );
}
