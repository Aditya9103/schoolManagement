import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, BellRing, Users, BookOpen } from 'lucide-react';

const DEFAULT_ANNOUNCEMENTS = [
    {
        title: 'Annual Sports Day 2026',
        desc: "We're excited to announce our Annual Sports Day scheduled for next week.",
        time: '2h ago',
        icon: Trophy,
        iconBg: 'bg-rose-50 text-rose-600 border-rose-100'
    },
    {
        title: 'Fee Payment Reminder',
        desc: 'Last date for Q3 fee payment is 30 September without late fee.',
        time: '1d ago',
        icon: BellRing,
        iconBg: 'bg-amber-50 text-amber-600 border-amber-100'
    },
    {
        title: 'PTM Schedule',
        desc: 'Parent-Teacher Meeting scheduled for coming Friday.',
        time: '2d ago',
        icon: Users,
        iconBg: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    {
        title: 'Library New Books',
        desc: 'New collection of reference books available in catalog.',
        time: '3d ago',
        icon: BookOpen,
        iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    }
];

export default function AnnouncementsCard({ data }) {
    const navigate = useNavigate();
    const rawAnnouncements = data && data.length > 0 ? data : DEFAULT_ANNOUNCEMENTS;
    const announcements = rawAnnouncements.map((item, idx) => ({
        ...item,
        time: item.time || item.timeAgo || `${idx + 1}d ago`,
        iconBg: item.iconBg || (idx === 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : idx === 1 ? 'bg-amber-50 text-amber-600 border-amber-100' : idx === 2 ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100')
    }));

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-4 sm:p-5 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight whitespace-nowrap">
                    Announcements
                </h3>
                <button
                    onClick={() => navigate('/school/notices')}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline whitespace-nowrap"
                >
                    View All
                </button>
            </div>

            <div className="space-y-2 flex-1">
                {announcements.slice(0, 4).map((item, idx) => {
                    const Icon = item.icon || BellRing;
                    const bgStyle = item.iconBg || 'bg-blue-50 text-blue-600 border-blue-100';

                    return (
                        <div
                            key={item.id || item.title || idx}
                            className="flex items-start gap-2.5 p-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                            onClick={() => navigate('/school/notices')}
                        >
                            <div className={`p-1.5 rounded-lg border ${bgStyle}shrink-0 mt-0.5 group-hover:scale-105 transition-transform`}>
                                <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                    <h4 className="text-[11px] font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </h4>
                                    <span className="text-[9px] text-slate-600 font-semibold font-medium shrink-0">
                                        {item.time}
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-700 font-semibold line-clamp-1 leading-tight mt-0.5">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
