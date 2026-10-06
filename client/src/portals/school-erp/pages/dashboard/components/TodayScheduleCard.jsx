import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Clock, Presentation } from 'lucide-react';

export default function TodayScheduleCard({ schedule, data }) {
    const rawItems = data || schedule;
    const items = Array.isArray(rawItems) ? rawItems : [];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-4 sm:p-5 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight whitespace-nowrap">
                    Today's Schedule
                </h3>
                <Link
                    to="/school/classes/timetable"
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline whitespace-nowrap"
                >
                    View All
                </Link>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400">
                        <Clock className="w-5 h-5 mb-1.5 text-slate-300" />
                        <span className="text-xs">No periods scheduled today</span>
                    </div>
                ) : (
                    items.slice(0, 6).map((slot, index) => {
                    const IconComponent = slot.icon || BookOpen;
                    return (
                        <div
                            key={index}
                            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            {/* Time badge */}
                            <span className="text-[10px] font-mono font-bold text-slate-700 font-semibold w-13 shrink-0">
                                {slot.time}
                            </span>

                            {/* Icon */}
                            <div className={`h-6 w-6 rounded-lg flex items-center justify-center font-bold shrink-0 ${slot.color || 'bg-blue-50 text-blue-600'}`}>
                                <IconComponent size={13} />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold text-slate-800 truncate leading-tight">
                                    {slot.title}
                                </p>
                                <p className="text-[10px] text-slate-600 font-semibold font-medium truncate leading-tight">
                                    {slot.location}
                                </p>
                            </div>

                            {/* Live Badge */}
                            {slot.isLive && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold shrink-0">
                                    <span className="h-1 w-1 rounded-full bg-emerald-500 animate-ping" />
                                    Live
                                </span>
                            )}
                        </div>
                    );
                }))}
            </div>
        </div>
    );
}
