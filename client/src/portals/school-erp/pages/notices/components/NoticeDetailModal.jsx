import React from 'react';
import {
    X, Megaphone, Calendar, Clock, Pin, Download, CheckCircle2,
    Paperclip, Users, AlertTriangle, ShieldCheck, Printer
} from 'lucide-react';
import { useAcknowledgeNoticeMutation } from '../../../../../store/api/noticeApi';

export default function NoticeDetailModal({ isOpen, onClose, notice, onUpdated }) {
    if (!isOpen || !notice) return null;

    const [acknowledgeNotice, { isLoading: isAcknowledging }] = useAcknowledgeNoticeMutation();

    const handleAcknowledge = async () => {
        try {
            await acknowledgeNotice(notice._id || notice.id).unwrap();
            if (onUpdated) onUpdated();
        } catch (err) {
            console.error('Failed to acknowledge notice', err);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const publishedDate = notice.publishedAt
        ? new Date(notice.publishedAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : 'Recently';

    const priorityColors = {
        URGENT: 'bg-rose-50 text-rose-700 border-rose-300',
        HIGH: 'bg-amber-50 text-amber-700 border-amber-300',
        NORMAL: 'bg-blue-50 text-blue-700 border-blue-200',
        LOW: 'bg-slate-50 text-slate-700 border-slate-200',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
                {/* Header */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border uppercase tracking-wider ${
                            priorityColors[notice.priority] || priorityColors.NORMAL
                        }`}>
                            {notice.priority} Priority
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                            {notice.category}
                        </span>
                        {notice.isPinned && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                                <Pin size={11} className="fill-amber-500 text-amber-500" />
                                Pinned
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 cursor-pointer"
                            title="Print Notice"
                        >
                            <Printer size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 font-display tracking-tight leading-snug">
                            {notice.title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-semibold mt-2.5 pb-4 border-b border-slate-100">
                            <span className="flex items-center gap-1 text-slate-700">
                                <Calendar size={13} className="text-blue-600" />
                                Published {publishedDate}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Users size={13} className="text-indigo-600" />
                                Target Audience: <strong className="text-slate-800">{notice.targetAudience}</strong>
                            </span>
                            {notice.publishedBy && (
                                <>
                                    <span>•</span>
                                    <span>
                                        By: <strong className="text-slate-800">{notice.publishedBy.firstName} {notice.publishedBy.lastName}</strong>
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Circular Body */}
                    <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80 font-medium">
                        {notice.content}
                    </div>

                    {/* Attachments */}
                    {notice.attachments && notice.attachments.length > 0 && (
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <Paperclip size={14} className="text-blue-600" />
                                Official Attachments & Documents
                            </span>
                            <div className="space-y-1.5">
                                {notice.attachments.map((att, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 font-bold">
                                                PDF
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{att.fileName}</p>
                                                <p className="text-[11px] text-slate-400">{att.fileSize || '1.5 MB'}</p>
                                            </div>
                                        </div>
                                        <a
                                            href={att.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <Download size={13} />
                                            Download
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Acknowledgment status */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="text-slate-500 font-medium">
                            {notice.acknowledgmentRequired ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
                                    <ShieldCheck size={14} />
                                    {notice.acknowledgedBy?.length || 0} Verified Read Acknowledgments
                                </span>
                            ) : (
                                <span className="text-slate-400">Read acknowledgment not required</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {notice.acknowledgmentRequired && (
                                <button
                                    type="button"
                                    onClick={handleAcknowledge}
                                    disabled={isAcknowledging}
                                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                    <CheckCircle2 size={14} />
                                    <span>Acknowledge Notice</span>
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
