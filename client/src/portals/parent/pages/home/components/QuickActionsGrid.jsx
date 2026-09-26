import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ACTIONS = [
    { icon: '📅', label: 'Attendance', to: '/parent/attendance', color: 'from-blue-600/30 to-blue-600/10 border-blue-500/25' },
    { icon: '📝', label: 'Homework', to: '/parent/homework', color: 'from-violet-600/30 to-violet-600/10 border-violet-500/25' },
    { icon: '📊', label: 'Exams', to: '/parent/exams', color: 'from-emerald-600/30 to-emerald-600/10 border-emerald-500/25' },
    { icon: '💰', label: 'Fees', to: '/parent/fees', color: 'from-amber-600/30 to-amber-600/10 border-amber-500/25' },
    { icon: '🕐', label: 'Timetable', to: '/parent/timetable', color: 'from-cyan-600/30 to-cyan-600/10 border-cyan-500/25' },
    { icon: '🚌', label: 'Transport', to: '/parent/transport', color: 'from-rose-600/30 to-rose-600/10 border-rose-500/25' },
    { icon: '📢', label: 'Notices', to: '/parent/notices', color: 'from-orange-600/30 to-orange-600/10 border-orange-500/25' },
    { icon: '💬', label: 'Chat', to: '/parent/chat', color: 'from-pink-600/30 to-pink-600/10 border-pink-500/25' },
];

export default function QuickActionsGrid() {
    const navigate = useNavigate();
    return (
        <div>
            <p className="text-xs font-bold text-slate-700 font-extrabold uppercase tracking-wider mb-3">Quick Access</p>
            <div className="grid grid-cols-4 gap-3">
                {ACTIONS.map(({ icon, label, to, color }) => (
                    <motion.button key={label} whileTap={{ scale: 0.92 }} onClick={() => navigate(to)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl bg-gradient-to-b border transition-colors ${color}`}>
                        <span className="text-2xl">{icon}</span>
                        <span className="text-[10px] font-semibold text-slate-300 leading-tight text-center">{label}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
