import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award } from 'lucide-react';

export default function TopPerformersCard({ data }) {
    const navigate = useNavigate();
    const performers = Array.isArray(data) ? data : [];

    const getRankBadge = (rank) => {
        if (rank === 1) return 'bg-amber-100 text-amber-800 font-bold border-amber-300';
        if (rank === 2) return 'bg-slate-200 text-slate-800 font-bold border-slate-300';
        if (rank === 3) return 'bg-amber-50 text-amber-700 font-bold border-amber-200';
        return 'bg-slate-100 text-slate-600 font-semibold border-slate-200';
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-4 sm:p-5 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight whitespace-nowrap">
                    Top Performers
                </h3>
                <button
                    onClick={() => navigate('/school/exams')}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline whitespace-nowrap"
                >
                    View All
                </button>
            </div>

            <div className="space-y-1.5 flex-1">
                {performers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400">
                        <Award className="w-5 h-5 mb-1.5 text-slate-300" />
                        <span className="text-xs">No exam results recorded yet</span>
                    </div>
                ) : (
                    performers.slice(0, 5).map((p, idx) => {
                        const rank = p.rank || idx + 1;
                        return (
                            <div
                                key={p.name || idx}
                                className="flex items-center justify-between p-1 hover:bg-slate-50/80 rounded-xl transition-colors"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] border shrink-0 ${getRankBadge(rank)}`}>
                                        {rank}
                                    </span>
                                    <img
                                        src={p.avatar}
                                        alt={p.name}
                                        className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=e2e8f0&color=475569`;
                                        }}
                                    />
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                                            {p.name}
                                        </p>
                                        <p className="text-[10px] text-slate-600 font-semibold font-medium truncate leading-none mt-0.5">
                                            {p.class}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-extrabold text-slate-900 tracking-tight ml-2 shrink-0">
                                    {p.score}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
