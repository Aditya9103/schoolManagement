import React, { useState, useEffect } from 'react';
import {
    X,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    RotateCw,
    Download,
    CheckCircle2,
    Clock,
    AlertCircle,
    Save,
    Award,
    Eye,
    FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SubmissionGradingDrawer({
    isOpen,
    onClose,
    submissions = [],
    initialSubmissionIndex = 0,
    assignmentTitle = '',
    maxMarks = 20,
    onSaveGrade,
}) {
    const list = Array.isArray(submissions) && submissions.length > 0
        ? submissions
        : Array.isArray(submissions?.submissions) && submissions.submissions.length > 0
        ? submissions.submissions
        : [];

    if (!isOpen || list.length === 0) return null;

    const [currentIndex, setCurrentIndex] = useState(initialSubmissionIndex);
    const currentSub = list[currentIndex] || list[0];

    const [marks, setMarks] = useState(currentSub?.marksObtained ?? '');
    const [grade, setGrade] = useState(currentSub?.grade || '');
    const [feedback, setFeedback] = useState(currentSub?.feedback || '');
    const [status, setStatus] = useState(currentSub?.status || 'SUBMITTED');
    const [zoom, setZoom] = useState(100);

    // Sync when current index changes
    useEffect(() => {
        if (currentSub) {
            setMarks(currentSub.marksObtained ?? 18);
            setGrade(currentSub.grade || calculateGrade(currentSub.marksObtained ?? 18, maxMarks));
            setFeedback(currentSub.feedback || '');
            setStatus(currentSub.status || 'SUBMITTED');
            setZoom(100);
        }
    }, [currentIndex, currentSub]);

    function calculateGrade(score, max) {
        const pct = (score / max) * 100;
        if (pct >= 90) return 'A+';
        if (pct >= 80) return 'A';
        if (pct >= 70) return 'B+';
        if (pct >= 60) return 'B';
        if (pct >= 50) return 'C';
        return 'D';
    }

    const handleMarksChange = (val) => {
        const num = Math.max(0, Math.min(maxMarks, Number(val) || 0));
        setMarks(num);
        setGrade(calculateGrade(num, maxMarks));
    };

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    const handleNext = () => {
        if (currentIndex < list.length - 1) setCurrentIndex(currentIndex + 1);
    };

    const handleSave = () => {
        onSaveGrade(currentSub._id, {
            marksObtained: marks,
            grade,
            feedback,
            status: 'GRADED',
        });
        toast.success(`Evaluated ${currentSub.studentName}: ${marks}/${maxMarks} (${grade})`);
        if (currentIndex < list.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-6xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[92vh] animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="p-4 sm:px-6 sm:py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div className="flex items-center gap-3 min-w-0">
                        <img
                            src={
                                currentSub.avatar ||
                                `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentSub.studentName}`
                            }
                            alt={currentSub.studentName}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20 shrink-0"
                        />
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                                    {currentSub.studentName}'s Submission
                                </h3>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    {status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">
                                Class 6 - A • Roll No: {currentSub.rollNo} • Submitted on {currentSub.submittedAt ? new Date(currentSub.submittedAt).toLocaleDateString('en-GB') : '20 Apr 2026'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* Prev / Next buttons */}
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
                            <button
                                type="button"
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-30 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" /> Previous
                            </button>
                            <span className="text-[11px] font-bold text-slate-400 px-1">
                                {currentIndex + 1} / {list.length}
                            </span>
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={currentIndex === submissions.length - 1}
                                className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-30 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                                Next <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 rounded-xl hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Dual-Pane Content Body */}
                <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-slate-100/50">
                    {/* Left Pane: Document Viewer (7 cols) */}
                    <div className="lg:col-span-7 p-4 flex flex-col justify-between border-r border-slate-200 bg-slate-800 text-white">
                        {/* Document Toolbar */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-700 text-xs">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-400" />
                                <span className="font-semibold text-slate-200 truncate">
                                    {currentSub.files?.[0]?.title || 'math_assignment_aarav.pdf'}
                                </span>
                                <span className="text-[11px] text-slate-400">(Page 1 of 3)</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setZoom((z) => Math.max(50, z - 20))}
                                    className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                                    title="Zoom Out"
                                >
                                    <ZoomOut className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-[11px] text-slate-300 font-mono w-10 text-center">
                                    {zoom}%
                                </span>
                                <button
                                    onClick={() => setZoom((z) => Math.min(200, z + 20))}
                                    className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                                    title="Zoom In"
                                >
                                    <ZoomIn className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Interactive Document / Scan Viewer matching Screen 4 */}
                        <div className="flex-1 overflow-auto flex items-center justify-center p-4 my-2">
                            <div
                                className="bg-white rounded-xl shadow-2xl p-6 text-slate-800 transition-all font-serif duration-150 select-none"
                                style={{
                                    width: `${Math.round(440 * (zoom / 100))}px`,
                                    minHeight: `${Math.round(580 * (zoom / 100))}px`,
                                }}
                            >
                                <div className="border-b border-blue-200 pb-2 mb-4 flex justify-between text-xs text-blue-900 font-mono">
                                    <span>Mathematics - Homework 1</span>
                                    <span>Aarav Sharma (6A001)</span>
                                </div>
                                <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                                    <p className="font-bold text-slate-900">Chapter 1: Number Systems & Fractions</p>
                                    <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                                        <p className="font-semibold">Q1. Solve 3/4 + 2/5</p>
                                        <p className="mt-1 pl-3 text-slate-600 font-mono text-[11px]">
                                            LCM of 4 and 5 = 20<br />
                                            = (3×5)/20 + (2×4)/20<br />
                                            = 15/20 + 8/20 = 23/20 = 1 3/20 ✓
                                        </p>
                                    </div>
                                    <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                                        <p className="font-semibold">Q2. Simplify (5/8) × (16/25)</p>
                                        <p className="mt-1 pl-3 text-slate-600 font-mono text-[11px]">
                                            = (5 × 16) / (8 × 25)<br />
                                            = 80 / 200 = 2 / 5 ✓
                                        </p>
                                    </div>
                                    <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                                        <p className="font-semibold">Q3. Word Problem</p>
                                        <p className="mt-1 pl-3 text-slate-600 text-[11px]">
                                            Total distance = 15 km.<br />
                                            Covered by bus = 2/3 of 15 km = 10 km.<br />
                                            Remaining = 15 - 10 = 5 km. ✓
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom notes */}
                        <div className="pt-2 text-center text-[11px] text-slate-400">
                            High-resolution handwritten student scan verified • Original file size 2.1 MB
                        </div>
                    </div>

                    {/* Right Pane: Evaluation & Grading Form (5 cols) matching Screen 4 */}
                    <div className="lg:col-span-5 p-5 sm:p-6 bg-white flex flex-col justify-between overflow-y-auto space-y-4">
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                                Evaluation & Grading
                            </h4>

                            {/* Marks & Grade Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Marks (Out of {maxMarks})
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={maxMarks}
                                        value={marks}
                                        onChange={(e) => handleMarksChange(e.target.value)}
                                        className="w-full text-base font-extrabold text-blue-600 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Calculated Grade
                                    </label>
                                    <div className="flex items-center h-10 px-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 font-extrabold text-base">
                                        <Award className="w-4 h-4 mr-2 text-purple-600" />
                                        <span>Grade {grade}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Teacher Feedback Textarea */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Teacher Feedback & Comments
                                </label>
                                <textarea
                                    rows={4}
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Write qualitative feedback for the student..."
                                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* Quick Action Chips */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">
                                    Quick Action Status
                                </label>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                        type="button"
                                        onClick={() => setStatus('GRADED')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            status === 'GRADED'
                                                ? 'bg-emerald-600 text-white shadow-xs'
                                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                        }`}
                                    >
                                        ✓ Approve & Grade
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStatus('RESUBMISSION_REQUESTED')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            status === 'RESUBMISSION_REQUESTED'
                                                ? 'bg-amber-600 text-white shadow-xs'
                                                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                        }`}
                                    >
                                        ↻ Request Resubmission
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStatus('LATE')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            status === 'LATE'
                                                ? 'bg-rose-600 text-white shadow-xs'
                                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                        }`}
                                    >
                                        ⏱ Mark as Late
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                            >
                                <Save className="w-4 h-4" /> Save Feedback & Continue
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
