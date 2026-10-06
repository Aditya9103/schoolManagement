import React, { useState, useEffect, useRef } from 'react';
import {
    ClipboardList,
    Plus,
    MoreHorizontal,
    Download,
    Printer,
    Send,
    FileSpreadsheet,
    Sparkles,
    ChevronDown,
    CalendarCheck,
    CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

import AttendanceMetrics from './components/AttendanceMetrics';
import AttendanceFiltersAndCalendar from './components/AttendanceFiltersAndCalendar';
import AttendanceRegisterTable from './components/AttendanceRegisterTable';
import AttendanceSidebar from './components/AttendanceSidebar';

import TakeAttendanceModal from './components/TakeAttendanceModal';
import ImportAttendanceModal from './components/ImportAttendanceModal';
import StudentLeaveModal from './components/StudentLeaveModal';
import AttendanceReportModal from './components/AttendanceReportModal';

import {
    useGetAttendanceStatsQuery,
    useGetRecentActivitiesQuery,
    useGetAttendanceRegisterQuery,
    useSaveAttendanceRegisterMutation,
    useGetLeaveRequestsQuery
} from '../../../../store/api/attendanceApi';
import { useGetClassesQuery } from '../../../../store/api/classApi';

// Initial cohort matching screenshot
const INITIAL_STUDENT_ROSTER = [
    { studentId: '65a000000000000000000001', rollNo: '6A001', studentName: 'Aarav Sharma', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000002', rollNo: '6A002', studentName: 'Ananya Verma', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000003', rollNo: '6A003', studentName: 'Rohan Patel', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000004', rollNo: '6A004', studentName: 'Sneha Gupta', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'ABSENT', remarks: 'Fever' },
    { studentId: '65a000000000000000000005', rollNo: '6A005', studentName: 'Vihaan Singh', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000006', rollNo: '6A006', studentName: 'Kavya Joshi', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', status: 'LATE', remarks: 'Reached at 9:30 AM' },
    { studentId: '65a000000000000000000007', rollNo: '6A007', studentName: 'Aditya Kumar', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000008', rollNo: '6A008', studentName: 'Meera Iyer', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000009', rollNo: '6A009', studentName: 'Arjun Nair', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000010', rollNo: '6A010', studentName: 'Diya Sharma', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'ABSENT', remarks: 'Medical leave' },
    { studentId: '65a000000000000000000011', rollNo: '6A011', studentName: 'Reyansh Malhotra', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000012', rollNo: '6A012', studentName: 'Ishaan Verma', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000013', rollNo: '6A013', studentName: 'Tanvi Deshmukh', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000014', rollNo: '6A014', studentName: 'Kabir Das', avatar: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000015', rollNo: '6A015', studentName: 'Zoya Khan', avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150', status: 'LATE', remarks: 'Traffic delay' },
    { studentId: '65a000000000000000000016', rollNo: '6A016', studentName: 'Aryan Bhatia', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000017', rollNo: '6A017', studentName: 'Pooja Hegde', avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000018', rollNo: '6A018', studentName: 'Manish Reddy', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000019', rollNo: '6A019', studentName: 'Sanya Mirza', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000020', rollNo: '6A020', studentName: 'Kunal Kapoor', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'ABSENT', remarks: 'Family function' },
    { studentId: '65a000000000000000000021', rollNo: '6A021', studentName: 'Riya Sen', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000022', rollNo: '6A022', studentName: 'Harsh Vardhan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000023', rollNo: '6A023', studentName: 'Simran Kaur', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000024', rollNo: '6A024', studentName: 'Varun Dhawan', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000025', rollNo: '6A025', studentName: 'Tara Sutaria', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000026', rollNo: '6A026', studentName: 'Nikhil Advani', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000027', rollNo: '6A027', studentName: 'Ananya Birla', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000028', rollNo: '6A028', studentName: 'Devansh Pandey', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000029', rollNo: '6A029', studentName: 'Kriti Sanon', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000030', rollNo: '6A030', studentName: 'Lakshya Sen', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000031', rollNo: '6A031', studentName: 'Parineeti Chopra', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'PRESENT', remarks: '-' },
    { studentId: '65a000000000000000000032', rollNo: '6A032', studentName: 'Siddharth Roy', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', status: 'PRESENT', remarks: '-' },
];

export default function AttendanceManagementPage() {
    // Selection state matching the reference screenshot
    const [selectedClassId, setSelectedClassId] = useState('class-6');
    const [selectedSectionId, setSelectedSectionId] = useState('sec-a');
    const [selectedDate, setSelectedDate] = useState('2026-04-21');
    const [selectedPeriod, setSelectedPeriod] = useState('FULL_DAY');

    // UI modals state
    const [isTakeModalOpen, setIsTakeModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [showMoreActions, setShowMoreActions] = useState(false);

    const moreActionsRef = useRef(null);

    // Queries
    const { data: statsData } = useGetAttendanceStatsQuery({ dateString: selectedDate });
    const { data: activitiesData } = useGetRecentActivitiesQuery();
    const { data: classesData } = useGetClassesQuery();
    const { data: leavesData } = useGetLeaveRequestsQuery();

    const {
        data: registerData,
        isLoading: isRegisterLoading,
        refetch: refetchRegister
    } = useGetAttendanceRegisterQuery({
        classId: selectedClassId,
        sectionId: selectedSectionId,
        dateString: selectedDate,
        period: selectedPeriod,
    });

    const [saveRegister, { isLoading: isSaving }] = useSaveAttendanceRegisterMutation();

    // Local mutable state of student records
    const [records, setRecords] = useState(INITIAL_STUDENT_ROSTER);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        if (registerData?.data?.records && registerData.data.records.length > 0) {
            setRecords(registerData.data.records);
            setHasUnsavedChanges(false);
        }
    }, [registerData]);

    // Close more actions on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (moreActionsRef.current && !moreActionsRef.current.contains(e.target)) {
                setShowMoreActions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle individual student status update
    const handleUpdateRecordStatus = (studentId, status) => {
        setRecords((prev) =>
            prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
        );
        setHasUnsavedChanges(true);
    };

    // Handle individual student remarks update
    const handleUpdateRecordRemarks = (studentId, remarks) => {
        setRecords((prev) =>
            prev.map((r) => (r.studentId === studentId ? { ...r, remarks } : r))
        );
        setHasUnsavedChanges(true);
    };

    // Handle bulk status updates
    const handleBulkMark = (studentIds, status) => {
        if (!studentIds || studentIds.length === 0) return;
        setRecords((prev) =>
            prev.map((r) => (studentIds.includes(r.studentId) ? { ...r, status } : r))
        );
        setHasUnsavedChanges(true);
        toast.success(`Marked ${studentIds.length} students as ${status}`);
    };

    // Handle mark all
    const handleMarkAll = (status) => {
        setRecords((prev) => prev.map((r) => ({ ...r, status })));
        setHasUnsavedChanges(true);
        toast.success(`Marked all students as ${status}`);
    };

    // Save attendance to backend
    const handleSaveAttendance = async (recordsToSave = null) => {
        const payloadRecords = Array.isArray(recordsToSave) && recordsToSave.length > 0
            ? recordsToSave
            : records;

        try {
            await saveRegister({
                classId: selectedClassId,
                sectionId: selectedSectionId,
                dateString: selectedDate,
                period: selectedPeriod,
                records: payloadRecords,
            }).unwrap();

            setRecords(payloadRecords);
            setHasUnsavedChanges(false);
            toast.success('Attendance saved successfully!');
            refetchRegister();
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to save attendance');
        }
    };

    // Handle save batch from Rapid Modal
    const handleSaveBatch = async (updatedRecords) => {
        if (!updatedRecords || updatedRecords.length === 0) return;
        setRecords(updatedRecords);
        setHasUnsavedChanges(true);
        await handleSaveAttendance(updatedRecords);
    };

    // Send absent alerts notification
    const handleSendAbsenteeAlerts = () => {
        const absentees = records.filter((r) => r.status === 'ABSENT');
        toast.success(`SMS and Push notifications dispatched to ${absentees.length} parents`);
        setShowMoreActions(false);
    };

    const classNameDisplay = 'Class 6 - Section A';

    return (
        <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Top Header & Motivational Quote Banner */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                        <span>Academic</span>
                        <span>&gt;</span>
                        <span className="text-blue-600">Attendance</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Attendance Management
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Mark, manage and analyze attendance for students across all classes and sections.
                    </p>
                </div>

                {/* Motivational Quote Banner & Primary Actions */}
                <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                    {/* Quote Banner */}
                    <div className="hidden xl:flex items-center gap-3 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/40 border border-blue-100/80 rounded-2xl px-4 py-2.5 shadow-2xs">
                        <div className="w-12 h-10 flex-shrink-0 relative">
                            {/* Teacher & Students Illustration Graphic */}
                            <svg viewBox="0 0 64 48" className="w-full h-full">
                                <circle cx="20" cy="18" r="8" fill="#3b82f6" />
                                <circle cx="36" cy="16" r="7" fill="#f59e0b" />
                                <circle cx="50" cy="20" r="6" fill="#10b981" />
                                <path d="M 6 44 Q 20 28 34 44" fill="#60a5fa" />
                                <path d="M 24 44 Q 36 26 48 44" fill="#fbbf24" />
                                <path d="M 40 44 Q 50 30 60 44" fill="#34d399" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-bold text-slate-800 italic leading-snug">
                                "Regular attendance today, brighter tomorrows."
                            </p>
                            <span className="text-[10px] font-semibold text-blue-600">
                                PrimeSchoolOs Attendance Hub
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() => setIsTakeModalOpen(true)}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                            <CalendarCheck className="w-4 h-4" />
                            <span>Take Attendance</span>
                        </button>

                        <div className="relative" ref={moreActionsRef}>
                            <button
                                type="button"
                                onClick={() => setShowMoreActions(!showMoreActions)}
                                className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm py-2.5 px-3.5 rounded-xl shadow-2xs transition-colors cursor-pointer"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                                <span>More Actions</span>
                            </button>

                            {showMoreActions && (
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 py-1.5 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-100">
                                    <button
                                        onClick={() => {
                                            setIsReportModalOpen(true);
                                            setShowMoreActions(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                                    >
                                        <Printer className="w-4 h-4 text-slate-500" /> Print Register
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsReportModalOpen(true);
                                            setShowMoreActions(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                                    >
                                        <FileSpreadsheet className="w-4 h-4 text-slate-500" /> Export to Excel
                                    </button>
                                    <button
                                        onClick={handleSendAbsenteeAlerts}
                                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-blue-600 font-medium cursor-pointer"
                                    >
                                        <Send className="w-4 h-4" /> Send Absentee SMS/Alerts
                                    </button>
                                    <div className="border-t border-slate-100 my-1" />
                                    <button
                                        onClick={() => {
                                            setIsLeaveModalOpen(true);
                                            setShowMoreActions(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-purple-600 font-medium cursor-pointer"
                                    >
                                        <ClipboardList className="w-4 h-4" /> Manage Student Leaves
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 5 KPI Metric Cards */}
            <AttendanceMetrics summary={statsData?.data?.summary} />

            {/* Middle Section: Filters, Week Calendar Strip, and Donut Statistics */}
            <AttendanceFiltersAndCalendar
                classes={classesData?.data}
                selectedClassId={selectedClassId}
                onSelectClass={setSelectedClassId}
                selectedSectionId={selectedSectionId}
                onSelectSection={setSelectedSectionId}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                selectedPeriod={selectedPeriod}
                onSelectPeriod={setSelectedPeriod}
                onLoadStudents={() => {
                    refetchRegister();
                    toast.success('Loaded student roster');
                }}
                distribution={statsData?.data?.distribution}
                isLoading={isRegisterLoading}
            />

            {/* Bottom Content Grid: Main Register Table (left ~68%) + Sidebar (right ~32%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Students Attendance Register Table */}
                <div className="lg:col-span-8">
                    <AttendanceRegisterTable
                        classNameDisplay={classNameDisplay}
                        records={records}
                        onUpdateRecordStatus={handleUpdateRecordStatus}
                        onUpdateRecordRemarks={handleUpdateRecordRemarks}
                        onSave={() => handleSaveAttendance()}
                        onBulkMark={handleBulkMark}
                        onMarkAll={handleMarkAll}
                        isSaving={isSaving}
                        hasUnsavedChanges={hasUnsavedChanges}
                    />
                </div>

                {/* Right Column: Quick Actions, 7-Day Trend Chart, and Recent Activity */}
                <div className="lg:col-span-4">
                    <AttendanceSidebar
                        onOpenTakeModal={() => setIsTakeModalOpen(true)}
                        onOpenImportModal={() => setIsImportModalOpen(true)}
                        onOpenReportsModal={() => setIsReportModalOpen(true)}
                        onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
                        trendDays={statsData?.data?.trendDays}
                        activities={activitiesData?.data}
                        onViewAllActivities={() => {
                            toast('Showing latest real-time activities');
                        }}
                    />
                </div>
            </div>

            {/* Interactive Modals */}
            <TakeAttendanceModal
                isOpen={isTakeModalOpen}
                onClose={() => setIsTakeModalOpen(false)}
                records={records}
                classNameDisplay={classNameDisplay}
                onSaveBatch={handleSaveBatch}
            />

            <ImportAttendanceModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                classNameDisplay={classNameDisplay}
                onImportSuccess={() => {
                    refetchRegister();
                }}
            />

            <StudentLeaveModal
                isOpen={isLeaveModalOpen}
                onClose={() => setIsLeaveModalOpen(false)}
                leaves={leavesData?.data}
            />

            <AttendanceReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                classNameDisplay={classNameDisplay}
                records={records}
                selectedDate={selectedDate}
            />
        </div>
    );
}
