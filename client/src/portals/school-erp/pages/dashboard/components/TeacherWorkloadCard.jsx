import React from 'react';

export default function TeacherWorkloadCard({ workload, isLoading }) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs animate-pulse">
                <div className="flex justify-between items-center mb-4">
                    <div className="h-4 w-40 bg-slate-200 rounded" />
                    <div className="h-6 w-28 bg-slate-100 rounded-lg" />
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-slate-100 rounded-xl" />
                    ))}
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full" />
            </div>
        );
    }

    const classesCount = workload?.classesCount ?? 0;
    const weeklyPeriods = workload?.weeklyPeriods ?? 0;
    const activeHomework = workload?.activeHomeworkCount ?? 0;
    const classTeacherTitle = workload?.classTeacherOf;
    const progressPct = workload?.curriculumProgressPct ?? 0;

    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">Teaching Workload Overview</h2>
                        <p className="text-xs text-slate-500">Weekly allocation and instructional metrics</p>
                    </div>
                    <span
                        className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${
                            classTeacherTitle
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                    >
                        {classTeacherTitle ? `Class Teacher: ${classTeacherTitle}` : 'Subject Faculty'}
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Assigned Classes</span>
                        <div className="text-xl font-black text-slate-900 mt-0.5">
                            {classesCount} {classesCount === 1 ? 'Section' : 'Sections'}
                        </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Weekly Periods</span>
                        <div className="text-xl font-black text-slate-900 mt-0.5">
                            {weeklyPeriods} {weeklyPeriods === 1 ? 'Period' : 'Periods'}
                        </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Active Homework</span>
                        <div className="text-xl font-black text-slate-900 mt-0.5">
                            {activeHomework} {activeHomework === 1 ? 'Task' : 'Tasks'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2 text-xs pt-2">
                <div className="flex items-center justify-between text-slate-700">
                    <span>Curriculum Delivery Completion</span>
                    <span className="font-bold text-slate-900">
                        {progressPct > 0 ? `${progressPct}% Delivered` : 'In Progress'}
                    </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(progressPct, progressPct > 0 ? progressPct : 15)}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
