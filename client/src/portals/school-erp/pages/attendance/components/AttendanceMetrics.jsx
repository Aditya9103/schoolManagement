import React from 'react';
import { Users, UserCheck, UserX, Clock, CalendarCheck, TrendingUp, TrendingDown } from 'lucide-react';

export default function AttendanceMetrics({ summary = {} }) {
    const {
        totalStudents = 1248,
        totalStudentsDelta = '+5%',
        presentToday = 1102,
        presentTodayRate = '88.3%',
        absentToday = 146,
        absentTodayDelta = '-2%',
        lateToday = 28,
        lateTodayDelta = '+1%',
        attendanceRate = 92.4,
        attendanceRateDelta = '+4%',
    } = summary;

    const cards = [
        {
            title: 'Total Students',
            value: totalStudents.toLocaleString(),
            delta: totalStudentsDelta,
            isPositive: true,
            iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
            Icon: Users,
            sparkColor: '#10b981',
            sparkline: [40, 48, 55, 62, 60, 72, 85],
        },
        {
            title: 'Present Today',
            value: presentToday.toLocaleString(),
            delta: `↑ ${presentTodayRate}`,
            isPositive: true,
            iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
            Icon: UserCheck,
            sparkColor: '#3b82f6',
            sparkline: [65, 70, 72, 80, 78, 86, 92],
        },
        {
            title: 'Absent Today',
            value: absentToday.toLocaleString(),
            delta: absentTodayDelta,
            isPositive: false,
            iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
            Icon: UserX,
            sparkColor: '#f43f5e',
            sparkline: [30, 28, 22, 25, 20, 18, 14],
        },
        {
            title: 'Late Today',
            value: lateToday.toLocaleString(),
            delta: lateTodayDelta,
            isPositive: true,
            iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
            Icon: Clock,
            sparkColor: '#f59e0b',
            sparkline: [12, 16, 14, 20, 18, 24, 28],
        },
        {
            title: 'Attendance Rate',
            value: `${attendanceRate}%`,
            delta: attendanceRateDelta,
            isPositive: true,
            iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
            Icon: CalendarCheck,
            sparkColor: '#6366f1',
            sparkline: [82, 85, 87, 88, 90, 91, 94],
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {cards.map((card, idx) => {
                const IconComponent = card.Icon;
                return (
                    <div
                        key={idx}
                        className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                                <IconComponent className="w-5 h-5" />
                            </div>
                            <span
                                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                                    card.isPositive
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                        : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                                }`}
                            >
                                {card.isPositive ? (
                                    <TrendingUp className="w-3 h-3" />
                                ) : (
                                    <TrendingDown className="w-3 h-3" />
                                )}
                                {card.delta}
                            </span>
                        </div>

                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500">{card.title}</p>
                                <p className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight mt-0.5">
                                    {card.value}
                                </p>
                            </div>

                            {/* Mini Sparkline SVG */}
                            <div className="w-16 h-8 opacity-80">
                                <svg viewBox="0 0 70 32" className="w-full h-full overflow-visible">
                                    <defs>
                                        <linearGradient id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={card.sparkColor} stopOpacity="0.4" />
                                            <stop offset="100%" stopColor={card.sparkColor} stopOpacity="0.0" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d={`M 0,${32 - card.sparkline[0] * 0.3} Q 12,${32 - card.sparkline[1] * 0.3} 24,${32 - card.sparkline[2] * 0.3} T 48,${32 - card.sparkline[4] * 0.3} T 70,${32 - card.sparkline[6] * 0.3}`}
                                        fill="none"
                                        stroke={card.sparkColor}
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d={`M 0,${32 - card.sparkline[0] * 0.3} Q 12,${32 - card.sparkline[1] * 0.3} 24,${32 - card.sparkline[2] * 0.3} T 48,${32 - card.sparkline[4] * 0.3} T 70,${32 - card.sparkline[6] * 0.3} L 70,32 L 0,32 Z`}
                                        fill={`url(#grad-${idx})`}
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
