import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Sliders,
    Plus,
    Save,
    RotateCcw,
    Trash2,
    Edit2,
    Check,
    X,
    Sparkles,
    FileText,
    Bell,
    CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_GRADES = [
    { id: '1', grade: 'A1', minMarks: 91, maxMarks: 100, point: 10.0, description: 'Outstanding' },
    { id: '2', grade: 'A2', minMarks: 81, maxMarks: 90, point: 9.0, description: 'Excellent' },
    { id: '3', grade: 'B1', minMarks: 71, maxMarks: 80, point: 8.0, description: 'Very Good' },
    { id: '4', grade: 'B2', minMarks: 61, maxMarks: 70, point: 7.0, description: 'Good' },
    { id: '5', grade: 'C1', minMarks: 51, maxMarks: 60, point: 6.0, description: 'Satisfactory' },
    { id: '6', grade: 'C2', minMarks: 41, maxMarks: 50, point: 5.0, description: 'Fair' },
    { id: '7', grade: 'D', minMarks: 33, maxMarks: 40, point: 4.0, description: 'Marginal' },
    { id: '8', grade: 'E', minMarks: 0, maxMarks: 32, point: 0.0, description: 'Needs Improvement / Fail' },
];

export default function ResultSettingsPage() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('Grading System');
    const [gradingScaleName, setGradingScaleName] = useState('CBSE Standard 9-Point Scale');
    const [grades, setGrades] = useState(DEFAULT_GRADES);

    // Add grade inline row state
    const [isAdding, setIsAdding] = useState(false);
    const [newGrade, setNewGrade] = useState('');
    const [newMin, setNewMin] = useState('');
    const [newMax, setNewMax] = useState('');
    const [newPoint, setNewPoint] = useState('');
    const [newDesc, setNewDesc] = useState('');

    // Publish settings state
    const [autoPublishRank, setAutoPublishRank] = useState(true);
    const [showPercentageOnPortal, setShowPercentageOnPortal] = useState(true);
    const [sendSmsToParents, setSendSmsToParents] = useState(false);
    const [sendEmailScorecards, setSendEmailScorecards] = useState(true);
    const [allowStudentReEvaluation, setAllowStudentReEvaluation] = useState(true);
    const [reEvaluationWindowDays, setReEvaluationWindowDays] = useState(14);

    // Template preferences
    const [selectedTemplate, setSelectedTemplate] = useState('CBSE_CREST');

    const handleAddGrade = (e) => {
        e.preventDefault();
        if (!newGrade.trim() || newMin === '' || newMax === '') {
            toast.error('Please fill in Grade and Percentage Range');
            return;
        }

        const item = {
            id: `g-${Date.now()}`,
            grade: newGrade.trim().toUpperCase(),
            minMarks: Number(newMin),
            maxMarks: Number(newMax),
            point: Number(newPoint) || 0,
            description: newDesc.trim() || 'Custom Tier',
        };

        setGrades([...grades, item]);
        setIsAdding(false);
        setNewGrade('');
        setNewMin('');
        setNewMax('');
        setNewPoint('');
        setNewDesc('');
        toast.success(`Added Grade ${item.grade}`);
    };

    const handleDeleteGrade = (id) => {
        setGrades(grades.filter(g => g.id !== id));
        toast.success('Grade removed from scale');
    };

    const handleSaveAll = () => {
        toast.success('Result and grading settings successfully updated!');
    };

    return (
        <div className="space-y-6">
            {/* Header matching Screen 12 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                        <span>Academic</span>
                        <span>&gt;</span>
                        <span>Exams & Results</span>
                        <span>&gt;</span>
                        <span className="text-blue-600">Settings</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                            Result Settings
                        </h1>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                            <Sparkles className="w-3.5 h-3.5" /> Institutional Rules
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Configure grading system, report card templates, and student result publication workflows.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
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
                        onClick={handleSaveAll}
                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                        <Save className="w-4 h-4" />
                        <span>Save Preferences</span>
                    </button>
                </div>
            </div>

            {/* Navigation Tabs matching Screen 12 */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                {['Grading System', 'Result Templates', 'Publish Settings'].map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeTab === tab
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab 1: Grading System Table matching Screen 12 */}
            {activeTab === 'Grading System' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900">Grading Scale Definition</h3>
                            <p className="text-xs text-slate-500">Benchmark score intervals against standardized letter grades.</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setGrades(DEFAULT_GRADES)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reset to CBSE 9-Point Scale</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsAdding(!isAdding)}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Grade</span>
                            </button>
                        </div>
                    </div>

                    {/* Add Inline Row Form */}
                    {isAdding && (
                        <form onSubmit={handleAddGrade} className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-wrap items-center gap-3">
                            <input
                                type="text"
                                placeholder="Grade (e.g. A*)"
                                required
                                value={newGrade}
                                onChange={(e) => setNewGrade(e.target.value)}
                                className="w-24 px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white uppercase font-bold"
                            />
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    placeholder="Min %"
                                    required
                                    value={newMin}
                                    onChange={(e) => setNewMin(e.target.value)}
                                    className="w-20 px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-center"
                                />
                                <span className="text-slate-400 font-bold">-</span>
                                <input
                                    type="number"
                                    placeholder="Max %"
                                    required
                                    value={newMax}
                                    onChange={(e) => setNewMax(e.target.value)}
                                    className="w-20 px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-center"
                                />
                            </div>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="Grade Point"
                                value={newPoint}
                                onChange={(e) => setNewPoint(e.target.value)}
                                className="w-28 px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-center"
                            />
                            <input
                                type="text"
                                placeholder="Description (e.g. Exceptional)"
                                value={newDesc}
                                onChange={(e) => setNewDesc(e.target.value)}
                                className="flex-1 min-w-[180px] px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white"
                            />
                            <button
                                type="submit"
                                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                            >
                                Add Tier
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </form>
                    )}

                    {/* Table matching Screen 12 */}
                    <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 text-xs uppercase font-extrabold tracking-wider">
                                    <th className="py-3 px-4 w-28">Grade</th>
                                    <th className="py-3 px-4 w-44">Percentage Range</th>
                                    <th className="py-3 px-4 w-32 text-center">Grade Point</th>
                                    <th className="py-3 px-4 min-w-[200px]">Description</th>
                                    <th className="py-3 px-4 w-24 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                                {grades.map((g) => (
                                    <tr key={g.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md font-extrabold text-xs ${
                                                g.grade.startsWith('A')
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : g.grade.startsWith('B')
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : g.grade.startsWith('C')
                                                    ? 'bg-amber-100 text-amber-800'
                                                    : 'bg-rose-100 text-rose-800'
                                            }`}>
                                                {g.grade}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 font-mono font-bold text-slate-700">
                                            {g.minMarks}% – {g.maxMarks}%
                                        </td>
                                        <td className="py-3 px-4 text-center font-extrabold text-slate-800">
                                            {g.point.toFixed(1)}
                                        </td>
                                        <td className="py-3 px-4 font-medium text-slate-700">
                                            {g.description}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteGrade(g.id)}
                                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Tab 2: Result Templates */}
            {activeTab === 'Result Templates' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900">Official Report Card Layouts</h3>
                        <p className="text-xs text-slate-500">Select active print template applied to term scorecards.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { id: 'CBSE_CREST', name: 'Greenwood Crest Formal', desc: 'Official CBSE border, dual signatures, and grade distribution charts.' },
                            { id: 'MODERN_CLEAN', name: 'Modern Minimalist', desc: 'Clean typography, QR verification code, and skill progress bars.' },
                            { id: 'CLASSIC_TRANSCRIPT', name: 'Academic Ledger Transcript', desc: 'High density marks listing with co-scholastic commentary.' },
                        ].map((tpl) => {
                            const isSelected = selectedTemplate === tpl.id;
                            return (
                                <div
                                    key={tpl.id}
                                    onClick={() => setSelectedTemplate(tpl.id)}
                                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                                        isSelected
                                            ? 'border-blue-600 bg-blue-50/40 text-blue-950 ring-2 ring-blue-500/20'
                                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <FileText className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                                            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                                isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                                            }`}>
                                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                            </span>
                                        </div>
                                        <h4 className="font-extrabold text-sm">{tpl.name}</h4>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tpl.desc}</p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                                        <span className={isSelected ? 'text-blue-600' : 'text-slate-400'}>
                                            {isSelected ? 'Active Template' : 'Click to Select'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Tab 3: Publish Settings */}
            {activeTab === 'Publish Settings' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900">Student & Parent Portal Preferences</h3>
                        <p className="text-xs text-slate-500">Determine access control and notifications when exam results are published.</p>
                    </div>

                    <div className="space-y-4 max-w-2xl">
                        <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                            <div>
                                <span className="text-xs font-extrabold text-slate-900 block">Auto-calculate Class and Cohort Ranks</span>
                                <span className="text-[11px] text-slate-500">Ranks are generated automatically upon score submission</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={autoPublishRank}
                                onChange={(e) => setAutoPublishRank(e.target.checked)}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                        </label>

                        <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                            <div>
                                <span className="text-xs font-extrabold text-slate-900 block">Show Total Percentage on Student Portal</span>
                                <span className="text-[11px] text-slate-500">Students and parents can view calculated aggregate percentages</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={showPercentageOnPortal}
                                onChange={(e) => setShowPercentageOnPortal(e.target.checked)}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                        </label>

                        <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                            <div>
                                <span className="text-xs font-extrabold text-slate-900 block">Dispatch Automated Email Scorecard</span>
                                <span className="text-[11px] text-slate-500">Instantly email verified PDF report card to registered primary parent</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={sendEmailScorecards}
                                onChange={(e) => setSendEmailScorecards(e.target.checked)}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                        </label>

                        <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                            <div>
                                <span className="text-xs font-extrabold text-slate-900 block">Allow Student Re-Evaluation Requests</span>
                                <span className="text-[11px] text-slate-500">Students can submit re-checking disputes for individual subjects</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={allowStudentReEvaluation}
                                onChange={(e) => setAllowStudentReEvaluation(e.target.checked)}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}
