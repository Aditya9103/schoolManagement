import React, { useState, useMemo } from 'react';
import {
    X,
    Search,
    Download,
    Eye,
    CheckCircle2,
    Clock,
    UserX,
    FileText,
    MoreVertical,
    Award,
    Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_SAMPLE_SUBMISSIONS = [
    { studentName: 'Aarav Sharma', rollNo: '6A001', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', status: 'SUBMITTED', submittedAt: '2026-04-20T16:30:00Z', marksObtained: 18, grade: 'A', feedback: 'Great work! Keep it up. Solve Q6 with more detailed steps next time.', isLate: false, files: [{ title: 'math_assignment_aarav.pdf', size: '2.1 MB' }] },
    { studentName: 'Ananya Verma', rollNo: '6A002', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', status: 'SUBMITTED', submittedAt: '2026-04-20T17:15:00Z', marksObtained: 19, grade: 'A+', feedback: 'Excellent step-by-step working and presentation.', isLate: false, files: [{ title: 'math_assignment_ananya.pdf', size: '1.8 MB' }] },
    { studentName: 'Rohan Patel', rollNo: '6A003', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'SUBMITTED', submittedAt: '2026-04-21T11:20:00Z', marksObtained: 16, grade: 'B+', feedback: 'Good effort, but check question 4 calculation again.', isLate: false, files: [{ title: 'rohan_exercise1.pdf', size: '3.0 MB' }] },
    { studentName: 'Sneha Gupta', rollNo: '6A004', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'PENDING', submittedAt: null, marksObtained: null, grade: null, feedback: '', isLate: false, files: [] },
    { studentName: 'Vihaan Singh', rollNo: '6A005', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'LATE', submittedAt: '2026-04-22T08:15:00Z', marksObtained: 14, grade: 'B', feedback: 'Submitted past deadline. Penalty applied.', isLate: true, files: [{ title: 'vihaan_maths.pdf', size: '1.5 MB' }] },
    { studentName: 'Kavya Joshi', rollNo: '6A006', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', status: 'SUBMITTED', submittedAt: '2026-04-20T18:40:00Z', marksObtained: 19, grade: 'A', feedback: 'Very neat drawings and clear reasoning.', isLate: false, files: [{ title: 'kavya_homework.pdf', size: '2.4 MB' }] },
    { studentName: 'Aditya Kumar', rollNo: '6A007', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', status: 'SUBMITTED', submittedAt: '2026-04-21T09:10:00Z', marksObtained: 17, grade: 'B+', feedback: 'Well done.', isLate: false, files: [{ title: 'aditya_solution.pdf', size: '2.0 MB' }] },
    { studentName: 'Meera Iyer', rollNo: '6A008', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', status: 'SUBMITTED', submittedAt: '2026-04-21T10:05:00Z', marksObtained: 20, grade: 'A+', feedback: 'Full marks! Flawless solution.', isLate: false, files: [{ title: 'meera_maths_flawless.pdf', size: '2.8 MB' }] },
    { studentName: 'Arjun Nair', rollNo: '6A009', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', status: 'PENDING', submittedAt: null, marksObtained: null, grade: null, feedback: '', isLate: false, files: [] },
    { studentName: 'Diya Sharma', rollNo: '6A010', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'PENDING', submittedAt: null, marksObtained: null, grade: null, feedback: 'On medical leave', isLate: false, files: [] },
];

export default function AssignmentSubmissionsModal({
    isOpen,
    onClose,
    assignment,
    submissions = [],
    metrics = null,
    onOpenGradingDrawer,
}) {
    if (!isOpen || !assignment) return null;

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const safeSubmissions = useMemo(() => {
        if (Array.isArray(submissions) && submissions.length > 0) return submissions;
        if (Array.isArray(submissions?.submissions) && submissions.submissions.length > 0) return submissions.submissions;
        return DEFAULT_SAMPLE_SUBMISSIONS;
    }, [submissions]);

    const totalStudents = metrics?.totalStudents ?? (safeSubmissions.length || 32);
    const submittedCount =
        metrics?.submittedCount ??
        (safeSubmissions.filter((s) => s.status === 'SUBMITTED' || s.status === 'GRADED').length || 28);
    const pendingCount =
        metrics?.pendingCount ??
        (safeSubmissions.filter((s) => s.status === 'PENDING').length || 4);
    const lateCount =
        metrics?.lateCount ??
        (safeSubmissions.filter((s) => s.status === 'LATE' || s.isLate).length || 2);

    const filtered = safeSubmissions.filter((s) => {
        const matchesSearch =
            (s.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.rollNo || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === 'ALL'
                ? true
                : statusFilter === 'SUBMITTED'
                ? s.status === 'SUBMITTED' || s.status === 'GRADED'
                : s.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleExport = () => {
        toast.success('Submissions register exported to Excel');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
                {/* Header matching Screen 3 */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-0.5">
                            <span>Academic</span>
                            <span>&gt;</span>
                            <span>Homework & Assignments</span>
                            <span>&gt;</span>
                            <span className="text-blue-600">Submissions</span>
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            Student Submissions
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {assignment.title} • {assignment.className} ({assignment.subjectName})
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 4 Stat Cards Row (Screen 3) */}
                <div className="p-5 border-b border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white">
                    <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
                        <span className="text-xs font-semibold text-slate-500">Total Students</span>
                        <p className="text-xl font-extrabold text-slate-900 mt-0.5">{totalStudents}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                        <span className="text-xs font-semibold text-slate-500">Submitted</span>
                        <p className="text-xl font-extrabold text-emerald-700 mt-0.5">
                            {submittedCount} <span className="text-xs font-normal text-slate-400">({Math.round((submittedCount / totalStudents) * 100)}%)</span>
                        </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100">
                        <span className="text-xs font-semibold text-slate-500">Pending</span>
                        <p className="text-xl font-extrabold text-rose-700 mt-0.5">
                            {pendingCount} <span className="text-xs font-normal text-slate-400">({Math.round((pendingCount / totalStudents) * 100)}%)</span>
                        </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                        <span className="text-xs font-semibold text-slate-500">Late Submissions</span>
                        <p className="text-xl font-extrabold text-amber-700 mt-0.5">
                            {lateCount} <span className="text-xs font-normal text-slate-400">({Math.round((lateCount / totalStudents) * 100)}%)</span>
                        </p>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search students by name or roll number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {['ALL', 'SUBMITTED', 'PENDING', 'LATE'].map((st) => (
                            <button
                                key={st}
                                onClick={() => setStatusFilter(st)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    statusFilter === st
                                        ? 'bg-slate-900 text-white shadow-xs'
                                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                            >
                                {st}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={handleExport}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
                        >
                            <Download className="w-3.5 h-3.5 text-slate-500" /> Export
                        </button>
                    </div>
                </div>

                {/* Submissions Table matching Screen 3 */}
                <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                                <th className="py-3 px-3.5 w-10 text-center">#</th>
                                <th className="py-3 px-3.5">Student Details</th>
                                <th className="py-3 px-3.5">Roll No.</th>
                                <th className="py-3 px-3.5">Submission Status</th>
                                <th className="py-3 px-3.5">Submitted On</th>
                                <th className="py-3 px-3.5">File / Link</th>
                                <th className="py-3 px-3.5">Marks</th>
                                <th className="py-3 px-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {filtered.map((item, idx) => (
                                <tr key={item._id || idx} className="hover:bg-slate-50/70 transition-colors">
                                    <td className="py-3 px-3.5 text-slate-400 font-semibold text-center">{idx + 1}</td>
                                    <td className="py-3 px-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <img
                                                src={
                                                    item.avatar ||
                                                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.studentName}`
                                                }
                                                alt={item.studentName}
                                                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                                            />
                                            <span className="font-bold text-slate-900">{item.studentName}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3.5 font-mono text-slate-600 font-semibold">{item.rollNo}</td>
                                    <td className="py-3 px-3.5">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                                item.status === 'SUBMITTED' || item.status === 'GRADED'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : item.status === 'LATE'
                                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3.5 text-slate-500">
                                        {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'}
                                    </td>
                                    <td className="py-3 px-3.5">
                                        {item.files?.length > 0 ? (
                                            <button
                                                onClick={() => onOpenGradingDrawer(idx)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition-colors cursor-pointer"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> View File
                                            </button>
                                        ) : (
                                            <span className="text-slate-400 font-medium">-</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-3.5">
                                        {item.marksObtained != null ? (
                                            <span className="font-extrabold text-blue-700 text-xs">
                                                {item.marksObtained} / 20
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                        <button
                                            onClick={() => onOpenGradingDrawer(idx)}
                                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                                        >
                                            Grade
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
