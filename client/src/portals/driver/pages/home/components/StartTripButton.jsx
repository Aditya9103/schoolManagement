import React from 'react';
import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';

export default function StartTripButton({ active, onToggle }) {
    return (
        <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onToggle}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base shadow-xl transition-all duration-300 ${
                active
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-red-500/30'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/30 animate-pulse-glow'
            }`}>
            <Navigation size={20} />
            {active ? '🛑 End Trip' : '🚀 Start Trip'}
        </motion.button>
    );
}
