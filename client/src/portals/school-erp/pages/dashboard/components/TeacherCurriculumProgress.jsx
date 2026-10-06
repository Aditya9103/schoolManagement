import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle2, BookOpen } from 'lucide-react';

export default function TeacherCurriculumProgress({ units, subjectName, className, isLoading }) {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs animate-pulse">
                <div className="h-4 w-44 bg-slate-200 rounded mb-2" />
                <div className="h-3 w-32 bg-slate-100 rounded mb-4" />
                <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-10 bg-slate-50 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    const unitList = units || [];

    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">
                            Curriculum & Lesson Planning
                        </h2>
                        <p className="text-xs text-slate-500">
                            {className ? `${className} • ` : ''}Instructional Syllabus Tracking
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/school/lesson-planning')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                        View Syllabus <ChevronRight size={14} />
                    </button>
                </div>

                {unitList.length === 0 ? (
                    <div className="py-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <BookOpen size={24} className="mx-auto text-slate-400 mb-1.5" />
                        <p className="text-xs font-bold text-slate-700">Track Course Modules</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Plan lessons, milestones, and syllabus completion in the planner.
                        </p>
                        <button
                            onClick={() => navigate('/school/lesson-planning')}
                            className="mt-3 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                            Open Lesson Planner
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        {unitList.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100"
                            >
                                {item.status === 'COMPLETED' ? (
                                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                                ) : item.status === 'IN_PROGRESS' ? (
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                                ) : (
                                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                                )}
                                <span
                                    className={`truncate ${
                                        item.status === 'COMPLETED'
                                            ? 'text-slate-600 line-through'
                                            : 'text-slate-900 font-semibold'
                                    }`}
                                >
                                    {item.unit}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
