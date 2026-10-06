import React, { useState } from 'react';
import { X, Megaphone, AlertCircle, Plus, Paperclip, Pin, CheckCircle2 } from 'lucide-react';
import { useCreateNoticeMutation } from '../../../../../store/api/noticeApi';
import { useGetClassesQuery } from '../../../../../store/api/classApi';

export default function CreateNoticeModal({ isOpen, onClose, onSuccess }) {
    if (!isOpen) return null;

    const [createNotice, { isLoading }] = useCreateNoticeMutation();
    const { data: classesData } = useGetClassesQuery();

    const classesList = Array.isArray(classesData?.data)
        ? classesData.data
        : Array.isArray(classesData?.data?.classes)
        ? classesData.data.classes
        : [];

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'ACADEMIC',
        priority: 'NORMAL',
        targetAudience: 'ALL',
        targetClassIds: [],
        attachmentName: '',
        attachmentUrl: '',
        isPinned: false,
        acknowledgmentRequired: false,
    });

    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleClassToggle = (classId) => {
        setFormData((prev) => {
            const exists = prev.targetClassIds.includes(classId);
            return {
                ...prev,
                targetClassIds: exists
                    ? prev.targetClassIds.filter((id) => id !== classId)
                    : [...prev.targetClassIds, classId],
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!formData.title.trim() || !formData.content.trim()) {
            setErrorMsg('Title and Content are required.');
            return;
        }

        const attachments = [];
        if (formData.attachmentUrl.trim()) {
            attachments.push({
                fileName: formData.attachmentName.trim() || 'Attached_Document.pdf',
                fileUrl: formData.attachmentUrl.trim(),
                fileType: 'application/pdf',
                fileSize: '1.5 MB',
            });
        }

        try {
            await createNotice({
                title: formData.title.trim(),
                content: formData.content.trim(),
                category: formData.category,
                priority: formData.priority,
                targetAudience: formData.targetAudience,
                targetClassIds: formData.targetAudience === 'SPECIFIC_CLASSES' ? formData.targetClassIds : [],
                attachments,
                isPinned: formData.isPinned,
                acknowledgmentRequired: formData.acknowledgmentRequired,
            }).unwrap();

            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            setErrorMsg(err?.data?.message || err?.message || 'Failed to publish notice.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
                {/* Header */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                            <Megaphone size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 font-display">Publish New Circular</h3>
                            <p className="text-[11px] text-slate-500">Broadcast administrative, academic, or emergency notice</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {errorMsg && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                            <AlertCircle size={15} />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Notice Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Annual Sports Day 2026-27 Schedule & Guidelines"
                            required
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-semibold"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 bg-white"
                            >
                                <option value="ACADEMIC">Academic Circular</option>
                                <option value="EVENT">School Event</option>
                                <option value="EXAMINATION">Examinations & Datesheet</option>
                                <option value="HOLIDAY">Holiday Notification</option>
                                <option value="ADMINISTRATIVE">Administrative Policy</option>
                                <option value="EMERGENCY">Emergency / Urgent Alert</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Priority Level</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 bg-white"
                            >
                                <option value="LOW">Low (FYI / General Info)</option>
                                <option value="NORMAL">Normal (Standard Bulletin)</option>
                                <option value="HIGH">High (Important Action Required)</option>
                                <option value="URGENT">Urgent (Immediate Campus Alert)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                        <select
                            name="targetAudience"
                            value={formData.targetAudience}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 bg-white font-medium"
                        >
                            <option value="ALL">All Campus (Students, Parents, Teachers, Staff)</option>
                            <option value="STUDENTS">Students Only</option>
                            <option value="PARENTS">Parents / Guardians Only</option>
                            <option value="TEACHERS">Teachers & Academic Faculty</option>
                            <option value="STAFF">All Non-Teaching Staff</option>
                            <option value="SPECIFIC_CLASSES">Specific Grades / Classes</option>
                        </select>
                    </div>

                    {formData.targetAudience === 'SPECIFIC_CLASSES' && (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                            <span className="text-xs font-bold text-slate-700 block">Select Target Classes</span>
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                {classesList.map((c) => {
                                    const classId = c.id || c._id;
                                    const isSelected = formData.targetClassIds.includes(classId);
                                    return (
                                        <button
                                            key={classId}
                                            type="button"
                                            onClick={() => handleClassToggle(classId)}
                                            className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                                                isSelected
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                            }`}
                                        >
                                            {c.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Notice Content / Description *</label>
                        <textarea
                            name="content"
                            rows={5}
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Write the full circular body, instructions, reporting timings, guidelines..."
                            required
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 leading-relaxed placeholder:text-slate-400"
                        />
                    </div>

                    {/* Attachment fields */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                            <Paperclip size={14} className="text-blue-600" />
                            <span>Attachment / Circular Document (Optional)</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                                type="text"
                                name="attachmentName"
                                value={formData.attachmentName}
                                onChange={handleChange}
                                placeholder="File Title (e.g. Schedule_2026.pdf)"
                                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-900"
                            />
                            <input
                                type="url"
                                name="attachmentUrl"
                                value={formData.attachmentUrl}
                                onChange={handleChange}
                                placeholder="Direct File URL (https://...)"
                                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 font-mono"
                            />
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                            <input
                                type="checkbox"
                                name="isPinned"
                                checked={formData.isPinned}
                                onChange={handleChange}
                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                            />
                            <span className="flex items-center gap-1">
                                <Pin size={13} className="text-amber-500" />
                                Pin to Top of Campus Bulletins
                            </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                            <input
                                type="checkbox"
                                name="acknowledgmentRequired"
                                checked={formData.acknowledgmentRequired}
                                onChange={handleChange}
                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                            />
                            <span className="flex items-center gap-1">
                                <CheckCircle2 size={13} className="text-emerald-500" />
                                Require Read Acknowledgment
                            </span>
                        </label>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                            <Plus size={14} />
                            {isLoading ? 'Publishing...' : 'Publish Notice'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
