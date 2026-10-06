import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, FileText, Award, BookOpen, MessageSquare, Coffee } from 'lucide-react';

export default function TeacherQuickActions() {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
                <h2 className="text-sm font-bold text-slate-900 mb-1">Quick Actions</h2>
                <p className="text-xs text-slate-500 mb-4">Fast shortcuts to common classroom tasks</p>

                <div className="grid grid-cols-2 gap-2.5">
                    <button
                        onClick={() => navigate('/school/attendance')}
                        className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-all cursor-pointer group"
                    >
                        <CheckCircle2 size={18} className="text-blue-600 mb-1.5 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-bold text-slate-800">Mark Attendance</div>
                        <span className="text-[10px] text-slate-600">Daily roll call</span>
                    </button>

                    <button
                        onClick={() => navigate('/school/assignments')}
                        className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-all cursor-pointer group"
                    >
                        <FileText size={18} className="text-indigo-600 mb-1.5 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-bold text-slate-800">Assign Homework</div>
                        <span className="text-[10px] text-slate-600">Post daily task</span>
                    </button>

                    <button
                        onClick={() => navigate('/school/exams')}
                        className="p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-left transition-all cursor-pointer group"
                    >
                        <Award size={18} className="text-amber-600 mb-1.5 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-bold text-slate-800">Enter Marks</div>
                        <span className="text-[10px] text-slate-600">Tests & exams</span>
                    </button>

                    <button
                        onClick={() => navigate('/school/lesson-planning')}
                        className="p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-left transition-all cursor-pointer group"
                    >
                        <BookOpen size={18} className="text-purple-600 mb-1.5 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-bold text-slate-800">Lesson Plan</div>
                        <span className="text-[10px] text-slate-600">Curriculum units</span>
                    </button>

                    <button
                        onClick={() => navigate('/school/messages')}
                        className="p-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-left transition-all cursor-pointer group"
                    >
                        <MessageSquare size={18} className="text-sky-600 mb-1.5 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-bold text-slate-800">Message Parent</div>
                        <span className="text-[10px] text-slate-600">Authorized chats</span>
                    </button>

                    <button
                        onClick={() => navigate('/school/leave')}
                        className="p-3 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 text-left transition-all cursor-pointer group"
                    >
                        <Coffee size={18} className="text-rose-600 mb-1.5 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-bold text-slate-800">Apply Leave</div>
                        <span className="text-[10px] text-slate-600">Balance: 12 days</span>
                    </button>
                </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600">
                <span className="font-bold text-slate-800">Faculty Advisory:</span> Mid-term exam question papers must be submitted by Friday, 09 Oct.
            </div>
        </div>
    );
}
