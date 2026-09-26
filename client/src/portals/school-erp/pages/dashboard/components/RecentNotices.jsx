import React from 'react';
import { AlertCircle } from 'lucide-react';

const NOTICES = [
    { title: 'Annual Sports Day — 25 Sep', category: 'Event', time: '2 hr ago' },
    { title: 'Parent-Teacher Meeting scheduled for Oct 1', category: 'Important', time: '5 hr ago' },
    { title: 'Fee payment reminder for Class 10', category: 'Finance', time: '1 day ago' },
];

const CAT_COLORS = {
    Event: 'text-blue-500',
    Important: 'text-red-500',
    Finance: 'text-amber-500',
};

export default function RecentNotices() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Recent Notices</h2>
            <div className="space-y-2.5">
                {NOTICES.map((n) => (
                    <div key={n.title} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                        <AlertCircle size={15} className={`flex-shrink-0 ${CAT_COLORS[n.category] || 'text-slate-400'}`} />
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">{n.title}</p>
                            <p className="text-[10px] text-slate-600 font-semibold">{n.category} · {n.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
