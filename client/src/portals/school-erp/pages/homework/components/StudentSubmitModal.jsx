import React, { useState } from 'react';
import {
    X,
    UploadCloud,
    FileText,
    Check,
    Calendar,
    Clock,
    Send,
    AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentSubmitModal({
    isOpen,
    onClose,
    assignment,
    onSubmitWork,
}) {
    if (!isOpen || !assignment) return null;

    const [uploadedFile, setUploadedFile] = useState(null);
    const [comments, setComments] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile({
                title: file.name,
                url: '#',
                size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                fileType: file.type.includes('pdf') ? 'PDF' : 'IMAGE',
            });
            toast.success(`Attached ${file.name}`);
        }
    };

    const handleSubmit = () => {
        if (!uploadedFile) {
            toast.error('Please upload your completed work before submitting');
            return;
        }

        onSubmitWork({
            files: [uploadedFile],
            comments,
        });
        toast.success('Homework submitted successfully!');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
                {/* Header matching Screen 7 */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-0.5">
                            <span>Academic</span>
                            <span>&gt;</span>
                            <span>Homework & Assignments</span>
                            <span>&gt;</span>
                            <span className="text-blue-600">Submit Assignment</span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                            {assignment.title}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {assignment.subjectName} • {assignment.className} • Due: {assignment.deadlineFormatted || '21 Apr 2026, 11:59 PM'}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Instructions Box */}
                    <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2 text-xs">
                        <span className="font-bold text-blue-900">Instructions:</span>
                        <div className="space-y-1 text-slate-600">
                            {(assignment.instructions?.length ? assignment.instructions : [
                                'Read Chapter from your textbook.',
                                'Solve questions in your notebook clearly.',
                                'Upload clear photos or PDF of your work.',
                                'Mention your name and roll number on each page.',
                            ]).map((inst, i) => (
                                <p key={i}>
                                    <span className="font-semibold text-slate-800">{i + 1}.</span> {inst}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Drag & Drop File Zone */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Upload Your Work *
                        </label>
                        <label
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                const file = e.dataTransfer.files?.[0];
                                if (file) {
                                    setUploadedFile({
                                        title: file.name,
                                        url: '#',
                                        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                                        fileType: file.type.includes('pdf') ? 'PDF' : 'IMAGE',
                                    });
                                    toast.success(`Attached ${file.name}`);
                                }
                            }}
                            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                                isDragging
                                    ? 'border-blue-500 bg-blue-50/40'
                                    : uploadedFile
                                    ? 'border-emerald-400 bg-emerald-50/20'
                                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
                            }`}
                        >
                            <input
                                type="file"
                                accept=".pdf, image/png, image/jpeg, image/jpg"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 border border-blue-100">
                                <UploadCloud className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-bold text-slate-800">
                                {uploadedFile ? uploadedFile.title : 'Drag & drop files here or click to browse'}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                {uploadedFile ? `Ready to submit (${uploadedFile.size})` : 'Supports PDF, JPG, PNG (Max 10 MB)'}
                            </p>
                        </label>
                    </div>

                    {/* Add Comments */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Add Comments (Optional)
                        </label>
                        <textarea
                            rows={3}
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Write any additional comments here..."
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!uploadedFile}
                        className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                        <Send className="w-4 h-4" /> Submit Assignment
                    </button>
                </div>
            </div>
        </div>
    );
}
