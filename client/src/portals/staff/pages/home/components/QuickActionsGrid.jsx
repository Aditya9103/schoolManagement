import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ACTIONS = [
    { label: 'Mark Attendance', icon: '✅', to: '/staff/attendance', color: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/20' },
    { label: 'Homework', icon: '📝', to: '/staff/homework', color: 'from-blue-600/20 to-cyan-600/20 border-blue-500/20' },
    { label: 'Exam Results', icon: '📊', to: '/staff/exams', color: 'from-violet-600/20 to-purple-600/20 border-violet-500/20' },
    { label: 'Leave Apply', icon: '🏖️', to: '/staff/leave', color: 'from-amber-600/20 to-orange-600/20 border-amber-500/20' },
];

export default function QuickActionsGrid() {
    const navigate = useNavigate();
    return (
        <div>
            <p className="text-xs font-bold text-slate-700 font-extrabold uppercase tracking-wider mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 gap-3">
                {ACTIONS.map(({ label, icon, to, color }) => (
                    <motion.button key={label} whileTap={{ scale: 0.96 }} onClick={() => navigate(to)}
                        className={`flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br border text-left transition-all ${color}`}>
                        <span className="text-2xl">{icon}</span>
                        <span className="text-xs font-bold text-white leading-tight">{label}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
