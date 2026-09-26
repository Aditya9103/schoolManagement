import React from 'react';
import { User, Edit3, ShieldCheck } from 'lucide-react';

export default function StudentInfoCard({ student = {}, onEdit }) {
    const formattedDob = student.dateOfBirth
        ? new Date(student.dateOfBirth).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : 'Not provided';

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6 transition-all">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <User size={18} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-slate-900">Student Information</h2>
                        <p className="text-[11px] text-slate-600 font-semibold">Primary demographic and identity records</p>
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

            <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 flex-1">
                    <div>
                        <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Full Name</span>
                        <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                            {student.firstName} {student.lastName}
                        </span>
                    </div>

                    <div>
                        <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Date of Birth</span>
                        <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                            {formattedDob}
                        </span>
                    </div>

                    <div>
                        <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Gender</span>
                        <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                            {student.gender || 'Not specified'}
                        </span>
                    </div>

                    <div>
                        <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Blood Group</span>
                        <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                            {student.bloodGroup || 'O+'}
                        </span>
                    </div>

                    <div>
                        <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Category</span>
                        <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                            {student.category || 'General'}
                        </span>
                    </div>

                    <div>
                        <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Nationality</span>
                        <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                            {student.nationality || 'Indian'}
                        </span>
                    </div>

                    <div className="col-span-2">
                        <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">Aadhaar Number</span>
                        <span className="text-xs font-mono font-bold text-slate-900 mt-0.5 block">
                            {student.aadhaarNo || 'XXXX-XXXX-XXXX'}
                        </span>
                    </div>
                </div>

                {/* Photo Preview Right Side */}
                <div className="shrink-0 flex flex-col items-center">
                    {student.photoUrl ? (
                        <div className="relative group">
                            <img
                                src={student.photoUrl}
                                alt="Student Portrait"
                                className="w-24 h-28 object-cover rounded-xl border-2 border-slate-200 shadow-xs"
                            />
                            <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold inline-flex items-center gap-1 shadow-xs">
                                    <ShieldCheck size={11} /> Verified
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-24 h-28 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-600 font-semibold text-xs font-medium">
                            <User size={24} className="mb-1" />
                            <span>No Photo</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
