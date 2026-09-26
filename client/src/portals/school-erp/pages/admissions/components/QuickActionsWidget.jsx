import React from 'react';
import {
    Calendar,
    FileCheck,
    MessageSquare,
    Mail,
    Download,
    Award,
    Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function QuickActionsWidget({
    onScheduleTest,
    onRecordResult,
    onSendMessage,
    onSendEmail,
    onGenerateAdmitCard,
    onDownloadPdf
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 transition-all space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Sparkles size={16} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Quick Actions</h3>
                </div>
            </div>

            <div className="space-y-2">
                <button
                    type="button"
                    onClick={onScheduleTest}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-700 hover:text-blue-700 text-xs font-bold transition-all text-left group cursor-pointer shadow-2xs"
                >
                    <div className="w-7 h-7 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Calendar size={14} />
                    </div>
                    <div className="flex-1">
                        <span className="block font-bold">Schedule Test</span>
                        <span className="block text-[10px] text-slate-600 font-semibold font-medium">Entrance test &amp; venue</span>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={onRecordResult}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/40 text-slate-700 hover:text-purple-700 text-xs font-bold transition-all text-left group cursor-pointer shadow-2xs"
                >
                    <div className="w-7 h-7 rounded-lg bg-purple-100/70 text-purple-700 font-bold flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <Award size={14} />
                    </div>
                    <div className="flex-1">
                        <span className="block font-bold">Record Test Result</span>
                        <span className="block text-[10px] text-slate-600 font-semibold font-medium">Scores and qualification</span>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={onSendMessage}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-all text-left group cursor-pointer shadow-2xs"
                >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-700 font-bold flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <MessageSquare size={14} />
                    </div>
                    <div className="flex-1">
                        <span className="block font-bold">Send Message</span>
                        <span className="block text-[10px] text-slate-600 font-semibold font-medium">SMS or WhatsApp notice</span>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={onSendEmail}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-700 hover:text-indigo-700 text-xs font-bold transition-all text-left group cursor-pointer shadow-2xs"
                >
                    <div className="w-7 h-7 rounded-lg bg-indigo-100/70 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Mail size={14} />
                    </div>
                    <div className="flex-1">
                        <span className="block font-bold">Send Email</span>
                        <span className="block text-[10px] text-slate-600 font-semibold font-medium">Formal decision or letter</span>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={onGenerateAdmitCard}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 text-slate-700 hover:text-amber-700 text-xs font-bold transition-all text-left group cursor-pointer shadow-2xs"
                >
                    <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-800 font-bold flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <FileCheck size={14} />
                    </div>
                    <div className="flex-1">
                        <span className="block font-bold">Generate Admit Card</span>
                        <span className="block text-[10px] text-slate-600 font-semibold font-medium">Entrance hall ticket</span>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={onDownloadPdf}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all text-left group cursor-pointer shadow-2xs"
                >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                        <Download size={14} />
                    </div>
                    <div className="flex-1">
                        <span className="block font-bold">Download Application</span>
                        <span className="block text-[10px] text-slate-600 font-semibold font-medium">Full summary PDF</span>
                    </div>
                </button>
            </div>
        </div>
    );
}
