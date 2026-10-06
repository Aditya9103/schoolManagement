import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export default function UpcomingEventsCard({ events, data }) {
    const rawList = data || events;
    const list = Array.isArray(rawList) ? rawList : [];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-4 sm:p-5 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight whitespace-nowrap">
                    Upcoming Events
                </h3>
                <Link
                    to="/school/events"
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline whitespace-nowrap"
                >
                    View All
                </Link>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto">
                {list.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400">
                        <Calendar className="w-5 h-5 mb-1.5 text-slate-300" />
                        <span className="text-xs">No upcoming events scheduled</span>
                    </div>
                ) : (
                    list.slice(0, 5).map((ev, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        {/* Date badge */}
                        <div className={`h-8 w-8 rounded-lg border flex flex-col items-center justify-center shrink-0 ${ev.color || 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                            <span className="text-[11px] font-black font-display leading-none">
                                {ev.date}
                            </span>
                            <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5 leading-none">
                                {ev.month}
                            </span>
                        </div>

                        {/* Title & Time */}
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-slate-900 truncate leading-tight">
                                {ev.title}
                            </p>
                            <p className="text-[10px] text-slate-600 font-semibold font-medium truncate leading-tight">
                                {ev.time}
                            </p>
                        </div>
                    </div>
                )))}
            </div>
        </div>
    );
}
