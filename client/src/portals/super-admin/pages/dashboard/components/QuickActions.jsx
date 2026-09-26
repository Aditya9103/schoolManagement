import React from 'react';
import { PlusCircle, Users, BarChart3, Megaphone, CreditCard, Headphones, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
    const navigate = useNavigate();

    const actions = [
        { label: 'Add New School', Icon: PlusCircle, bg: 'bg-blue-50 text-blue-600', to: '/super-admin/schools/new' },
        { label: 'Manage Users', Icon: Users, bg: 'bg-emerald-50 text-emerald-600', to: '/super-admin/users' },
        { label: 'View Reports', Icon: BarChart3, bg: 'bg-purple-50 text-purple-600', to: '/super-admin/reports' },
        { label: 'Send Announcement', Icon: Megaphone, bg: 'bg-amber-50 text-amber-600', to: '/super-admin/announcements' },
        { label: 'Manage Subscriptions', Icon: CreditCard, bg: 'bg-rose-50 text-rose-600', to: '/super-admin/plans' },
        { label: 'Support Tickets', Icon: Headphones, bg: 'bg-teal-50 text-teal-600', to: '/super-admin/support' },
    ];

    return (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 border-b border-slate-200/80 pb-3">
                <h3 className="text-base font-bold text-slate-900 font-display">Quick Actions</h3>
                <span className="text-xs font-bold text-slate-600 cursor-pointer hover:text-slate-900 transition-colors">
                    Customize
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {actions.map((act) => {
                    const { label, Icon, bg, to } = act;
                    return (
                        <button
                            key={label}
                            onClick={() => navigate(to)}
                            className="p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xs bg-white hover:bg-blue-50/20 transition-all flex flex-col items-center text-center group active:scale-98 cursor-pointer"
                        >
                            <div className={`h-10 w-10 rounded-xl ${bg}flex items-center justify-center mb-2 shadow-2xs group-hover:scale-110 transition-transform border border-black/5`}>
                                <Icon size={18} strokeWidth={2.4} />
                            </div>
                            <span className="text-xs font-bold text-slate-800 leading-tight">
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Grow Your Impact Banner matching Image 1 */}
            <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white flex items-center justify-between shadow-sm">
                <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        👑 Grow Your Impact
                    </p>
                    <p className="text-[10px] text-blue-200 truncate mt-0.5">
                        Add more schools, unlock premium modules and scale your platform.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/super-admin/schools/new')}
                    className="h-7 w-7 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center shrink-0 transition-colors"
                >
                    <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
}
