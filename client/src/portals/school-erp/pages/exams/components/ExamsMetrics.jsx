import React from 'react';
import {
    FileText,
    Users,
    Award,
    Trophy,
    Clock,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';

export default function ExamsMetrics({ summary = {} }) {
    const {
        totalExams = 12,
        totalExamsDelta = '+20%',
        studentsAppeared = 1248,
        studentsAppearedDelta = '+8%',
        averagePassRate = 92.4,
        averagePassRateDelta = '+5%',
        topPerformers = 186,
        topPerformersDelta = '+12%',
        pendingResults = 3,
    } = summary;

    const cards = [
        {
            title: 'Total Exams',
            value: totalExams.toLocaleString(),
            delta: totalExamsDelta,
            isPositive: true,
            iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
            Icon: FileText,
            sparkColor: '#3b82f6',
            sparkline: [8, 9, 10, 10, 11, 11, 12],
        },
        {
            title: 'Students Appeared',
            value: studentsAppeared.toLocaleString(),
            delta: studentsAppearedDelta,
            isPositive: true,
            iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
            Icon: Users,
            sparkColor: '#10b981',
            sparkline: [950, 1020, 1100, 1150, 1190, 1220, 1248],
        },
        {
            title: 'Average Pass Rate',
            value: `${averagePassRate}%`,
            delta: averagePassRateDelta,
            isPositive: true,
            iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
            Icon: Award,
            sparkColor: '#a855f7',
            sparkline: [85, 87, 88, 89, 90, 91.5, 92.4],
        },
        {
            title: 'Top Performers',
            value: topPerformers.toLocaleString(),
            delta: topPerformersDelta,
            isPositive: true,
            iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
            Icon: Trophy,
            sparkColor: '#f59e0b',
            sparkline: [120, 135, 142, 155, 168, 175, 186],
        },
        {
            title: 'Pending Results',
            value: pendingResults.toLocaleString(),
            delta: null,
            isPositive: false,
            iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
            Icon: Clock,
            sparkColor: '#f43f5e',
            sparkline: [6, 5, 5, 4, 4, 3, 3],
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {cards.map((card, idx) => {
                const Icon = card.Icon;
                const min = Math.min(...card.sparkline);
                const max = Math.max(...card.sparkline);
                const range = max - min || 1;
                const points = card.sparkline
                    .map((val, i) => {
                        const x = (i / (card.sparkline.length - 1)) * 60;
                        const y = 24 - ((val - min) / range) * 20;
                        return `${x},${y}`;
                    })
                    .join(' ');

                return (
                    <div
                        key={idx}
                        className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}>
                                <Icon className="w-4.5 h-4.5" />
                            </div>
                            {card.delta && (
                                <span
                                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                        card.isPositive
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                            : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                                    }`}
                                >
                                    {card.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {card.delta}
                                </span>
                            )}
                        </div>

                        <div className="mt-3 flex items-baseline justify-between">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {card.title}
                                </p>
                                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5 tracking-tight font-display">
                                    {card.value}
                                </p>
                            </div>

                            {/* Mini sparkline */}
                            <svg className="w-14 h-6 overflow-visible shrink-0 opacity-80" viewBox="0 0 60 26">
                                <polyline
                                    fill="none"
                                    stroke={card.sparkColor}
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    points={points}
                                />
                            </svg>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
