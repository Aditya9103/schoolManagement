import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, GraduationCap, Users } from 'lucide-react';

export default function TeacherClassesGrid({ classesList = [], isLoading }) {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs animate-pulse">
                <div className="h-4 w-40 bg-slate-200 rounded mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-28 bg-slate-50 border border-slate-100 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    const items = classesList || [];

    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-sm font-bold text-slate-900">My Assigned Classes</h2>
                    <p className="text-xs text-slate-500">Live roster and assigned teaching sections</p>
                </div>
                <button
                    onClick={() => navigate('/school/classes')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                    Manage Classes <ChevronRight size={14} />
                </button>
            </div>

            {items.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <GraduationCap size={28} className="mx-auto text-slate-400 mb-2" />
                    <p className="text-xs font-bold text-slate-700">No classes assigned yet</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                        Teaching assignments are managed by administration or department heads.
                    </p>
                    <button
                        onClick={() => navigate('/school/classes')}
                        className="mt-3 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                        Browse Classes
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {items.map((c, i) => (
                        <div
                            key={i}
                            className="p-4 rounded-xl border border-slate-200/90 hover:border-blue-300 transition-all bg-white hover:shadow-2xs"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-bold text-slate-900">{c.name}</h3>
                                <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                        c.role === 'Class Teacher'
                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                            : 'bg-slate-50 text-slate-600 border-slate-200'
                                    }`}
                                >
                                    {c.role}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Users size={12} /> {c.students} {c.students === 1 ? 'Student' : 'Students'}
                                </span>
                                <span>
                                    Attendance: <strong className="text-slate-800">{c.avgAttendance}</strong>
                                </span>
                            </div>
                            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                                <button
                                    onClick={() => navigate('/school/students')}
                                    className="text-xs font-bold text-slate-700 hover:text-blue-600 cursor-pointer"
                                >
                                    Student Roster
                                </button>
                                <button
                                    onClick={() => navigate('/school/assignments')}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                                >
                                    Assignments
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
