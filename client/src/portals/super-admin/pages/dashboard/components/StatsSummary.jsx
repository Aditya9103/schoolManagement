import React from 'react';
import { School, Users, UserCheck, IndianRupee, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useGetPlatformStatsQuery } from '../../../../../store/api/superAdminApi';

// Mini Bar Chart SVG Component matching mockup graphics
function MiniBarChart({ color, heights = [40, 55, 30, 70, 85, 100] }) {
    return (
        <div className="flex items-end gap-1 h-8 shrink-0">
            {heights.map((h, i) => (
                <div
                    key={i}
                    className="w-1.5 rounded-full transition-all duration-300"
                    style={{
                        height: `${h}%`,
                        backgroundColor: color,
                        opacity: i === heights.length - 1 ? 1 : 0.35 + (i * 0.1),
                    }}
                />
            ))}
        </div>
    );
}

export default function StatsSummary() {
    const { data: statsRes } = useGetPlatformStatsQuery();
    const stats = statsRes?.data;

    const cards = [
        {
            label: 'Total Schools',
            value: stats?.totalSchools?.toLocaleString() || '156',
            delta: '+12% vs last month',
            isPositive: true,
            Icon: School,
            themeColor: '#2563EB', // Blue
            iconBg: 'bg-blue-50 text-blue-600',
            barColor: '#3B82F6',
            heights: [30, 45, 60, 50, 75, 95],
        },
        {
            label: 'Total Students',
            value: stats?.totalStudents?.toLocaleString() || '48,320',
            delta: '+18% vs last month',
            isPositive: true,
            Icon: Users,
            themeColor: '#10B981', // Emerald
            iconBg: 'bg-emerald-50 text-emerald-600',
            barColor: '#10B981',
            heights: [40, 55, 65, 70, 85, 100],
        },
        {
            label: 'Total Staff',
            value: stats?.totalStaff?.toLocaleString() || '3,842',
            delta: '+11% vs last month',
            isPositive: true,
            Icon: UserCheck,
            themeColor: '#8B5CF6', // Purple
            iconBg: 'bg-purple-50 text-purple-600',
            barColor: '#8B5CF6',
            heights: [35, 50, 45, 65, 80, 90],
        },
        {
            label: 'Total Revenue',
            value: '₹ 2.48 Cr',
            delta: '+24% vs last month',
            isPositive: true,
            Icon: IndianRupee,
            themeColor: '#F59E0B', // Amber
            iconBg: 'bg-amber-50 text-amber-600',
            barColor: '#F59E0B',
            heights: [25, 40, 55, 70, 85, 95],
        },
        {
            label: 'Expiring Soon',
            value: stats?.expiringSoonSchools?.toString() || '18',
            delta: '-6% in next 30 days',
            isPositive: false,
            Icon: AlertCircle,
            themeColor: '#EF4444', // Red
            iconBg: 'bg-rose-50 text-rose-600',
            barColor: '#EF4444',
            heights: [80, 70, 65, 50, 35, 25],
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {cards.map((card) => {
                const { label, value, delta, isPositive, Icon, iconBg, barColor, heights } = card;
                return (
                    <div
                        key={label}
                        className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className={`h-9 w-9 rounded-xl ${iconBg}flex items-center justify-center shadow-xs border border-black/5`}>
                                <Icon size={18} strokeWidth={2.4} />
                            </div>
                            <MiniBarChart color={barColor} heights={heights} />
                        </div>

                        <div className="mt-1">
                            <span className="text-xs font-bold text-slate-700 block truncate">
                                {label}
                            </span>
                            <p className="text-2xl font-black text-slate-900 font-display tracking-tight mt-0.5">
                                {value}
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 mt-2.5 text-xs font-bold">
                            {isPositive ? (
                                <>
                                    <ArrowUpRight size={14} className="text-emerald-700 shrink-0" strokeWidth={2.5} />
                                    <span className="text-emerald-700 font-extrabold">{delta}</span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownRight size={14} className="text-rose-700 shrink-0" strokeWidth={2.5} />
                                    <span className="text-rose-700 font-extrabold">{delta}</span>
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
