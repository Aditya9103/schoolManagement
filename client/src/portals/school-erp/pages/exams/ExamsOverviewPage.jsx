import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles, Award } from 'lucide-react';
import toast from 'react-hot-toast';

import {
    useGetExamOverviewStatsQuery,
    useListExamsQuery,
    useGetRecentResultsQuery,
    useDeleteExamMutation,
} from '../../../../store/api/examApi';

import ExamsMetrics from './components/ExamsMetrics';
import ExamsFilterToolbar from './components/ExamsFilterToolbar';
import ExamsTable from './components/ExamsTable';
import RecentResultsTable from './components/RecentResultsTable';
import ExamsSidebar from './components/ExamsSidebar';

export default function ExamsOverviewPage() {
    const navigate = useNavigate();

    // Filters and pagination state
    const [activeTab, setActiveTab] = useState('ALL');
    const [activeView, setActiveView] = useState('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState('all');
    const [selectedTerm, setSelectedTerm] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // API hooks
    const { data: statsRes, refetch: refetchStats } = useGetExamOverviewStatsQuery();

    const queryParams = useMemo(() => {
        const params = {
            page: currentPage,
            limit: rowsPerPage,
        };
        if (activeTab && activeTab !== 'ALL') params.tab = activeTab;
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (selectedClass && selectedClass !== 'all') params.classApplicable = selectedClass;
        if (selectedTerm && selectedTerm !== 'all') params.term = selectedTerm;
        if (selectedType && selectedType !== 'all') params.type = selectedType;
        if (selectedStatus && selectedStatus !== 'all') params.status = selectedStatus;
        return params;
    }, [currentPage, rowsPerPage, activeTab, searchQuery, selectedClass, selectedTerm, selectedType, selectedStatus]);

    const { data: examsRes, refetch: refetchExams } = useListExamsQuery(queryParams);
    const { data: recentRes } = useGetRecentResultsQuery();
    const [deleteExamMutation] = useDeleteExamMutation();

    const statsData = statsRes?.data || {};
    const examsList = examsRes?.data?.exams || [];
    const totalCount = examsRes?.data?.pagination?.total || 12;
    const totalPages = examsRes?.data?.pagination?.pages || Math.ceil(totalCount / rowsPerPage);
    const recentResults = recentRes?.data || [];

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
            refetchStats();
        } catch (error) {
            console.error('Delete exam failed:', error);
            toast.error(error?.data?.message || 'Failed to delete exam');
        }
    };

    const handleSelectView = (view) => {
        setActiveView(view);
        if (view === 'analytics') {
            navigate('/school/exams/analytics');
        } else if (view === 'calendar') {
            navigate('/school/exams/manage');
        }
    };

    return (
        <div className="space-y-6">
            {/* 1. Hero Motivation Banner (Image 2 matching) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-indigo-900/40">
                <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
                <div className="absolute right-1/3 -bottom-20 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-200 uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            Academic Assessment System
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight font-display">
                            Exams & Results
                        </h1>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                            Create, manage and evaluate exams. Generate results and detailed performance reports for students.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                        {/* Quote Box matching Image 2 */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 text-center sm:text-left">
                            <p className="text-xs italic text-indigo-100 font-medium">
                                &ldquo;Assess today, empower tomorrow.&rdquo;
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate('/school/exams/create')}
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-bold shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Exam</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Top 5 KPI Metric Cards */}
            <ExamsMetrics summary={statsData} />

            {/* 3. Filter Toolbar */}
            <ExamsFilterToolbar
                activeTab={activeTab}
                onSelectTab={(tab) => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                }}
                activeView={activeView}
                onSelectView={handleSelectView}
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
                counts={statsData.examCounts || { all: 12, ongoing: 2, upcoming: 3, completed: 7 }}
            />

            {/* 4. Main 2-Column Content Layout (Image 2) */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                {/* Left 3 Columns: Exams Table + Recent Results Table */}
                <div className="xl:col-span-3 space-y-6">
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

                    <RecentResultsTable
                        results={recentResults}
                        onViewAllResults={() => navigate('/school/exams/results')}
                        onViewStudentResult={(item) => navigate(`/school/exams/results/student/${item.studentId || item.id || '1'}`)}
                    />
                </div>

                {/* Right 1 Column: Result Stats, Class Performance, Upcoming, Quick Actions */}
                <div className="xl:col-span-1 space-y-6">
                    <ExamsSidebar
                        stats={statsData}
                        upcomingExams={statsData.upcomingExams || []}
                    />
                </div>
            </div>
        </div>
    );
}
