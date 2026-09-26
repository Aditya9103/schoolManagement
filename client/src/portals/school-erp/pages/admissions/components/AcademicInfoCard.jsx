import React from 'react';
import { BookOpen, Edit3, School } from 'lucide-react';

export default function AcademicInfoCard({ student = {}, previousSchool = {}, onEdit }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6 transition-all">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center">
                        <BookOpen size={18} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-slate-900">Academic Information</h2>
                        <p className="text-[11px] text-slate-600 font-semibold">Class applied and prior school records</p>
                    </div>
                </div>
                {onEdit && (
                    <button
                        type="button"
                        onClick={onEdit}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                        <Edit3 size={13} />
                        Edit
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                <div>
                    <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Applying For Class</span>
                    <span className="text-xs font-bold text-blue-700 mt-0.5 block">
                        {student.targetClassName || 'Class 1'}
                    </span>
                </div>

                <div>
                    <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Academic Session</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                        Academic Year {student.academicYear || 'Current'}
                    </span>
                    {student.academicYearId && (
                        <span className="text-[10px] font-mono text-slate-600 font-semibold block mt-0.5">
                            ID: {student.academicYearId}
                        </span>
                    )}
                </div>

                <div>
                    <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Last Class Attended</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                        {previousSchool.lastClassAttended || 'UKG'}
                    </span>
                </div>

                <div className="col-span-2">
                    <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Previous School</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                        {previousSchool.schoolName || 'St. Xavier High School'}
                    </span>
                </div>

                <div>
                    <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Percentage / Grade</span>
                    <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
                        {previousSchool.percentageOrGrade || 'Grade A (91.5%)'}
                    </span>
                </div>

                <div>
                    <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Transfer Certificate (TC) No</span>
                    <span className="text-xs font-mono font-bold text-slate-900 mt-0.5 block">
                        {previousSchool.tcNumber || 'TC-2026-092'}
                    </span>
                </div>

                <div className="col-span-2">
                    <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Reason for Leaving</span>
                    <span className="text-xs text-slate-700 mt-0.5 block">
                        {previousSchool.reasonForLeaving || 'Relocation to new residential area / Seeking CBSE curriculum'}
                    </span>
                </div>
            </div>
        </div>
    );
}
