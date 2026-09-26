import React, { useState, useRef } from 'react';
import {
    FileText,
    Download,
    Eye,
    CheckCircle2,
    Clock,
    XCircle,
    Plus,
    UploadCloud,
    Loader2,
    ShieldCheck,
    FileCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useVerifyDocumentMutation } from '../../../../../store/api/admissionsApi';
import { useUploadDocumentMutation } from '../../../../../store/api/uploadApi';

const FORMAT_TYPE_LABEL = {
    BIRTH_CERTIFICATE: 'Birth Certificate',
    AADHAAR_CARD: 'Aadhaar Card',
    AADHAAR: 'Aadhaar Card',
    PREVIOUS_TC: 'Previous School TC',
    TRANSFER_CERTIFICATE: 'Transfer Certificate',
    PREVIOUS_MARKSHEET: 'Previous Marksheet',
    MARKSHEET: 'Academic Marksheet',
    STUDENT_PHOTO: 'Passport Photo',
    PHOTO: 'Student Photo',
    ADDRESS_PROOF: 'Address Proof',
    CASTE_CERTIFICATE: 'Caste Certificate',
    OTHER: 'Other Document'
};

export default function DocumentsTableTab({ applicationId, documents = [], onDocumentUpdated }) {
    const [verifyDocument, { isLoading: isVerifying }] = useVerifyDocumentMutation();
    const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();
    const [previewDoc, setPreviewDoc] = useState(null);
    const fileInputRef = useRef(null);

    const handleVerify = async (docId, newStatus) => {
        try {
            await verifyDocument({
                id: applicationId,
                docId,
                status: newStatus,
                remarks: newStatus === 'VERIFIED' ? 'Verified by School Admin' : 'Document rejected, please re-upload'
            }).unwrap();
            toast.success(`Document marked as ${newStatus}`);
            if (onDocumentUpdated) onDocumentUpdated();
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update document status');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const data = new FormData();
            data.append('file', file);
            data.append('folder', 'admissions/documents');

            toast.loading('Uploading document...', { id: 'doc-upload' });
            const res = await uploadDocument(data).unwrap();
            const remoteUrl = res?.data?.url || res?.url;

            toast.success('Document uploaded successfully!', { id: 'doc-upload' });
            if (onDocumentUpdated) onDocumentUpdated();
        } catch (err) {
            toast.error('Upload failed, please try again', { id: 'doc-upload' });
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <FileCheck size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-900">
                            Documents Submitted ({documents.length})
                        </h3>
                        <p className="text-[11px] text-slate-600 font-semibold">
                            Verification status of certificates and identity records
                        </p>
                    </div>
                </div>

                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 size={13} className="animate-spin" /> Uploading...
                            </>
                        ) : (
                            <>
                                <Plus size={14} /> Upload Document
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Documents Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr className="border-b border-slate-200/80 bg-slate-50/90 text-[11px] font-bold text-slate-700 font-extrabold uppercase tracking-wider">
                            <th className="py-3 px-4 w-12 text-center">#</th>
                            <th className="py-3 px-4">Document Type</th>
                            <th className="py-3 px-4">File Name</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4">Uploaded On</th>
                            <th className="py-3 px-4">Verified On</th>
                            <th className="py-3 px-4">Remarks</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {documents.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-8 text-center text-slate-600 font-medium">
                                    No documents attached yet.
                                </td>
                            </tr>
                        ) : (
                            documents.map((doc, idx) => {
                                const isVerified = doc.status === 'VERIFIED';
                                const isPending = doc.status === 'PENDING';
                                const isRejected = doc.status === 'REJECTED';

                                const typeTitle =
                                    FORMAT_TYPE_LABEL[doc.type] || doc.title || doc.type || 'Document';

                                const fileName = doc.uploadedFileName || `${doc.type || 'document'}.pdf`;

                                return (
                                    <tr key={doc._id || idx} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3.5 px-4 text-center font-bold text-slate-600 font-medium">
                                            {idx + 1}
                                        </td>

                                        <td className="py-3.5 px-4 font-bold text-slate-900">
                                            {typeTitle}
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                    <FileText size={15} />
                                                </div>
                                                <div className="truncate max-w-[160px]">
                                                    <span className="font-semibold text-slate-800 truncate block">
                                                        {fileName}
                                                    </span>
                                                    {doc.fileSize && (
                                                        <span className="text-[10px] text-slate-600 font-semibold">
                                                            {doc.fileSize}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-4 text-center">
                                            {isVerified && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                                                    <CheckCircle2 size={12} /> Verified
                                                </span>
                                            )}
                                            {isPending && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
                                                    <Clock size={12} /> Pending
                                                </span>
                                            )}
                                            {isRejected && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200">
                                                    <XCircle size={12} /> Rejected
                                                </span>
                                            )}
                                        </td>

                                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                                            {doc.uploadedAt
                                                ? new Date(doc.uploadedAt).toLocaleDateString('en-IN', {
                                                      day: 'numeric',
                                                      month: 'short',
                                                      year: 'numeric',
                                                  })
                                                : '23 Sep 2026'}
                                        </td>

                                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                                            {doc.verifiedAt
                                                ? new Date(doc.verifiedAt).toLocaleDateString('en-IN', {
                                                      day: 'numeric',
                                                      month: 'short',
                                                      year: 'numeric',
                                                  })
                                                : '-'}
                                        </td>

                                        <td className="py-3.5 px-4 text-slate-500 max-w-[140px] truncate">
                                            {doc.remarks || (isVerified ? 'Verified by Admin' : '-')}
                                        </td>

                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {doc.fileUrl && (
                                                    <a
                                                        href={doc.fileUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                                                        title="View / Download"
                                                    >
                                                        <Eye size={13} />
                                                    </a>
                                                )}

                                                {!isVerified && (
                                                    <button
                                                        type="button"
                                                        disabled={isVerifying}
                                                        onClick={() => handleVerify(doc._id, 'VERIFIED')}
                                                        className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200 transition-colors cursor-pointer"
                                                    >
                                                        Verify
                                                    </button>
                                                )}

                                                {isVerified && (
                                                    <button
                                                        type="button"
                                                        disabled={isVerifying}
                                                        onClick={() => handleVerify(doc._id, 'REJECTED')}
                                                        className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold border border-rose-200 transition-colors cursor-pointer"
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
