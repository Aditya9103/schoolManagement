import React, { useState } from 'react';
import {
    Megaphone, Calendar, Paperclip, Pin, Download, CheckCircle2,
    Search, Filter, ShieldCheck, ArrowLeft, RefreshCw
} from 'lucide-react';
import { useGetNoticesQuery, useAcknowledgeNoticeMutation } from '../../../../store/api/noticeApi';

export default function FamilyNoticesPage() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [selectedNotice, setSelectedNotice] = useState(null);

    const { data: resData, isLoading, refetch } = useGetNoticesQuery({
        search,
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
    });

    const [acknowledgeNotice, { isLoading: isAcknowledging }] = useAcknowledgeNoticeMutation();

    const notices = resData?.data?.notices || [];

    const handleAcknowledge = async (noticeId) => {
        try {
            await acknowledgeNotice(noticeId).unwrap();
            refetch();
        } catch (err) {
            console.error('Failed to acknowledge notice', err);
        }
    };

    return (
        <div className="space-y-5 text-white">
            {/* Header */}
            <div className="rounded-3xl bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-800 p-6 shadow-xl border border-indigo-500/30">
                <div className="flex items-center gap-3.5 mb-2">
                    <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-md">
                        <Megaphone size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black font-display tracking-tight">School Circulars & Notices</h1>
                        <p className="text-blue-200 text-xs mt-0.5">Official administrative, academic, and event announcements</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-2.5 mt-4 pt-3 border-t border-white/10">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-200 pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search notices..."
                            className="w-full pl-9 pr-3 py-2 bg-white/10 backdrop-blur-md rounded-xl text-xs text-white placeholder:text-blue-200/70 border border-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto">
                        {['ALL', 'ACADEMIC', 'EVENT', 'EXAMINATION', 'HOLIDAY'].map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${selectedCategory === cat
                                        ? 'bg-white text-blue-800 shadow-md'
                                        : 'bg-white/10 hover:bg-white/20 text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content List */}
            {isLoading ? (
                <div className="p-16 text-center rounded-3xl bg-slate-800/80 border border-slate-700 space-y-2">
                    <RefreshCw size={24} className="animate-spin text-blue-400 mx-auto" />
                    <p className="text-xs text-slate-400 font-bold">Loading notices...</p>
                </div>
            ) : notices.length === 0 ? (
                <div className="p-16 text-center rounded-3xl bg-slate-800/80 border border-slate-700 space-y-2">
                    <Megaphone size={32} className="text-slate-500 mx-auto" />
                    <p className="text-sm font-bold text-slate-300">No circulars found</p>
                    <p className="text-xs text-slate-500">There are no notices matching your filter criteria.</p>
                </div>
            ) : (
                <div className="space-y-3.5">
                    {notices.map((n) => {
                        const noticeId = n._id || n.id;
                        const dateFormatted = n.publishedAt
                            ? new Date(n.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                            : 'Recently';

                        return (
                            <div
                                key={noticeId}
                                onClick={() => setSelectedNotice(n)}
                                className={`p-5 rounded-2xl bg-slate-800/90 border transition-all cursor-pointer hover:border-blue-500 group ${n.priority === 'URGENT'
                                        ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/20 to-slate-800/90'
                                        : n.isPinned
                                            ? 'border-amber-500/40 bg-gradient-to-r from-amber-950/20 to-slate-800/90'
                                            : 'border-slate-700/80'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                            {n.category}
                                        </span>
                                        {n.isPinned && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                                <Pin size={10} className="fill-amber-400" />
                                                Pinned
                                            </span>
                                        )}
                                        {n.priority === 'URGENT' && (
                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                                Urgent
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                                        <Calendar size={12} className="text-blue-400" />
                                        {dateFormatted}
                                    </span>
                                </div>

                                <h3 className="font-bold text-white group-hover:text-blue-300 transition-colors text-sm">
                                    {n.title}
                                </h3>

                                <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                                    {n.content}
                                </p>

                                <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                                    <span className="text-[11px]">
                                        Target: <strong className="text-slate-300">{n.targetAudience}</strong>
                                    </span>

                                    {n.attachments && n.attachments.length > 0 && (
                                        <span className="inline-flex items-center gap-1 text-blue-400 font-bold text-[11px]">
                                            <Paperclip size={12} />
                                            {n.attachments.length} Attachment
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Notice Full Reader Modal */}
            {selectedNotice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 p-6 space-y-4 max-h-[85vh] overflow-y-auto">
                        <div className="flex items-start justify-between gap-3">
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                                {selectedNotice.category}
                            </span>
                            <button
                                type="button"
                                onClick={() => setSelectedNotice(null)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <h2 className="text-lg font-black text-white">{selectedNotice.title}</h2>

                        <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                            {selectedNotice.content}
                        </div>

                        {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
                            <div className="space-y-2 pt-2">
                                <span className="text-xs font-bold text-slate-300 block">Attached Documents</span>
                                {selectedNotice.attachments.map((att, idx) => (
                                    <div key={idx} className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                                        <span className="font-semibold text-white">{att.fileName}</span>
                                        <a
                                            href={att.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <Download size={13} /> Download
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                            {selectedNotice.acknowledgmentRequired && (
                                <button
                                    type="button"
                                    onClick={() => handleAcknowledge(selectedNotice._id || selectedNotice.id)}
                                    disabled={isAcknowledging}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                    <CheckCircle2 size={14} />
                                    <span>Mark as Acknowledged</span>
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setSelectedNotice(null)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
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
