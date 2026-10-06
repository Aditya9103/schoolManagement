import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Plus } from 'lucide-react';

const DAYS = ['Mon 21 Apr', 'Tue 22 Apr', 'Wed 23 Apr', 'Thu 24 Apr', 'Fri 25 Apr', 'Sat 26 Apr'];
const TIME_SLOTS = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

export default function TeacherScheduleGrid({ teacherName = 'Teacher', scheduleSlots = [] }) {
    const [viewMode, setViewMode] = useState('week'); // 'week' | 'month'

    const visualBlocks = React.useMemo(() => {
        if (!scheduleSlots || !scheduleSlots.length) return [];
        const daysMap = { Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4, Saturday: 5 };
        return scheduleSlots.map((s) => ({
            dayIndex: s.dayIndex ?? (s.day ? (daysMap[s.day] ?? 0) : 0),
            time: s.time || s.startTime || '9:00 AM',
            title: s.title || `${s.className || 'Class'} ${s.subject || ''}`.trim(),
            room: s.room || s.roomNumber || 'Room 101',
            color: s.color || 'bg-blue-100 border-blue-200 text-blue-900',
        }));
    }, [scheduleSlots]);

    return (
        <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs font-bold text-slate-800">21 Apr – 27 Apr 2026</span>
                    <button
                        type="button"
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                        <button
                            type="button"
                            onClick={() => setViewMode('week')}
                            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                                viewMode === 'week' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Week
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('month')}
                            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                                viewMode === 'month' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Month
                        </button>
                    </div>

                    <button
                        type="button"
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                        Today
                    </button>
                </div>
            </div>

            {/* Weekly Timetable Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                    <div className="min-w-[760px]">
                        {/* Days Header */}
                        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-700">
                            <div className="p-3 text-center text-slate-400 border-r border-slate-200">Time</div>
                            {DAYS.map((d) => (
                                <div key={d} className="p-3 text-center border-r last:border-r-0 border-slate-200">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Time Grid Rows */}
                        {TIME_SLOTS.map((time) => (
                            <div key={time} className="grid grid-cols-7 border-b last:border-b-0 border-slate-100 min-h-[52px]">
                                <div className="p-2 text-[11px] font-semibold text-slate-400 text-center border-r border-slate-100 flex items-center justify-center">
                                    {time}
                                </div>

                                {DAYS.map((d, dayIndex) => {
                                    const block = visualBlocks.find(b => b.dayIndex === dayIndex && b.time === time);
                                    return (
                                        <div
                                            key={`${d}-${time}`}
                                            className="p-1 border-r last:border-r-0 border-slate-100 relative group"
                                        >
                                            {block && (
                                                <div className={`p-2 rounded-xl border text-[11px] font-bold ${block.color} shadow-2xs transition-all hover:scale-[1.02] cursor-pointer`}>
                                                    <div className="truncate">{block.title}</div>
                                                    <div className="text-[10px] opacity-75 flex items-center gap-1 mt-0.5 font-medium">
                                                        <MapPin size={10} />
                                                        <span>{block.room}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom: Today's Classes & Upcoming Events Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <Clock size={15} className="text-blue-600" />
                        <span>Today's Classes</span>
                    </h4>
                    <div className="space-y-2">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800">6-A Mathematics</span>
                            <span className="text-slate-500 font-medium">9:00 - 10:00 AM • Room 104</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800">7-B Mathematics</span>
                            <span className="text-slate-500 font-medium">10:30 - 11:30 AM • Room 109</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800">8-A Mathematics</span>
                            <span className="text-slate-500 font-medium">1:30 - 2:30 PM • Room 201</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <CalendarIcon size={15} className="text-indigo-600" />
                        <span>Upcoming Department Events</span>
                    </h4>
                    <div className="space-y-2">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800">Department Meeting</span>
                            <span className="text-slate-500 font-medium">23 Apr • 10:00 AM</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800">Term 1 Test Review</span>
                            <span className="text-slate-500 font-medium">25 Apr • 9:00 AM</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800">Parent Teacher Conference</span>
                            <span className="text-slate-500 font-medium">26 Apr • 1:00 PM</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
