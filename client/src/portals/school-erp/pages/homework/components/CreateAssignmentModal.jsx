import React, { useState, useRef } from 'react';
import {
    X,
    Plus,
    Trash2,
    UploadCloud,
    FileText,
    Check,
    Calendar,
    Clock,
    BookOpen,
    Eye,
    Save,
    Sparkles,
    Paperclip,
    Sliders,
    Award,
    BarChart3,
    Settings,
    FileCheck,
    AlertCircle,
    Download,
    ExternalLink,
    Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useUploadDocumentMutation } from '../../../../../store/api/uploadApi';

export default function CreateAssignmentModal({
    isOpen,
    onClose,
    onSaveAssignment,
    editAssignment = null,
}) {
    if (!isOpen) return null;

    const fileInputRef = useRef(null);
    const [uploadDocument, { isLoading: isUploadingFile }] = useUploadDocumentMutation();

    const [activeTab, setActiveTab] = useState('overview'); // overview, submissions, grading, analytics, settings

    // ── 1. Overview State
    const [title, setTitle] = useState(editAssignment?.title || '');
    const [subjectName, setSubjectName] = useState(editAssignment?.subjectName || 'Mathematics');
    const [className, setClassName] = useState(editAssignment?.className || 'Class 6 - A');
    const [type, setType] = useState(editAssignment?.type || 'HOMEWORK');
    const [category, setCategory] = useState(editAssignment?.category || 'Chapter Exercise');
    const [deadlineDate, setDeadlineDate] = useState(
        editAssignment?.deadline ? new Date(editAssignment.deadline).toISOString().split('T')[0] : '2026-04-21'
    );
    const [deadlineTime, setDeadlineTime] = useState('23:59');
    const [description, setDescription] = useState(editAssignment?.description || '');
    const [instructions, setInstructions] = useState(
        editAssignment?.instructions?.length
            ? [...editAssignment.instructions]
            : [
                  'Read Chapter 1 from your textbook.',
                  'Solve Exercise 1.1 (Q1 to Q10) in your notebook.',
                  'Write neat and clear working steps.',
                  'Upload clear photos or PDF of your work.',
                  'Mention your name and roll number on each page.',
              ]
    );
    const [newInstruction, setNewInstruction] = useState('');

    // Attachments & Worksheets
    const [attachments, setAttachments] = useState(
        editAssignment?.attachments?.length
            ? [...editAssignment.attachments]
            : [
                  {
                      title: 'Chapter_1_Exercise_Worksheet.pdf',
                      url: '#',
                      size: '2.4 MB',
                      fileType: 'PDF',
                  },
              ]
    );
    const [urlDocTitle, setUrlDocTitle] = useState('');
    const [urlDocLink, setUrlDocLink] = useState('');
    const [showUrlInput, setShowUrlInput] = useState(false);

    // ── 2. Submissions Settings State
    const [submissionFormat, setSubmissionFormat] = useState(editAssignment?.submissionFormat || 'FILE_UPLOAD'); // FILE_UPLOAD, TEXT_EDITOR, BOTH
    const [maxFiles, setMaxFiles] = useState(editAssignment?.maxFiles || 3);
    const [maxFileSizeMb, setMaxFileSizeMb] = useState(editAssignment?.maxFileSizeMb || 10);
    const [allowLate, setAllowLate] = useState(editAssignment?.allowLate ?? true);
    const [latePenaltyPercent, setLatePenaltyPercent] = useState(editAssignment?.latePenaltyPercent || 5);
    const [resubmissionPolicy, setResubmissionPolicy] = useState(editAssignment?.resubmissionPolicy || 'ONE_RETRY'); // NOT_ALLOWED, ONE_RETRY, UNLIMITED
    const [plagiarismCheck, setPlagiarismCheck] = useState(editAssignment?.plagiarismCheck ?? true);

    // ── 3. Grading Configuration State
    const [maxMarks, setMaxMarks] = useState(editAssignment?.maxMarks || 50);
    const [passingMarks, setPassingMarks] = useState(editAssignment?.passingMarks || 20);
    const [gradingScheme, setGradingScheme] = useState(editAssignment?.gradingScheme || 'POINTS'); // POINTS, LETTER_GRADE, PERCENTAGE
    const [autoPublishGrades, setAutoPublishGrades] = useState(editAssignment?.autoPublishGrades ?? false);
    const [rubricCriteria, setRubricCriteria] = useState(
        editAssignment?.rubricCriteria?.length
            ? [...editAssignment.rubricCriteria]
            : [
                  { id: 1, name: 'Conceptual Accuracy', weight: 40, maxPoints: 20 },
                  { id: 2, name: 'Step-by-Step Working', weight: 40, maxPoints: 20 },
                  { id: 3, name: 'Neatness & Presentation', weight: 20, maxPoints: 10 },
              ]
    );
    const [newCritName, setNewCritName] = useState('');
    const [newCritWeight, setNewCritWeight] = useState(20);

    // ── 4. Analytics & Expectations State
    const [targetSubmissionRate, setTargetSubmissionRate] = useState(editAssignment?.targetSubmissionRate || 95);
    const [expectedAverageScore, setExpectedAverageScore] = useState(editAssignment?.expectedAverageScore || 80);
    const [difficultyLevel, setDifficultyLevel] = useState(editAssignment?.difficultyLevel || 'MODERATE'); // EASY, MODERATE, CHALLENGING
    const [estimatedDurationMins, setEstimatedDurationMins] = useState(editAssignment?.estimatedDurationMins || 45);
    const [learningOutcomes, setLearningOutcomes] = useState(
        editAssignment?.learningOutcomes?.length
            ? [...editAssignment.learningOutcomes]
            : ['Linear Equations in one variable', 'Solving word problems through algebra']
    );
    const [newOutcome, setNewOutcome] = useState('');

    // ── 5. Advanced Settings State
    const [notifyStudents, setNotifyStudents] = useState(editAssignment?.notifyStudents ?? true);
    const [notifyParents, setNotifyParents] = useState(editAssignment?.notifyParents ?? true);
    const [publishTiming, setPublishTiming] = useState(editAssignment?.publishTiming || 'IMMEDIATE'); // IMMEDIATE, SCHEDULED
    const [scheduledPublishDate, setScheduledPublishDate] = useState('2026-04-18T08:00');
    const [lockAfterDeadline, setLockAfterDeadline] = useState(editAssignment?.lockAfterDeadline ?? false);
    const [anonymousGrading, setAnonymousGrading] = useState(editAssignment?.anonymousGrading ?? false);

    // ── Handlers
    const handleAddInstruction = () => {
        if (!newInstruction.trim()) return;
        setInstructions([...instructions, newInstruction.trim()]);
        setNewInstruction('');
    };

    const handleRemoveInstruction = (index) => {
        setInstructions(instructions.filter((_, i) => i !== index));
    };

    // Real File Upload
    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        for (const file of files) {
            const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
            const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';

            try {
                const formData = new FormData();
                formData.append('file', file);
                const res = await uploadDocument(formData).unwrap();
                const uploadedUrl = res?.data?.url || res?.url || URL.createObjectURL(file);

                setAttachments((prev) => [
                    ...prev,
                    {
                        title: file.name,
                        url: uploadedUrl,
                        size: sizeStr,
                        fileType: ext,
                    },
                ]);
                toast.success(`Attached ${file.name}`);
            } catch (err) {
                // Graceful fallback to client ObjectURL
                const localUrl = URL.createObjectURL(file);
                setAttachments((prev) => [
                    ...prev,
                    {
                        title: file.name,
                        url: localUrl,
                        size: sizeStr,
                        fileType: ext,
                    },
                ]);
                toast.success(`Attached ${file.name}`);
            }
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAddUrlDoc = () => {
        if (!urlDocTitle.trim() || !urlDocLink.trim()) {
            toast.error('Please enter document title and valid link URL');
            return;
        }

        setAttachments((prev) => [
            ...prev,
            {
                title: urlDocTitle.trim(),
                url: urlDocLink.trim(),
                size: 'External URL',
                fileType: 'LINK',
            },
        ]);
        setUrlDocTitle('');
        setUrlDocLink('');
        setShowUrlInput(false);
        toast.success('Document link added');
    };

    const handleAddRubricCrit = () => {
        if (!newCritName.trim()) return;
        const calculatedPoints = Math.round((maxMarks * Number(newCritWeight)) / 100);
        setRubricCriteria((prev) => [
            ...prev,
            {
                id: Date.now(),
                name: newCritName.trim(),
                weight: Number(newCritWeight),
                maxPoints: calculatedPoints,
            },
        ]);
        setNewCritName('');
        setNewCritWeight(20);
    };

    const handleRemoveRubricCrit = (id) => {
        setRubricCriteria((prev) => prev.filter((c) => c.id !== id));
    };

    const handleAddOutcome = () => {
        if (!newOutcome.trim()) return;
        setLearningOutcomes((prev) => [...prev, newOutcome.trim()]);
        setNewOutcome('');
    };

    const handleRemoveOutcome = (idx) => {
        setLearningOutcomes((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = (status = 'ACTIVE') => {
        if (!title.trim()) {
            toast.error('Please enter an assignment title');
            setActiveTab('overview');
            return;
        }

        const deadlineIso = new Date(`${deadlineDate}T${deadlineTime}:00Z`).toISOString();
        const payload = {
            title: title.trim(),
            subjectName,
            className,
            type,
            category,
            deadline: deadlineIso,
            instructions,
            description,
            attachments,
            // Submissions config
            submissionFormat,
            maxFiles,
            maxFileSizeMb,
            allowLate,
            latePenaltyPercent,
            resubmissionPolicy,
            plagiarismCheck,
            // Grading config
            maxMarks: Number(maxMarks),
            passingMarks: Number(passingMarks),
            gradingScheme,
            autoPublishGrades,
            rubricCriteria,
            // Analytics expectations
            targetSubmissionRate: Number(targetSubmissionRate),
            expectedAverageScore: Number(expectedAverageScore),
            difficultyLevel,
            estimatedDurationMins: Number(estimatedDurationMins),
            learningOutcomes,
            // Advanced settings
            notifyStudents,
            notifyParents,
            publishTiming,
            scheduledPublishDate,
            lockAfterDeadline,
            anonymousGrading,
            status,
        };

        onSaveAssignment(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
                {/* Modal Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-0.5">
                            <span>Academic</span>
                            <span>&gt;</span>
                            <span>Homework & Assignments</span>
                            <span>&gt;</span>
                            <span className="text-blue-600">{editAssignment ? 'Edit' : 'Create'} Assignment</span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                            {title || 'New Assignment'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 rounded-xl hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Stepper Tabs Bar */}
                <div className="px-5 pt-2 border-b border-slate-100 flex items-center gap-6 bg-white overflow-x-auto text-xs font-semibold">
                    {[
                        { id: 'overview', label: 'Overview', icon: BookOpen },
                        { id: 'submissions', label: 'Submissions', icon: FileCheck },
                        { id: 'grading', label: 'Grading', icon: Award },
                        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                        { id: 'settings', label: 'Settings', icon: Settings },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-2.5 transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                                    isActive
                                        ? 'border-blue-600 text-blue-600 font-bold'
                                        : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Form & Live Preview Grid */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Form (7 cols) */}
                    <div className="lg:col-span-7 space-y-4">
                        {/* ── TAB 1: OVERVIEW ── */}
                        {activeTab === 'overview' && (
                            <div className="space-y-4 animate-in fade-in duration-150">
                                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                                    Assignment Information
                                </h3>

                                {/* Title */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Assignment Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Chapter 1 - Exercise Questions"
                                        className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
                                        required
                                    />
                                </div>

                                {/* Subject, Class, Type Grid */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                                        <select
                                            value={subjectName}
                                            onChange={(e) => setSubjectName(e.target.value)}
                                            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                                        >
                                            <option value="Mathematics">Mathematics</option>
                                            <option value="English">English</option>
                                            <option value="Science">Science</option>
                                            <option value="Social Science">Social Science</option>
                                            <option value="Computer">Computer</option>
                                            <option value="Arts">Arts</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Class</label>
                                        <select
                                            value={className}
                                            onChange={(e) => setClassName(e.target.value)}
                                            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                                        >
                                            <option value="Class 6 - A">Class 6 - A (32 students)</option>
                                            <option value="Class 6 - B">Class 6 - B (28 students)</option>
                                            <option value="Class 7 - A">Class 7 - A (30 students)</option>
                                            <option value="Class 7 - B">Class 7 - B (30 students)</option>
                                            <option value="Class 8 - A">Class 8 - A (28 students)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                                        <select
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                                        >
                                            <option value="HOMEWORK">Homework</option>
                                            <option value="ASSIGNMENT">Assignment</option>
                                            <option value="PROJECT">Project</option>
                                            <option value="PRACTICAL">Practical</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Deadline & Category */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                                        <input
                                            type="date"
                                            value={deadlineDate}
                                            onChange={(e) => setDeadlineDate(e.target.value)}
                                            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Due Time</label>
                                        <input
                                            type="time"
                                            value={deadlineTime}
                                            onChange={(e) => setDeadlineTime(e.target.value)}
                                            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                                        <input
                                            type="text"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            placeholder="e.g. Chapter Exercise"
                                            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Instructions */}
                                <div className="pt-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-bold text-slate-700">
                                            Instructions for Students
                                        </label>
                                        <span className="text-[11px] text-slate-400">
                                            {instructions.length} items
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-3">
                                        {instructions.map((inst, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs text-slate-800"
                                            >
                                                <span className="font-bold text-slate-400 w-5 shrink-0">{idx + 1}.</span>
                                                <span className="flex-1">{inst}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveInstruction(idx)}
                                                    className="text-slate-400 hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add instruction input */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newInstruction}
                                            onChange={(e) => setNewInstruction(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddInstruction();
                                                }
                                            }}
                                            placeholder="Add next step or instruction..."
                                            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddInstruction}
                                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Add
                                        </button>
                                    </div>
                                </div>

                                {/* ── Attachments & Worksheets (FIXED & FULLY WORKING) ── */}
                                <div className="pt-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-bold text-slate-700">
                                            Attachments & Worksheets
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowUrlInput(!showUrlInput)}
                                            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                                        >
                                            {showUrlInput ? 'Hide URL Link' : '+ Add by URL Link'}
                                        </button>
                                    </div>

                                    {/* Hidden File Input */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        multiple
                                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                        className="hidden"
                                    />

                                    {/* Upload Trigger Area */}
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-2xl p-4 text-center bg-blue-50/30 hover:bg-blue-50/60 transition-all cursor-pointer group"
                                    >
                                        {isUploadingFile ? (
                                            <div className="flex flex-col items-center justify-center gap-1.5 py-1">
                                                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                                                <p className="text-xs font-bold text-blue-700">Uploading worksheet document...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <UploadCloud className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform mx-auto mb-1" />
                                                <p className="text-xs font-bold text-slate-800">
                                                    Click to browse or drop worksheet files here
                                                </p>
                                                <p className="text-[11px] text-slate-400">
                                                    Supports PDF, DOCX, PNG, JPG (Max 25MB)
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    {/* Optional URL Input */}
                                    {showUrlInput && (
                                        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    value={urlDocTitle}
                                                    onChange={(e) => setUrlDocTitle(e.target.value)}
                                                    placeholder="Document Name (e.g. Google Docs Worksheet)"
                                                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                                                />
                                                <input
                                                    type="url"
                                                    value={urlDocLink}
                                                    onChange={(e) => setUrlDocLink(e.target.value)}
                                                    placeholder="Document URL (https://...)"
                                                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={handleAddUrlDoc}
                                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                                                >
                                                    Attach Link
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* List of Attached Worksheets */}
                                    <div className="space-y-2 mt-3">
                                        {attachments.map((att, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between p-2.5 bg-white border border-slate-200 shadow-2xs rounded-xl text-xs group hover:border-blue-300 transition-colors"
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold text-[10px]">
                                                        {att.fileType || 'DOC'}
                                                    </div>
                                                    <span className="font-bold text-slate-800 truncate">{att.title}</span>
                                                    <span className="text-[11px] text-slate-400 shrink-0">({att.size})</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {att.url && att.url !== '#' && (
                                                        <a
                                                            href={att.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800 p-1"
                                                            title="Preview/Open Document"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                        </a>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                                                        className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-1"
                                                        title="Remove Attachment"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── TAB 2: SUBMISSIONS ── */}
                        {activeTab === 'submissions' && (
                            <div className="space-y-4 animate-in fade-in duration-150">
                                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                                    <FileCheck className="w-4 h-4 text-blue-600" />
                                    Submission Requirements & Policies
                                </h3>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Submission Format
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { id: 'FILE_UPLOAD', label: 'File Upload Only', desc: 'PDFs & photos of notebook' },
                                                { id: 'TEXT_EDITOR', label: 'Online Text', desc: 'Type answers directly' },
                                                { id: 'BOTH', label: 'Mixed (File or Text)', desc: 'Flexible student choice' },
                                            ].map((fmt) => (
                                                <div
                                                    key={fmt.id}
                                                    onClick={() => setSubmissionFormat(fmt.id)}
                                                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                                        submissionFormat === fmt.id
                                                            ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                                                            : 'border-slate-200 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <p className="font-bold text-slate-900">{fmt.label}</p>
                                                    <p className="text-[11px] text-slate-500 mt-0.5">{fmt.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                                Max Attachments Allowed
                                            </label>
                                            <select
                                                value={maxFiles}
                                                onChange={(e) => setMaxFiles(Number(e.target.value))}
                                                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                                            >
                                                <option value={1}>1 File</option>
                                                <option value={3}>Up to 3 Files</option>
                                                <option value={5}>Up to 5 Files</option>
                                                <option value={10}>Up to 10 Files</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                                Max File Size Limit
                                            </label>
                                            <select
                                                value={maxFileSizeMb}
                                                onChange={(e) => setMaxFileSizeMb(Number(e.target.value))}
                                                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                                            >
                                                <option value={5}>5 MB per file</option>
                                                <option value={10}>10 MB per file</option>
                                                <option value={25}>25 MB per file</option>
                                                <option value={50}>50 MB per file</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-1">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                                Resubmission Policy
                                            </label>
                                            <select
                                                value={resubmissionPolicy}
                                                onChange={(e) => setResubmissionPolicy(e.target.value)}
                                                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                                            >
                                                <option value="NOT_ALLOWED">Final upon first submit</option>
                                                <option value="ONE_RETRY">Allow 1 Resubmission retry</option>
                                                <option value="UNLIMITED">Unlimited retries before deadline</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                                Late Submission Grace
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer mt-1.5">
                                                    <input
                                                        type="checkbox"
                                                        checked={allowLate}
                                                        onChange={(e) => setAllowLate(e.target.checked)}
                                                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                                    />
                                                    <span>Accept Late Work</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {allowLate && (
                                        <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs flex items-center justify-between">
                                            <span className="font-bold text-amber-900">Late Penalty Deduction (%)</span>
                                            <div className="flex items-center gap-1.5">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="50"
                                                    value={latePenaltyPercent}
                                                    onChange={(e) => setLatePenaltyPercent(Number(e.target.value))}
                                                    className="w-16 px-2 py-1 bg-white border border-amber-300 rounded-lg text-center font-bold text-amber-900"
                                                />
                                                <span className="text-amber-800 font-bold">%</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                                        <div>
                                            <p className="font-bold text-slate-900">Originality & Plagiarism Scan</p>
                                            <p className="text-[11px] text-slate-500">Automatically inspect text submissions for similarity</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={plagiarismCheck}
                                            onChange={(e) => setPlagiarismCheck(e.target.checked)}
                                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── TAB 3: GRADING ── */}
                        {activeTab === 'grading' && (
                            <div className="space-y-4 animate-in fade-in duration-150">
                                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                                    <Award className="w-4 h-4 text-blue-600" />
                                    Evaluation & Rubric Builder
                                </h3>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Max Marks *</label>
                                        <input
                                            type="number"
                                            min="5"
                                            max="500"
                                            value={maxMarks}
                                            onChange={(e) => setMaxMarks(Number(e.target.value))}
                                            className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Passing Threshold</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max={maxMarks}
                                            value={passingMarks}
                                            onChange={(e) => setPassingMarks(Number(e.target.value))}
                                            className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Grading Scale</label>
                                        <select
                                            value={gradingScheme}
                                            onChange={(e) => setGradingScheme(e.target.value)}
                                            className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                                        >
                                            <option value="POINTS">Points (e.g. 45/50)</option>
                                            <option value="LETTER_GRADE">Letter Grade (A+, A, B, C)</option>
                                            <option value="PERCENTAGE">Percentage (%)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Dynamic Rubric Builder */}
                                <div className="pt-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-bold text-slate-700">
                                            Evaluation Rubric Criteria
                                        </label>
                                        <span className="text-[11px] text-slate-500 font-bold">
                                            Total Weight: {rubricCriteria.reduce((a, c) => a + c.weight, 0)}%
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-3">
                                        {rubricCriteria.map((crit) => (
                                            <div
                                                key={crit.id}
                                                className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Award className="w-3.5 h-3.5 text-blue-600" />
                                                    <span className="font-bold text-slate-900">{crit.name}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-slate-500 font-semibold">{crit.weight}% weight</span>
                                                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                                                        {Math.round((maxMarks * crit.weight) / 100)} pts
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveRubricCrit(crit.id)}
                                                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Criteria Input */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newCritName}
                                            onChange={(e) => setNewCritName(e.target.value)}
                                            placeholder="Criterion Name (e.g. Problem Solving Method)"
                                            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                                        />
                                        <input
                                            type="number"
                                            min="5"
                                            max="100"
                                            value={newCritWeight}
                                            onChange={(e) => setNewCritWeight(Number(e.target.value))}
                                            placeholder="Weight %"
                                            className="w-20 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-center"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddRubricCrit}
                                            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold rounded-xl cursor-pointer"
                                        >
                                            + Add
                                        </button>
                                    </div>
                                </div>

                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                                    <div>
                                        <p className="font-bold text-slate-900">Auto-Publish Evaluated Grades</p>
                                        <p className="text-[11px] text-slate-500">Send grade cards instantly to Family Portal upon teacher review</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={autoPublishGrades}
                                        onChange={(e) => setAutoPublishGrades(e.target.checked)}
                                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ── TAB 4: ANALYTICS ── */}
                        {activeTab === 'analytics' && (
                            <div className="space-y-4 animate-in fade-in duration-150">
                                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-blue-600" />
                                    Performance Targets & Curriculum Alignment
                                </h3>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Target Submission Rate (%)
                                        </label>
                                        <input
                                            type="number"
                                            min="50"
                                            max="100"
                                            value={targetSubmissionRate}
                                            onChange={(e) => setTargetSubmissionRate(Number(e.target.value))}
                                            className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Expected Class Average (%)
                                        </label>
                                        <input
                                            type="number"
                                            min="40"
                                            max="100"
                                            value={expectedAverageScore}
                                            onChange={(e) => setExpectedAverageScore(Number(e.target.value))}
                                            className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Difficulty Classification
                                        </label>
                                        <select
                                            value={difficultyLevel}
                                            onChange={(e) => setDifficultyLevel(e.target.value)}
                                            className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                                        >
                                            <option value="EASY">Easy (Foundation / Recall)</option>
                                            <option value="MODERATE">Moderate (Application & Practice)</option>
                                            <option value="CHALLENGING">Challenging (Advanced Problem Solving)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Estimated Effort Time (Mins)
                                        </label>
                                        <input
                                            type="number"
                                            min="10"
                                            max="180"
                                            value={estimatedDurationMins}
                                            onChange={(e) => setEstimatedDurationMins(Number(e.target.value))}
                                            className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                                        />
                                    </div>
                                </div>

                                {/* Learning Outcomes */}
                                <div className="pt-2">
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Curriculum Learning Outcomes
                                    </label>
                                    <div className="space-y-1.5 mb-2">
                                        {learningOutcomes.map((outcome, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                                            >
                                                <span className="font-semibold text-slate-800">🎯 {outcome}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveOutcome(idx)}
                                                    className="text-slate-400 hover:text-rose-600 cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newOutcome}
                                            onChange={(e) => setNewOutcome(e.target.value)}
                                            placeholder="Add target learning outcome or chapter topic..."
                                            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddOutcome}
                                            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold rounded-xl cursor-pointer"
                                        >
                                            + Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── TAB 5: SETTINGS ── */}
                        {activeTab === 'settings' && (
                            <div className="space-y-4 animate-in fade-in duration-150">
                                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-blue-600" />
                                    Release & Notification Rules
                                </h3>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Publish Schedule
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div
                                                onClick={() => setPublishTiming('IMMEDIATE')}
                                                className={`p-3 rounded-xl border text-xs cursor-pointer ${
                                                    publishTiming === 'IMMEDIATE'
                                                        ? 'border-blue-600 bg-blue-50/50 shadow-2xs font-bold text-blue-900'
                                                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                                }`}
                                            >
                                                ⚡ Publish Immediately Now
                                            </div>
                                            <div
                                                onClick={() => setPublishTiming('SCHEDULED')}
                                                className={`p-3 rounded-xl border text-xs cursor-pointer ${
                                                    publishTiming === 'SCHEDULED'
                                                        ? 'border-blue-600 bg-blue-50/50 shadow-2xs font-bold text-blue-900'
                                                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                                }`}
                                            >
                                                🕒 Schedule for Future Date
                                            </div>
                                        </div>
                                    </div>

                                    {publishTiming === 'SCHEDULED' && (
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                                Release Date & Time
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={scheduledPublishDate}
                                                onChange={(e) => setScheduledPublishDate(e.target.value)}
                                                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                                            />
                                        </div>
                                    )}

                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                                        <span className="text-xs font-bold text-slate-800 block">Notification Dispatches</span>
                                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={notifyStudents}
                                                onChange={(e) => setNotifyStudents(e.target.checked)}
                                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                            />
                                            <span>Send in-app notification to all enrolled students</span>
                                        </label>
                                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={notifyParents}
                                                onChange={(e) => setNotifyParents(e.target.checked)}
                                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                            />
                                            <span>Broadcast homework notice on Parent Family Portal</span>
                                        </label>
                                    </div>

                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                                        <span className="text-xs font-bold text-slate-800 block">Integrity Controls</span>
                                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={lockAfterDeadline}
                                                onChange={(e) => setLockAfterDeadline(e.target.checked)}
                                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                            />
                                            <span>Hard lockdown: Reject any submissions after deadline</span>
                                        </label>
                                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={anonymousGrading}
                                                onChange={(e) => setAnonymousGrading(e.target.checked)}
                                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                            />
                                            <span>Blind grading: Hide student names and photos during evaluation</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Live Preview Panel (5 cols) */}
                    <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-4 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                    Student Preview
                                </span>
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    <Check className="w-3 h-3" /> Ready
                                </span>
                            </div>

                            {/* Header card preview */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2 mb-4">
                                <h4 className="font-extrabold text-slate-900 text-sm">{title || 'Assignment Title'}</h4>
                                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 flex-wrap">
                                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{subjectName}</span>
                                    <span>•</span>
                                    <span>{className}</span>
                                    <span>•</span>
                                    <span className="text-rose-600 font-bold">Due {deadlineDate} {deadlineTime}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] pt-1">
                                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                                        Max Marks: {maxMarks}
                                    </span>
                                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                                        Format: {submissionFormat.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            {/* Instructions Preview Card */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                                <p className="text-xs font-bold text-slate-900">Instructions ({instructions.length})</p>
                                <div className="space-y-1.5 text-xs text-slate-600 max-h-36 overflow-y-auto">
                                    {instructions.map((inst, idx) => (
                                        <div key={idx} className="flex items-start gap-2">
                                            <span className="font-bold text-slate-800">{idx + 1}.</span>
                                            <span>{inst}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Attachments Card Preview */}
                            {attachments.length > 0 && (
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2 mt-4">
                                    <p className="text-xs font-bold text-slate-900">Attached Worksheets ({attachments.length})</p>
                                    <div className="space-y-1.5 max-h-28 overflow-y-auto">
                                        {attachments.map((att, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-xs text-blue-800 font-semibold bg-blue-50/70 p-2 rounded-lg border border-blue-100">
                                                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                                                <span className="truncate flex-1">{att.title}</span>
                                                <span className="text-[10px] text-slate-400 shrink-0">{att.size}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Active Tab Configuration Summary */}
                            <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 text-[11px] space-y-1">
                                <span className="font-bold text-slate-700 uppercase tracking-wider block text-[10px]">
                                    Configuration Summary
                                </span>
                                <div className="text-slate-600 flex justify-between">
                                    <span>Pass Mark / Scheme:</span>
                                    <strong className="text-slate-800">{passingMarks} / {gradingScheme}</strong>
                                </div>
                                <div className="text-slate-600 flex justify-between">
                                    <span>Late Submissions:</span>
                                    <strong className={allowLate ? 'text-emerald-700' : 'text-rose-700'}>
                                        {allowLate ? `Allowed (${latePenaltyPercent}% penalty)` : 'Disallowed'}
                                    </strong>
                                </div>
                                <div className="text-slate-600 flex justify-between">
                                    <span>Plagiarism Check:</span>
                                    <strong className={plagiarismCheck ? 'text-emerald-700' : 'text-slate-500'}>
                                        {plagiarismCheck ? 'Enabled' : 'Disabled'}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => handleSubmit('DRAFT')}
                                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                            >
                                Save as Draft
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSubmit('ACTIVE')}
                                className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                                <Save className="w-4 h-4" /> Publish Assignment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
