import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    UserPlus,
    Users,
    BookOpen,
    CreditCard,
    CheckSquare,
    Send,
    BarChart3,
    Mail,
    Calendar,
    FileEdit,
    CalendarCheck2,
    ShieldCheck
} from 'lucide-react';

const ACTIONS = [
    {
        label: 'Add Student',
        icon: UserPlus,
        to: '/school/students/new',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        borderColor: 'border-blue-100',
        hoverBg: 'hover:bg-blue-100/70'
    },
    {
        label: 'Add Teacher',
        icon: Users,
        to: '/school/teachers',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600',
        borderColor: 'border-emerald-100',
        hoverBg: 'hover:bg-emerald-100/70'
    },
    {
        label: 'Create Class',
        icon: BookOpen,
        to: '/school/classes',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
        borderColor: 'border-purple-100',
        hoverBg: 'hover:bg-purple-100/70'
    },
    {
        label: 'Collect Fees',
        icon: CreditCard,
        to: '/school/fees',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-600',
        borderColor: 'border-amber-100',
        hoverBg: 'hover:bg-amber-100/70'
    },
    {
        label: 'Mark Attendance',
        icon: CheckSquare,
        to: '/school/attendance',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600',
        borderColor: 'border-emerald-100',
        hoverBg: 'hover:bg-emerald-100/70'
    },
    {
        label: 'Create Notice',
        icon: Send,
        to: '/school/notices',
        bgColor: 'bg-sky-50',
        textColor: 'text-sky-600',
        borderColor: 'border-sky-100',
        hoverBg: 'hover:bg-sky-100/70'
    },
    {
        label: 'Generate Report',
        icon: BarChart3,
        to: '/school/exams',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
        borderColor: 'border-purple-100',
        hoverBg: 'hover:bg-purple-100/70'
    },
    {
        label: 'Send Message',
        icon: Mail,
        to: '/school/communication',
        bgColor: 'bg-rose-50',
        textColor: 'text-rose-500',
        borderColor: 'border-rose-100',
        hoverBg: 'hover:bg-rose-100/70'
    },
    {
        label: 'Manage Timetable',
        icon: Calendar,
        to: '/school/classes/timetable',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-600',
        borderColor: 'border-amber-100',
        hoverBg: 'hover:bg-amber-100/70'
    },
    {
        label: 'Add Assignment',
        icon: FileEdit,
        to: '/school/assignments',
        bgColor: 'bg-teal-50',
        textColor: 'text-teal-600',
        borderColor: 'border-teal-100',
        hoverBg: 'hover:bg-teal-100/70'
    },
    {
        label: 'Create Event',
        icon: CalendarCheck2,
        to: '/school/events',
        bgColor: 'bg-pink-50',
        textColor: 'text-pink-600',
        borderColor: 'border-pink-100',
        hoverBg: 'hover:bg-pink-100/70'
    },
    {
        label: 'Visitor Entry',
        icon: ShieldCheck,
        to: '/school/visitors',
        bgColor: 'bg-cyan-50',
        textColor: 'text-cyan-600',
        borderColor: 'border-cyan-100',
        hoverBg: 'hover:bg-cyan-100/70'
    }
];

export default function QuickActionsGrid() {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-4 sm:p-5 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight whitespace-nowrap">
                    Quick Actions
                </h3>
                <button
                    type="button"
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline whitespace-nowrap"
                >
                    Customize
                </button>
            </div>

            <div className="grid grid-cols-4 gap-2 flex-1">
                {ACTIONS.map((action) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={action.label}
                            type="button"
                            onClick={() => navigate(action.to)}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl border ${action.borderColor}${action.bgColor}${action.hoverBg}transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 text-center group`}
                        >
                            <div className={`p-1.5 rounded-lg ${action.textColor}mb-1 transition-transform group-hover:scale-110`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-700 group-hover:text-slate-900 leading-tight line-clamp-1">
                                {action.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
