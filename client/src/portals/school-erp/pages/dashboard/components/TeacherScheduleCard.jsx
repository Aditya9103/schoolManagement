import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Check, Calendar } from 'lucide-react';

export default function TeacherScheduleCard({ schedule = [], isLoading }) {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs animate-pulse">
                <div className="h-4 w-40 bg-slate-200 rounded mb-2" />
                <div className="h-3 w-64 bg-slate-100 rounded mb-4" />
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-slate-50 border border-slate-100 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    const items = schedule || [];

    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between min-h-[300px]">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">Today's Class Schedule</h2>
                        <p className="text-xs text-slate-500">Live instructional timeline and classroom allocation</p>
                    </div>
                    <button
                        onClick={() => navigate('/school/classes/timetable')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                        Full Timetable <ChevronRight size={14} />
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <Calendar size={28} className="mx-auto text-slate-400 mb-2" />
                        <p className="text-xs font-bold text-slate-700">No classes scheduled for today</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Check the full timetable or assign teaching periods in Timetable Manager.
                        </p>
                        <button
                            onClick={() => navigate('/school/classes/timetable')}
                            className="mt-3 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                            Open Timetable
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {items.map((slot, i) => (
                            <div
                                key={i}
                                className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                                    slot.status === 'LIVE'
                                        ? 'bg-blue-50/70 border-blue-200'
                                        : slot.status === 'COMPLETED'
                                        ? 'bg-slate-50 border-slate-200/80 opacity-75'
                                        : 'bg-white border-slate-200/90'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-center w-12 shrink-0">
                                        <span className="text-[10px] font-bold text-slate-600 block">Period</span>
                                        <span className="text-sm font-extrabold text-slate-900">{slot.period}</span>
                                    </div>
                                    <div className="h-8 w-px bg-slate-200 shrink-0" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xs font-bold text-slate-900">{slot.className}</h3>
                                            <span className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-700">
                                                {slot.subject}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                            {slot.time} • {slot.room}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    {slot.status === 'LIVE' && (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-600 text-white animate-pulse">
                                            <span className="w-1.5 h-1.5 rounded-full bg-white" /> LIVE NOW
                                        </span>
                                    )}
                                    {slot.status === 'COMPLETED' && (
                                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                            <Check size={14} /> Done
                                        </span>
                                    )}
                                    {slot.status === 'UPCOMING' && (
                                        <span className="text-[11px] font-semibold text-slate-500">Upcoming</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                    {items.length} {items.length === 1 ? 'class' : 'classes'} scheduled today
                </span>
                <span className="font-semibold text-slate-700">Real-Time Sync Active</span>
            </div>
        </div>
    );
}
