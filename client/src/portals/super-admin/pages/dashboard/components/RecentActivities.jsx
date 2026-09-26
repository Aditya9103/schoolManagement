import React from 'react';
import { School, RefreshCw, UserPlus, IndianRupee, Sliders, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ACTIVITIES = [
    {
        id: 1,
        title: 'New school onboarded',
        desc: 'Sunrise Public School, Jaipur',
        time: '2 min ago',
        Icon: School,
        iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
        id: 2,
        title: 'Subscription renewed',
        desc: 'Maple Leaf School, Delhi',
        time: '18 min ago',
        Icon: RefreshCw,
        iconBg: 'bg-blue-50 text-blue-600',
    },
    {
        id: 3,
        title: 'New user added',
        desc: 'Rohit Sharma (Teacher)',
        time: '45 min ago',
        Icon: UserPlus,
        iconBg: 'bg-sky-50 text-sky-600',
    },
    {
        id: 4,
        title: 'Payment received',
        desc: '₹1,20,000 from Greenwood School',
        time: '1 hour ago',
        Icon: IndianRupee,
        iconBg: 'bg-green-50 text-green-600',
    },
    {
        id: 5,
        title: 'Feature enabled',
        desc: 'Transport Module - Riverdale School',
        time: '2 hours ago',
        Icon: Sliders,
        iconBg: 'bg-purple-50 text-purple-600',
    },
    {
        id: 6,
        title: 'Support ticket resolved',
        desc: '#TKT-4582 - Login issue',
        time: '3 hours ago',
        Icon: CheckCircle2,
        iconBg: 'bg-teal-50 text-teal-600',
    },
];

export default function RecentActivities() {
    return (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 border-b border-slate-200/80 pb-3">
                <h3 className="text-base font-bold text-slate-900 font-display">Recent Activities</h3>
                <Link to="/super-admin/activity" className="text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors">
                    View All →
                </Link>
            </div>

            <div className="space-y-3 divide-y divide-slate-200/80">
                {ACTIVITIES.map((act) => {
                    const { Icon, iconBg } = act;
                    return (
                        <div key={act.id} className="pt-2.5 first:pt-0 flex items-start gap-3">
                            <div className={`h-8 w-8 rounded-xl ${iconBg}flex items-center justify-center shrink-0 shadow-2xs mt-0.5 border border-black/5`}>
                                <Icon size={15} strokeWidth={2.4} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold text-slate-900 truncate">{act.title}</p>
                                    <span className="text-[11px] font-semibold text-slate-700 shrink-0">{act.time}</span>
                                </div>
                                <p className="text-xs text-slate-700 font-medium truncate mt-0.5">{act.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
