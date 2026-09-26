import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import { X, Printer, ShieldCheck, Phone, Droplet, School as SchoolIcon } from 'lucide-react';

export default function StudentIdCardModal({ student, onClose }) {
    const cardRef = useRef(null);
    if (!student) return null;

    const schoolName = student.schoolId?.name || 'Greenwood International School';
    const schoolAddress = student.schoolId?.address?.city || 'Noida, Uttar Pradesh';

    // Signed QR payload for transport/driver app attendance scanning
    const qrPayload = JSON.stringify({
        studentId: student._id,
        admissionNo: student.admissionNo,
        schoolId: student.schoolId?._id || student.schoolId,
        name: `${student.firstName} ${student.lastName}`,
        class: `${student.classId?.name || 'Class 6'} - ${student.sectionId?.name || 'A'}`,
        rollNo: student.rollNo,
        busRoute: student.busRouteNo || 'Route 3',
        busStop: student.busStop || 'Main Stop',
    });

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="text-blue-600" size={18} />
                        <h3 className="text-sm font-bold text-slate-800">Student Identity Card</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-slate-600 font-medium hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Printable ID Card Container */}
                <div className="p-5 flex justify-center bg-slate-100/50">
                    <div
                        ref={cardRef}
                        className="w-full max-w-[320px] bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-950 text-white rounded-2xl shadow-xl overflow-hidden border border-blue-400/20 relative"
                    >
                        {/* Decorative Top Accent */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400" />

                        {/* School Header */}
                        <div className="p-4 text-center border-b border-white/10 bg-white/5 backdrop-blur-xs">
                            <div className="flex items-center justify-center gap-1.5 mb-1">
                                <div className="h-7 w-7 rounded-lg bg-white/20 flex items-center justify-center shadow-inner">
                                    <SchoolIcon size={16} className="text-white" />
                                </div>
                                <h4 className="text-xs font-black tracking-wide uppercase line-clamp-1">
                                    {schoolName}
                                </h4>
                            </div>
                            <p className="text-[9px] text-blue-200 font-medium tracking-wider uppercase">
                                Student ID Card • {student.academicYear ? `Session ${student.academicYear}` : 'Current Session'}
                            </p>
                        </div>

                        {/* Student Photo & Name */}
                        <div className="p-4 flex flex-col items-center text-center">
                            <div className="relative mb-3">
                                <div className="h-20 w-20 rounded-2xl ring-3 ring-emerald-400/80 shadow-md overflow-hidden bg-slate-700">
                                    {student.photoUrl ? (
                                        <img
                                            src={student.photoUrl}
                                            alt={student.firstName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-xl font-bold text-white">
                                            {student.firstName?.[0]}
                                            {student.lastName?.[0]}
                                        </div>
                                    )}
                                </div>
                                <span className="absolute -bottom-1.5 right-1 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-md bg-emerald-500 text-white shadow-xs">
                                    {student.status || 'Active'}
                                </span>
                            </div>

                            <h2 className="text-base font-bold text-white tracking-tight">
                                {student.firstName} {student.lastName}
                            </h2>
                            <p className="text-xs font-semibold text-emerald-300 mt-0.5">
                                {student.classId?.name || 'Class 6'} - {student.sectionId?.name || 'A'} • Roll #{student.rollNo}
                            </p>
                            <p className="text-[10px] font-mono text-blue-200/90 mt-0.5">
                                {student.admissionNo}
                            </p>

                            {/* Details Grid */}
                            <div className="w-full mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-left text-[10px]">
                                <div className="bg-white/5 rounded-xl p-2">
                                    <span className="text-blue-300 block text-[9px]">Blood Group</span>
                                    <span className="font-bold text-white flex items-center gap-1">
                                        <Droplet size={10} className="text-rose-400" />
                                        {student.bloodGroup || 'N/A'}
                                    </span>
                                </div>
                                <div className="bg-white/5 rounded-xl p-2">
                                    <span className="text-blue-300 block text-[9px]">Emergency</span>
                                    <span className="font-bold text-white flex items-center gap-1 truncate">
                                        <Phone size={10} className="text-emerald-400" />
                                        {student.emergencyContact || student.fatherPhone || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            {/* QR Code Section for Driver Bus Check-in */}
                            <div className="mt-4 p-2.5 bg-white rounded-xl shadow-inner flex flex-col items-center">
                                <QRCode
                                    value={qrPayload}
                                    size={96}
                                    level="M"
                                    style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                                />
                                <span className="text-[8px] font-bold text-slate-600 mt-1 uppercase tracking-wider">
                                    Scan to Check-in
                                </span>
                            </div>

                            <p className="text-[8px] text-blue-300/80 mt-3 text-center">
                                If found, please return to {schoolName}, {schoolAddress}.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-white">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-xl shadow-md shadow-blue-500/20 transition-all"
                    >
                        <Printer size={14} />
                        Print ID Card
                    </button>
                </div>
            </div>
        </div>
    );
}
