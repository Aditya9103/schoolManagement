import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, QrCode, BarChart3 } from 'lucide-react';

const ACTIONS = [
    { Icon: MapPin, label: 'Live Tracking', to: '/driver/route', color: 'from-blue-600/20 to-cyan-600/20 border-blue-500/25' },
    { Icon: Users, label: 'Student List', to: '/driver/students', color: 'from-violet-600/20 to-purple-600/20 border-violet-500/25' },
    { Icon: QrCode, label: 'Scan QR', to: '/driver/scan', color: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/25' },
    { Icon: BarChart3, label: 'Reports', to: '/driver/more', color: 'from-amber-600/20 to-orange-600/20 border-amber-500/25' },
];

export default function QuickActionsGrid() {
    const navigate = useNavigate();
    return (
        <div>
            <p className="text-xs font-bold text-slate-700 font-extrabold uppercase tracking-wider mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 gap-3">
                {ACTIONS.map(({ Icon, label, to, color }) => (
                    <motion.button key={label} whileTap={{ scale: 0.95 }} onClick={() => navigate(to)}
                        className={`flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br border text-white transition-colors ${color}`}>
                        <Icon size={22} className="text-slate-300 flex-shrink-0" />
                        <span className="text-sm font-bold">{label}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
