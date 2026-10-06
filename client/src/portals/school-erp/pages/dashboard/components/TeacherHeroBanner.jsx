import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function TeacherHeroBanner({ teacherName, schoolName }) {
    const navigate = useNavigate();

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-200">
                        <Sparkles size={14} className="text-amber-300" />
                        Academic Year 2026-27 • {schoolName || 'Greenwood International School'}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Good morning, {teacherName || 'Rahul Sharma'}! 🌞
                    </h1>
                    <p className="text-sm text-slate-300 max-w-2xl leading-relaxed italic">
                        "Education is the most powerful weapon which you can use to change the world." — Nelson Mandela
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/15 text-right">
                        <p className="text-xs text-slate-300">Today's Date</p>
                        <p className="text-sm font-bold text-white">Tuesday, 06 Oct 2026</p>
                    </div>
                    <button
                        onClick={() => navigate('/school/attendance')}
                        className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                        <CheckCircle2 size={16} />
                        Take Today's Attendance
                    </button>
                </div>
            </div>
        </div>
    );
}
