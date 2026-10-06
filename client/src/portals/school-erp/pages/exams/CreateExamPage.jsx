import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft,
    Check,
    ChevronRight,
    Save,
    Calendar,
    BookOpen,
    Clock,
    Sliders,
    Sparkles,
    Layers,
    AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateExamMutation } from '../../../../store/api/examApi';

export default function CreateExamPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('editId');

    const [currentStep, setCurrentStep] = useState(1);
    const [createExamMutation, { isLoading }] = useCreateExamMutation();

    // Form fields
    const [examName, setExamName] = useState(editId ? 'Unit Test 1' : '');
    const [academicYear, setAcademicYear] = useState('2026 - 27');
    const [examType, setExamType] = useState('PERIODIC_TEST');
    const [term, setTerm] = useState('Term 1');
    const [totalMarks, setTotalMarks] = useState(100);
    const [passingMarks, setPassingMarks] = useState(33);
    const [description, setDescription] = useState('First unit test for all subjects.');
    const [includeInFinalResult, setIncludeInFinalResult] = useState(true);
    const [allowReEvaluation, setAllowReEvaluation] = useState(false);

    // Selected classes
    const [selectedClasses, setSelectedClasses] = useState(new Set(['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']));
    const [activeClassTab, setActiveClassTab] = useState('Class 6');

    // Subjects configuration
    const [subjectsMap, setSubjectsMap] = useState({
        'Class 6': [
            { name: 'English', code: 'ENG', maxMarks: 100, passingMarks: 33, selected: true, date: '2026-04-10', time: '09:00 AM - 12:00 PM' },
            { name: 'Mathematics', code: 'MATH', maxMarks: 100, passingMarks: 33, selected: true, date: '2026-04-11', time: '09:00 AM - 12:00 PM' },
            { name: 'Science', code: 'SCI', maxMarks: 100, passingMarks: 33, selected: true, date: '2026-04-12', time: '09:00 AM - 12:00 PM' },
            { name: 'Social Science', code: 'SST', maxMarks: 100, passingMarks: 33, selected: true, date: '2026-04-13', time: '09:00 AM - 12:00 PM' },
            { name: 'Hindi', code: 'HIN', maxMarks: 100, passingMarks: 33, selected: true, date: '2026-04-14', time: '09:00 AM - 12:00 PM' },
            { name: 'Computer', code: 'COMP', maxMarks: 100, passingMarks: 33, selected: true, date: '2026-04-15', time: '09:00 AM - 12:00 PM' },
            { name: 'Art & Craft', code: 'ART', maxMarks: 100, passingMarks: 33, selected: false, date: '', time: '' },
            { name: 'Physical Education', code: 'PE', maxMarks: 100, passingMarks: 33, selected: false, date: '', time: '' },
        ],
    });

    const toggleClass = (c) => {
        const next = new Set(selectedClasses);
        if (next.has(c)) next.delete(c);
        else next.add(c);
        setSelectedClasses(next);
    };

    const toggleSubject = (idx) => {
        const list = [...(subjectsMap[activeClassTab] || subjectsMap['Class 6'])];
        list[idx].selected = !list[idx].selected;
        setSubjectsMap({ ...subjectsMap, [activeClassTab]: list });
    };

    const handleSaveExam = async (status = 'UPCOMING') => {
        if (!examName.trim()) {
            toast.error('Please enter an exam name');
            setCurrentStep(1);
            return;
        }

        try {
            const payload = {
                name: examName.trim(),
                academicYear,
                type: examType,
                term,
                classesApplicable: Array.from(selectedClasses).join(', ') || '1 - 12',
                startDate: new Date('2026-04-10'),
                endDate: new Date('2026-04-20'),
                status,
                description,
                includeInFinalResult,
                allowReEvaluation,
            };

            await createExamMutation(payload).unwrap();
            toast.success(`Exam ${status === 'DRAFT' ? 'saved as draft' : 'created and published'} successfully!`);
            navigate('/school/exams');
        } catch (error) {
            console.error('Failed to create exam:', error);
            toast.error(error?.data?.message || 'Failed to create exam');
        }
    };

    const steps = [
        { num: 1, label: 'Basic Details', icon: Calendar },
        { num: 2, label: 'Classes & Subjects', icon: BookOpen },
        { num: 3, label: 'Schedule', icon: Clock },
        { num: 4, label: 'Configuration', icon: Sliders },
    ];

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                        <span>Academic</span>
                        <span>&gt;</span>
                        <span>Exams & Results</span>
                        <span>&gt;</span>
                        <span className="text-blue-600">{editId ? 'Edit Exam' : 'Create New Exam'}</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                        {editId ? 'Edit Exam' : 'Create New Exam'}
                    </h1>
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/school/exams')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer self-start sm:self-auto"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Cancel</span>
                </button>
            </div>

            {/* Stepper Wizard Bar matching Screen 2 */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    {steps.map((st, i) => {
                        const Icon = st.icon;
                        const isDone = currentStep > st.num;
                        const isCurrent = currentStep === st.num;

                        return (
                            <React.Fragment key={st.num}>
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(st.num)}
                                    className="flex items-center gap-2.5 focus:outline-none cursor-pointer group"
                                >
                                    <div
                                        className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold transition-all ${
                                            isDone
                                                ? 'bg-emerald-600 text-white shadow-xs'
                                                : isCurrent
                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-4 ring-blue-100'
                                                : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                                        }`}
                                    >
                                        {isDone ? <Check className="w-4 h-4" /> : st.num}
                                    </div>
                                    <span
                                        className={`text-xs font-bold hidden sm:inline ${
                                            isCurrent ? 'text-blue-600' : isDone ? 'text-slate-900' : 'text-slate-400'
                                        }`}
                                    >
                                        {st.label}
                                    </span>
                                </button>

                                {i < steps.length - 1 && (
                                    <div
                                        className={`flex-1 h-0.5 mx-3 sm:mx-4 transition-colors ${
                                            currentStep > st.num ? 'bg-emerald-500' : 'bg-slate-200'
                                        }`}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Step 1: Basic Details (Screen 2) */}
            {currentStep === 1 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-150">
                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                        1. Basic Examination Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Exam Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Exam Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={examName}
                                onChange={(e) => setExamName(e.target.value)}
                                placeholder="e.g. Unit Test 1"
                                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>

                        {/* Academic Year */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Academic Year <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={academicYear}
                                onChange={(e) => setAcademicYear(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                            >
                                <option>2026 - 27</option>
                                <option>2025 - 26</option>
                            </select>
                        </div>

                        {/* Exam Type */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Exam Type <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={examType}
                                onChange={(e) => setExamType(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                            >
                                <option value="PERIODIC_TEST">Periodic Test</option>
                                <option value="TERM_EXAM">Term Exam</option>
                                <option value="BOARD_PATTERN">Board Pattern</option>
                                <option value="MOCK_EXAM">Mock Exam</option>
                            </select>
                        </div>

                        {/* Total Marks per Subject */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Total Marks per Subject
                            </label>
                            <input
                                type="number"
                                value={totalMarks}
                                onChange={(e) => setTotalMarks(Number(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Term */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Term
                            </label>
                            <select
                                value={term}
                                onChange={(e) => setTerm(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                            >
                                <option value="Term 1">Term 1</option>
                                <option value="Term 2">Term 2</option>
                                <option value="Annual">Annual</option>
                            </select>
                        </div>

                        {/* Passing Marks */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                Passing Marks
                            </label>
                            <input
                                type="number"
                                value={passingMarks}
                                onChange={(e) => setPassingMarks(Number(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="First unit test for all subjects."
                            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    {/* Toggles matching Screen 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                            <div>
                                <p className="text-xs font-bold text-slate-900">Include in Final Result</p>
                                <p className="text-[11px] text-slate-500">Weightage calculated in annual consolidated report card</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={includeInFinalResult}
                                onChange={(e) => setIncludeInFinalResult(e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                            <div>
                                <p className="text-xs font-bold text-slate-900">Allow Re-evaluation</p>
                                <p className="text-[11px] text-slate-500">Permit student scrutiny application window after results</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={allowReEvaluation}
                                onChange={(e) => setAllowReEvaluation(e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                            />
                        </label>
                    </div>
                </div>
            )}

            {/* Step 2: Classes & Subjects (Screen 3) */}
            {currentStep === 2 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h2 className="text-base font-bold text-slate-900">
                            2. Select Participating Classes & Map Subjects
                        </h2>
                        <span className="text-xs text-blue-600 font-bold">
                            {selectedClasses.size} Classes Selected
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left column: Select Classes */}
                        <div className="md:col-span-1 border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
                                Select Classes
                            </h3>
                            <div className="space-y-2 max-h-[360px] overflow-y-auto scrollbar-thin">
                                {Array.from({ length: 12 }).map((_, i) => {
                                    const cName = `Class ${i + 1}`;
                                    const isSelected = selectedClasses.has(cName);
                                    const isActive = activeClassTab === cName;

                                    return (
                                        <div
                                            key={cName}
                                            onClick={() => setActiveClassTab(cName)}
                                            className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                                                isActive
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                    : isSelected
                                                    ? 'bg-blue-50 text-blue-900 border-blue-200'
                                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        toggleClass(cName);
                                                    }}
                                                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                                                />
                                                <span className="text-xs font-bold">{cName}</span>
                                            </div>
                                            <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right column: Subjects for Active Class */}
                        <div className="md:col-span-2 border border-slate-200 rounded-2xl p-4 bg-white">
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                    Subjects for {activeClassTab}
                                </h3>
                                <p className="text-[11px] text-slate-400 font-medium">
                                    Select subjects to include in this exam
                                </p>
                            </div>

                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100">
                                        <th className="py-2 px-2 w-8">#</th>
                                        <th className="py-2 px-3">Subject</th>
                                        <th className="py-2 px-3">Code</th>
                                        <th className="py-2 px-3 text-right">Max Marks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {(subjectsMap['Class 6'] || []).map((sub, idx) => (
                                        <tr
                                            key={sub.name}
                                            onClick={() => toggleSubject(idx)}
                                            className="hover:bg-slate-50 transition-colors cursor-pointer"
                                        >
                                            <td className="py-3 px-2">
                                                <input
                                                    type="checkbox"
                                                    checked={sub.selected}
                                                    onChange={() => {}}
                                                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                                                />
                                            </td>
                                            <td className="py-3 px-3 font-bold text-slate-900">
                                                {sub.name}
                                            </td>
                                            <td className="py-3 px-3 font-mono text-slate-500 font-semibold">
                                                {sub.code}
                                            </td>
                                            <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                                                {sub.maxMarks}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Schedule Timetable */}
            {currentStep === 3 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-150">
                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                        3. Schedule & Timetable Planning ({activeClassTab})
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
                            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
                                <tr>
                                    <th className="py-3 px-3.5">Subject</th>
                                    <th className="py-3 px-3.5">Exam Date</th>
                                    <th className="py-3 px-3.5">Start Time</th>
                                    <th className="py-3 px-3.5">End Time</th>
                                    <th className="py-3 px-3.5">Room No</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {(subjectsMap['Class 6'] || [])
                                    .filter((s) => s.selected)
                                    .map((sub, i) => (
                                        <tr key={sub.name}>
                                            <td className="py-3 px-3.5 font-bold text-slate-900">
                                                {sub.name} ({sub.code})
                                            </td>
                                            <td className="py-3 px-3.5">
                                                <input
                                                    type="date"
                                                    defaultValue={sub.date || '2026-04-10'}
                                                    className="bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-pointer focus:bg-white focus:outline-none"
                                                />
                                            </td>
                                            <td className="py-3 px-3.5">
                                                <input
                                                    type="text"
                                                    defaultValue="09:00 AM"
                                                    className="bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-2.5 py-1.5 text-xs font-semibold w-24 focus:bg-white focus:outline-none"
                                                />
                                            </td>
                                            <td className="py-3 px-3.5">
                                                <input
                                                    type="text"
                                                    defaultValue="12:00 PM"
                                                    className="bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-2.5 py-1.5 text-xs font-semibold w-24 focus:bg-white focus:outline-none"
                                                />
                                            </td>
                                            <td className="py-3 px-3.5">
                                                <input
                                                    type="text"
                                                    defaultValue={`Hall ${(i % 3) + 1}`}
                                                    className="bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-2.5 py-1.5 text-xs font-semibold w-20 focus:bg-white focus:outline-none"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Step 4: Grading Scale & Review */}
            {currentStep === 4 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-150">
                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                        4. Final Configuration & Review
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                            <span className="text-[11px] font-bold text-blue-600 uppercase">Exam Name</span>
                            <p className="text-base font-extrabold text-slate-900 mt-1">{examName || 'Unit Test 1'}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{term} • {academicYear}</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                            <span className="text-[11px] font-bold text-emerald-600 uppercase">Classes Included</span>
                            <p className="text-base font-extrabold text-slate-900 mt-1">{selectedClasses.size} Classes</p>
                            <p className="text-xs text-slate-500 mt-0.5">{Array.from(selectedClasses).slice(0, 3).join(', ')}...</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                            <span className="text-[11px] font-bold text-purple-600 uppercase">Grading Scale</span>
                            <p className="text-base font-extrabold text-slate-900 mt-1">CBSE 10-Point Scale</p>
                            <p className="text-xs text-slate-500 mt-0.5">Passing Marks: {passingMarks} / {totalMarks}</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                        <p className="font-bold text-slate-900">Ready to Publish:</p>
                        <p>✓ All class schedules and room assignments will be synchronized to teacher and student portals.</p>
                        <p>✓ Grade entry terminals for class teachers will become active upon the start date.</p>
                    </div>
                </div>
            )}

            {/* Bottom Wizard Footer Buttons */}
            <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                {currentStep > 1 ? (
                    <button
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        Previous
                    </button>
                ) : (
                    <div />
                )}

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => handleSaveExam('DRAFT')}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        Save as Draft
                    </button>

                    {currentStep < 4 ? (
                        <button
                            type="button"
                            onClick={() => setCurrentStep(currentStep + 1)}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        >
                            <span>Next Step</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleSaveExam('UPCOMING')}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            <span>Publish Exam</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
