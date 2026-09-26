import React from 'react';
import { Calendar, MapPin, User, Award, CheckCircle2, Clock, Edit3 } from 'lucide-react';

export default function EntranceTestDetailsWidget({ entranceTest = {}, onEdit }) {
    const isScheduled = !!entranceTest?.testDate;
    const isCompleted = entranceTest?.marksObtained != null;

    const formattedDate = entranceTest.testDate
        ? new Date(entranceTest.testDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          })
        : '28 Sep 2026';

    const formattedTime = entranceTest.testTime || '10:00 AM';

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 transition-all space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 font-bold flex items-center justify-center">
                        <Calendar size={16} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                        Entrance Test Details
                    </h3>
                </div>

                {onEdit && (
                    <button
                        type="button"
                        onClick={onEdit}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                        <Edit3 size={12} />
                        {isScheduled ? 'Edit' : 'Schedule'}
                    </button>
                )}
            </div>

            {isScheduled ? (
                <div className="space-y-3 text-xs">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider">
                            Format
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200">
                            {entranceTest.testType || 'Written Test'}
                        </span>
                    </div>

                    {/* Date & Time */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                            <Clock size={13} className="text-purple-700 font-bold shrink-0" />
                            <span>
                                {formattedDate} at {formattedTime}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 font-semibold text-[11px]">
                            <MapPin size={13} className="text-slate-600 font-medium shrink-0" />
                            <span>{entranceTest.venue || 'Examination Hall B, Room 204'}</span>
                        </div>
                    </div>

                    {/* Details list */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">Invigilator:</span>
                            <span className="font-bold text-slate-800">
                                {entranceTest.invigilator || 'Mr. Rajesh Sharma'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">Maximum Marks:</span>
                            <span className="font-bold text-slate-800">
                                {entranceTest.maxMarks || 100} Marks
                            </span>
                        </div>

                        {entranceTest.passingMarks && (
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 font-medium">Passing Marks:</span>
                                <span className="font-bold text-slate-800">
                                    {entranceTest.passingMarks} Marks
                                </span>
                            </div>
                        )}

                        {isCompleted && (
                            <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                                        Result
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                                        Qualified
                                    </span>
                                </div>
                                <div className="text-base font-black text-emerald-900">
                                    {entranceTest.marksObtained} / {entranceTest.maxMarks || 100}
                                    <span className="text-xs font-normal text-emerald-700 ml-1.5">
                                        (
                                        {(
                                            (entranceTest.marksObtained /
                                                (entranceTest.maxMarks || 100)) *
                                            100
                                        ).toFixed(1)}
                                        %)
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center py-6 px-4 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
                    <Calendar size={24} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-semibold text-slate-600">No Test Scheduled</p>
                    <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
                        Entrance evaluation has not been booked for this applicant.
                    </p>
                    {onEdit && (
                        <button
                            type="button"
                            onClick={onEdit}
                            className="mt-3 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                            Schedule Test
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
