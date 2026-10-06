import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    Clock,
    Calendar,
    Printer,
    Download,
    Sparkles,
    Edit2,
    Building2,
    UserCheck,
    Coffee,
    Plus,
    Save,
    RotateCcw,
    Layers,
    Check,
    AlertCircle,
    Settings,
    Palette,
    BookOpen,
} from 'lucide-react';
import {
    useGetClassesQuery,
    useGetTimetableQuery,
    useSaveTimetableMutation,
    useGetSubjectsQuery,
    useGetStaffTeachersQuery,
} from '../../../../store/api/classApi';
import TimetableSlotModal from './components/TimetableSlotModal';
import ConfigurePeriodsModal from './components/ConfigurePeriodsModal';
import toast from 'react-hot-toast';

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DAY_THEMES = {
    Monday: {
        badgeBg: 'bg-emerald-600 text-white',
        border: 'border-emerald-200',
        text: 'text-emerald-950',
        tagBg: 'bg-emerald-100 text-emerald-800',
    },
    Tuesday: {
        badgeBg: 'bg-cyan-600 text-white',
        border: 'border-cyan-200',
        text: 'text-cyan-950',
        tagBg: 'bg-cyan-100 text-cyan-800',
    },
    Wednesday: {
        badgeBg: 'bg-blue-600 text-white',
        border: 'border-blue-200',
        text: 'text-blue-950',
        tagBg: 'bg-blue-100 text-blue-800',
    },
    Thursday: {
        badgeBg: 'bg-purple-600 text-white',
        border: 'border-purple-200',
        text: 'text-purple-950',
        tagBg: 'bg-purple-100 text-purple-800',
    },
    Friday: {
        badgeBg: 'bg-rose-600 text-white',
        border: 'border-rose-200',
        text: 'text-rose-950',
        tagBg: 'bg-rose-100 text-rose-800',
    },
    Saturday: {
        badgeBg: 'bg-indigo-600 text-white',
        border: 'border-indigo-200',
        text: 'text-indigo-950',
        tagBg: 'bg-indigo-100 text-indigo-800',
    },
};

const COLOR_PALETTE = [
    '#2563EB', // Blue
    '#059669', // Emerald
    '#7C3AED', // Violet
    '#D97706', // Amber
    '#DB2777', // Pink
    '#0891B2', // Cyan
    '#EA580C', // Orange
    '#4F46E5', // Indigo
    '#0D9488', // Teal
];

function getSlotColor(slot, index = 0) {
    if (slot?.color && slot.color.startsWith('#')) return slot.color;
    if (slot?.subjectName) {
        let hash = 0;
        for (let i = 0; i < slot.subjectName.length; i++) {
            hash = slot.subjectName.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colorIdx = Math.abs(hash) % COLOR_PALETTE.length;
        return COLOR_PALETTE[colorIdx];
    }
    return COLOR_PALETTE[index % COLOR_PALETTE.length];
}

function hexToRgba(hex, alpha = 0.15) {
    if (!hex || typeof hex !== 'string') return `rgba(37, 99, 235, ${alpha})`;
    let clean = hex.replace('#', '').trim();
    if (clean.length === 3) {
        clean = clean.split('').map((c) => c + c).join('');
    }
    if (clean.length !== 6) return `rgba(37, 99, 235, ${alpha})`;
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(37, 99, 235, ${alpha})`;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ClassTimetablePage({ targetClassId = null }) {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const queryClassId = targetClassId || params.classId || searchParams.get('classId') || '';
    const querySectionId = searchParams.get('sectionId') || '';

    // Classes query
    const { data: classesRes, isLoading: isLoadingClasses } = useGetClassesQuery();
    const classes = classesRes?.data || [];

    const [selectedClassId, setSelectedClassId] = useState(queryClassId);
    const activeClass = classes.find((c) => c._id === selectedClassId) || classes[0];
    const sections = activeClass?.sections || [];

    const [selectedSectionId, setSelectedSectionId] = useState(querySectionId);

    // Sync selected class & section
    useEffect(() => {
        if (classes.length > 0) {
            if (!selectedClassId || !classes.find((c) => c._id === selectedClassId)) {
                setSelectedClassId(classes[0]._id);
            }
        }
    }, [classes, selectedClassId]);

    useEffect(() => {
        if (sections.length > 0) {
            if (!selectedSectionId || !sections.find((s) => s._id === selectedSectionId)) {
                setSelectedSectionId(sections[0]._id);
            }
        } else {
            setSelectedSectionId('');
        }
    }, [sections, selectedSectionId]);

    const activeSection = sections.find((s) => s._id === selectedSectionId) || sections[0];

    // Queries for subjects and teachers
    const { data: subjectsRes } = useGetSubjectsQuery(
        { classId: activeClass?._id },
        { skip: !activeClass?._id }
    );
    const availableSubjects = subjectsRes?.data?.subjects || [];

    const { data: staffTeachersRes } = useGetStaffTeachersQuery();
    const availableTeachers = staffTeachersRes?.data || [];

    // Timetable query
    const { data: timetableRes, isLoading: isLoadingTimetable } = useGetTimetableQuery(
        { classId: activeClass?._id, sectionId: activeSection?._id },
        { skip: !activeClass?._id || !activeSection?._id }
    );

    const [saveTimetable, { isLoading: isSaving }] = useSaveTimetableMutation();

    // Local mutable state for periods configuration & slots
    const [periodsConfig, setPeriodsConfig] = useState([]);
    const [slotsMap, setSlotsMap] = useState({});
    const [isDirty, setIsDirty] = useState(false);
    const [includeSaturday, setIncludeSaturday] = useState(true);

    const activeDays = useMemo(
        () => (includeSaturday ? ALL_DAYS : ALL_DAYS.slice(0, 5)),
        [includeSaturday]
    );

    // Modals
    const [isConfigurePeriodsOpen, setIsConfigurePeriodsOpen] = useState(false);
    const [activeSlotData, setActiveSlotData] = useState(null);

    // Sync from server when timetable data loads
    useEffect(() => {
        if (timetableRes?.data) {
            const data = timetableRes.data;
            if (data.periodsConfig && data.periodsConfig.length > 0) {
                setPeriodsConfig(data.periodsConfig);
            } else {
                // Default 8-period structure
                setPeriodsConfig([
                    { periodNumber: 1, name: 'Period 1', startTime: '08:00 AM', endTime: '08:45 AM', isBreak: false },
                    { periodNumber: 2, name: 'Period 2', startTime: '08:45 AM', endTime: '09:30 AM', isBreak: false },
                    { periodNumber: 3, name: 'Period 3', startTime: '09:30 AM', endTime: '10:15 AM', isBreak: false },
                    { periodNumber: 4, name: 'Period 4', startTime: '10:15 AM', endTime: '11:00 AM', isBreak: false },
                    { periodNumber: 5, name: 'Recess Break', startTime: '11:00 AM', endTime: '11:30 AM', isBreak: true, breakTitle: 'Recess Break' },
                    { periodNumber: 6, name: 'Period 5', startTime: '11:30 AM', endTime: '12:15 PM', isBreak: false },
                    { periodNumber: 7, name: 'Period 6', startTime: '12:15 PM', endTime: '01:00 PM', isBreak: false },
                    { periodNumber: 8, name: 'Period 7', startTime: '01:00 PM', endTime: '01:45 PM', isBreak: false },
                ]);
            }

            // Populate slots map
            const newMap = {};
            if (data.slots && data.slots.length > 0) {
                data.slots.forEach((s) => {
                    const key = `${s.day}-${s.periodNumber}`;
                    newMap[key] = s;
                });
            }
            setSlotsMap(newMap);
            setIsDirty(false);
        }
    }, [timetableRes]);

    const handleClassChange = (newClassId) => {
        setSelectedClassId(newClassId);
        setSearchParams({ classId: newClassId });
    };

    const handleSectionChange = (newSectionId) => {
        setSelectedSectionId(newSectionId);
        setSearchParams({ classId: selectedClassId, sectionId: newSectionId });
    };

    const handleSaveSlot = (slotData) => {
        const key = `${slotData.day}-${slotData.periodNumber}`;
        setSlotsMap((prev) => ({
            ...prev,
            [key]: slotData,
        }));
        setIsDirty(true);
        toast.success(`Slot updated for ${slotData.day} Period ${slotData.periodNumber}`);
    };

    const handleSavePeriodsConfig = (updatedPeriods) => {
        setPeriodsConfig(updatedPeriods);
        setIsDirty(true);
        toast.success('Period timings updated. Remember to save changes.');
    };

    const handleSaveAllChanges = async () => {
        if (!activeClass?._id || !activeSection?._id) {
            toast.error('Class and section are required');
            return;
        }

        const slotsArray = Object.values(slotsMap);
        try {
            await saveTimetable({
                classId: activeClass._id,
                sectionId: activeSection._id,
                periodsConfig,
                slots: slotsArray,
            }).unwrap();
            setIsDirty(false);
            toast.success(`Timetable saved for ${activeClass.name} - Section ${activeSection.name}`);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to save timetable');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (isLoadingClasses || isLoadingTimetable) {
        return (
            <div className="py-24 text-center">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-semibold text-slate-700 font-medium">Loading master timetable...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Embedded Print CSS ensuring full landscape print with zero cutoffs */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        size: landscape;
                        margin: 8mm 10mm;
                    }
                    body {
                        background: #ffffff !important;
                        color: #000000 !important;
                        font-family: system-ui, -apple-system, sans-serif !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    nav, header, aside, .no-print, button, select, .sidebar, .erp-sidebar {
                        display: none !important;
                    }
                    .print-only-header {
                        display: block !important;
                        margin-bottom: 12px !important;
                        border-bottom: 2px solid #0f172a !important;
                        padding-bottom: 8px !important;
                    }
                    .timetable-print-wrapper {
                        display: block !important;
                        width: 100% !important;
                        overflow: visible !important;
                        border: none !important;
                        box-shadow: none !important;
                    }
                    .timetable-print-table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                        table-layout: fixed !important;
                        font-size: 8pt !important;
                    }
                    .timetable-print-table th, .timetable-print-table td {
                        border: 1px solid #cbd5e1 !important;
                        padding: 4px !important;
                        text-align: left !important;
                        vertical-align: top !important;
                        word-break: break-word !important;
                    }
                    .timetable-print-table th {
                        background-color: #f1f5f9 !important;
                        font-weight: bold !important;
                        color: #0f172a !important;
                        text-align: center !important;
                    }
                    .timetable-print-table .break-cell {
                        background-color: #f8fafc !important;
                        font-weight: bold !important;
                        color: #334155 !important;
                        text-align: center !important;
                    }
                    .timetable-slot-card {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        box-shadow: none !important;
                    }
                }
                .print-only-header {
                    display: none;
                }
            ` }} />

            {/* Print Only Header (Visible only when window.print() is invoked) */}
            <div className="print-only-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black text-slate-900">
                            Academic Master Timetable • {activeClass?.name} - Section {activeSection?.name}
                        </h1>
                        <p className="text-xs text-slate-700 font-semibold">
                            Room: {activeSection?.roomNumber || 'Room 101'} • Section Teacher: {activeSection?.classTeacherId?.firstName ? `${activeSection.classTeacherId.firstName} ${activeSection.classTeacherId.lastName || ''}`.trim() : 'Assigned Faculty'}
                        </p>
                    </div>
                    <div className="text-right text-xs text-slate-700 font-semibold">
                        <p className="font-bold text-slate-900">Academic Year 2026-27 • {includeSaturday ? 'Mon–Sat (6 Days)' : 'Mon–Fri (5 Days)'}</p>
                        <p>Printed: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                </div>
            </div>

            {/* Header & Controls Hub (Hidden on Print) */}
            <div className="no-print space-y-3.5">
                {/* Tier 1: Main Header & Actions Bar */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3.5">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0 mt-0.5 sm:mt-0">
                            <Clock size={22} />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-display">
                                    {activeClass?.name || 'Class'} Weekly Timetable
                                </h1>
                                <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider">
                                    Section {activeSection?.name || 'A'}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold inline-flex items-center gap-1">
                                    <Calendar size={12} className="text-indigo-600" />
                                    {includeSaturday ? '6 Working Days' : '5 Working Days'}
                                </span>
                                {isDirty && (
                                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold inline-flex items-center gap-1 animate-pulse">
                                        <AlertCircle size={12} className="text-amber-600" />
                                        Unsaved Changes
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                                Manage periods, customizable bell timings, recess breaks, educator assignments, and Saturday scheduling
                            </p>
                        </div>
                    </div>

                    {/* Top Action Buttons */}
                    <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap shrink-0 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        {/* Configure Periods Button */}
                        <button
                            onClick={() => setIsConfigurePeriodsOpen(true)}
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-300 shadow-2xs hover:border-slate-400 active:scale-95 cursor-pointer"
                            title="Add/Edit periods, custom timeslots, and breaks"
                        >
                            <Settings size={14} className="text-slate-600" />
                            <span>Configure Periods ({periodsConfig.length})</span>
                        </button>

                        {/* Print Timetable */}
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-300 shadow-2xs hover:border-slate-400 active:scale-95 cursor-pointer"
                            title="Print Timetable in full landscape mode without cutoffs"
                        >
                            <Printer size={14} className="text-slate-600" />
                            <span className="hidden sm:inline">Print</span>
                        </button>

                        {/* Save Changes Button */}
                        <button
                            onClick={handleSaveAllChanges}
                            disabled={isSaving}
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                        >
                            <Save size={15} />
                            <span>{isSaving ? 'Saving...' : 'Save Timetable'}</span>
                        </button>
                    </div>
                </div>

                {/* Tier 2: Selection & Schedule Toolbar (Optimized for all screens) */}
                <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                    {/* Left: Class & Section Selectors */}
                    <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                        {/* Class Dropdown */}
                        {classes.length > 0 && (
                            <div className="flex items-center gap-2 shrink-0">
                                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                                    Class:
                                </label>
                                <select
                                    value={selectedClassId}
                                    onChange={(e) => handleClassChange(e.target.value)}
                                    className="px-3.5 py-2 bg-slate-50 hover:bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition-colors cursor-pointer"
                                >
                                    {classes.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

                        {/* Section Selector */}
                        {sections.length > 0 && (
                            <div className="flex items-center gap-2 min-w-0">
                                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 shrink-0">
                                    Section:
                                </label>
                                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar max-w-full">
                                    {sections.map((s) => (
                                        <button
                                            key={s._id}
                                            onClick={() => handleSectionChange(s._id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${selectedSectionId === s._id
                                                ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80 font-extrabold'
                                                : 'text-slate-700 hover:text-slate-950 hover:bg-white/50'
                                                }`}
                                        >
                                            Section {s.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Working Days Mode Switcher */}
                    <div className="flex items-center gap-2 shrink-0 self-start md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-between md:justify-end">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 sm:hidden md:inline">
                            Schedule:
                        </span>
                        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                            <button
                                type="button"
                                onClick={() => setIncludeSaturday(false)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${!includeSaturday
                                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-extrabold'
                                    : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                5 Days (Mon–Fri)
                            </button>
                            <button
                                type="button"
                                onClick={() => setIncludeSaturday(true)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${includeSaturday
                                    ? 'bg-indigo-600 text-white shadow-xs font-extrabold'
                                    : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                <Calendar size={13} className={includeSaturday ? 'text-white' : 'text-slate-500'} />
                                <span>6 Days (Includes Sat)</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Metrics Bar (Hidden on Print) */}
            <div className="no-print grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Configured Periods</p>
                    <h3 className="text-xl font-black text-slate-900 mt-1">{periodsConfig.length} Daily Slots</h3>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                        {periodsConfig.filter((p) => p.isBreak).length} Breaks • {periodsConfig.filter((p) => !p.isBreak).length} Teaching Periods
                    </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Classroom Space</p>
                    <h3 className="text-xl font-black text-blue-700 mt-1">{activeSection?.roomNumber || 'Room 101'}</h3>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5">Dedicated Division Room</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Section Educator</p>
                    <h3 className="text-xl font-black text-emerald-700 mt-1 truncate">
                        {activeSection?.classTeacherId?.firstName
                            ? `${activeSection.classTeacherId.firstName} ${activeSection.classTeacherId.lastName || ''}`.trim()
                            : 'Unassigned'}
                    </h3>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5">Class Supervisor</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Weekly Schedule</p>
                    <h3 className="text-xl font-black text-indigo-700 mt-1">
                        {includeSaturday ? 'Monday – Saturday' : 'Monday – Friday'}
                    </h3>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                        {includeSaturday ? 'Full 6 Working Days' : 'Full 5 Working Days'}
                    </p>
                </div>
            </div>

            {/* Timetable Interactive Grid / Printable Table */}
            <div className="timetable-print-wrapper bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="no-print p-4.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gradient-to-r from-slate-50/80 via-white to-indigo-50/30">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <h3 className="text-sm font-black text-slate-900 tracking-tight">
                                Weekly Master Schedule • {activeClass?.name} ({activeSection?.name})
                            </h3>
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                            Click any period cell to customize subject, assign educators, or adjust classroom room numbers.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                            {periodsConfig.length} Daily Slots
                        </span>
                        <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs">
                            {activeDays.length} Working Days
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto relative scrollbar-thin">
                    <table className="timetable-print-table min-w-max w-full text-left border-separate border-spacing-0 text-xs">
                        <thead>
                            <tr className="bg-slate-100 text-slate-900 font-extrabold">
                                <th className="py-3.5 px-4 w-36 min-w-36 max-w-36 bg-slate-100 text-slate-800 uppercase tracking-wider text-[11px] sticky left-0 z-10 border-r border-b border-slate-200 font-black shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
                                    <div className="flex items-center gap-2">
                                        <Clock size={13} className="text-slate-600 shrink-0" />
                                        <span>Day \ Time</span>
                                    </div>
                                </th>
                                {periodsConfig.map((period, pIdx) => {
                                    const isBreak = period.isBreak;
                                    return (
                                        <th
                                            key={period.periodNumber || pIdx}
                                            className={`py-3 px-3 text-center border-r border-b border-slate-200 w-40 min-w-40 transition-colors ${isBreak
                                                ? 'bg-slate-100 text-slate-800 font-extrabold'
                                                : 'bg-slate-50 text-slate-900 font-extrabold'
                                                }`}
                                        >
                                            <div className="flex items-center justify-center gap-1.5">
                                                <span
                                                    className={`px-2 py-0.5 rounded-md text-[10.5px] font-black uppercase tracking-wider shadow-2xs ${isBreak
                                                        ? 'bg-slate-200 text-slate-800 border border-slate-300'
                                                        : 'bg-white text-slate-800 border border-slate-200/90'
                                                        }`}
                                                >
                                                    {isBreak ? 'Break' : `P${period.periodNumber || pIdx + 1}`}
                                                </span>
                                                <span className="font-extrabold text-xs text-slate-900 truncate">
                                                    {period.name || `Period ${period.periodNumber}`}
                                                </span>
                                            </div>
                                            <div className="inline-flex items-center gap-1 text-[10px] text-slate-700 font-bold font-mono mt-1 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200/60 shadow-2xs">
                                                <Clock size={10} className="text-slate-500 shrink-0" />
                                                <span>{period.startTime} - {period.endTime}</span>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {activeDays.map((day) => {
                                const dayTheme = DAY_THEMES[day] || {
                                    badgeBg: 'bg-slate-700 text-white',
                                    border: 'border-slate-200',
                                    text: 'text-slate-950',
                                    tagBg: 'bg-slate-100 text-slate-800',
                                };

                                return (
                                    <tr key={day} className={`hover:bg-slate-50/50 transition-colors ${day === 'Saturday' ? 'bg-indigo-50/15' : ''}`}>
                                        {/* Day Name Column - Solid opaque background prevents bleed-through on scroll */}
                                        <td className="py-3.5 px-4 w-36 min-w-36 max-w-36 sticky left-0 z-10 bg-white border-r border-b border-slate-200 shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)] font-black align-middle">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center justify-between gap-1.5">
                                                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-black tracking-wide shadow-2xs ${dayTheme.badgeBg}`}>
                                                        {day.substring(0, 3).toUpperCase()}
                                                    </span>
                                                    {day === 'Saturday' && (
                                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-900 font-extrabold uppercase tracking-wider border border-indigo-200">
                                                            Sat
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs font-black text-slate-900 tracking-tight">
                                                    {day}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Periods */}
                                        {periodsConfig.map((period, pIdx) => {
                                            const key = `${day}-${period.periodNumber}`;
                                            const slot = slotsMap[key];
                                            const isBreak = period.isBreak || slot?.isBreak;

                                            if (isBreak) {
                                                return (
                                                    <td
                                                        key={key}
                                                        onClick={() => {
                                                            setActiveSlotData({
                                                                day,
                                                                periodNumber: period.periodNumber,
                                                                startTime: period.startTime,
                                                                endTime: period.endTime,
                                                                isBreak: true,
                                                                breakTitle: period.breakTitle || period.name || 'Recess Break',
                                                                ...slot,
                                                            });
                                                        }}
                                                        className="break-cell p-2 text-center border-r border-b border-slate-200 w-40 min-w-40 bg-slate-50/60 hover:bg-slate-100/70 cursor-pointer transition-colors align-middle"
                                                    >
                                                        <div className="timetable-break-card h-full min-h-[76px] rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs p-2.5 flex flex-col items-center justify-center text-center shadow-2xs space-y-1.5 transition-all">
                                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shadow-2xs group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                                <Coffee size={13} />
                                                            </div>
                                                            <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-800 leading-tight">
                                                                {slot?.breakTitle || period.breakTitle || period.name || 'Recess Break'}
                                                            </span>
                                                            <span className="text-[9.5px] font-bold text-slate-600 font-mono bg-slate-100/90 px-2 py-0.5 rounded-md border border-slate-200/60">
                                                                {period.startTime} - {period.endTime}
                                                            </span>
                                                        </div>
                                                    </td>
                                                );
                                            }

                                            const subjectName = slot?.subjectName;
                                            const teacherName = slot?.teacherName;
                                            const slotColor = getSlotColor(slot, pIdx);
                                            const bgTint = hexToRgba(slotColor, 0.12);
                                            const borderTint = hexToRgba(slotColor, 0.35);

                                            return (
                                                <td
                                                    key={key}
                                                    onClick={() => {
                                                        setActiveSlotData({
                                                            day,
                                                            periodNumber: period.periodNumber,
                                                            startTime: period.startTime,
                                                            endTime: period.endTime,
                                                            isBreak: false,
                                                            ...slot,
                                                        });
                                                    }}
                                                    className="p-2 border-r border-b border-slate-200 w-40 min-w-40 hover:bg-indigo-50/30 cursor-pointer transition-all group align-top"
                                                >
                                                    {subjectName ? (
                                                        <div
                                                            className="timetable-slot-card p-2.5 rounded-2xl border shadow-2xs space-y-1.5 transition-all duration-150 group-hover:shadow-xs relative overflow-hidden"
                                                            style={{
                                                                backgroundColor: bgTint,
                                                                borderColor: borderTint,
                                                                borderLeftWidth: '4px',
                                                                borderLeftColor: slotColor,
                                                            }}
                                                        >
                                                            {/* Subject Header */}
                                                            <div className="flex items-start justify-between gap-1">
                                                                <div className="min-w-0">
                                                                    <span className="font-black text-slate-900 text-xs block truncate leading-snug">
                                                                        {subjectName}
                                                                    </span>
                                                                    {slot.subjectCode && (
                                                                        <span
                                                                            className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded mt-0.5 inline-block"
                                                                            style={{
                                                                                backgroundColor: hexToRgba(slotColor, 0.25),
                                                                                color: slotColor,
                                                                            }}
                                                                        >
                                                                            {slot.subjectCode}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div
                                                                    className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 shadow-2xs"
                                                                    style={{ backgroundColor: slotColor }}
                                                                    title={subjectName}
                                                                />
                                                            </div>

                                                            {/* Teacher info */}
                                                            {teacherName ? (
                                                                <div className="flex items-center gap-1.5 text-[10.5px] text-slate-800 font-bold bg-white/70 backdrop-blur-xs px-1.5 py-0.5 rounded-md border border-white/80">
                                                                    <div
                                                                        className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0"
                                                                        style={{ backgroundColor: slotColor }}
                                                                    >
                                                                        {teacherName.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <span className="truncate">{teacherName}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="text-[10px] text-slate-500 font-semibold italic">
                                                                    No educator
                                                                </div>
                                                            )}

                                                            {/* Room & Quick Edit */}
                                                            <div className="flex items-center justify-between text-[10px] pt-0.5">
                                                                <span className="inline-flex items-center gap-1 bg-white/90 text-slate-700 font-bold px-1.5 py-0.5 rounded border border-slate-200/60 shadow-2xs">
                                                                    <Building2 size={10} className="text-slate-500" />
                                                                    <span className="truncate max-w-[70px]">{slot.roomNumber || activeSection?.roomNumber || 'Room 101'}</span>
                                                                </span>
                                                                <span className="opacity-0 group-hover:opacity-100 text-slate-700 group-hover:text-blue-700 bg-white/90 p-1 rounded border border-slate-200/60 transition-all shadow-2xs">
                                                                    <Edit2 size={11} />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-full min-h-[76px] rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 p-2 flex flex-col items-center justify-center text-center gap-1 transition-all duration-150 group/empty">
                                                            <div className="w-6 h-6 rounded-full bg-slate-100 group-hover/empty:bg-blue-100 flex items-center justify-center text-slate-500 group-hover/empty:text-blue-600 transition-colors shadow-2xs">
                                                                <Plus size={13} />
                                                            </div>
                                                            <span className="text-[10px] font-extrabold text-slate-600 group-hover/empty:text-blue-700 transition-colors">
                                                                Assign Subject
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Subject Color Legend Bar */}
                <div className="no-print bg-slate-50/80 border-t border-slate-200/90 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Palette size={15} className="text-indigo-600" />
                            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                                Subject Color Palette & Distribution
                            </span>
                        </div>
                        <div className="text-[11px] text-slate-600 font-semibold">
                            Click any slot to customize • {Object.keys(slotsMap).filter(k => slotsMap[k]?.subjectName && !slotsMap[k]?.isBreak).length} total active periods this week
                        </div>
                    </div>

                    {availableSubjects.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-2.5 mt-3">
                            {availableSubjects.map((sub, sIdx) => {
                                const subColor = sub.color || COLOR_PALETTE[sIdx % COLOR_PALETTE.length];
                                const count = Object.values(slotsMap).filter(s => (s.subjectId === sub._id || s.subjectName === sub.name) && !s.isBreak).length;
                                return (
                                    <div
                                        key={sub._id || sIdx}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow"
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                                            style={{ backgroundColor: subColor }}
                                        />
                                        <span className="text-xs font-black text-slate-900">{sub.name}</span>
                                        <span
                                            className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md"
                                            style={{
                                                backgroundColor: hexToRgba(subColor, 0.15),
                                                color: subColor,
                                            }}
                                        >
                                            {count} {count === 1 ? 'period' : 'periods'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 font-medium mt-2 italic">
                            Assign subjects to this class to display their respective color codes in the legend.
                        </p>
                    )}
                </div>
            </div>

            {/* Modals */}
            {activeSlotData && (
                <TimetableSlotModal
                    isOpen={!!activeSlotData}
                    onClose={() => setActiveSlotData(null)}
                    slot={activeSlotData}
                    availableSubjects={availableSubjects}
                    availableTeachers={availableTeachers}
                    defaultRoomNumber={activeSection?.roomNumber}
                    onSave={handleSaveSlot}
                />
            )}

            <ConfigurePeriodsModal
                isOpen={isConfigurePeriodsOpen}
                onClose={() => setIsConfigurePeriodsOpen(false)}
                initialPeriods={periodsConfig}
                onSave={handleSavePeriodsConfig}
            />
        </div>
    );
}
