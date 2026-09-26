import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const SCHEDULE = [
    { time: '08:30', subject: 'Mathematics', class: 'Class 8-A', room: 'Room 204' },
    { time: '10:00', subject: 'Science', class: 'Class 9-B', room: 'Lab 2' },
    { time: '11:30', subject: 'Mathematics', class: 'Class 10-A', room: 'Room 301' },
    { time: '02:00', subject: 'Mathematics', class: 'Class 7-C', room: 'Room 104' },
];

export default function TodaySchedule() {
    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-700 font-extrabold uppercase tracking-wider">Today's Schedule</p>
                <button className="text-xs text-blue-400 font-semibold flex items-center gap-1">Full <ChevronRight size={12} /></button>
            </div>
            <div className="space-y-2.5">
                {SCHEDULE.map((cls, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/40 hover:bg-slate-800 transition-colors cursor-pointer">
                        <div className="flex-shrink-0 w-12 text-center">
                            <p className="text-xs font-bold text-blue-400">{cls.time}</p>
                        </div>
                        <div className="w-px h-8 bg-slate-700 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-white">{cls.subject}</p>
                            <p className="text-xs text-slate-600 font-semibold">{cls.class} · {cls.room}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
