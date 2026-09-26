import React, { useState } from 'react';
import {
    X,
    CheckCircle2,
    Clock,
    AlertCircle,
    Calendar,
    FileText,
    ExternalLink,
    Check,
    Ban,
    UserCheck,
    Send,
    Download,
    Eye,
    Sparkles,
    User,
    Users,
    BookOpen,
    ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
    useGetApplicationByIdQuery,
    useUpdateApplicationStatusMutation,
    useVerifyDocumentMutation
} from '../../../../../store/api/admissionsApi';

const MILESTONES = [
    { key: 'Submitted', label: 'Submitted' },
    { key: 'Docs Review', label: 'Docs Review' },
    { key: 'Test Scheduled', label: 'Test Scheduled' },
    { key: 'Result', label: 'Result' },
    { key: 'Approval', label: 'Approval' },
    { key: 'Enrolled', label: 'Enrolled' },
];

export default function ApplicationDetailDrawer({
    applicationId,
    onClose,
    onScheduleTest,
    onEnroll,
}) {
    const [activeTab, setActiveTab] = useState('Overview');
    const [auditNote, setAuditNote] = useState('');

    const { data: res, isLoading } = useGetApplicationByIdQuery(applicationId, {
        skip: !applicationId,
    });
    const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateApplicationStatusMutation();
    const [verifyDoc, { isLoading: isVerifyingDoc }] = useVerifyDocumentMutation();

    const application = res?.data;

    if (!applicationId) return null;

    const handleStatusUpdate = async (newStatus) => {
        try {
            await updateStatus({ id: applicationId, status: newStatus }).unwrap();
            toast.success(`Application marked as ${newStatus}`);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update application status');
        }
    };

    const handleDocVerify = async (docId, status) => {
        try {
            await verifyDoc({ id: applicationId, docId, status }).unwrap();
            toast.success(`Document marked as ${status}`);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update document status');
        }
    };

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
            case 'Admitted':
                return 5;
            default:
                return 1;
        }
    };

    const currentStageIndex = application ? getStageIndex(application.status) : 0;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
            <div className="w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col font-sans text-slate-800 animate-in slide-in-from-right duration-300">
                {/* ── Top Header ────────────────────────────────────────────── */}
                <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-lg shadow-xs">
                            {application?.student?.firstName?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-black text-slate-900 leading-tight">
                                    Application Details — {application?.applicationNo}
                                </h2>
                                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black uppercase tracking-wider">
                                    {application?.status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-700 font-medium">
                                Submitted on {new Date(application?.appliedDate || Date.now()).toLocaleDateString('en-GB')} via {application?.source || 'Website'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Quick Decision Buttons */}
                        {application?.status !== 'Admitted' && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => handleStatusUpdate('Selected')}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
                                >
                                    Approve
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleStatusUpdate('Waitlisted')}
                                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-colors cursor-pointer"
                                >
                                    Waitlist
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleStatusUpdate('Rejected')}
                                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                                >
                                    Reject
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onEnroll(application)}
                                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                    <UserCheck size={14} />
                                    Enroll Student
                                </button>
                            </>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-xl text-slate-600 font-medium hover:text-slate-600 hover:bg-slate-200/60 transition-colors ml-2 cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* ── Student Profile Header Card (Matches UI 2 Step 7) ──── */}
                        <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                            <div className="flex items-center gap-4">
                                <img
                                    src={application?.student?.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'}
                                    alt="Student"
                                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md"
                                />
                                <div>
                                    <h3 className="text-xl font-black text-white">
                                        {application?.student?.firstName} {application?.student?.lastName}
                                    </h3>
                                    <p className="text-xs text-indigo-200 font-medium">
                                        Target: <span className="font-bold text-white">{application?.targetClassName}</span> ({application?.academicYear})
                                    </p>
                                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-300">
                                        <span>DOB: {application?.student?.dateOfBirth || 'N/A'}</span>
                                        <span>•</span>
                                        <span>Gender: {application?.student?.gender}</span>
                                        <span>•</span>
                                        <span>Blood: {application?.student?.bloodGroup || 'O+'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex sm:flex-col gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => onScheduleTest(application)}
                                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <Calendar size={14} className="text-amber-400" />
                                    Schedule Test / Interview
                                </button>
                            </div>
                        </div>

                        {/* ── Horizontal Milestone Tracker (Matches UI 2 Step 7) ── */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="flex items-center justify-between">
                                {MILESTONES.map((m, idx) => {
                                    const isCompleted = idx < currentStageIndex;
                                    const isCurrent = idx === currentStageIndex;

                                    return (
                                        <React.Fragment key={m.key}>
                                            <div className="flex flex-col items-center gap-1 text-center">
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                                        isCompleted
                                                            ? 'bg-emerald-600 text-white shadow-xs'
                                                            : isCurrent
                                                            ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-100'
                                                            : 'bg-white border-2 border-slate-300 text-slate-400'
                                                    }`}
                                                >
                                                    {isCompleted ? <Check size={14} /> : idx + 1}
                                                </div>
                                                <span
                                                    className={`text-[10px] font-bold ${
                                                        isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                                                    }`}
                                                >
                                                    {m.label}
                                                </span>
                                            </div>
                                            {idx < MILESTONES.length - 1 && (
                                                <div
                                                    className={`h-0.5 flex-1 transition-all ${
                                                        idx < currentStageIndex ? 'bg-emerald-600' : 'bg-slate-200'
                                                    }`}
                                                />
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Sub-Navigation Tabs ─────────────────────────────────── */}
                        <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
                            {['Overview', 'Student Details', 'Parent Details', 'Documents', 'Entrance Test', 'Notes & Activities'].map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                                        activeTab === tab
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* ── TAB CONTENT ────────────────────────────────────────── */}

                        {/* TAB 1: OVERVIEW */}
                        {activeTab === 'Overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-blue-600">Application Information</h4>
                                    <div className="space-y-2.5 text-xs">
                                        <div className="flex justify-between py-1 border-b border-slate-100">
                                            <span className="text-slate-600 font-medium">Application No:</span>
                                            <span className="font-mono font-bold text-slate-900">{application?.applicationNo}</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-slate-100">
                                            <span className="text-slate-600 font-medium">Applied On:</span>
                                            <span className="font-bold text-slate-800">{new Date(application?.appliedDate).toLocaleString('en-GB')}</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-slate-100">
                                            <span className="text-slate-600 font-medium">Class Applied:</span>
                                            <span className="font-bold text-blue-600">{application?.targetClassName}</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-slate-100">
                                            <span className="text-slate-600 font-medium">Source:</span>
                                            <span className="font-bold text-slate-800">{application?.source}</span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="text-slate-600 font-medium">Current Status:</span>
                                            <span className="font-bold text-slate-900">{application?.status}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-blue-600">Primary Contact</h4>
                                    <div className="space-y-2.5 text-xs">
                                        <div className="flex justify-between py-1 border-b border-slate-100">
                                            <span className="text-slate-600 font-medium">Father's Name:</span>
                                            <span className="font-bold text-slate-800">{application?.parent?.fatherName}</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-slate-100">
                                            <span className="text-slate-600 font-medium">Mobile Phone:</span>
                                            <span className="font-bold text-slate-800">{application?.parent?.fatherPhone}</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-slate-100">
                                            <span className="text-slate-600 font-medium">Email:</span>
                                            <span className="font-bold text-slate-800">{application?.parent?.fatherEmail || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="text-slate-600 font-medium">City / State:</span>
                                            <span className="font-bold text-slate-800">{application?.parent?.address?.city}, {application?.parent?.address?.state}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: STUDENT DETAILS */}
                        {activeTab === 'Student Details' && (
                            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-wider text-blue-600">Detailed Student Profile</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                                    <div><span className="text-slate-600 font-medium block">First Name:</span> <span className="font-bold text-slate-800">{application?.student?.firstName}</span></div>
                                    <div><span className="text-slate-600 font-medium block">Last Name:</span> <span className="font-bold text-slate-800">{application?.student?.lastName}</span></div>
                                    <div><span className="text-slate-600 font-medium block">Date of Birth:</span> <span className="font-bold text-slate-800">{application?.student?.dateOfBirth}</span></div>
                                    <div><span className="text-slate-600 font-medium block">Gender:</span> <span className="font-bold text-slate-800">{application?.student?.gender}</span></div>
                                    <div><span className="text-slate-600 font-medium block">Category:</span> <span className="font-bold text-slate-800">{application?.student?.category}</span></div>
                                    <div><span className="text-slate-600 font-medium block">Blood Group:</span> <span className="font-bold text-slate-800">{application?.student?.bloodGroup}</span></div>
                                    <div><span className="text-slate-600 font-medium block">Aadhaar Number:</span> <span className="font-bold text-slate-800">{application?.student?.aadhaarNo || 'Not provided'}</span></div>
                                    <div><span className="text-slate-600 font-medium block">Nationality:</span> <span className="font-bold text-slate-800">{application?.student?.nationality || 'Indian'}</span></div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: PARENT DETAILS */}
                        {activeTab === 'Parent Details' && (
                            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-wider text-blue-600">Parent / Guardian Information</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    <div><span className="text-slate-600 font-medium block">Father Name:</span> <span className="font-bold text-slate-800">{application?.parent?.fatherName}</span></div>
                                    <div><span className="text-slate-600 font-medium block">Father Mobile:</span> <span className="font-bold text-slate-800">{application?.parent?.fatherPhone}</span></div>
                                    <div><span className="text-slate-600 font-medium block">Father Occupation:</span> <span className="font-bold text-slate-800">{application?.parent?.fatherOccupation || 'N/A'}</span></div>
                                    <div><span className="text-slate-600 font-medium block">Mother Name:</span> <span className="font-bold text-slate-800">{application?.parent?.motherName || 'N/A'}</span></div>
                                    <div><span className="text-slate-600 font-medium block">Mother Mobile:</span> <span className="font-bold text-slate-800">{application?.parent?.motherPhone || 'N/A'}</span></div>
                                    <div className="sm:col-span-2"><span className="text-slate-600 font-medium block">Residential Address:</span> <span className="font-bold text-slate-800">{application?.parent?.address?.street}, {application?.parent?.address?.city}, {application?.parent?.address?.state} {application?.parent?.address?.pincode}</span></div>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: DOCUMENTS VERIFICATION (Matches UI 2 Step 7) */}
                        {activeTab === 'Documents' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900">Submitted Verification Documents</h4>
                                        <p className="text-xs text-slate-700 font-medium">Review uploaded files and toggle verification status.</p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                                        {application?.documents?.filter((d) => d.status === 'VERIFIED').length} of {application?.documents?.length || 0} Verified
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {application?.documents?.length === 0 ? (
                                        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            <p className="text-xs text-slate-700 font-medium">No documents uploaded with this application.</p>
                                        </div>
                                    ) : (
                                        application?.documents?.map((doc) => {
                                            const isVerified = doc.status === 'VERIFIED';
                                            const isRejected = doc.status === 'REJECTED';

                                            return (
                                                <div
                                                    key={doc._id || doc.type}
                                                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                                                            <FileText size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h5 className="text-xs font-bold text-slate-900">{doc.title}</h5>
                                                                <span
                                                                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                                        isVerified
                                                                            ? 'bg-emerald-100 text-emerald-800'
                                                                            : isRejected
                                                                            ? 'bg-rose-100 text-rose-800'
                                                                            : 'bg-amber-100 text-amber-800'
                                                                    }`}
                                                                >
                                                                    {doc.status}
                                                                </span>
                                                            </div>
                                                            <span className="text-[11px] text-slate-600 font-semibold">Official attachment</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <a
                                                            href={doc.fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                                                            title="Preview Document"
                                                        >
                                                            <Eye size={16} />
                                                        </a>

                                                        <button
                                                            type="button"
                                                            disabled={isVerifyingDoc || isVerified}
                                                            onClick={() => handleDocVerify(doc._id, 'VERIFIED')}
                                                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <Check size={12} />
                                                            Verify
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={isVerifyingDoc || isRejected}
                                                            onClick={() => handleDocVerify(doc._id, 'REJECTED')}
                                                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 disabled:opacity-40 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <Ban size={12} />
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB 5: ENTRANCE TEST */}
                        {activeTab === 'Entrance Test' && (
                            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-blue-600">Entrance Test &amp; Interview</h4>
                                    <button
                                        type="button"
                                        onClick={() => onScheduleTest(application)}
                                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                                    >
                                        Edit / Reschedule
                                    </button>
                                </div>

                                {application?.entranceTest?.status === 'SCHEDULED' || application?.entranceTest?.status === 'COMPLETED' ? (
                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        <div><span className="text-slate-600 font-medium block">Type:</span> <span className="font-bold text-slate-800">{application.entranceTest.type}</span></div>
                                        <div><span className="text-slate-600 font-medium block">Date:</span> <span className="font-bold text-slate-800">{new Date(application.entranceTest.scheduledDate).toLocaleDateString('en-GB')}</span></div>
                                        <div><span className="text-slate-600 font-medium block">Time:</span> <span className="font-bold text-slate-800">{application.entranceTest.scheduledTime}</span></div>
                                        <div><span className="text-slate-600 font-medium block">Venue:</span> <span className="font-bold text-slate-800">{application.entranceTest.venue}</span></div>
                                        <div><span className="text-slate-600 font-medium block">Examiner:</span> <span className="font-bold text-slate-800">{application.entranceTest.examinerName || 'Staff Committee'}</span></div>
                                        <div><span className="text-slate-600 font-medium block">Marks:</span> <span className="font-bold text-blue-600">{application.entranceTest.marksObtained != null ? `${application.entranceTest.marksObtained} / ${application.entranceTest.maxMarks}` : 'Pending evaluation'}</span></div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-700 font-medium">No entrance test or interview scheduled yet.</p>
                                )}
                            </div>
                        )}

                        {/* TAB 6: NOTES & TIMELINE */}
                        {activeTab === 'Notes & Activities' && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-wider text-blue-600">Timeline &amp; Audit Log</h4>
                                <div className="space-y-3 pl-4 border-l-2 border-slate-200">
                                    {application?.timeline?.map((item, idx) => (
                                        <div key={idx} className="relative space-y-1">
                                            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600" />
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-900">{item.stage}</span>
                                                <span className="text-[10px] text-slate-600 font-semibold">{new Date(item.timestamp).toLocaleString('en-GB')}</span>
                                            </div>
                                            <p className="text-xs text-slate-600">{item.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
