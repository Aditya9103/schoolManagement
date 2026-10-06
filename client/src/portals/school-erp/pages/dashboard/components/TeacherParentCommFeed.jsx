import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Phone, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TeacherParentCommFeed({ communications = [], isLoading }) {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs animate-pulse">
                <div className="h-4 w-36 bg-slate-200 rounded mb-2" />
                <div className="h-3 w-48 bg-slate-100 rounded mb-4" />
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-slate-50 border border-slate-100 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    const items = communications || [];

    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-bold text-slate-900">Parent Communication</h2>
                    <button
                        onClick={() => navigate('/school/messages')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                        Inbox
                    </button>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                    Authorized parent contacts for your assigned classes
                </p>

                {items.length === 0 ? (
                    <div className="py-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <MessageSquare size={24} className="mx-auto text-slate-400 mb-1.5" />
                        <p className="text-xs font-bold text-slate-700">No recent communications</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Use the messaging center to contact authorized parents.
                        </p>
                        <button
                            onClick={() => navigate('/school/messages')}
                            className="mt-3 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                            Open Messaging
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {items.map((msg, i) => (
                            <div
                                key={i}
                                className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-slate-900">{msg.parent}</span>
                                    <span className="text-[10px] text-slate-500">{msg.student}</span>
                                </div>
                                <p className="text-slate-600 text-[11px] mb-2 truncate">{msg.note}</p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            toast.success(`Opening conversation with ${msg.parent}`);
                                            navigate('/school/messages');
                                        }}
                                        className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                                    >
                                        <Send size={10} /> Message
                                    </button>
                                    <button
                                        onClick={() =>
                                            toast.success(`Logged communication call with ${msg.parent}`)
                                        }
                                        className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                                    >
                                        <Phone size={10} /> Call
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <p className="text-[11px] text-slate-500 mt-3 italic">
                * All communication is logged in central compliance CommunicationLog.
            </p>
        </div>
    );
}
