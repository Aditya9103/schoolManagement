import React, { useState } from 'react';
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
    Paperclip
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateAssignmentModal({
    isOpen,
    onClose,
    onSaveAssignment,
    editAssignment = null,
}) {
    if (!isOpen) return null;

    const [activeTab, setActiveTab] = useState('overview'); // overview, submissions, grading, analytics, settings
    const [title, setTitle] = useState(editAssignment?.title || '');
    const [subjectName, setSubjectName] = useState(editAssignment?.subjectName || 'Mathematics');
    const [className, setClassName] = useState(editAssignment?.className || 'Class 6 - A');
    const [type, setType] = useState(editAssignment?.type || 'HOMEWORK');
    const [category, setCategory] = useState(editAssignment?.category || 'Chapter Exercise');
    const [deadlineDate, setDeadlineDate] = useState(
        editAssignment?.deadline ? new Date(editAssignment.deadline).toISOString().split('T')[0] : '2026-04-21'
    );
    const [deadlineTime, setDeadlineTime] = useState('23:59');
    const [allowLate, setAllowLate] = useState(true);
    const [notifyStudents, setNotifyStudents] = useState(true);
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
    const [attachments, setAttachments] = useState(
        editAssignment?.attachments?.length
            ? [...editAssignment.attachments]
            : [
                  {
                      title: 'Chapter_1_Problems.pdf',
                      url: '#',
                      size: '2.4 MB',
                      fileType: 'PDF',
                  },
              ]
    );

    const handleAddInstruction = () => {
        if (!newInstruction.trim()) return;
        setInstructions([...instructions, newInstruction.trim()]);
        setNewInstruction('');
    };

    const handleRemoveInstruction = (index) => {
        setInstructions(instructions.filter((_, i) => i !== index));
    };

    const handleSubmit = (status = 'ACTIVE') => {
        if (!title.trim()) {
            toast.error('Please enter an assignment title');
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
            allowLate,
            notifyStudents,
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

                {/* Stepper Tabs Bar (Screen 2) */}
                <div className="px-5 pt-2 border-b border-slate-100 flex items-center gap-6 bg-white overflow-x-auto text-xs font-semibold">
                    {['Overview', 'Submissions', 'Grading', 'Analytics', 'Settings'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`pb-2.5 transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                                activeTab === tab.toLowerCase()
                                    ? 'border-blue-600 text-blue-600 font-bold'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Form & Live Preview Grid */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Form (7 cols) */}
                    <div className="lg:col-span-7 space-y-4">
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
                                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Due Time</label>
                                <input
                                    type="time"
                                    value={deadlineTime}
                                    onChange={(e) => setDeadlineTime(e.target.value)}
                                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="Chapter Exercise"
                                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Toggles */}
                        <div className="flex items-center gap-6 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={allowLate}
                                    onChange={(e) => setAllowLate(e.target.checked)}
                                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                />
                                Allow Late Submissions
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={notifyStudents}
                                    onChange={(e) => setNotifyStudents(e.target.checked)}
                                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                />
                                Notify Students & Parents
                            </label>
                        </div>

                        {/* Instructions Builder */}
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

                        {/* Attachments Section */}
                        <div className="pt-2">
                            <label className="block text-xs font-bold text-slate-700 mb-2">
                                Attachments & Worksheets
                            </label>
                            <div className="border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-2xl p-4 text-center bg-slate-50/50 cursor-pointer">
                                <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                                <p className="text-xs font-bold text-slate-700">Click to upload reference PDF or images</p>
                                <p className="text-[11px] text-slate-400">PDF, DOCX, PNG (Max 10MB)</p>
                            </div>

                            <div className="space-y-2 mt-3">
                                {attachments.map((att, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-2.5 bg-rose-50/50 border border-rose-100 rounded-xl text-xs"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                                            <span className="font-semibold text-slate-900 truncate">{att.title}</span>
                                            <span className="text-[11px] text-slate-400 shrink-0">({att.size})</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                                            className="text-slate-400 hover:text-rose-600 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Live Preview Panel (5 cols) matching Screen 2 */}
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
                                    <span>{subjectName}</span>
                                    <span>•</span>
                                    <span>{className}</span>
                                    <span>•</span>
                                    <span className="text-rose-600 font-bold">Due {deadlineDate}</span>
                                </div>
                            </div>

                            {/* Instructions Preview Card */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                                <p className="text-xs font-bold text-slate-900">Instructions</p>
                                <div className="space-y-1.5 text-xs text-slate-600">
                                    {instructions.map((inst, idx) => (
                                        <div key={idx} className="flex items-start gap-2">
                                            <span className="font-bold text-slate-800">{idx + 1}.</span>
                                            <span>{inst}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Attachments Card */}
                            {attachments.length > 0 && (
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2 mt-4">
                                    <p className="text-xs font-bold text-slate-900">Attachments</p>
                                    {attachments.map((att, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs text-rose-700 font-semibold bg-rose-50 p-2 rounded-lg">
                                            <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                                            <span className="truncate">{att.title}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
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
