import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    XCircle,
    UserCheck,
    UserPlus,
    Calendar,
    Download,
    Mail,
    MessageSquare,
    MoreVertical,
    FileText,
    ShieldAlert,
    AlertCircle,
    Printer,
    ChevronRight,
    Loader2,
    Eye,
    Plus,
    X
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
    useGetApplicationByIdQuery,
    useUpdateApplicationStatusMutation,
    useRecordTestResultMutation
} from '../../../../store/api/admissionsApi';

import ApplicantHeaderBanner from './components/ApplicantHeaderBanner';
import MilestoneProgressTracker from './components/MilestoneProgressTracker';
import StudentInfoCard from './components/StudentInfoCard';
import ParentInfoCard from './components/ParentInfoCard';
import AcademicInfoCard from './components/AcademicInfoCard';
import AddressInfoCard from './components/AddressInfoCard';
import DocumentsTableTab from './components/DocumentsTableTab';
import EntranceTestDetailsWidget from './components/EntranceTestDetailsWidget';
import QuickActionsWidget from './components/QuickActionsWidget';
import ApplicationTimelineWidget from './components/ApplicationTimelineWidget';
import ScheduleTestModal from './components/ScheduleTestModal';
import EnrollStudentModal from './components/EnrollStudentModal';

export default function ApplicationDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data: res,
        isLoading,
        isError,
        refetch
    } = useGetApplicationByIdQuery(id, { skip: !id });

    const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateApplicationStatusMutation();
    const [recordResult, { isLoading: isRecordingResult }] = useRecordTestResultMutation();

    const [activeTab, setActiveTab] = useState('documents');
    const [isScheduleTestOpen, setIsScheduleTestOpen] = useState(false);
    const [isEnrollOpen, setIsEnrollOpen] = useState(false);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

    // Result modal inputs
    const [resultForm, setResultForm] = useState({
        marksObtained: '',
        maxMarks: '100',
        qualified: true,
        remarks: 'Performed well in mathematics and oral interaction.'
    });

    const application = res?.data?.application || res?.application || res?.data;

    // Status action handler
    const handleStatusUpdate = async (status, remarks) => {
        try {
            await updateStatus({
                id,
                status,
                remarks: remarks || `Status changed to ${status} by administrator.`
            }).unwrap();
            toast.success(`Application marked as ${status}`);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || `Failed to update status to ${status}`);
        }
    };

    // Record Test Result handler
    const handleSaveResult = async (e) => {
        e.preventDefault();
        try {
            await recordResult({
                id,
                marksObtained: Number(resultForm.marksObtained),
                maxMarks: Number(resultForm.maxMarks),
                qualified: resultForm.qualified,
                remarks: resultForm.remarks
            }).unwrap();
            toast.success('Entrance test result recorded successfully!');
            setIsResultModalOpen(false);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to record test result');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[500px] flex flex-col items-center justify-center p-8 space-y-4">
                <Loader2 size={36} className="text-blue-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-600">
                    Loading application records...
                </p>
            </div>
        );
    }

    if (isError || !application) {
        return (
            <div className="p-8 max-w-xl mx-auto text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-700 font-bold flex items-center justify-center mx-auto">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-xl font-black text-slate-900">Application Not Found</h2>
                <p className="text-xs text-slate-700 font-medium">
                    The requested admission application could not be found or you may not have permission to view it.
                </p>
                <button
                    type="button"
                    onClick={() => navigate('/school/admissions')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                    <ArrowLeft size={14} /> Back to Admissions Hub
                </button>
            </div>
        );
    }

    const {
        applicationNo,
        student = {},
        status = 'SUBMITTED',
        fees = {},
        documents = [],
        entranceTest = {}
    } = application;

    const normalizedStatus = (status || '').toUpperCase();
    const isApproved = normalizedStatus === 'SELECTED' || normalizedStatus === 'APPROVED';
    const isWaitlisted = normalizedStatus === 'WAITLISTED';
    const isRejected = normalizedStatus === 'REJECTED';
    const isEnrolled = normalizedStatus === 'ENROLLED' || normalizedStatus === 'ADMITTED';

    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-200">
            {/* ── Top Bar: Breadcrumb & Primary Action Buttons ────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
                <div className="space-y-1">
                    {/* Back button & Breadcrumb */}
                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <button
                            type="button"
                            onClick={() => navigate('/school/admissions')}
                            className="inline-flex items-center gap-1.5 font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer mr-2"
                        >
                            <ArrowLeft size={14} />
                            <span>Back to List</span>
                        </button>
                        <span>/</span>
                        <Link to="/school/admissions" className="hover:text-blue-600 font-medium">
                            Admissions
                        </Link>
                        <ChevronRight size={12} className="text-slate-600 font-medium" />
                        <span className="hover:text-blue-600 font-medium">Applications</span>
                        <ChevronRight size={12} className="text-slate-600 font-medium" />
                        <span className="font-bold text-slate-900 font-mono">{applicationNo}</span>
                    </div>
                </div>

                {/* Top Action Buttons (Matching Screenshot) */}
                <div className="flex items-center flex-wrap gap-2">
                    {/* Approve Button */}
                    <button
                        type="button"
                        disabled={isUpdatingStatus || isApproved || isEnrolled}
                        onClick={() => handleStatusUpdate('Selected', 'Application approved by school admission panel.')}
                        className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                            isApproved
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 opacity-60 cursor-not-allowed'
                                : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border-slate-200 hover:border-emerald-300'
                        }`}
                    >
                        <CheckCircle2 size={14} className="text-emerald-700 font-bold" />
                        Approve
                    </button>

                    {/* Waitlist Button */}
                    <button
                        type="button"
                        disabled={isUpdatingStatus || isWaitlisted || isEnrolled}
                        onClick={() => handleStatusUpdate('Waitlisted', 'Placed on reserve waitlist.')}
                        className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                            isWaitlisted
                                ? 'bg-amber-50 text-amber-700 border-amber-200 opacity-60 cursor-not-allowed'
                                : 'bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-700 border-slate-200 hover:border-amber-300'
                        }`}
                    >
                        <Clock size={14} className="text-amber-800 font-bold" />
                        Waitlist
                    </button>

                    {/* Reject Button */}
                    <button
                        type="button"
                        disabled={isUpdatingStatus || isRejected || isEnrolled}
                        onClick={() => handleStatusUpdate('Rejected', 'Application rejected by administration.')}
                        className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                            isRejected
                                ? 'bg-rose-50 text-rose-700 border-rose-200 opacity-60 cursor-not-allowed'
                                : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border-slate-200 hover:border-rose-300'
                        }`}
                    >
                        <XCircle size={14} className="text-rose-700 font-bold" />
                        Reject
                    </button>

                    {/* Enroll Student Button */}
                    <button
                        type="button"
                        onClick={() => setIsEnrollOpen(true)}
                        disabled={isEnrolled}
                        className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer ${
                            isEnrolled
                                ? 'bg-emerald-600 text-white cursor-not-allowed opacity-90'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                        }`}
                    >
                        <UserPlus size={15} />
                        {isEnrolled ? 'Already Enrolled' : 'Enroll Student'}
                    </button>
                </div>
            </div>

            {/* ── Banner Card: Applicant Identity, Status, Fee ──────────────── */}
            <ApplicantHeaderBanner
                application={application}
                onOpenReceipt={() => setIsReceiptModalOpen(true)}
            />

            {/* ── Milestone Progress Tracker: 8 Nodes ───────────────────────── */}
            <MilestoneProgressTracker
                status={status}
                entranceTest={entranceTest}
                fees={fees}
            />

            {/* ── 2-Column Responsive Layout (Left 8 cols, Right 4 cols) ────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* ── Left Column (8 Columns) ────────────────────────────────── */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Student Information Card */}
                    <StudentInfoCard student={student} />

                    {/* Parent / Guardian Information Card */}
                    <ParentInfoCard parent={application.parent} />

                    {/* Academic Information Card */}
                    <AcademicInfoCard
                        student={student}
                        previousSchool={application.previousSchool}
                    />

                    {/* Address Information Card */}
                    <AddressInfoCard address={application.parent?.address} />

                    {/* Tabs Section: Documents, Entrance Test, Notes, Communication */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab('documents')}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                    activeTab === 'documents'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                Documents ({documents.length})
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('entranceTest')}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                    activeTab === 'entranceTest'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                Entrance Test
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('notes')}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                    activeTab === 'notes'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                Staff Notes (3)
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('communication')}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                    activeTab === 'communication'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                Communication (5)
                            </button>
                        </div>

                        {/* Active Tab Panel */}
                        {activeTab === 'documents' && (
                            <DocumentsTableTab
                                applicationId={application._id}
                                documents={documents}
                                onDocumentUpdated={refetch}
                            />
                        )}

                        {activeTab === 'entranceTest' && (
                            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                    <h3 className="text-sm font-black text-slate-900">
                                        Evaluation Overview &amp; Syllabus
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setIsScheduleTestOpen(true)}
                                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                                    >
                                        Re-schedule Assessment
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                                        <span className="text-[10px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">
                                            Test Pattern
                                        </span>
                                        <span className="font-bold text-slate-900 mt-1 block">
                                            Written + Interactive Viva
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                                        <span className="text-[10px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">
                                            Subjects Evaluated
                                        </span>
                                        <span className="font-bold text-slate-900 mt-1 block">
                                            English, Math, General Aptitude
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                                        <span className="text-[10px] font-bold text-slate-700 font-extrabold uppercase tracking-wider block">
                                            Duration
                                        </span>
                                        <span className="font-bold text-slate-900 mt-1 block">
                                            90 Minutes
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                                    <span className="font-bold block mb-1">Assessment Guidelines:</span>
                                    <p className="text-[11px] leading-relaxed text-amber-800">
                                        The applicant must present their Hall Ticket / Admit Card upon entry. 
                                        Parents are requested to wait in the Auditorium during the written examination.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notes' && (
                            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                                <h3 className="text-sm font-black text-slate-900">
                                    Internal Staff Remarks &amp; Notes
                                </h3>
                                <div className="space-y-3 text-xs">
                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-900">Document verification passed</span>
                                            <span className="text-[10px] text-slate-600 font-semibold">23 Sep 2026, 11:30 AM</span>
                                        </div>
                                        <p className="text-slate-600 text-[11px]">
                                            Birth certificate municipal seal and Aadhaar credentials verified against UIDAI format.
                                        </p>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-900">Entrance Test Slot Assigned</span>
                                            <span className="text-[10px] text-slate-600 font-semibold">24 Sep 2026, 02:15 PM</span>
                                        </div>
                                        <p className="text-slate-600 text-[11px]">
                                            Assigned Hall B, Seat 14. Parent notified via automated WhatsApp channel.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'communication' && (
                            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                                <h3 className="text-sm font-black text-slate-900">
                                    Communication History
                                </h3>
                                <div className="space-y-3 text-xs">
                                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                            <MessageSquare size={16} />
                                        </div>
                                        <div className="flex-1 space-y-0.5">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-900">WhatsApp Notification Delivered</span>
                                                <span className="text-[10px] text-slate-600 font-semibold">23 Sep 2026, 10:25 AM</span>
                                            </div>
                                            <p className="text-slate-600 text-[11px]">
                                                "Dear Rahul Mehta, we have received Aarav Mehta's application APP-2026-0104 for Class 1."
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                                            <Mail size={16} />
                                        </div>
                                        <div className="flex-1 space-y-0.5">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-900">Confirmation Email Sent</span>
                                                <span className="text-[10px] text-slate-600 font-semibold">23 Sep 2026, 10:25 AM</span>
                                            </div>
                                            <p className="text-slate-600 text-[11px]">
                                                Official acknowledgement letter and fee payment receipt dispatched to parent inbox.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Right Column (4 Columns) ───────────────────────────────── */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Quick Actions Widget */}
                    <QuickActionsWidget
                        onScheduleTest={() => setIsScheduleTestOpen(true)}
                        onRecordResult={() => setIsResultModalOpen(true)}
                        onSendMessage={() => {
                            const phone = application.parent?.fatherPhone || application.parent?.motherPhone;
                            if (phone) {
                                window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`, '_blank');
                            } else {
                                toast.error('No parent phone number registered');
                            }
                        }}
                        onSendEmail={() => {
                            const email = application.parent?.fatherEmail || application.parent?.motherEmail;
                            if (email) {
                                window.location.href = `mailto:${email}?subject=Admission Application ${applicationNo}`;
                            } else {
                                toast.error('No parent email address registered');
                            }
                        }}
                        onGenerateAdmitCard={() => {
                            toast.success('Admit Card generated and downloaded!');
                            window.print();
                        }}
                        onDownloadPdf={() => {
                            window.print();
                        }}
                    />

                    {/* Entrance Test Details Widget */}
                    <EntranceTestDetailsWidget
                        entranceTest={entranceTest}
                        onEdit={() => setIsScheduleTestOpen(true)}
                    />

                    {/* Application Timeline Audit Widget */}
                    <ApplicationTimelineWidget application={application} />
                </div>
            </div>

            {/* ── Schedule Test Modal ────────────────────────────────────────── */}
            {isScheduleTestOpen && (
                <ScheduleTestModal
                    application={application}
                    onClose={() => {
                        setIsScheduleTestOpen(false);
                        refetch();
                    }}
                />
            )}

            {/* ── Enroll Student Modal ───────────────────────────────────────── */}
            {isEnrollOpen && (
                <EnrollStudentModal
                    application={application}
                    onClose={() => {
                        setIsEnrollOpen(false);
                        refetch();
                    }}
                />
            )}

            {/* ── Record Test Result Modal ───────────────────────────────────── */}
            {isResultModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 font-bold block">
                                    Entrance Assessment
                                </span>
                                <h3 className="text-base font-black text-slate-900">Record Test Result</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsResultModalOpen(false)}
                                className="p-1 text-slate-600 font-medium hover:text-slate-600 cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveResult} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">
                                        Marks Obtained *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        max={resultForm.maxMarks}
                                        value={resultForm.marksObtained}
                                        onChange={(e) =>
                                            setResultForm({ ...resultForm, marksObtained: e.target.value })
                                        }
                                        placeholder="e.g. 88"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold outline-hidden focus:border-purple-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">
                                        Maximum Marks *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={resultForm.maxMarks}
                                        onChange={(e) =>
                                            setResultForm({ ...resultForm, maxMarks: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold outline-hidden focus:border-purple-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1">
                                    Qualification Decision
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setResultForm({ ...resultForm, qualified: true })}
                                        className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                                            resultForm.qualified
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                                : 'bg-white text-slate-600 border-slate-200'
                                        }`}
                                    >
                                        Qualified
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setResultForm({ ...resultForm, qualified: false })}
                                        className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                                            !resultForm.qualified
                                                ? 'bg-rose-50 text-rose-700 border-rose-300'
                                                : 'bg-white text-slate-600 border-slate-200'
                                        }`}
                                    >
                                        Not Qualified
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1">
                                    Examiner Remarks
                                </label>
                                <textarea
                                    rows={3}
                                    value={resultForm.remarks}
                                    onChange={(e) =>
                                        setResultForm({ ...resultForm, remarks: e.target.value })
                                    }
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium outline-hidden focus:border-purple-600 resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsResultModalOpen(false)}
                                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isRecordingResult}
                                    className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                                >
                                    {isRecordingResult ? (
                                        <Loader2 size={13} className="animate-spin" />
                                    ) : null}
                                    Save Result
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Fee Receipt Modal ─────────────────────────────────────────── */}
            {isReceiptModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-900">Application Fee Receipt</h3>
                            <p className="text-xs text-slate-700 font-medium font-mono mt-0.5">
                                {fees?.transactionId || 'TXN1234567890'}
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-left">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Applicant:</span>
                                <span className="font-bold text-slate-900">{student.firstName} {student.lastName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Application No:</span>
                                <span className="font-bold text-slate-900 font-mono">{applicationNo}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Payment Status:</span>
                                <span className="font-bold text-emerald-700">PAID</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
                                <span className="font-black text-slate-900">Total Amount:</span>
                                <span className="font-black text-slate-900">₹ {fees?.amount || '1,000'}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                            >
                                <Printer size={14} /> Print Receipt
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsReceiptModalOpen(false)}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
