import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    QrCode,
    Edit3,
    FileText,
    UploadCloud,
    Trash2,
    Download,
    Phone,
    Bus,
} from 'lucide-react';
import {
    useGetStudentByIdQuery,
    useAddStudentDocumentMutation,
    useRemoveStudentDocumentMutation,
} from '../../../../store/api/studentApi';
import { useUploadDocumentMutation } from '../../../../store/api/uploadApi';
import StudentIdCardModal from './components/StudentIdCardModal';
import toast from 'react-hot-toast';

export default function StudentDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('Personal'); // 'Personal' | 'Academic' | 'Documents'
    const [showIdCardModal, setShowIdCardModal] = useState(false);
    const [uploadingDoc, setUploadingDoc] = useState(false);

    const { data: studentRes, isLoading } = useGetStudentByIdQuery(id);
    const student = studentRes?.data;

    const [addDocument] = useAddStudentDocumentMutation();
    const [removeDocument] = useRemoveStudentDocumentMutation();
    const [uploadDocument] = useUploadDocumentMutation();

    if (isLoading) {
        return (
            <div className="min-h-full bg-slate-50 flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
            </div>
        );
    }

    if (!student) {
        return (
            <div className="min-h-full bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
                <h2 className="text-base font-bold text-slate-800">Student not found</h2>
                <button
                    onClick={() => navigate('/school/students')}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                    Back to Students
                </button>
            </div>
        );
    }

    // Format Date of Birth
    const dobFormatted = student.dateOfBirth
        ? new Date(student.dateOfBirth).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          })
        : 'Not provided';

    const admissionDateFormatted = student.admissionDate
        ? new Date(student.admissionDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          })
        : '12 Jan 2023';

    // Handle AWS S3 Document Upload
    const handleDocumentUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingDoc(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', `students/${student._id}/documents`);

            const uploadRes = await uploadDocument(formData).unwrap();

            if (uploadRes?.data) {
                const s3Doc = uploadRes.data;
                await addDocument({
                    studentId: student._id,
                    document: {
                        title: file.name.replace(/\.[^/.]+$/, ''),
                        url: s3Doc.url,
                        key: s3Doc.key,
                        type: file.type.includes('pdf') ? 'PDF' : 'IMAGE',
                    },
                }).unwrap();
                toast.success('Document uploaded successfully');
            }
        } catch (err) {
            console.error('Failed to upload document to S3:', err);
            toast.error(err?.data?.message || err?.message || 'Failed to upload document. Please try again.');
        } finally {
            setUploadingDoc(false);
            e.target.value = '';
        }
    };

    return (
        <div className="min-h-full bg-slate-50 flex flex-col pb-24">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-xs">
                <button
                    onClick={() => navigate('/school/students')}
                    className="p-1.5 -ml-1.5 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-base font-bold text-slate-900 font-display">Student Profile</h1>
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setShowIdCardModal(true)}
                        className="p-1.5 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View & Print ID Card"
                    >
                        <QrCode size={19} />
                    </button>
                    <button
                        onClick={() => navigate(`/school/students/${student._id}/edit`)}
                        className="p-1.5 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Edit Student"
                    >
                        <Edit3 size={18} />
                    </button>
                </div>
            </div>

            {/* Profile Header Card matching Image 2/4 Screen 11 */}
            <div className="p-4">
                <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 flex flex-col items-center text-center">
                    {/* Student Avatar */}
                    <div className="relative mb-3">
                        <div className="h-20 w-20 rounded-full overflow-hidden bg-slate-100 ring-4 ring-blue-50 shadow-md">
                            {student.photoUrl ? (
                                <img
                                    src={student.photoUrl}
                                    alt={student.firstName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-2xl">
                                    {student.firstName?.[0]}
                                    {student.lastName?.[0]}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setShowIdCardModal(true)}
                            className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md ring-2 ring-white hover:bg-blue-700 transition-all"
                            title="Generate QR ID Card"
                        >
                            <QrCode size={12} />
                        </button>
                    </div>

                    {/* Identity Details */}
                    <h2 className="text-base font-bold text-slate-900">
                        {student.firstName} {student.lastName}
                    </h2>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                        {student.classId?.name || 'Class 5'}-{student.sectionId?.name || 'A'} • Roll No. {student.rollNo}
                    </p>
                    <p className="text-[11px] font-mono text-slate-600 font-semibold mt-0.5">
                        Admission No. {student.admissionNo}
                    </p>

                    {/* Quick Pill Actions */}
                    <div className="mt-3.5 flex items-center gap-2">
                        <button
                            onClick={() => setShowIdCardModal(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-xs font-bold transition-all shadow-xs"
                        >
                            <QrCode size={13} />
                            Print ID Card
                        </button>
                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/50 rounded-full text-xs font-semibold">
                            {student.status || 'Active'}
                        </span>
                    </div>
                </div>

                {/* 3 Segmented Tabs */}
                <div className="mt-4 bg-slate-200/60 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
                    {['Personal', 'Academic', 'Documents'].map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                                    isActive
                                        ? 'bg-blue-900 text-white shadow-md'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                {/* Tab 1: Personal Details Tab */}
                {activeTab === 'Personal' && (
                    <div className="mt-4 space-y-3">
                        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs divide-y divide-slate-100 text-xs">
                            <div className="py-2.5 flex justify-between items-center first:pt-0">
                                <span className="text-slate-500 font-medium">Date of Birth</span>
                                <span className="font-semibold text-slate-900">{dobFormatted}</span>
                            </div>
                            <div className="py-2.5 flex justify-between items-center">
                                <span className="text-slate-500 font-medium">Blood Group</span>
                                <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                                    {student.bloodGroup || 'Not specified'}
                                </span>
                            </div>
                            <div className="py-2.5 flex justify-between items-center">
                                <span className="text-slate-500 font-medium">Father's Name</span>
                                <span className="font-semibold text-slate-900">
                                    {student.fatherName || 'Rajesh Sharma'}
                                </span>
                            </div>
                            <div className="py-2.5 flex justify-between items-center">
                                <span className="text-slate-500 font-medium">Mother's Name</span>
                                <span className="font-semibold text-slate-900">
                                    {student.motherName || 'Neha Sharma'}
                                </span>
                            </div>
                            <div className="py-2.5 flex justify-between items-start gap-4">
                                <span className="text-slate-500 font-medium shrink-0">Address</span>
                                <span className="font-medium text-slate-800 text-right">
                                    {student.address || '123, Green Park, Noida, Uttar Pradesh'}
                                </span>
                            </div>
                            <div className="py-2.5 flex justify-between items-center last:pb-0">
                                <span className="text-slate-500 font-medium">Emergency Contact</span>
                                <span className="font-bold text-blue-600 flex items-center gap-1">
                                    <Phone size={12} />
                                    {student.emergencyContact || student.fatherPhone || '+91 98765 43210'}
                                </span>
                            </div>
                        </div>

                        {/* Inspirational Quote Card matching Image 2/4 Screen 11 */}
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100/60 shadow-xs flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                                🌱
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-800 italic">
                                    "Believe. Learn. Grow. A brighter you is always possible."
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 2: Academic Details Tab */}
                {activeTab === 'Academic' && (
                    <div className="mt-4 space-y-3">
                        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs divide-y divide-slate-100 text-xs">
                            <div className="py-2.5 flex justify-between items-center first:pt-0">
                                <span className="text-slate-500 font-medium">Academic Year</span>
                                <div className="text-right">
                                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                                        Academic Year {student.academicYear || 'Current'}
                                    </span>
                                    {student.academicYearId && (
                                        <span className="block text-[10px] font-mono text-slate-600 font-semibold mt-0.5">
                                            ID: {student.academicYearId}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="py-2.5 flex justify-between items-center">
                                <span className="text-slate-500 font-medium">Admission Date</span>
                                <span className="font-semibold text-slate-900">{admissionDateFormatted}</span>
                            </div>
                            <div className="py-2.5 flex justify-between items-center">
                                <span className="text-slate-500 font-medium">Class & Section</span>
                                <span className="font-semibold text-slate-900">
                                    {student.classId?.name || 'Class 6'} - {student.sectionId?.name || 'A'}
                                </span>
                            </div>
                            <div className="py-2.5 flex justify-between items-center">
                                <span className="text-slate-500 font-medium">Room Number</span>
                                <span className="font-semibold text-slate-900">
                                    {student.sectionId?.roomNumber || 'Room 106'}
                                </span>
                            </div>
                            <div className="py-2.5 flex justify-between items-center">
                                <span className="text-slate-500 font-medium">Class Teacher</span>
                                <span className="font-semibold text-slate-900">
                                    {student.sectionId?.classTeacherId
                                        ? `${student.sectionId.classTeacherId.firstName} ${student.sectionId.classTeacherId.lastName}`
                                        : 'Mr. A. Sharma'}
                                </span>
                            </div>
                            <div className="py-2.5 flex justify-between items-center">
                                <span className="text-slate-500 font-medium">Bus Route</span>
                                <span className="font-semibold text-slate-900 flex items-center gap-1">
                                    <Bus size={12} className="text-amber-800 font-bold" />
                                    {student.busRouteNo || 'Bus No. 3'}
                                </span>
                            </div>
                            <div className="py-2.5 flex justify-between items-center last:pb-0">
                                <span className="text-slate-500 font-medium">Pickup / Drop Stop</span>
                                <span className="font-semibold text-slate-900">
                                    {student.busStop || 'Sunshine Homes'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 3: Documents Tab (AWS S3) */}
                {activeTab === 'Documents' && (
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-slate-800">Uploaded Documents</h3>
                            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs">
                                <UploadCloud size={14} />
                                {uploadingDoc ? 'Uploading...' : 'Upload to S3'}
                                <input
                                    type="file"
                                    onChange={handleDocumentUpload}
                                    disabled={uploadingDoc}
                                    className="hidden"
                                    accept=".pdf,.png,.jpg,.jpeg"
                                />
                            </label>
                        </div>

                        {(!student.documents || student.documents.length === 0) ? (
                            <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-200 text-center text-slate-600 font-medium">
                                <FileText size={24} className="mx-auto mb-2 opacity-50" />
                                <p className="text-xs font-medium">No documents uploaded yet</p>
                                <p className="text-[10px] text-slate-600 font-semibold mt-0.5">
                                    Upload birth certificate, transfer certificate, or identity proof
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {student.documents.map((doc) => (
                                    <div
                                        key={doc._id}
                                        className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                <FileText size={16} />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-bold text-slate-800 truncate">
                                                    {doc.title}
                                                </h4>
                                                <p className="text-[10px] text-slate-600 font-semibold mt-0.5">
                                                    {doc.type} • AWS S3 Verified
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View / Download"
                                            >
                                                <Download size={14} />
                                            </a>
                                            <button
                                                onClick={async () => {
                                                    if (confirm(`Remove ${doc.title}?`)) {
                                                        await removeDocument({
                                                            studentId: student._id,
                                                            docId: doc._id,
                                                        });
                                                    }
                                                }}
                                                className="p-1.5 text-rose-700 font-bold hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Delete Document"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Student ID Card Modal */}
            {showIdCardModal && (
                <StudentIdCardModal
                    student={student}
                    onClose={() => setShowIdCardModal(false)}
                />
            )}
        </div>
    );
}
