import React from 'react';

export default function StudentCard({ student = { name: 'Priya Sharma', class: 'Class 8-A', rollNo: '14', school: 'Delhi Public School, Rohini', attendance: '94%', grade: 'B+', feeDue: '₹0' } }) {
    return (
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-violet-700 p-5 shadow-2xl shadow-blue-500/30">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-white border border-white/10">
                    {student.name.charAt(0)}
                </div>
                <div>
                    <p className="text-lg font-extrabold text-white">{student.name}</p>
                    <p className="text-blue-200 text-xs mt-0.5">{student.class} · Roll No. {student.rollNo}</p>
                    <p className="text-blue-300 text-[10px] mt-0.5 truncate max-w-[200px]">{student.school}</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
                {[['Attendance', student.attendance], ['Grade', student.grade], ['Fee Due', student.feeDue]].map(([lbl, val]) => (
                    <div key={lbl} className="rounded-xl bg-white/10 backdrop-blur-sm p-3 text-center border border-white/10">
                        <p className="text-base font-extrabold text-white">{val}</p>
                        <p className="text-[10px] text-blue-200 mt-0.5">{lbl}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
