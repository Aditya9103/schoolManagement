import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import {
    useListExamsQuery,
    useGetExamOverviewStatsQuery,
    useDeleteExamMutation,
} from '../../../../store/api/examApi';

import ExamsFilterToolbar from './components/ExamsFilterToolbar';
import ExamsTable from './components/ExamsTable';

export default function ExamManagementPage() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState('all');
    const [selectedTerm, setSelectedTerm] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const queryParams = useMemo(() => {
        const params = { page: currentPage, limit: rowsPerPage };
        if (activeTab && activeTab !== 'ALL') params.tab = activeTab;
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (selectedClass && selectedClass !== 'all') params.classApplicable = selectedClass;
        if (selectedTerm && selectedTerm !== 'all') params.term = selectedTerm;
        if (selectedType && selectedType !== 'all') params.type = selectedType;
        if (selectedStatus && selectedStatus !== 'all') params.status = selectedStatus;
        return params;
    }, [currentPage, rowsPerPage, activeTab, searchQuery, selectedClass, selectedTerm, selectedType, selectedStatus]);

    const { data: examsRes, refetch: refetchExams } = useListExamsQuery(queryParams);
    const { data: statsRes } = useGetExamOverviewStatsQuery();
    const [deleteExamMutation] = useDeleteExamMutation();

    const examsList = examsRes?.data?.exams || [];
    const totalCount = examsRes?.data?.pagination?.total || 12;
    const totalPages = examsRes?.data?.pagination?.pages || Math.ceil(totalCount / rowsPerPage);
    const examCounts = statsRes?.data?.examCounts || { all: 12, ongoing: 2, upcoming: 3, completed: 7 };

    const handleResetFilters = () => {
        setActiveTab('ALL');
        setSearchQuery('');
        setSelectedClass('all');
        setSelectedTerm('all');
        setSelectedType('all');
        setSelectedStatus('all');
        setCurrentPage(1);
    };

    const handleDeleteExam = async (exam) => {
        const id = typeof exam === 'string' ? exam : exam?._id || exam?.id;
        const name = typeof exam === 'object' && exam?.name ? exam.name : 'this exam';
        const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
        if (!confirmDelete) return;

        try {
            await deleteExamMutation(id).unwrap();
            toast.success('Exam deleted successfully');
            refetchExams();
        } catch (error) {
            console.error('Delete exam failed:', error);
            toast.error(error?.data?.message || 'Failed to delete exam');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header matching Screen 1 (lower left composite) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                        <span>Academic</span>
                        <span>&gt;</span>
                        <span className="text-blue-600">Exam Management</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                        Exam Management
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Manage all exams, view schedules, timetable configurations and status.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/school/exams')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Overview</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/school/exams/create')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Exam</span>
                    </button>
                </div>
            </div>

            {/* Filter toolbar */}
            <ExamsFilterToolbar
                activeTab={activeTab}
                onSelectTab={(tab) => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                }}
                activeView="list"
                onSelectView={(v) => {
                    if (v === 'analytics') navigate('/school/exams/analytics');
                }}
                searchQuery={searchQuery}
                onSearchChange={(q) => {
                    setSearchQuery(q);
                    setCurrentPage(1);
                }}
                selectedClass={selectedClass}
                onClassChange={(c) => {
                    setSelectedClass(c);
                    setCurrentPage(1);
                }}
                selectedTerm={selectedTerm}
                onTermChange={(t) => {
                    setSelectedTerm(t);
                    setCurrentPage(1);
                }}
                selectedType={selectedType}
                onTypeChange={(tp) => {
                    setSelectedType(tp);
                    setCurrentPage(1);
                }}
                selectedStatus={selectedStatus}
                onStatusChange={(st) => {
                    setSelectedStatus(st);
                    setCurrentPage(1);
                }}
                onResetFilters={handleResetFilters}
                counts={examCounts}
            />

            {/* Full width table */}
            <ExamsTable
                exams={examsList}
                totalCount={totalCount}
                currentPage={currentPage}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={(r) => {
                    setRowsPerPage(r);
                    setCurrentPage(1);
                }}
                onCreateExam={() => navigate('/school/exams/create')}
                onEnterMarks={(exam) => navigate(`/school/exams/marks?examId=${exam._id || exam.id}`)}
                onViewResults={(exam) => navigate(`/school/exams/results?examId=${exam._id || exam.id}`)}
                onGenerateReportCards={(exam) => navigate(`/school/exams/report-cards?examId=${exam._id || exam.id}`)}
                onEditExam={(exam) => navigate(`/school/exams/create?editId=${exam._id || exam.id}`)}
                onDeleteExam={handleDeleteExam}
            />
        </div>
    );
}
