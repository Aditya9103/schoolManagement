import React, { useState, useMemo } from 'react';
import { X, BookOpen, Layers, CheckCircle2, AlertCircle, PlusCircle } from 'lucide-react';
import { useAssignTeacherClassMutation, useAssignTeacherSubjectMutation } from '../../../../../store/api/peopleApi';
import { useGetClassesQuery, useGetSubjectsQuery } from '../../../../../store/api/classApi';

export default function AssignClassSubjectModal({
    isOpen,
    onClose,
    teacherId,
    teacherName,
    initialTab = 'class', // 'class' | 'subject'
    onSuccess,
}) {
    if (!isOpen || !teacherId) return null;

    const [activeTab, setActiveTab] = useState(initialTab);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Fetch classes and subjects from backend
    const { data: classesData, isLoading: isLoadingClasses } = useGetClassesQuery();
    const { data: subjectsData, isLoading: isLoadingSubjects } = useGetSubjectsQuery();

    const classesList = useMemo(() => {
        if (Array.isArray(classesData?.data)) return classesData.data;
        if (Array.isArray(classesData?.data?.classes)) return classesData.data.classes;
        if (Array.isArray(classesData)) return classesData;
        return [];
    }, [classesData]);

    const subjectsList = useMemo(() => {
        if (Array.isArray(subjectsData?.data)) return subjectsData.data;
        if (Array.isArray(subjectsData?.data?.subjects)) return subjectsData.data.subjects;
        if (Array.isArray(subjectsData)) return subjectsData;
        return [];
    }, [subjectsData]);

    // Class assignment state
    const [classForm, setClassForm] = useState({
        classId: '',
        sectionId: '',
        assignmentType: 'CLASS_TEACHER',
        academicYear: '2026-27',
    });

    // Subject assignment state
    const [subjectForm, setSubjectForm] = useState({
        subjectId: '',
        classId: '',
        sectionId: '',
        periodsPerWeek: 5,
        academicYear: '2026-27',
    });

    const [assignClass, { isLoading: isAssigningClass }] = useAssignTeacherClassMutation();
    const [assignSubject, { isLoading: isAssigningSubject }] = useAssignTeacherSubjectMutation();

    // Sections for selected class in Class Form
    const classFormSections = useMemo(() => {
        const found = classesList.find((c) => (c.id || c._id) === classForm.classId);
        return found?.sections || [];
    }, [classesList, classForm.classId]);

    // Sections for selected class in Subject Form
    const subjectFormSections = useMemo(() => {
        const found = classesList.find((c) => (c.id || c._id) === subjectForm.classId);
        return found?.sections || [];
    }, [classesList, subjectForm.classId]);

    const handleClassSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!classForm.classId || !classForm.sectionId) {
            setErrorMsg('Please select both a class and a section.');
            return;
        }

        try {
            await assignClass({
                id: teacherId,
                classId: classForm.classId,
                sectionId: classForm.sectionId,
                assignmentType: classForm.assignmentType,
                academicYear: classForm.academicYear,
            }).unwrap();

            setSuccessMsg('Class assigned successfully!');
            setTimeout(() => {
                if (onSuccess) onSuccess();
                onClose();
            }, 800);
        } catch (err) {
            setErrorMsg(err?.data?.message || err?.message || 'Failed to assign class.');
        }
    };

    const handleSubjectSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!subjectForm.subjectId || !subjectForm.classId || !subjectForm.sectionId) {
            setErrorMsg('Please select a subject, class, and section.');
            return;
        }

        try {
            await assignSubject({
                id: teacherId,
                subjectId: subjectForm.subjectId,
                classId: subjectForm.classId,
                sectionId: subjectForm.sectionId,
                periodsPerWeek: Number(subjectForm.periodsPerWeek) || 5,
                academicYear: subjectForm.academicYear,
            }).unwrap();

            setSuccessMsg('Subject allocated successfully!');
            setTimeout(() => {
                if (onSuccess) onSuccess();
                onClose();
            }, 800);
        } catch (err) {
            setErrorMsg(err?.data?.message || err?.message || 'Failed to allocate subject.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
                {/* Header */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 font-display">
                            Academic Allocations
                        </h3>
                        <p className="text-[11px] text-slate-500">
                            Assign class or subjects for <span className="font-bold text-slate-700">{teacherName || 'Teacher'}</span>
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 bg-slate-100/50 p-1.5">
                    <button
                        type="button"
                        onClick={() => { setActiveTab('class'); setErrorMsg(''); setSuccessMsg(''); }}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            activeTab === 'class'
                                ? 'bg-white text-blue-700 shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Layers size={14} />
                        <span>Class Teacher Role</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => { setActiveTab('subject'); setErrorMsg(''); setSuccessMsg(''); }}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            activeTab === 'subject'
                                ? 'bg-white text-blue-700 shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <BookOpen size={14} />
                        <span>Subject Allocation</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {errorMsg && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                            <AlertCircle size={15} />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {successMsg && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-medium">
                            <CheckCircle2 size={15} />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    {activeTab === 'class' ? (
                        <form onSubmit={handleClassSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Select Class *</label>
                                <select
                                    value={classForm.classId}
                                    onChange={(e) => setClassForm((p) => ({ ...p, classId: e.target.value, sectionId: '' }))}
                                    required
                                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 bg-white"
                                >
                                    <option value="">-- Choose Class --</option>
                                    {classesList.map((c) => (
                                        <option key={c.id || c._id} value={c.id || c._id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Select Section *</label>
                                <select
                                    value={classForm.sectionId}
                                    onChange={(e) => setClassForm((p) => ({ ...p, sectionId: e.target.value }))}
                                    required
                                    disabled={!classForm.classId}
                                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 bg-white disabled:opacity-50"
                                >
                                    <option value="">-- Choose Section --</option>
                                    {classFormSections.map((s) => (
                                        <option key={s.id || s._id} value={s.id || s._id}>
                                            Section {s.name} {s.roomNumber ? `(${s.roomNumber})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Role Designation</label>
                                    <select
                                        value={classForm.assignmentType}
                                        onChange={(e) => setClassForm((p) => ({ ...p, assignmentType: e.target.value }))}
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 bg-white"
                                    >
                                        <option value="CLASS_TEACHER">Head Class Teacher</option>
                                        <option value="ASSISTANT_CLASS_TEACHER">Assistant Class Teacher</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
                                    <input
                                        type="text"
                                        value={classForm.academicYear}
                                        onChange={(e) => setClassForm((p) => ({ ...p, academicYear: e.target.value }))}
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-mono"
                                    />
                                </div>
                            </div>

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
                                    disabled={isAssigningClass || isLoadingClasses}
                                    className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                    <PlusCircle size={14} />
                                    {isAssigningClass ? 'Assigning...' : 'Assign Class'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSubjectSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Select Subject *</label>
                                <select
                                    value={subjectForm.subjectId}
                                    onChange={(e) => setSubjectForm((p) => ({ ...p, subjectId: e.target.value }))}
                                    required
                                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 bg-white"
                                >
                                    <option value="">-- Choose Subject --</option>
                                    {subjectsList.map((s) => (
                                        <option key={s.id || s._id} value={s.id || s._id}>
                                            {s.name} {s.code ? `(${s.code})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Class *</label>
                                    <select
                                        value={subjectForm.classId}
                                        onChange={(e) => setSubjectForm((p) => ({ ...p, classId: e.target.value, sectionId: '' }))}
                                        required
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 bg-white"
                                    >
                                        <option value="">-- Class --</option>
                                        {classesList.map((c) => (
                                            <option key={c.id || c._id} value={c.id || c._id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Section *</label>
                                    <select
                                        value={subjectForm.sectionId}
                                        onChange={(e) => setSubjectForm((p) => ({ ...p, sectionId: e.target.value }))}
                                        required
                                        disabled={!subjectForm.classId}
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 bg-white disabled:opacity-50"
                                    >
                                        <option value="">-- Section --</option>
                                        {subjectFormSections.map((s) => (
                                            <option key={s.id || s._id} value={s.id || s._id}>
                                                Section {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Weekly Periods</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="40"
                                        value={subjectForm.periodsPerWeek}
                                        onChange={(e) => setSubjectForm((p) => ({ ...p, periodsPerWeek: e.target.value }))}
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
                                    <input
                                        type="text"
                                        value={subjectForm.academicYear}
                                        onChange={(e) => setSubjectForm((p) => ({ ...p, academicYear: e.target.value }))}
                                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-mono"
                                    />
                                </div>
                            </div>

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
                                    disabled={isAssigningSubject || isLoadingSubjects}
                                    className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                    <PlusCircle size={14} />
                                    {isAssigningSubject ? 'Allocating...' : 'Allocate Subject'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
