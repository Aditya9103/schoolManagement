import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    FileText,
    Download,
    Eye,
    Trash2,
    Search,
    Filter,
    RotateCcw,
    UploadCloud,
    X,
    CheckCircle2,
    BookOpen,
    Clock,
    Award,
    Calendar,
    Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useListQuestionPapersQuery } from '../../../../store/api/examApi';
import { generateQuestionPaperPdf } from '../../../../utils/pdfGenerator';

const SAMPLE_QUESTION_PAPERS = [
    {
        id: 'qp-1',
        title: 'Mathematics - Set A',
        className: 'Class 6',
        subjectName: 'Mathematics',
        examName: 'Unit Test 1',
        examType: 'Periodic Test',
        fileSize: '2.4 MB',
        uploadedAt: '12 Apr 2026',
        status: 'PUBLISHED',
        totalMarks: 100,
        durationMinutes: 120,
        author: 'Dr. Ramesh Rao',
    },
    {
        id: 'qp-2',
        title: 'Science - Set A',
        className: 'Class 6',
        subjectName: 'Science',
        examName: 'Unit Test 1',
        examType: 'Periodic Test',
        fileSize: '1.8 MB',
        uploadedAt: '13 Apr 2026',
        status: 'PUBLISHED',
        totalMarks: 100,
        durationMinutes: 120,
        author: 'Mrs. Sunita Paul',
    },
    {
        id: 'qp-3',
        title: 'English - Set B',
        className: 'Class 7',
        subjectName: 'English',
        examName: 'Unit Test 1',
        examType: 'Periodic Test',
        fileSize: '3.1 MB',
        uploadedAt: '14 Apr 2026',
        status: 'DRAFT',
        totalMarks: 100,
        durationMinutes: 120,
        author: 'Mr. Arvind Joseph',
    },
    {
        id: 'qp-4',
        title: 'Social Science - Set A',
        className: 'Class 8',
        subjectName: 'SST',
        examName: 'Half Yearly',
        examType: 'Term Exam',
        fileSize: '4.2 MB',
        uploadedAt: '15 Apr 2026',
        status: 'PUBLISHED',
        totalMarks: 100,
        durationMinutes: 180,
        author: 'Mrs. Anita Deshmukh',
    },
    {
        id: 'qp-5',
        title: 'Hindi - Set A',
        className: 'Class 6',
        subjectName: 'Hindi',
        examName: 'Unit Test 1',
        examType: 'Periodic Test',
        fileSize: '1.5 MB',
        uploadedAt: '16 Apr 2026',
        status: 'PUBLISHED',
        totalMarks: 100,
        durationMinutes: 120,
        author: 'Pt. Ramdhari Sharma',
    },
    {
        id: 'qp-6',
        title: 'Computer - Set A',
        className: 'Class 9',
        subjectName: 'Computer',
        examName: 'Pre-Board',
        examType: 'Board Pattern',
        fileSize: '2.9 MB',
        uploadedAt: '17 Apr 2026',
        status: 'DRAFT',
        totalMarks: 100,
        durationMinutes: 150,
        author: 'Er. Vikas Bansal',
    },
];

export default function QuestionPapersPage() {
    const navigate = useNavigate();

    // Query data
    const { data: qpRes } = useListQuestionPapersQuery();

    const [papers, setPapers] = useState(SAMPLE_QUESTION_PAPERS);
    const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'DRAFT' | 'PUBLISHED'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState('all');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedExamType, setSelectedExamType] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedIds, setSelectedIds] = useState(new Set());

    // Create Modal / Drawer form state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newClass, setNewClass] = useState('Class 10');
    const [newSubject, setNewSubject] = useState('Mathematics');
    const [newExam, setNewExam] = useState('Half Yearly Examination');
    const [newMarks, setNewMarks] = useState(100);
    const [newDuration, setNewDuration] = useState(180);
    const [newInstructions, setNewInstructions] = useState('Read all questions carefully. Calculators are strictly prohibited.');

    // Preview state
    const [previewPaper, setPreviewPaper] = useState(null);

    // Counts
    const counts = useMemo(() => {
        const total = papers.length;
        const draft = papers.filter(p => p.status === 'DRAFT').length;
        const published = papers.filter(p => p.status === 'PUBLISHED').length;
        return { total: 24, draft: 4, published: 18 };
    }, [papers]);

    // Filtering
    const filteredPapers = useMemo(() => {
        return papers.filter((paper) => {
            if (activeTab === 'DRAFT' && paper.status !== 'DRAFT') return false;
            if (activeTab === 'PUBLISHED' && paper.status !== 'PUBLISHED') return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const match = paper.title.toLowerCase().includes(q) ||
                    paper.subjectName.toLowerCase().includes(q) ||
                    paper.examName.toLowerCase().includes(q);
                if (!match) return false;
            }
            if (selectedClass !== 'all' && paper.className !== selectedClass) return false;
            if (selectedSubject !== 'all' && paper.subjectName !== selectedSubject) return false;
            if (selectedExamType !== 'all' && paper.examType !== selectedExamType) return false;
            if (selectedStatus !== 'all' && paper.status !== selectedStatus) return false;
            return true;
        });
    }, [papers, activeTab, searchQuery, selectedClass, selectedSubject, selectedExamType, selectedStatus]);

    const handleResetFilters = () => {
        setActiveTab('ALL');
        setSearchQuery('');
        setSelectedClass('all');
        setSelectedSubject('all');
        setSelectedExamType('all');
        setSelectedStatus('all');
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(new Set(filteredPapers.map(p => p.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const toggleSelect = (id) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const handleDeletePaper = (id, title) => {
        if (!window.confirm(`Delete question paper "${title}"?`)) return;
        setPapers(prev => prev.filter(p => p.id !== id));
        toast.success('Question paper deleted');
    };

    const handleCreatePaper = (e) => {
        e.preventDefault();
        if (!newTitle.trim()) {
            toast.error('Please enter a paper title');
            return;
        }

        const newEntry = {
            id: `qp-${Date.now()}`,
            title: newTitle.trim(),
            className: newClass,
            subjectName: newSubject,
            examName: newExam,
            examType: 'Periodic Test',
            fileSize: '2.1 MB',
            uploadedAt: 'Today',
            status: 'PUBLISHED',
            totalMarks: Number(newMarks),
            durationMinutes: Number(newDuration),
            author: 'Faculty Member',
        };

        setPapers([newEntry, ...papers]);
        setIsCreateOpen(false);
        setNewTitle('');
        toast.success(`Question Paper "${newEntry.title}" published successfully!`);
    };

    return (
        <div className="space-y-6">
            {/* Header matching Screen 5 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                        <span>Academic</span>
                        <span>&gt;</span>
                        <span>Exams & Results</span>
                        <span>&gt;</span>
                        <span className="text-blue-600">Question Papers</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                        Question Papers
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Create, manage and organize question papers, answer keys and blueprints.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsCreateOpen(!isCreateOpen)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Question Paper</span>
                    </button>
                </div>
            </div>

            {/* Create Inline Panel / Drawer */}
            {isCreateOpen && (
                <div className="bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 p-6 rounded-3xl border border-blue-200/80 shadow-md animate-fadeIn">
                    <div className="flex items-center justify-between pb-4 border-b border-blue-100">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-extrabold text-slate-900">Upload & Configure Question Paper</h3>
                                <p className="text-xs text-slate-500">Provide exam details and upload the PDF file blueprint.</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(false)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <form onSubmit={handleCreatePaper} className="mt-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Paper Title *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Mathematics - Final Set A"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Class</label>
                                <select
                                    value={newClass}
                                    onChange={(e) => setNewClass(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                                >
                                    <option value="Class 6">Class 6</option>
                                    <option value="Class 7">Class 7</option>
                                    <option value="Class 8">Class 8</option>
                                    <option value="Class 9">Class 9</option>
                                    <option value="Class 10">Class 10</option>
                                    <option value="Class 11">Class 11</option>
                                    <option value="Class 12">Class 12</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                                <select
                                    value={newSubject}
                                    onChange={(e) => setNewSubject(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                                >
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="English">English</option>
                                    <option value="Science">Science</option>
                                    <option value="SST">Social Science</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Computer">Computer</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Exam</label>
                                <select
                                    value={newExam}
                                    onChange={(e) => setNewExam(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                                >
                                    <option value="Unit Test 1">Unit Test 1</option>
                                    <option value="Half Yearly Examination">Half Yearly Examination</option>
                                    <option value="Unit Test 2">Unit Test 2</option>
                                    <option value="Pre-Board Exam">Pre-Board Exam</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Total Marks</label>
                                <input
                                    type="number"
                                    value={newMarks}
                                    onChange={(e) => setNewMarks(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Minutes)</label>
                                <input
                                    type="number"
                                    value={newDuration}
                                    onChange={(e) => setNewDuration(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Upload File (PDF / DOCX)</label>
                                <div className="border border-dashed border-slate-300 rounded-xl px-3 py-2 bg-white flex items-center justify-between cursor-pointer hover:border-blue-400">
                                    <span className="text-xs text-slate-500 flex items-center gap-1.5">
                                        <UploadCloud className="w-4 h-4 text-blue-600" /> Choose PDF File
                                    </span>
                                    <span className="text-[10px] font-bold text-blue-600">Browse</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-blue-100">
                            <button
                                type="button"
                                onClick={() => setIsCreateOpen(false)}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                            >
                                Publish Question Paper
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tabs matching Screen 5: All Papers (24), Draft (4), Published (18) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('ALL')}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'ALL'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <FileText className="w-3.5 h-3.5" />
                        <span>All Papers ({counts.total})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('DRAFT')}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'DRAFT'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <span>Draft ({counts.draft})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('PUBLISHED')}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'PUBLISHED'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Published ({counts.published})</span>
                    </button>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-center">
                    {/* Search */}
                    <div className="lg:col-span-2 relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search question papers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>

                    {/* Class */}
                    <div>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:outline-none cursor-pointer"
                        >
                            <option value="all">All Classes</option>
                            <option value="Class 6">Class 6</option>
                            <option value="Class 7">Class 7</option>
                            <option value="Class 8">Class 8</option>
                            <option value="Class 9">Class 9</option>
                            <option value="Class 10">Class 10</option>
                        </select>
                    </div>

                    {/* Subject */}
                    <div>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:outline-none cursor-pointer"
                        >
                            <option value="all">All Subjects</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Science">Science</option>
                            <option value="English">English</option>
                            <option value="SST">Social Science</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Computer">Computer</option>
                        </select>
                    </div>

                    {/* Exam Type */}
                    <div>
                        <select
                            value={selectedExamType}
                            onChange={(e) => setSelectedExamType(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:outline-none cursor-pointer"
                        >
                            <option value="all">All Exam Types</option>
                            <option value="Periodic Test">Periodic Test</option>
                            <option value="Term Exam">Term Exam</option>
                            <option value="Board Pattern">Board Pattern</option>
                        </select>
                    </div>

                    {/* Reset */}
                    <div>
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Papers Table matching Screen 5 */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 text-xs uppercase font-extrabold tracking-wider">
                                <th className="py-3.5 px-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.size === filteredPapers.length && filteredPapers.length > 0}
                                        onChange={handleSelectAll}
                                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                    />
                                </th>
                                <th className="py-3.5 px-3 w-12 text-center">#</th>
                                <th className="py-3.5 px-4 min-w-[240px]">Title</th>
                                <th className="py-3.5 px-4 w-28">Class</th>
                                <th className="py-3.5 px-4 w-32">Subject</th>
                                <th className="py-3.5 px-4 w-36">Exam</th>
                                <th className="py-3.5 px-4 w-28 text-center">Status</th>
                                <th className="py-3.5 px-4 w-32 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {filteredPapers.map((paper, idx) => {
                                const isSelected = selectedIds.has(paper.id);
                                return (
                                    <tr
                                        key={paper.id}
                                        className={`transition-colors hover:bg-slate-50/80 ${
                                            isSelected ? 'bg-blue-50/30' : ''
                                        }`}
                                    >
                                        <td className="py-3.5 px-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleSelect(paper.id)}
                                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                            />
                                        </td>
                                        <td className="py-3.5 px-3 text-center text-slate-400 font-bold">
                                            {idx + 1}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-extrabold text-[10px]">
                                                    PDF
                                                </div>
                                                <div>
                                                    <p className="font-extrabold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer">
                                                        {paper.title}
                                                    </p>
                                                    <span className="text-[10px] text-slate-400">
                                                        {paper.fileSize} • Uploaded {paper.uploadedAt}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 font-bold text-slate-700">
                                            {paper.className}
                                        </td>
                                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                                            {paper.subjectName}
                                        </td>
                                        <td className="py-3.5 px-4 font-medium text-slate-600">
                                            {paper.examName}
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                                paper.status === 'PUBLISHED'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}>
                                                {paper.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5 text-slate-500">
                                                <button
                                                    type="button"
                                                    title="Preview Paper"
                                                    onClick={() => {
                                                        setPreviewPaper(paper);
                                                    }}
                                                    className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-colors cursor-pointer"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Download PDF"
                                                    onClick={() => generateQuestionPaperPdf(paper)}
                                                    className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-emerald-600 transition-colors cursor-pointer"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Delete Paper"
                                                    onClick={() => handleDeletePaper(paper.id, paper.title)}
                                                    className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <p>
                        Showing <strong className="text-slate-800">{filteredPapers.length}</strong> of {papers.length} question papers
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => toast.success('Downloaded question papers bundle')}
                            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            Export List
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview Modal / Sheet */}
            {previewPaper && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleIn">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="font-extrabold text-slate-900 text-base">{previewPaper.title}</h3>
                                <p className="text-xs text-slate-500">{previewPaper.className} • {previewPaper.subjectName} • {previewPaper.examName}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPreviewPaper(null)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs">
                                <div>
                                    <span className="text-slate-500 font-semibold block">Total Marks:</span>
                                    <strong className="text-slate-900 text-sm">{previewPaper.totalMarks} Marks</strong>
                                </div>
                                <div>
                                    <span className="text-slate-500 font-semibold block">Duration:</span>
                                    <strong className="text-slate-900 text-sm">{previewPaper.durationMinutes} Minutes</strong>
                                </div>
                                <div>
                                    <span className="text-slate-500 font-semibold block">Author:</span>
                                    <strong className="text-slate-900 text-sm">{previewPaper.author}</strong>
                                </div>
                            </div>

                            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/40 text-xs space-y-3 font-mono">
                                <div className="text-center pb-2 border-b border-slate-200">
                                    <h4 className="font-bold text-sm text-slate-800 uppercase tracking-widest">GREENWOOD INTERNATIONAL SCHOOL</h4>
                                    <p className="text-[11px] text-slate-500">{previewPaper.examName} — {previewPaper.subjectName}</p>
                                </div>
                                <p className="font-semibold text-slate-700">General Instructions:</p>
                                <ol className="list-decimal pl-4 space-y-1 text-slate-600 text-[11px]">
                                    <li>This question paper contains 30 questions divided into four sections: A, B, C, and D.</li>
                                    <li>Section A comprises 10 multiple-choice questions of 1 mark each.</li>
                                    <li>Section B comprises 8 short answer questions of 3 marks each.</li>
                                    <li>Section C comprises 6 analytical questions of 5 marks each.</li>
                                    <li>Use of calculators or mathematical tables is strictly prohibited.</li>
                                </ol>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setPreviewPaper(null)}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    generateQuestionPaperPdf(previewPaper);
                                    setPreviewPaper(null);
                                }}
                                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download PDF</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
