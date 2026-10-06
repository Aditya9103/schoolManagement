import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    CheckCircle2,
    Award,
    Calculator,
    Send,
    Eye,
    Sliders,
    Layers,
    AlertCircle,
    Sparkles,
    Check,
    FileCheck,
    TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResultProcessingPage() {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedExam, setSelectedExam] = useState('Half Yearly Examination');
    const [selectedClass, setSelectedClass] = useState('Class 10');
    const [gradingSystem, setGradingSystem] = useState('CBSE'); // 'CBSE' | 'PERCENTAGE' | 'CUSTOM'

    // Additional configuration options
    const [includeCoScholastic, setIncludeCoScholastic] = useState(true);
    const [autoGenerateRank, setAutoGenerateRank] = useState(true);
    const [sendSmsNotification, setSendSmsNotification] = useState(false);
    const [sendEmailNotification, setSendEmailNotification] = useState(true);

    const [isCalculating, setIsCalculating] = useState(false);
    const [isCalculated, setIsCalculated] = useState(true);
    const [isPublished, setIsPublished] = useState(false);

    const handleCalculate = () => {
        setIsCalculating(true);
        setTimeout(() => {
            setIsCalculating(false);
            setIsCalculated(true);
            setCurrentStep(3);
            toast.success(`Results calculated for ${selectedClass} - ${selectedExam}!`);
        }, 800);
    };

    const handlePublish = () => {
        setIsPublished(true);
        setCurrentStep(4);
        toast.success(`Results successfully published to Parent & Student portals!`);
    };

    const PIPELINE_STEPS = [
        { step: 1, label: 'Select Exam' },
        { step: 2, label: 'Configure Grading' },
        { step: 3, label: 'Preview' },
        { step: 4, label: 'Publish' },
    ];

    return (
        <div className="space-y-6">
            {/* Header matching Screen 7 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                        <span>Academic</span>
                        <span>&gt;</span>
                        <span>Exams & Results</span>
                        <span>&gt;</span>
                        <span className="text-blue-600">Process Results</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                            Process Results
                        </h1>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                            <Sparkles className="w-3.5 h-3.5" /> Pipeline V2.4
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Generate comprehensive marks summaries, apply board grading scales and publish to portals.
                    </p>
                </div>

                <div className="flex items-center gap-3">
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
                        onClick={() => navigate('/school/exams/results')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <Eye className="w-4 h-4" />
                        <span>View Marksheet</span>
                    </button>
                </div>
            </div>

            {/* 4-Step Pipeline Wizard Bar matching Screen 7 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between relative max-w-3xl mx-auto">
                    {/* Connecting line */}
                    <div className="absolute left-6 right-6 top-5 -translate-y-1/2 h-1 bg-slate-100 -z-0">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${((currentStep - 1) / (PIPELINE_STEPS.length - 1)) * 100}%` }}
                        />
                    </div>

                    {PIPELINE_STEPS.map((s) => {
                        const isDone = currentStep > s.step;
                        const isCurrent = currentStep === s.step;
                        return (
                            <button
                                key={s.step}
                                type="button"
                                onClick={() => setCurrentStep(s.step)}
                                className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                            >
                                <div
                                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-xs transition-all duration-200 ${
                                        isDone
                                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                                            : isCurrent
                                            ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md shadow-blue-500/20'
                                            : 'bg-white border-2 border-slate-200 text-slate-400 group-hover:border-slate-300'
                                    }`}
                                >
                                    {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : s.step}
                                </div>
                                <span
                                    className={`mt-2 text-xs font-bold transition-colors ${
                                        isCurrent ? 'text-blue-600' : isDone ? 'text-slate-800' : 'text-slate-400'
                                    }`}
                                >
                                    {s.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Interactive Grid matching Screen 7 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Configuration Form (7 cols) */}
                <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                    <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900">1. Exam & Grading Setup</h3>
                            <p className="text-xs text-slate-500">Select target cohort and configure scale rules.</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs">
                            Step {currentStep} of 4
                        </span>
                    </div>

                    <div className="space-y-5">
                        {/* Select Exam & Class */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                                    Select Exam
                                </label>
                                <select
                                    value={selectedExam}
                                    onChange={(e) => setSelectedExam(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                                >
                                    <option value="Half Yearly Examination">Half Yearly Examination (Term 1)</option>
                                    <option value="Unit Test 1">Unit Test 1 (Periodic Test)</option>
                                    <option value="Unit Test 2">Unit Test 2 (Periodic Test)</option>
                                    <option value="Pre-Board Exam">Pre-Board Exam</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                                    Target Class
                                </label>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                                >
                                    <option value="Class 10">Class 10 (All Sections)</option>
                                    <option value="Class 9">Class 9 (All Sections)</option>
                                    <option value="Class 8">Class 8 (All Sections)</option>
                                    <option value="Class 7">Class 7 (All Sections)</option>
                                    <option value="Class 6">Class 6 (All Sections)</option>
                                </select>
                            </div>
                        </div>

                        {/* Grading System Selection matching Screen 7 */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                                Grading System
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    { id: 'CBSE', label: 'CBSE (A1, A2, B1...)', desc: '9-Point Scale benchmarked to percentiles' },
                                    { id: 'PERCENTAGE', label: 'Percentage', desc: 'Distinction (75%), 1st (60%), Pass (33%)' },
                                    { id: 'CUSTOM', label: 'Custom Grading', desc: 'Direct GPA 10.0 scale conversion' },
                                ].map((sys) => {
                                    const active = gradingSystem === sys.id;
                                    return (
                                        <div
                                            key={sys.id}
                                            onClick={() => setGradingSystem(sys.id)}
                                            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                                                active
                                                    ? 'border-blue-600 bg-blue-50/40 text-blue-950'
                                                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                                            }`}
                                        >
                                            <div>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-xs font-extrabold">{sys.label}</span>
                                                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                                        active ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                                                    }`}>
                                                        {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 leading-relaxed">{sys.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Additional calculation flags */}
                        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                            <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeCoScholastic}
                                    onChange={(e) => setIncludeCoScholastic(e.target.checked)}
                                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                />
                                <span>Include Co-Scholastic & Life Skills (Art, Physical Ed, Work Ed)</span>
                            </label>

                            <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={autoGenerateRank}
                                    onChange={(e) => setAutoGenerateRank(e.target.checked)}
                                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                />
                                <span>Auto-generate Class & Cohort Ranks</span>
                            </label>

                            <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={sendEmailNotification}
                                    onChange={(e) => setSendEmailNotification(e.target.checked)}
                                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                />
                                <span>Send automated email scorecard to parents upon publishing</span>
                            </label>
                        </div>

                        {/* Calculate Button */}
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={handleCalculate}
                                disabled={isCalculating}
                                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <Calculator className="w-4 h-4" />
                                <span>{isCalculating ? 'Computing Ledger & Scales...' : 'Calculate Results'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Hero / Preview Summary (5 cols) matching Screen 7 illustration */}
                <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 p-6 sm:p-7 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[460px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold mb-4 backdrop-blur-xs">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Cohort Ledger Overview</span>
                        </div>

                        <h3 className="text-xl font-extrabold tracking-tight">
                            {selectedClass} Results Snapshot
                        </h3>
                        <p className="text-xs text-blue-200 mt-1">
                            {selectedExam} • 2026 - 27 Session
                        </p>

                        {/* Calculation Metric Pills */}
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                                <span className="text-[11px] text-blue-200 uppercase font-semibold">Total Students</span>
                                <div className="text-2xl font-extrabold mt-1 text-white">48</div>
                                <span className="text-[10px] text-emerald-400 font-bold">100% Evaluated</span>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                                <span className="text-[11px] text-blue-200 uppercase font-semibold">Pass Rate</span>
                                <div className="text-2xl font-extrabold mt-1 text-emerald-400">91.7%</div>
                                <span className="text-[10px] text-blue-200 font-bold">44 Passed, 4 Failed</span>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                                <span className="text-[11px] text-blue-200 uppercase font-semibold">Class Average</span>
                                <div className="text-2xl font-extrabold mt-1 text-white">78.6%</div>
                                <span className="text-[10px] text-blue-200 font-bold">Highest: 98%</span>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                                <span className="text-[11px] text-blue-200 uppercase font-semibold">Top Ranker</span>
                                <div className="text-lg font-extrabold mt-1 text-amber-300 truncate">Aarav Sharma</div>
                                <span className="text-[10px] text-blue-200 font-bold">94.4% (Grade A+)</span>
                            </div>
                        </div>
                    </div>

                    {/* Publish Action Section */}
                    <div className="pt-6 border-t border-white/10 mt-6 space-y-3">
                        <div className="flex items-center justify-between text-xs text-blue-200">
                            <span>Status:</span>
                            <span className="font-extrabold text-white">
                                {isPublished ? 'Published to Portals' : isCalculated ? 'Calculated & Ready' : 'Pending Calculation'}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => navigate('/school/exams/results')}
                                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer text-center"
                            >
                                Preview Marksheet
                            </button>

                            <button
                                type="button"
                                onClick={handlePublish}
                                disabled={!isCalculated || isPublished}
                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                    isPublished
                                        ? 'bg-emerald-500 text-white cursor-default'
                                        : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                                }`}
                            >
                                <Send className="w-3.5 h-3.5" />
                                <span>{isPublished ? 'Published ✓' : 'Publish Results'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
