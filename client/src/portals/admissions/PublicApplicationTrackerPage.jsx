import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
    GraduationCap,
    Search,
    CheckCircle2,
    Clock,
    Calendar,
    MapPin,
    FileText,
    Download,
    ArrowLeft,
    AlertCircle,
    User,
    Check,
    XCircle,
    Sparkles,
    Printer
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLazyTrackPublicApplicationQuery } from '../../store/api/admissionsApi';

const MILESTONES = [
    { key: 'SUBMITTED', label: 'Application Submitted', desc: 'Your application has been submitted successfully.' },
    { key: 'DOCS_REVIEW', label: 'Documents Under Review', desc: 'School admissions committee is verifying submitted certificates.' },
    { key: 'TEST_SCHEDULED', label: 'Entrance Test Scheduled', desc: 'Assessment or interview date allocated.' },
    { key: 'RESULT_EVALUATION', label: 'Result Under Evaluation', desc: 'Test scores and academic profiling being tabulated.' },
    { key: 'DECISION', label: 'Admission Decision', desc: 'Offer letter or merit list allocation decided.' },
    { key: 'FEE_PAYMENT', label: 'Fee Payment', desc: 'Admission seat confirmation fee processing.' },
    { key: 'ENROLLMENT', label: 'Enrollment & Welcome', desc: 'Student enrolled with official admission number & student ID.' },
];

export default function PublicApplicationTrackerPage() {
    const { schoolSlug } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [applicationNo, setApplicationNo] = useState(searchParams.get('appNo') || '');
    const [phoneOrDob, setPhoneOrDob] = useState('');
    const [showAdmitCard, setShowAdmitCard] = useState(false);

    const [triggerTrack, { data: res, isFetching, error }] = useLazyTrackPublicApplicationQuery();

    const application = res?.data;

    useEffect(() => {
        const queryAppNo = searchParams.get('appNo');
        if (queryAppNo) {
            triggerTrack({ applicationNo: queryAppNo, phoneOrDob: '' });
        }
    }, [searchParams, triggerTrack]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!applicationNo.trim()) {
            toast.error('Please enter your Application Number (e.g. APP-2026-001)');
            return;
        }
        triggerTrack({ applicationNo: applicationNo.trim(), phoneOrDob: phoneOrDob.trim() });
    };

    // Determine current progress index
    const getStageIndex = (status) => {
        switch (status) {
            case 'New Application':
                return 0;
            case 'Under Review':
            case 'Document Pending':
                return 1;
            case 'Entrance Test':
                return 2;
            case 'Selected':
                return 4;
            case 'Fee Pending':
                return 5;
            case 'Admitted':
                return 6;
            case 'Rejected':
            case 'Waitlisted':
            case 'Withdrawn':
                return 4;
            default:
                return 1;
        }
    };

    const currentStageIndex = application ? getStageIndex(application.status) : 0;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* ── Top Header ────────────────────────────────────────────── */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => (schoolSlug ? navigate(`/admissions/${schoolSlug}`) : navigate('/admissions'))}
                            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                                <GraduationCap size={20} />
                            </div>
                            <div>
                                <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                                    {application?.schoolId?.name || 'PrimeSchoolOS Admissions'}
                                </h1>
                                <p className="text-[11px] text-slate-700 font-semibold">
                                    Official Live Status Tracking Portal
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => (schoolSlug ? navigate(`/admissions/${schoolSlug}/apply`) : navigate('/admissions'))}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                        New Application
                    </button>
                </div>

                {/* ── Search Bar Section (Matches UI 2 Step 5) ──────────────── */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-4">
                    <div className="text-center max-w-xl mx-auto space-y-1">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            Track Your Application
                        </h2>
                        <p className="text-xs text-slate-700 font-medium">
                            Enter your application number and registered mobile number or date of birth to check live status.
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto pt-2 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-800 mb-1">
                                    Application Number *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. APP-2026-001"
                                    value={applicationNo}
                                    onChange={(e) => setApplicationNo(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-semibold uppercase outline-hidden"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-800 mb-1">
                                    Registered Mobile / DOB (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Mobile No. or YYYY-MM-DD"
                                    value={phoneOrDob}
                                    onChange={(e) => setPhoneOrDob(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium outline-hidden"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isFetching}
                            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isFetching ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Track Application</span>
                                    <Search size={14} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* ── Status Not Found / Error ──────────────────────────────── */}
                {error && (
                    <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2">
                        <AlertCircle size={28} className="text-rose-700 font-bold mx-auto" />
                        <h3 className="text-sm font-bold text-rose-900">Application Record Not Found</h3>
                        <p className="text-xs text-rose-700 font-bold max-w-md mx-auto">
                            Please verify the Application Number entered. If you recently applied, it may take a few moments to sync across the network.
                        </p>
                    </div>
                )}

                {/* ── Active Application Result (Matches UI 2 Step 5) ───────── */}
                {application && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left: 7-Stage Visual Milestone Timeline */}
                        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
                                        Milestone Journey
                                    </span>
                                    <h3 className="text-base font-black text-slate-900">
                                        Application Progress
                                    </h3>
                                </div>
                                <span className="text-xs font-mono font-bold text-slate-700 font-medium">
                                    {application.applicationNo}
                                </span>
                            </div>

                            <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                {MILESTONES.map((m, idx) => {
                                    const isCompleted = idx < currentStageIndex;
                                    const isCurrent = idx === currentStageIndex;

                                    return (
                                        <div key={m.key} className="relative flex items-start gap-4">
                                            <div
                                                className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                                    isCompleted
                                                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                                                        : isCurrent
                                                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm animate-pulse'
                                                        : 'bg-white border-2 border-slate-300 text-slate-400'
                                                }`}
                                            >
                                                {isCompleted ? <Check size={14} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                                            </div>

                                            <div className="space-y-0.5 pt-0.5">
                                                <div className="flex items-center gap-2">
                                                    <h4
                                                        className={`text-xs font-black ${
                                                            isCurrent ? 'text-blue-700' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                                                        }`}
                                                    >
                                                        {m.label}
                                                    </h4>
                                                    {isCurrent && (
                                                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                                                            Current Stage
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-700 font-semibold leading-normal">
                                                    {m.desc}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right: Current Status Card (Matching UI 2 Step 5) */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Status Card */}
                            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-5">
                                <div className="space-y-2">
                                    <span className="text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">
                                        Current Status
                                    </span>
                                    <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Sparkles size={18} className="text-indigo-600" />
                                            <span className="text-sm font-black text-indigo-950">
                                                {application.status}
                                            </span>
                                        </div>
                                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
                                    </div>
                                </div>

                                {/* Entrance Test Schedule Details (if scheduled) */}
                                {application.entranceTest?.status === 'SCHEDULED' && (
                                    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                                        <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            Entrance Assessment Details
                                        </h4>

                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <span className="text-[10px] font-semibold text-slate-700 block">Test Date</span>
                                                <span className="font-bold text-slate-800">
                                                    {application.entranceTest.scheduledDate
                                                        ? new Date(application.entranceTest.scheduledDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                                        : 'To be announced'}
                                                </span>
                                            </div>

                                            <div>
                                                <span className="text-[10px] font-semibold text-slate-700 block">Time</span>
                                                <span className="font-bold text-slate-800">
                                                    {application.entranceTest.scheduledTime || '10:00 AM - 11:30 AM'}
                                                </span>
                                            </div>

                                            <div className="col-span-2">
                                                <span className="text-[10px] font-semibold text-slate-700 block">Venue</span>
                                                <span className="font-bold text-slate-800">
                                                    {application.entranceTest.venue || 'Main Campus, Academic Block A'}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-[11px] text-blue-800 leading-normal font-medium pt-1">
                                            {application.entranceTest.instructions || 'Please carry your printed Admit Card, HB pencil, and original birth certificate.'}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => setShowAdmitCard(true)}
                                            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <Download size={14} />
                                            Download Admit Card
                                        </button>
                                    </div>
                                )}

                                {/* Applicant Profile Quick Summary */}
                                <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                                    <h4 className="text-xs font-black text-slate-900">Applicant Details</h4>
                                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                                        <div>
                                            <span className="text-[10px] text-slate-600 font-semibold block">Student</span>
                                            <span className="font-bold text-slate-800">{application.student?.firstName} {application.student?.lastName}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-600 font-semibold block">Class Applied</span>
                                            <span className="font-bold text-slate-800">{application.targetClassName}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-600 font-semibold block">Father / Guardian</span>
                                            <span className="font-bold text-slate-800">{application.parent?.fatherName}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-600 font-semibold block">Submission Date</span>
                                            <span className="font-bold text-slate-800">
                                                {new Date(application.appliedDate || Date.now()).toLocaleDateString('en-GB')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Admit Card Modal ──────────────────────────────────────── */}
                {showAdmitCard && application && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="text-blue-600" size={24} />
                                    <h3 className="font-black text-slate-900">Official Entrance Admit Card</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowAdmitCard(false)}
                                    className="p-1 rounded-lg text-slate-600 font-medium hover:text-slate-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">School:</span>
                                    <span className="font-bold text-slate-800">{application.schoolId?.name || 'Greenwood International School'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Roll / App No:</span>
                                    <span className="font-mono font-bold text-blue-600">{application.applicationNo}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Candidate Name:</span>
                                    <span className="font-bold text-slate-800">{application.student?.firstName} {application.student?.lastName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Class:</span>
                                    <span className="font-bold text-slate-800">{application.targetClassName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Reporting Time:</span>
                                    <span className="font-bold text-slate-800">{application.entranceTest?.scheduledTime || '09:30 AM'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Test Venue:</span>
                                    <span className="font-bold text-slate-800">{application.entranceTest?.venue || 'Main Auditorium, Block A'}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <Printer size={14} />
                                    Print Admit Card
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAdmitCard(false)}
                                    className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
