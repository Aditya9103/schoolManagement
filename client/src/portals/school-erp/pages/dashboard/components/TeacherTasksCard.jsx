import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function TeacherTasksCard({ tasks = [], isLoading }) {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs animate-pulse">
                <div className="h-4 w-48 bg-slate-200 rounded mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-slate-100 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    const taskList = tasks || [];

    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {taskList.length > 0 ? (
                        <AlertCircle size={18} className="text-rose-600" />
                    ) : (
                        <CheckCircle2 size={18} className="text-emerald-600" />
                    )}
                    <h2 className="text-sm font-bold text-slate-900">My Tasks & Action Center</h2>
                    <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            taskList.length > 0
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-emerald-100 text-emerald-700'
                        }`}
                    >
                        {taskList.length} {taskList.length === 1 ? 'Action Item' : 'Action Items'}
                    </span>
                </div>
                {taskList.length > 0 && (
                    <span className="text-xs text-slate-500 hidden sm:inline">
                        Click any task to jump directly to workflow
                    </span>
                )}
            </div>

            {taskList.length === 0 ? (
                <div className="py-4 text-center border border-dashed border-emerald-200 rounded-xl bg-emerald-50/50">
                    <p className="text-xs font-semibold text-emerald-800">
                        All caught up! No urgent tasks or pending evaluations.
                    </p>
                    <p className="text-[11px] text-emerald-600 mt-0.5">
                        Attendance registers, homework checks, and lesson workflows are up to date.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {taskList.map((task) => (
                        <button
                            key={task.id}
                            onClick={() => navigate(task.route)}
                            className={`flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all hover:scale-[1.01] active:scale-95 ${task.color}`}
                        >
                            <span className="text-xs font-semibold truncate pr-2">{task.label}</span>
                            <ArrowRight size={14} className="shrink-0 opacity-70" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
