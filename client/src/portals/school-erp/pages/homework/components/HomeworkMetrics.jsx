import React from 'react';
import { BookOpen, FileCheck, Clock, Award, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';

export default function HomeworkMetrics({ summary = {} }) {
    const {
        totalAssignments = 124,
        totalAssignmentsDelta = '+12%',
        activeAssignments = 28,
        activeAssignmentsDelta = '+8%',
        pendingSubmissions = 256,
        pendingSubmissionsDelta = '-5%',
        gradedAssignments = 96,
        gradedAssignmentsDelta = '+18%',
        averageSubmissionRate = 86,
        averageSubmissionRateDelta = '+6%',
    } = summary;

    const cards = [
        {
            title: 'Total Assignments',
            value: totalAssignments.toLocaleString(),
            delta: totalAssignmentsDelta,
            isPositive: true,
            iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
            Icon: BookOpen,
            sparkColor: '#3b82f6',
            sparkline: [35, 45, 52, 60, 68, 80, 95],
        },
        {
            title: 'Active Assignments',
            value: activeAssignments.toLocaleString(),
            delta: activeAssignmentsDelta,
            isPositive: true,
            iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
            Icon: FileCheck,
            sparkColor: '#10b981',
            sparkline: [15, 20, 22, 25, 24, 26, 28],
        },
        {
            title: 'Pending Submissions',
            value: pendingSubmissions.toLocaleString(),
            delta: pendingSubmissionsDelta,
            isPositive: false,
            iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
            Icon: Clock,
            sparkColor: '#f43f5e',
            sparkline: [40, 36, 32, 28, 26, 24, 20],
        },
        {
            title: 'Graded Assignments',
            value: gradedAssignments.toLocaleString(),
            delta: gradedAssignmentsDelta,
            isPositive: true,
            iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
            Icon: Award,
            sparkColor: '#f59e0b',
            sparkline: [50, 58, 65, 72, 80, 88, 96],
        },
        {
            title: 'Average Submission Rate',
            value: `${averageSubmissionRate}%`,
            delta: averageSubmissionRateDelta,
            isPositive: true,
            iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
            Icon: CheckCircle2,
            sparkColor: '#a855f7',
            sparkline: [70, 74, 76, 79, 82, 84, 86],
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
                                        <linearGradient id={`grad-hw-${idx}`} x1="0" y1="0" x2="0" y2="1">
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
                                        fill={`url(#grad-hw-${idx})`}
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
