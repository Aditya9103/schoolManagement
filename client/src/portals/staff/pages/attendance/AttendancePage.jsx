import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ClassSelector from './components/ClassSelector';
import AttendanceSummary from './components/AttendanceSummary';
import StudentAttendanceList from './components/StudentAttendanceList';

const MOCK_STUDENTS = [
    { id: 1, name: 'Priya Sharma', rollNo: '01' },
    { id: 2, name: 'Arjun Kumar', rollNo: '02' },
    { id: 3, name: 'Sneha Patel', rollNo: '03' },
    { id: 4, name: 'Rahul Singh', rollNo: '04' },
    { id: 5, name: 'Kavya Reddy', rollNo: '05' },
    { id: 6, name: 'Amit Joshi', rollNo: '06' },
    { id: 7, name: 'Divya Nair', rollNo: '07' },
    { id: 8, name: 'Rohan Mehta', rollNo: '08' },
];

export default function AttendancePage() {
    const navigate = useNavigate();
    const [selectedClass, setSelectedClass] = useState('Class 8-A');
    const [attendance, setAttendance] = useState({});
    const [saving, setSaving] = useState(false);

    const mark = (id, status) => setAttendance((a) => ({ ...a, [id]: status }));

    const presentCount = Object.values(attendance).filter((v) => v === 'P').length;
    const absentCount = Object.values(attendance).filter((v) => v === 'A').length;
    const lateCount = Object.values(attendance).filter((v) => v === 'L').length;

    const handleSave = async () => {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 900));
        setSaving(false);
        toast.success('✅ Attendance saved!');
        navigate(-1);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
            {/* Header */}
            <div className="bg-slate-900 px-5 pt-6 pb-4 border-b border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)}
                        className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-medium hover:text-white transition-colors">
                        <ArrowLeft size={17} />
                    </button>
                    <div>
                        <h1 className="text-lg font-extrabold text-white font-display">Mark Attendance</h1>
                        <p className="text-xs text-slate-700 font-medium">Monday, 22 September 2026</p>
                    </div>
                </div>
                <ClassSelector selected={selectedClass} onSelect={setSelectedClass} />
            </div>

            {/* Summary */}
            <div className="px-5 py-3 bg-slate-900/50 border-b border-slate-800">
                <AttendanceSummary presentCount={presentCount} absentCount={absentCount} lateCount={lateCount} total={MOCK_STUDENTS.length} />
            </div>

            {/* Students */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
                <StudentAttendanceList students={MOCK_STUDENTS} attendance={attendance} onMark={mark} />
            </div>

            {/* Save */}
            <div className="px-5 py-4 bg-slate-900 border-t border-slate-800">
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 disabled:opacity-60 transition-all">
                    {saving
                        ? <><div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Saving...</>
                        : <><Save size={16} /> Save Attendance</>}
                </motion.button>
            </div>
        </div>
    );
}
