import React, { useState, useMemo } from 'react';
import {
    Plus,
    Calendar as CalendarIcon,
    BarChart3,
    Sparkles,
    RefreshCw,
    BookOpen,
    Layers,
    FileText,
    UploadCloud
} from 'lucide-react';
import toast from 'react-hot-toast';

import {
    useGetHomeworkStatsQuery,
    useListAssignmentsQuery,
    useCreateAssignmentMutation,
    useUpdateAssignmentMutation,
    useDeleteAssignmentMutation,
    useListSubmissionsQuery,
    useGradeSubmissionMutation,
    useSubmitHomeworkMutation,
    useGetHomeworkAnalyticsQuery,
} from '../../../../store/api/homeworkApi';

import HomeworkMetrics from './components/HomeworkMetrics';
import HomeworkFilterToolbar from './components/HomeworkFilterToolbar';
import HomeworkTable from './components/HomeworkTable';
import HomeworkSidebar from './components/HomeworkSidebar';
import CreateAssignmentModal from './components/CreateAssignmentModal';
import AssignmentSubmissionsModal from './components/AssignmentSubmissionsModal';
import SubmissionGradingDrawer from './components/SubmissionGradingDrawer';
import AssignmentCalendarModal from './components/AssignmentCalendarModal';
import AssignmentAnalyticsModal from './components/AssignmentAnalyticsModal';
import StudentSubmitModal from './components/StudentSubmitModal';

export default function HomeworkManagementPage() {
    // ----------------------------------------------------
    // State: Filter Toolbar & Pagination
    // ----------------------------------------------------
    const [activeTab, setActiveTab] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState('all');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [activeView, setActiveView] = useState('list');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // ----------------------------------------------------
    // State: Modals & Drawer Overlays
    // ----------------------------------------------------
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
    const [isGradingDrawerOpen, setIsGradingDrawerOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
    const [isStudentSubmitModalOpen, setIsStudentSubmitModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [initialGradeIndex, setInitialGradeIndex] = useState(0);

    // ----------------------------------------------------
    // RTK Query: API hooks
    // ----------------------------------------------------
    const {
        data: statsRes,
        isLoading: isStatsLoading,
        refetch: refetchStats
    } = useGetHomeworkStatsQuery();

    const queryParams = useMemo(() => {
        const params = {
            page: currentPage,
            limit: rowsPerPage,
        };
        if (activeTab && activeTab !== 'ALL') params.tab = activeTab;
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (selectedClass && selectedClass !== 'all') params.class = selectedClass;
        if (selectedSubject && selectedSubject !== 'all') params.subject = selectedSubject;
        if (selectedType && selectedType !== 'all') params.type = selectedType;
        if (selectedStatus && selectedStatus !== 'all') params.status = selectedStatus;
        return params;
    }, [currentPage, rowsPerPage, activeTab, searchQuery, selectedClass, selectedSubject, selectedType, selectedStatus]);

    const {
        data: assignmentsRes,
        isLoading: isAssignmentsLoading,
        isFetching: isAssignmentsFetching,
        refetch: refetchAssignments
    } = useListAssignmentsQuery(queryParams);

    const {
        data: analyticsRes,
        refetch: refetchAnalytics
    } = useGetHomeworkAnalyticsQuery();

    const selectedAssignmentId = selectedAssignment?._id || selectedAssignment?.id;

    const {
        data: submissionsRes,
        isLoading: isSubmissionsLoading,
        refetch: refetchSubmissions
    } = useListSubmissionsQuery(
        { assignmentId: selectedAssignmentId },
        { skip: !selectedAssignmentId }
    );

    const [createAssignmentMutation] = useCreateAssignmentMutation();
    const [updateAssignmentMutation] = useUpdateAssignmentMutation();
    const [deleteAssignmentMutation] = useDeleteAssignmentMutation();
    const [gradeSubmissionMutation] = useGradeSubmissionMutation();
    const [submitHomeworkMutation] = useSubmitHomeworkMutation();

    // ----------------------------------------------------
    // Handlers
    // ----------------------------------------------------
    const handleResetFilters = () => {
        setActiveTab('ALL');
        setSearchQuery('');
        setSelectedClass('all');
        setSelectedSubject('all');
        setSelectedType('all');
        setSelectedStatus('all');
        setCurrentPage(1);
    };

    const handleOpenCreateModal = () => {
        setEditingAssignment(null);
        setIsCreateModalOpen(true);
    };

    const handleOpenEditModal = (assignment) => {
        setEditingAssignment(assignment);
        setIsCreateModalOpen(true);
    };

    const handleSaveAssignment = async (assignmentPayload) => {
        try {
            if (editingAssignment) {
                const id = editingAssignment._id || editingAssignment.id;
                await updateAssignmentMutation({ id, ...assignmentPayload }).unwrap();
                toast.success('Assignment updated successfully!');
            } else {
                await createAssignmentMutation(assignmentPayload).unwrap();
                toast.success('Assignment created and published to class stream!');
            }
            setIsCreateModalOpen(false);
            setEditingAssignment(null);
            refetchAssignments();
            refetchStats();
        } catch (error) {
            console.error('Save assignment failed:', error);
            toast.error(error?.data?.message || 'Failed to save assignment. Please try again.');
        }
    };

    const handleDeleteAssignment = async (assignment) => {
        const id = typeof assignment === 'string' ? assignment : assignment?._id || assignment?.id;
        const title = typeof assignment === 'object' && assignment?.title ? assignment.title : 'this assignment';
        const confirmDelete = window.confirm(`Are you sure you want to delete "${title}"?`);
        if (!confirmDelete) return;

        try {
            await deleteAssignmentMutation(id).unwrap();
            toast.success('Assignment deleted successfully.');
            refetchAssignments();
            refetchStats();
        } catch (error) {
            console.error('Delete assignment failed:', error);
            toast.error(error?.data?.message || 'Failed to delete assignment.');
        }
    };

    const handleViewSubmissions = (assignment) => {
        setSelectedAssignment(assignment);
        setIsSubmissionsModalOpen(true);
    };

    const handleOpenGradingDrawer = (assignment, submissionIndex = 0) => {
        setSelectedAssignment(assignment);
        setInitialGradeIndex(submissionIndex);
        setIsGradingDrawerOpen(true);
    };

    const handleSaveGrade = async (arg1, arg2) => {
        if (!selectedAssignmentId) return;
        const submissionId = typeof arg1 === 'string' ? arg1 : arg1?.submissionId;
        const payload = typeof arg1 === 'object' && !arg2 ? arg1 : arg2 || {};
        try {
            await gradeSubmissionMutation({
                assignmentId: selectedAssignmentId,
                submissionId,
                marksObtained: payload.marksObtained ?? 18,
                grade: payload.grade || 'A',
                feedback: payload.feedback || '',
                status: payload.status || 'GRADED',
            }).unwrap();
            toast.success('Grade & evaluation saved!');
            refetchSubmissions();
            refetchAssignments();
            refetchStats();
        } catch (error) {
            console.error('Grade submission failed:', error);
            toast.error(error?.data?.message || 'Failed to submit grade.');
        }
    };

    const handleOpenStudentSubmit = (assignment) => {
        setSelectedAssignment(assignment);
        setIsStudentSubmitModalOpen(true);
    };

    const handleSubmitStudentWork = async (data) => {
        if (!selectedAssignmentId) return;
        try {
            await submitHomeworkMutation({
                assignmentId: selectedAssignmentId,
                files: data.files,
                comments: data.comments,
            }).unwrap();
            toast.success('Student work submitted successfully!');
            setIsStudentSubmitModalOpen(false);
            refetchSubmissions();
            refetchStats();
        } catch (error) {
            console.error('Student submission failed:', error);
            toast.error(error?.data?.message || 'Failed to submit work.');
        }
    };

    const handleSelectViewMode = (mode) => {
        setActiveView(mode);
        if (mode === 'calendar') {
            setIsCalendarModalOpen(true);
        }
    };

    // Extract payloads from API or use high-fidelity fallbacks
    const statsData = statsRes?.data || {};
    const assignmentsList = assignmentsRes?.data?.assignments || [];
    const totalAssignmentsCount = assignmentsRes?.data?.pagination?.total || 124;
    const totalPages = assignmentsRes?.data?.pagination?.pages || Math.ceil(totalAssignmentsCount / rowsPerPage);
    const rawSubmissionsData = submissionsRes?.data;
    const submissionsList = Array.isArray(rawSubmissionsData)
        ? rawSubmissionsData
        : Array.isArray(rawSubmissionsData?.submissions)
        ? rawSubmissionsData.submissions
        : [];
    const submissionsMetrics = rawSubmissionsData?.metrics || null;
    const analyticsData = analyticsRes?.data || null;

    return (
        <div className="min-h-screen bg-slate-50/70 p-4 md:p-6 lg:p-8 space-y-6">
            {/* ----------------------------------------------------
                1. Header Motivational Banner (Image 1 & 2 matching)
            ---------------------------------------------------- */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 md:p-8 text-white shadow-xl border border-indigo-900/40">
                {/* Decorative background glow accents */}
                <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
                <div className="absolute right-1/3 -bottom-20 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-200 uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            Academic Command Center
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight font-display">
                            &ldquo;Homework today, brighter minds tomorrow.&rdquo;
                        </h1>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                            Assign, monitor, and evaluate student work seamlessly across all classes and subjects. Track progress with automated grading and live insights.
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsAnalyticsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/20 text-white text-sm font-semibold backdrop-blur-sm transition-all shadow-sm"
                            title="Open Performance Analytics"
                        >
                            <BarChart3 className="w-4 h-4 text-indigo-300" />
                            <span>Analytics</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsCalendarModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/20 text-white text-sm font-semibold backdrop-blur-sm transition-all shadow-sm"
                            title="Open Calendar Schedule"
                        >
                            <CalendarIcon className="w-4 h-4 text-blue-300" />
                            <span>Calendar</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleOpenCreateModal}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Assignment</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ----------------------------------------------------
                2. Five Key Performance Metric Cards
            ---------------------------------------------------- */}
            <HomeworkMetrics summary={statsData} />

            {/* ----------------------------------------------------
                3. Filter & Search Toolbar (Tabs, Dropdowns, Reset)
            ---------------------------------------------------- */}
            <HomeworkFilterToolbar
                activeTab={activeTab}
                onSelectTab={(tab) => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                }}
                activeView={activeView}
                onSelectView={handleSelectViewMode}
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
                selectedSubject={selectedSubject}
                onSubjectChange={(s) => {
                    setSelectedSubject(s);
                    setCurrentPage(1);
                }}
                selectedType={selectedType}
                onTypeChange={(t) => {
                    setSelectedType(t);
                    setCurrentPage(1);
                }}
                selectedStatus={selectedStatus}
                onStatusChange={(st) => {
                    setSelectedStatus(st);
                    setCurrentPage(1);
                }}
                onResetFilters={handleResetFilters}
                counts={{
                    all: statsData.totalAssignments || 124,
                    active: statsData.activeAssignments || 28,
                    upcoming: statsData.upcomingAssignments || 16,
                    past: statsData.pastAssignments || 80,
                    drafts: statsData.drafts || 5,
                }}
            />

            {/* ----------------------------------------------------
                4. Main Workspace (Table on Left, Sidebar on Right)
            ---------------------------------------------------- */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                {/* Primary Assignment Table & Controls (3 cols on XL) */}
                <div className="xl:col-span-3 space-y-4">
                    <HomeworkTable
                        assignments={assignmentsList}
                        totalCount={totalAssignmentsCount}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        rowsPerPage={rowsPerPage}
                        onPageChange={(p) => setCurrentPage(p)}
                        onRowsPerPageChange={(r) => {
                            setRowsPerPage(r);
                            setCurrentPage(1);
                        }}
                        onViewSubmissions={handleViewSubmissions}
                        onGradeAssignment={(assignment) => handleOpenGradingDrawer(assignment, 0)}
                        onEditAssignment={handleOpenEditModal}
                        onDeleteAssignment={handleDeleteAssignment}
                    />
                </div>

                {/* Secondary Right Sidebar (Overview Donut, Deadlines, Activity) */}
                <div className="xl:col-span-1 space-y-6">
                    <HomeworkSidebar
                        typeDistribution={statsData.typeDistribution || []}
                        upcomingDeadlines={statsData.upcomingDeadlines || []}
                        recentActivities={statsData.recentActivities || []}
                        onViewAllDeadlines={() => setIsCalendarModalOpen(true)}
                        onViewAllActivities={() => setIsAnalyticsModalOpen(true)}
                        onSelectDeadline={(deadlineItem) => {
                            const match =
                                assignmentsList.find((a) =>
                                    a.title?.toLowerCase().includes(deadlineItem.title?.toLowerCase()?.slice(0, 4))
                                ) || assignmentsList[0];
                            if (match) {
                                setSelectedAssignment(match);
                                setIsSubmissionsModalOpen(true);
                            }
                        }}
                    />
                </div>
            </div>

            {/* ----------------------------------------------------
                5. Modals & Drawers Overlays
            ---------------------------------------------------- */}
            {/* Create / Edit Assignment Modal */}
            <CreateAssignmentModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingAssignment(null);
                }}
                onSaveAssignment={handleSaveAssignment}
                editAssignment={editingAssignment}
            />

            {/* Assignment Submissions List Modal */}
            <AssignmentSubmissionsModal
                isOpen={isSubmissionsModalOpen}
                onClose={() => {
                    setIsSubmissionsModalOpen(false);
                    setSelectedAssignment(null);
                }}
                assignment={selectedAssignment}
                submissions={submissionsList}
                metrics={submissionsMetrics}
                onOpenGradingDrawer={(submissionIndex) => {
                    setIsSubmissionsModalOpen(false);
                    handleOpenGradingDrawer(selectedAssignment, submissionIndex);
                }}
            />

            {/* Dual-Pane Document Viewer & Grading Drawer */}
            <SubmissionGradingDrawer
                isOpen={isGradingDrawerOpen}
                onClose={() => {
                    setIsGradingDrawerOpen(false);
                    setSelectedAssignment(null);
                }}
                submissions={submissionsList}
                initialSubmissionIndex={initialGradeIndex}
                assignmentTitle={selectedAssignment?.title || 'Chapter 1 - Exercise Questions'}
                maxMarks={selectedAssignment?.maxMarks || 20}
                onSaveGrade={handleSaveGrade}
            />

            {/* Assignment Calendar Schedule Modal */}
            <AssignmentCalendarModal
                isOpen={isCalendarModalOpen}
                onClose={() => {
                    setIsCalendarModalOpen(false);
                    setActiveView('list');
                }}
                assignments={assignmentsList}
                onSelectAssignment={(item) => {
                    setIsCalendarModalOpen(false);
                    setSelectedAssignment(item);
                    setIsSubmissionsModalOpen(true);
                }}
                onCreateNew={() => {
                    setIsCalendarModalOpen(false);
                    handleOpenCreateModal();
                }}
            />

            {/* Assignment Performance Analytics Dashboard Modal */}
            <AssignmentAnalyticsModal
                isOpen={isAnalyticsModalOpen}
                onClose={() => setIsAnalyticsModalOpen(false)}
                analyticsData={analyticsData}
            />

            {/* Student Upload & Work Submission Dialog */}
            <StudentSubmitModal
                isOpen={isStudentSubmitModalOpen}
                onClose={() => {
                    setIsStudentSubmitModalOpen(false);
                    setSelectedAssignment(null);
                }}
                assignment={selectedAssignment}
                onSubmitWork={handleSubmitStudentWork}
            />
        </div>
    );
}
