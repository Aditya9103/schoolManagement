import React from 'react';
import {
    GraduationCap,
    UserCheck,
    Users,
    Coins,
    CalendarCheck,
    Star,
    ArrowUpRight,
} from 'lucide-react';

export default function StatsSummaryRow({ stats }) {
    const totalStudents = stats?.totalStudents !== undefined ? stats.totalStudents.toLocaleString('en-IN') : '0';
    const totalTeachers = stats?.totalTeachers !== undefined ? stats.totalTeachers.toLocaleString('en-IN') : '0';
    const totalStaff = stats?.totalStaff !== undefined ? stats.totalStaff.toLocaleString('en-IN') : '0';
    const feesCollected = stats?.feesCollectedFormatted || '₹ 0';
    const attendanceRate = stats?.attendanceRate || '0%';
    const parentSatisfaction = stats?.parentSatisfaction || '5.0';
    const parentReviews = stats?.parentReviewCount || 0;

    const cards = [
        {
            title: 'Total Students',
            value: totalStudents,
            change: 'Live',
            subtext: 'Active enrolled',
            Icon: GraduationCap,
            iconBg: 'bg-blue-100 text-blue-600',
            trendBg: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        },
        {
            title: 'Total Teachers',
            value: totalTeachers,
            change: 'Live',
            subtext: 'Faculty members',
            Icon: UserCheck,
            iconBg: 'bg-emerald-100 text-emerald-600',
            trendBg: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        },
        {
            title: 'Total Staff',
            value: totalStaff,
            change: 'Live',
            subtext: 'Operations staff',
            Icon: Users,
            iconBg: 'bg-purple-100 text-purple-600',
            trendBg: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        },
        {
            title: 'Fees Collected',
            value: feesCollected,
            change: 'Live',
            subtext: 'Academic Year',
            Icon: Coins,
            iconBg: 'bg-amber-100 text-amber-600',
            trendBg: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        },
        {
            title: 'Attendance Rate',
            value: attendanceRate,
            change: 'Live',
            subtext: 'Weekly Average',
            Icon: CalendarCheck,
            iconBg: 'bg-rose-100 text-rose-600',
            trendBg: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        },
        {
            title: 'Parent Satisfaction',
            value: parentSatisfaction,
            change: null,
            subtext: parentReviews > 0 ? `From ${parentReviews} reviews` : 'No reviews yet',
            Icon: Star,
            iconBg: 'bg-blue-50 text-blue-600',
            trendBg: null,
            isRating: true,
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
            {cards.map((card) => {
                const { Icon } = card;
                return (
                    <div
                        key={card.title}
                        className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                        {/* Top: Icon + Change Pill */}
                        <div className="flex items-center justify-between gap-1.5 mb-2">
                            <div className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${card.iconBg}`}>
                                <Icon size={18} />
                            </div>
                            {card.change && (
                                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${card.trendBg}`}>
                                    <ArrowUpRight size={10} />
                                    {card.change}
                                </span>
                            )}
                            {card.isRating && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                    ★ 5.0
                                </span>
                            )}
                        </div>

                        {/* Middle: Metric Number */}
                        <div>
                            <p className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-display truncate">
                                {card.value}
                            </p>
                            <p className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-0.5 leading-snug">
                                {card.title}
                            </p>
                        </div>

                        {/* Bottom: Subtitle / Month Trend */}
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-600 font-semibold font-medium">
                            <span className="truncate">{card.subtext}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
