import React from 'react';
import { motion } from 'framer-motion';

const STATUS_CONFIG = {
    P: { label: 'P', title: 'Present', activeColor: 'bg-emerald-500 text-white shadow-emerald-500/30' },
    A: { label: 'A', title: 'Absent', activeColor: 'bg-red-500 text-white shadow-red-500/30' },
    L: { label: 'L', title: 'Late', activeColor: 'bg-amber-500 text-white shadow-amber-500/30' },
};

export default function StudentAttendanceList({ students, attendance, onMark }) {
    return (
        <div className="space-y-2.5">
            {students.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/50">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-md shadow-blue-500/20">
                        {s.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{s.name}</p>
                        <p className="text-[10px] text-slate-700 font-semibold">Roll No. {s.rollNo}</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                            <button key={key} onClick={() => onMark(s.id, key)}
                                title={cfg.title}
                                className={`h-8 w-8 rounded-xl text-xs font-bold transition-all shadow-md ${
                                    attendance[s.id] === key ? `${cfg.activeColor} shadow-lg scale-105` : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                }`}>
                                {key}
                            </button>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
