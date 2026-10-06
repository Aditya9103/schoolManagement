import React, { useState } from 'react';
import {
    X,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Plus,
    FileText,
    BookOpen,
    Layers,
    Laptop
} from 'lucide-react';

export default function AssignmentCalendarModal({
    isOpen,
    onClose,
    assignments = [],
    onSelectAssignment,
    onCreateNew,
}) {
    if (!isOpen) return null;

    const [calendarView, setCalendarView] = useState('month'); // month, week, day
    const [currentMonth, setCurrentMonth] = useState('April 2026');

    // Calendar grid generation for April 2026 (starts on Wednesday)
    const daysInMonth = 30;
    const startDayOffset = 3; // Wednesday

    const colorMap = {
        HOMEWORK: 'bg-blue-100 text-blue-800 border-blue-200',
        ASSIGNMENT: 'bg-purple-100 text-purple-800 border-purple-200',
        PROJECT: 'bg-amber-100 text-amber-800 border-amber-200',
        PRACTICAL: 'bg-pink-100 text-pink-800 border-pink-200',
    };

    const eventsMap = useMemo(() => {
        const map = {};
        for (const item of assignments) {
            if (!item.deadline) continue;
            const d = new Date(item.deadline);
            const dayNum = String(d.getDate());
            if (!map[dayNum]) map[dayNum] = [];
            map[dayNum].push({
                id: item._id || item.id,
                title: item.title,
                type: item.type || 'HOMEWORK',
                color: colorMap[item.type] || 'bg-blue-100 text-blue-800 border-blue-200',
                raw: item,
            });
        }
        return map;
    }, [assignments]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
                {/* Header matching Screen 6 */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-0.5">
                            <span>Academic</span>
                            <span>&gt;</span>
                            <span>Homework & Assignments</span>
                            <span>&gt;</span>
                            <span className="text-blue-600">Calendar</span>
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            Assignment Calendar
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            View all assignments and deadlines in calendar view.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={onCreateNew}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" /> Create Assignment
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-xl hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Calendar Toolbar */}
                <div className="p-4 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <button className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-extrabold text-slate-900 px-2">
                            {currentMonth}
                        </span>
                        <button className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                        {['Month', 'Week', 'Day'].map((v) => (
                            <button
                                key={v}
                                onClick={() => setCalendarView(v.toLowerCase())}
                                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                                    calendarView === v.toLowerCase()
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Calendar Month Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                        {/* Day headers */}
                        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/70 text-center text-xs font-bold text-slate-600 py-2.5">
                            <span>Sun</span>
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 text-xs">
                            {/* Empty offset days */}
                            {Array.from({ length: startDayOffset }).map((_, i) => (
                                <div key={`empty-${i}`} className="min-h-[90px] p-2 bg-slate-50/30 text-slate-300" />
                            ))}

                            {/* Actual Month Days */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const dayNumber = i + 1;
                                const events = eventsMap[dayNumber.toString()] || [];
                                const isToday = dayNumber === 21;

                                return (
                                    <div
                                        key={dayNumber}
                                        className={`min-h-[90px] p-1.5 transition-colors flex flex-col justify-between ${
                                            isToday ? 'bg-blue-50/20 ring-1 ring-blue-500/20' : 'hover:bg-slate-50/50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span
                                                className={`w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs ${
                                                    isToday
                                                        ? 'bg-blue-600 text-white shadow-xs'
                                                        : 'text-slate-700'
                                                }`}
                                            >
                                                {dayNumber}
                                            </span>
                                        </div>

                                        {/* Event Pills */}
                                        <div className="space-y-1">
                                            {events.map((evt) => (
                                                <button
                                                    key={evt.id}
                                                    type="button"
                                                    onClick={() => {
                                                        const match = evt.raw || assignments.find((a) => (a._id || a.id) === evt.id);
                                                        if (match && onSelectAssignment) onSelectAssignment(match);
                                                    }}
                                                    className={`w-full text-left px-1.5 py-0.5 rounded-md border text-[10px] font-bold truncate block transition-transform hover:scale-[1.02] cursor-pointer ${evt.color}`}
                                                >
                                                    {evt.title}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom Legend matching Screen 6 */}
                    <div className="flex items-center justify-center gap-4 pt-4 text-xs font-semibold text-slate-600 flex-wrap">
                        <span className="inline-flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Homework
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Assignment
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Project
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Practical
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Exam Preparation
                        </span>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
