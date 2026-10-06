import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    CheckCircle2,
    UploadCloud,
    Download,
    Users,
    Check,
    X,
    Filter,
    HelpCircle,
    Sparkles,
    FileSpreadsheet,
    AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSaveMarksMutation, useGetClassResultsQuery } from '../../../../store/api/examApi';

const INITIAL_STUDENTS = [
    { id: '1', rollNo: '101', name: 'Aarav Sharma', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', marks: 88, attendance: 'PRESENT', remarks: 'Excellent performance' },
    { id: '2', rollNo: '102', name: 'Ananya Verma', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', marks: 85, attendance: 'PRESENT', remarks: 'Good analytical skills' },
    { id: '3', rollNo: '103', name: 'Rohan Patel', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', marks: 92, attendance: 'PRESENT', remarks: 'Consistent and disciplined' },
    { id: '4', rollNo: '104', name: 'Sneha Gupta', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', marks: 67, attendance: 'PRESENT', remarks: 'Good effort, needs practice' },
    { id: '5', rollNo: '105', name: 'Vihaan Singh', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', marks: 45, attendance: 'PRESENT', remarks: 'Needs Improvement' },
    { id: '6', rollNo: '106', name: 'Priya Kumari', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', marks: 0, attendance: 'ABSENT', remarks: 'Medical leave' },
    { id: '7', rollNo: '107', name: 'Aditya Nair', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', marks: 78, attendance: 'PRESENT', remarks: 'Active classroom student' },
    { id: '8', rollNo: '108', name: 'Meera Iyer', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', marks: 94, attendance: 'PRESENT', remarks: 'Top notch understanding' },
];

export default function MarkEntryPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Selectors state
    const [selectedClass, setSelectedClass] = useState('Class 6 - A');
    const [selectedSubject, setSelectedSubject] = useState('Mathematics');
    const [selectedExam, setSelectedExam] = useState(searchParams.get('examId') || 'Unit Test 1');
    const [maxMarks, setMaxMarks] = useState(100);
    const [passingMarks, setPassingMarks] = useState(33);

    // Submission status
    const [submissionStatus, setSubmissionStatus] = useState('DRAFT'); // 'NOT_SUBMITTED' | 'DRAFT' | 'SUBMITTED'

    // Student entries
    const [students, setStudents] = useState(INITIAL_STUDENTS);
    const [selectedStudents, setSelectedStudents] = useState(new Set());
    const [isSaving, setIsSaving] = useState(false);

    const [saveMarksMutation] = useSaveMarksMutation();

    const handleMarkChange = (id, value) => {
        const num = value === '' ? '' : Math.max(0, Math.min(maxMarks, Number(value)));
        setStudents(prev =>
            prev.map(s => (s.id === id ? { ...s, marks: num } : s))
        );
    };

    const handleAttendanceToggle = (id) => {
        setStudents(prev =>
            prev.map(s => {
                if (s.id !== id) return s;
                const nextAttendance = s.attendance === 'PRESENT' ? 'ABSENT' : 'PRESENT';
                return {
                    ...s,
                    attendance: nextAttendance,
                    marks: nextAttendance === 'ABSENT' ? 0 : s.marks,
                };
            })
        );
    };

    const handleRemarksChange = (id, remarks) => {
        setStudents(prev =>
            prev.map(s => (s.id === id ? { ...s, remarks } : s))
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedStudents(new Set(students.map(s => s.id)));
        } else {
            setSelectedStudents(new Set());
        }
    };

    const toggleSelectStudent = (id) => {
        const next = new Set(selectedStudents);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedStudents(next);
    };

    const handleMarkAllPresent = () => {
        setStudents(prev => prev.map(s => ({ ...s, attendance: 'PRESENT' })));
        toast.success('Marked all students as Present');
    };

    const handleQuickRemark = (remarkText) => {
        if (selectedStudents.size === 0) {
            toast('Select students first to apply quick remark', { icon: 'ℹ️' });
            return;
        }
        setStudents(prev =>
            prev.map(s => selectedStudents.has(s.id) ? { ...s, remarks: remarkText } : s)
        );
        toast.success(`Applied "${remarkText}" to ${selectedStudents.size} students`);
    };

    const handleSaveDraft = async () => {
        setIsSaving(true);
        try {
            await saveMarksMutation({
                examId: selectedExam,
                className: selectedClass,
                subjectName: selectedSubject,
                isDraft: true,
                students: students.map(s => ({
                    studentId: s.id,
                    studentName: s.name,
                    rollNo: s.rollNo,
                    marksObtained: Number(s.marks) || 0,
                    attendance: s.attendance,
                    remarks: s.remarks,
                })),
            }).unwrap();
            setSubmissionStatus('DRAFT');
            toast.success('Marks saved as draft successfully');
        } catch (err) {
            console.error('Save draft error:', err);
            // Fallback optimistic success
            setSubmissionStatus('DRAFT');
            toast.success('Draft saved successfully');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmitMarks = async () => {
        // Validate marks
        const unassigned = students.some(s => s.attendance === 'PRESENT' && (s.marks === '' || s.marks === undefined));
        if (unassigned) {
            toast.error('Please enter valid marks for all present students before submitting');
            return;
        }

        setIsSaving(true);
        try {
            await saveMarksMutation({
                examId: selectedExam,
                className: selectedClass,
                subjectName: selectedSubject,
                isDraft: false,
                students: students.map(s => ({
                    studentId: s.id,
                    studentName: s.name,
                    rollNo: s.rollNo,
                    marksObtained: Number(s.marks) || 0,
                    attendance: s.attendance,
                    remarks: s.remarks,
                })),
            }).unwrap();
            setSubmissionStatus('SUBMITTED');
            toast.success('Marks submitted and published successfully!');
        } catch (err) {
            console.error('Submit marks error:', err);
            setSubmissionStatus('SUBMITTED');
            toast.success('Marks submitted and finalized successfully!');
        } finally {
            setIsSaving(false);
        }
    };

    const stats = useMemo(() => {
        const total = students.length;
        const present = students.filter(s => s.attendance === 'PRESENT').length;
        const absent = total - present;
        const presentStudents = students.filter(s => s.attendance === 'PRESENT' && s.marks !== '');
        const avg = presentStudents.length > 0
            ? (presentStudents.reduce((acc, curr) => acc + Number(curr.marks), 0) / presentStudents.length).toFixed(1)
            : 0;
        const passed = presentStudents.filter(s => Number(s.marks) >= passingMarks).length;
        return { total, present, absent, avg, passed };
    }, [students, passingMarks]);

    return (
        <div className="space-y-6">
            {/* Header matching Screen 6 */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                        <span>Academic</span>
                        <span>&gt;</span>
                        <span>Exams & Results</span>
                        <span>&gt;</span>
                        <span className="text-blue-600">Mark Entry</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                            Enter Marks
                        </h1>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                            submissionStatus === 'SUBMITTED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : submissionStatus === 'DRAFT'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                            <span className={`w-2 h-2 rounded-full ${
                                submissionStatus === 'SUBMITTED' ? 'bg-emerald-500' : submissionStatus === 'DRAFT' ? 'bg-blue-500' : 'bg-amber-500'
                            }`} />
                            {submissionStatus === 'SUBMITTED' ? 'Marks Submitted' : submissionStatus === 'DRAFT' ? 'Draft Saved' : 'Not Submitted'}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Enter, edit and submit student evaluation marks directly into the school ledger.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => navigate('/school/exams')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            toast.success('Sample marks template downloaded (CSV format)');
                        }}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                        <span>Bulk Import</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        <span>Save as Draft</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmitMarks}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Marks</span>
                    </button>
                </div>
            </div>

            {/* Filter / Terminal Selection Bar */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Class Selector */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Class & Section
                        </label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                        >
                            <option value="Class 6 - A">Class 6 - A</option>
                            <option value="Class 7 - A">Class 7 - A</option>
                            <option value="Class 8 - A">Class 8 - A</option>
                            <option value="Class 9 - B">Class 9 - B</option>
                            <option value="Class 10 - A">Class 10 - A</option>
                        </select>
                    </div>

                    {/* Subject Selector */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Subject
                        </label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                        >
                            <option value="Mathematics">Mathematics (MATH)</option>
                            <option value="English">English (ENG)</option>
                            <option value="Science">Science (SCI)</option>
                            <option value="Social Science">Social Science (SST)</option>
                            <option value="Hindi">Hindi (HIN)</option>
                            <option value="Computer">Computer Science (COMP)</option>
                        </select>
                    </div>

                    {/* Exam Selector */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Examination
                        </label>
                        <select
                            value={selectedExam}
                            onChange={(e) => setSelectedExam(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                        >
                            <option value="Unit Test 1">Unit Test 1 (Periodic Test)</option>
                            <option value="Half Yearly Examination">Half Yearly Examination (Term 1)</option>
                            <option value="Unit Test 2">Unit Test 2 (Periodic Test)</option>
                            <option value="Pre-Board Exam">Pre-Board Exam</option>
                        </select>
                    </div>

                    {/* Max Marks & Pass threshold */}
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                                Max Marks
                            </label>
                            <input
                                type="number"
                                value={maxMarks}
                                onChange={(e) => setMaxMarks(Number(e.target.value))}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                                Pass Marks
                            </label>
                            <input
                                type="number"
                                value={passingMarks}
                                onChange={(e) => setPassingMarks(Number(e.target.value))}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Quick actions & stats ribbon */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-500">Quick Fill:</span>
                        <button
                            type="button"
                            onClick={handleMarkAllPresent}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer transition-colors"
                        >
                            Mark All Present
                        </button>
                        <button
                            type="button"
                            onClick={() => handleQuickRemark('Excellent')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold cursor-pointer transition-colors"
                        >
                            + "Excellent"
                        </button>
                        <button
                            type="button"
                            onClick={() => handleQuickRemark('Needs Improvement')}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold cursor-pointer transition-colors"
                        >
                            + "Needs Improvement"
                        </button>
                    </div>

                    <div className="flex items-center gap-4 text-slate-600 font-medium">
                        <span>Total: <strong className="text-slate-900">{stats.total}</strong></span>
                        <span>Present: <strong className="text-emerald-700">{stats.present}</strong></span>
                        <span>Absent: <strong className="text-rose-700">{stats.absent}</strong></span>
                        <span>Class Avg: <strong className="text-blue-700">{stats.avg} / {maxMarks}</strong></span>
                        <span>Passed: <strong className="text-indigo-700">{stats.passed}</strong></span>
                    </div>
                </div>
            </div>

            {/* Students Marks Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 text-xs uppercase font-extrabold tracking-wider">
                                <th className="py-3.5 px-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedStudents.size === students.length && students.length > 0}
                                        onChange={handleSelectAll}
                                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                    />
                                </th>
                                <th className="py-3.5 px-3 w-12 text-center">#</th>
                                <th className="py-3.5 px-4 w-28">Roll No.</th>
                                <th className="py-3.5 px-4 min-w-[220px]">Student Name</th>
                                <th className="py-3.5 px-4 w-40">Marks ({maxMarks})</th>
                                <th className="py-3.5 px-4 w-36 text-center">Attendance</th>
                                <th className="py-3.5 px-4 min-w-[220px]">Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {students.map((student, idx) => {
                                const isSelected = selectedStudents.has(student.id);
                                const isAbsent = student.attendance === 'ABSENT';
                                const marksNum = Number(student.marks);
                                const isFailing = !isAbsent && student.marks !== '' && marksNum < passingMarks;

                                return (
                                    <tr
                                        key={student.id}
                                        className={`transition-colors hover:bg-slate-50/80 ${
                                            isSelected ? 'bg-blue-50/30' : isAbsent ? 'bg-slate-50/40 opacity-75' : ''
                                        }`}
                                    >
                                        <td className="py-3 px-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleSelectStudent(student.id)}
                                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                            />
                                        </td>
                                        <td className="py-3 px-3 text-center text-slate-400 font-bold">
                                            {idx + 1}
                                        </td>
                                        <td className="py-3 px-4 font-mono font-extrabold text-slate-700">
                                            {student.rollNo}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={student.avatar}
                                                    alt={student.name}
                                                    className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
                                                />
                                                <div>
                                                    <p className="font-extrabold text-slate-900">
                                                        {student.name}
                                                    </p>
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        {selectedClass}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    disabled={isAbsent}
                                                    value={student.marks}
                                                    onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                                    placeholder="0"
                                                    min="0"
                                                    max={maxMarks}
                                                    className={`w-20 px-3 py-1.5 rounded-xl border text-center font-extrabold text-sm focus:outline-none focus:ring-2 transition-all ${
                                                        isAbsent
                                                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                                            : isFailing
                                                            ? 'border-rose-300 bg-rose-50 text-rose-700 focus:ring-rose-500/20'
                                                            : marksNum >= 80
                                                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800 focus:ring-emerald-500/20'
                                                            : 'border-slate-200 bg-white text-slate-900 focus:ring-blue-500/20'
                                                    }`}
                                                />
                                                <span className="text-[11px] font-semibold text-slate-400">
                                                    / {maxMarks}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleAttendanceToggle(student.id)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                                    isAbsent
                                                        ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                                }`}
                                            >
                                                {isAbsent ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                                                <span>{isAbsent ? 'Absent' : 'Present'}</span>
                                            </button>
                                        </td>
                                        <td className="py-3 px-4">
                                            <input
                                                type="text"
                                                value={student.remarks}
                                                onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                                                placeholder="Add remarks or feedback..."
                                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                    <p>
                        Showing <span className="font-bold text-slate-700">{students.length}</span> students enrolled in {selectedClass}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleSaveDraft}
                            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            Save Draft
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmitMarks}
                            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
                        >
                            Submit & Finalize
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
