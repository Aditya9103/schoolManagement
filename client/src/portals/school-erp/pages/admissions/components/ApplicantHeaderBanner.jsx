import React, { useState } from 'react';
import {
    Calendar,
    Copy,
    Check,
    Globe,
    CreditCard,
    ArrowUpRight,
    UserCheck,
    CheckCircle2,
    Clock,
    AlertCircle,
    Building2,
    CalendarDays
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApplicantHeaderBanner({ application, onOpenReceipt }) {
    const [copied, setCopied] = useState(false);

    if (!application) return null;

    const {
        applicationNo,
        student = {},
        status = 'SUBMITTED',
        source = 'WEBSITE',
        createdAt,
        fees = {},
        entranceTest = {}
    } = application;

    const handleCopy = () => {
        if (!applicationNo) return;
        navigator.clipboard.writeText(applicationNo);
        setCopied(true);
        toast.success('Application number copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    // Calculate age from DOB
    const calculateAge = (dobString) => {
        if (!dobString) return null;
        const dob = new Date(dobString);
        if (isNaN(dob.getTime())) return null;

        const now = new Date();
        let years = now.getFullYear() - dob.getFullYear();
        let months = now.getMonth() - dob.getMonth();
        if (months < 0 || (months === 0 && now.getDate() < dob.getDate())) {
            years--;
            months = (months + 12) % 12;
        }
        return `${years} Years ${months} Months`;
    };

    const ageString = calculateAge(student.dateOfBirth);

    // Format applied date
    const formattedAppliedDate = createdAt
        ? new Date(createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : '23 Sep 2026, 10:24 AM';

    // Status display config
    const getStatusConfig = (st) => {
        switch (st) {
            case 'SUBMITTED':
            case 'New Application':
                return {
                    label: 'Application Submitted',
                    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
                    nextStep: 'Verify submitted student documents',
                    dotColor: 'bg-blue-500'
                };
            case 'DOCS_PENDING':
            case 'Document Pending':
                return {
                    label: 'Documents Pending',
                    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
                    nextStep: 'Awaiting parent document upload',
                    dotColor: 'bg-amber-500'
                };
            case 'UNDER_REVIEW':
            case 'Under Review':
                return {
                    label: 'Documents Under Review',
                    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    nextStep: 'Review documents and schedule entrance test',
                    dotColor: 'bg-indigo-500'
                };
            case 'TEST_SCHEDULED':
            case 'Entrance Test':
                return {
                    label: 'Entrance Test Scheduled',
                    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
                    nextStep: entranceTest?.testDate
                        ? `Conduct entrance test on ${new Date(entranceTest.testDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                        : 'Conduct entrance test as scheduled',
                    dotColor: 'bg-purple-500'
                };
            case 'TEST_COMPLETED':
                return {
                    label: 'Test Completed',
                    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
                    nextStep: 'Record test marks and declare result',
                    dotColor: 'bg-cyan-500'
                };
            case 'INTERVIEW_SCHEDULED':
                return {
                    label: 'Interview Scheduled',
                    badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
                    nextStep: 'Conduct parent & student interaction',
                    dotColor: 'bg-violet-500'
                };
            case 'APPROVED':
            case 'Selected':
                return {
                    label: 'Admission Approved',
                    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    nextStep: 'Awaiting admission fee payment & enrollment',
                    dotColor: 'bg-emerald-500'
                };
            case 'WAITLISTED':
            case 'Waitlisted':
                return {
                    label: 'Waitlisted',
                    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
                    nextStep: 'Under reserve pool based on seat availability',
                    dotColor: 'bg-amber-500'
                };
            case 'ENROLLED':
            case 'Admitted':
                return {
                    label: 'Enrolled & Admitted',
                    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                    nextStep: `Enrolled as Student (Roll: ${application.enrolledStudentId?.rollNumber || 'Assigned'})`,
                    dotColor: 'bg-emerald-600'
                };
            case 'REJECTED':
            case 'Rejected':
                return {
                    label: 'Application Rejected',
                    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
                    nextStep: 'Admission process closed',
                    dotColor: 'bg-rose-500'
                };
            default:
                return {
                    label: st,
                    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
                    nextStep: 'Review application details',
                    dotColor: 'bg-slate-500'
                };
        }
    };

    const statusConfig = getStatusConfig(status);

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6 transition-all">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Left: Student Identity */}
                <div className="flex items-start sm:items-center gap-4.5">
                    <div className="relative shrink-0">
                        {student.photoUrl ? (
                            <img
                                src={student.photoUrl}
                                alt={`${student.firstName || 'Student'} photo`}
                                className="w-20 h-24 sm:w-22 sm:h-26 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                            />
                        ) : (
                            <div className="w-20 h-24 sm:w-22 sm:h-26 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-slate-200 flex flex-col items-center justify-center text-blue-700 font-black text-2xl shadow-sm">
                                {student.firstName?.[0] || 'A'}
                                {student.lastName?.[0] || 'M'}
                            </div>
                        )}
                        <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold shadow-xs">
                            {student.gender || 'Student'}
                        </span>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                {student.firstName} {student.lastName}
                            </h1>
                            {ageString && (
                                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                                    {ageString}
                                </span>
                            )}
                        </div>

                        {/* Metadata row */}
                        <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-600">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-slate-800">
                                <span>App No:</span>
                                <span className="font-mono text-blue-600 font-bold">{applicationNo}</span>
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="text-slate-600 font-medium hover:text-slate-700 transition-colors cursor-pointer ml-0.5"
                                    title="Copy application number"
                                >
                                    {copied ? <Check size={13} className="text-emerald-700 font-bold" /> : <Copy size={13} />}
                                </button>
                            </div>

                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50/70 border border-blue-100 text-blue-700 font-semibold">
                                Applied for {student.targetClassName || 'Class 1'} {student.academicYear ? `(Session ${student.academicYear})` : ''}
                            </span>

                            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                                <Calendar size={13} className="text-slate-600 font-medium" />
                                {formattedAppliedDate}
                            </span>

                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold">
                                <Globe size={13} />
                                {source === 'WEBSITE' ? 'Source Website' : `Source ${source}`}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Center & Right Cards */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto shrink-0">
                    {/* Status Card */}
                    <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/70 min-w-[210px] space-y-1.5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 font-extrabold">Current Status</div>
                        <div>
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-bold ${statusConfig.badgeBg}`}
                            >
                                <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor}animate-pulse`} />
                                {statusConfig.label}
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-700 font-semibold font-medium leading-snug">
                            {statusConfig.nextStep}
                        </p>
                    </div>

                    {/* Fee Payment Card */}
                    <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/70 min-w-[210px] space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-700 font-extrabold">
                            <span>Application Fee</span>
                            <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    fees?.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}
                            >
                                {fees?.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                        </div>
                        <div className="text-lg font-black text-slate-900 tracking-tight">
                            ₹ {fees?.amount?.toLocaleString('en-IN') || '1,000'}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-700 font-semibold">
                            <span className="truncate max-w-[120px] font-mono">
                                {fees?.transactionId || 'TXN1234567890'}
                            </span>
                            <button
                                type="button"
                                onClick={onOpenReceipt}
                                className="text-blue-600 hover:text-blue-800 font-bold hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                            >
                                Receipt <ArrowUpRight size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
