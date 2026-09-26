import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UPDATES = [
    { icon: '📝', text: 'Mathematics homework assigned for Class 8-A', time: '2 hr ago' },
    { icon: '💰', text: '₹12,500 fee due by 30 Sep 2026', time: '3 hr ago' },
    { icon: '📢', text: 'Annual Sports Day on 25 Sep — form due', time: '5 hr ago' },
    { icon: '✅', text: 'Attendance: 94% this month — Great job!', time: '1 day ago' },
];

export default function UpdatesFeed() {
    const navigate = useNavigate();
    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-700 font-extrabold uppercase tracking-wider">Today's Updates</p>
                <button onClick={() => navigate('/parent/updates')} className="text-xs text-blue-400 font-semibold flex items-center gap-1">
                    All <ChevronRight size={12} />
                </button>
            </div>
            <div className="space-y-2.5">
                {UPDATES.map((u, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className="flex items-start gap-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/40 hover:bg-slate-800 transition-colors cursor-pointer">
                        <span className="text-xl flex-shrink-0">{u.icon}</span>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-200 leading-snug">{u.text}</p>
                            <p className="text-[10px] text-slate-700 font-semibold mt-1">{u.time}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
