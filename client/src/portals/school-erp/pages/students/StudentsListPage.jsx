import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Plus,
    ChevronDown,
    SlidersHorizontal,
    ArrowLeft,
    Users,
} from 'lucide-react';
import { useGetStudentsQuery } from '../../../../store/api/studentApi';
import { useGetClassesQuery } from '../../../../store/api/classApi';

export default function StudentsListPage() {
    const navigate = useNavigate();

    // Filters state
    const [search, setSearch] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('rollNo');

    // Queries
    const { data: classesRes } = useGetClassesQuery();
    const classes = classesRes?.data || [];

    const { data: studentsRes, isLoading } = useGetStudentsQuery({
        search,
        classId: selectedClassId,
        sectionId: selectedSectionId,
        status: statusFilter,
        sort: sortBy,
    });

    const students = studentsRes?.data?.students || [];
    const totalCount = studentsRes?.data?.pagination?.total ?? students.length;

    // Resolve current selected class sections for the section dropdown
    const currentClass = classes.find((c) => c._id === selectedClassId);
    const availableSections = currentClass?.sections || [];

    return (
        <div className="min-h-full bg-slate-50 flex flex-col pb-20">
            {/* Top Bar matching Image 1 Screen 4 */}
            <div className="bg-white border-b border-slate-100 px-4 py-3 sticky top-0 z-20 shadow-xs">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-1.5 -ml-1.5 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
                        aria-label="Go Back"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-base font-bold text-slate-900 font-display">Students</h1>
                    <button
                        onClick={() => navigate('/school/students/new')}
                        className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/25 active:scale-95 transition-all"
                        aria-label="Add Student"
                        title="Enroll New Student"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mt-3 relative">
                    <Search
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 font-medium"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, class, roll no..."
                        className="w-full bg-slate-100/80 hover:bg-slate-100 text-xs text-slate-800 placeholder:text-slate-500 font-medium pl-9 pr-4 py-2.5 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all shadow-inner"
                    />
                </div>

                {/* Filter Pills Row */}
                <div className="mt-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                    {/* Class Dropdown Pill */}
                    <div className="relative shrink-0">
                        <select
                            value={selectedClassId}
                            onChange={(e) => {
                                setSelectedClassId(e.target.value);
                                setSelectedSectionId('');
                            }}
                            className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-medium pl-3 pr-7 py-1.5 rounded-lg shadow-xs hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="">Class ⌵</option>
                            {classes.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            size={12}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 font-medium pointer-events-none"
                        />
                    </div>

                    {/* Section Dropdown Pill */}
                    <div className="relative shrink-0">
                        <select
                            value={selectedSectionId}
                            onChange={(e) => setSelectedSectionId(e.target.value)}
                            disabled={!selectedClassId}
                            className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-medium pl-3 pr-7 py-1.5 rounded-lg shadow-xs hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <option value="">Section ⌵</option>
                            {availableSections.map((s) => (
                                <option key={s._id} value={s._id}>
                                    Sec {s.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            size={12}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 font-medium pointer-events-none"
                        />
                    </div>

                    {/* Status Dropdown Pill */}
                    <div className="relative shrink-0">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-medium pl-3 pr-7 py-1.5 rounded-lg shadow-xs hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="">Status ⌵</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="TRANSFERRED">Transferred</option>
                        </select>
                        <ChevronDown
                            size={12}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 font-medium pointer-events-none"
                        />
                    </div>

                    {/* Reset Filters Icon */}
                    {(selectedClassId || selectedSectionId || statusFilter || search) && (
                        <button
                            onClick={() => {
                                setSelectedClassId('');
                                setSelectedSectionId('');
                                setStatusFilter('');
                                setSearch('');
                            }}
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 transition-colors shrink-0 text-xs font-medium"
                            title="Clear Filters"
                        >
                            Reset
                        </button>
                    )}

                    <div className="ml-auto shrink-0">
                        <button
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 shadow-xs"
                            title="Filter Options"
                        >
                            <SlidersHorizontal size={13} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Roster Meta Summary Bar */}
            <div className="px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
                <span className="font-bold text-slate-800 tracking-tight">
                    {totalCount.toLocaleString()} Students
                </span>
                <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-700 font-semibold">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                    >
                        <option value="rollNo">Roll No</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="recent">Recently Added</option>
                        <option value="admissionNo">Admission No</option>
                    </select>
                </div>
            </div>

            {/* Students List Container */}
            <div className="px-4 space-y-2">
                {isLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center text-slate-600 font-medium">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mb-2" />
                        <p className="text-xs">Loading students roster...</p>
                    </div>
                ) : students.length === 0 ? (
                    <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-6">
                        <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                            <Users size={22} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">No students found</h3>
                        <p className="text-xs text-slate-700 font-medium mt-1 max-w-xs mx-auto">
                            No student matches the current search or filters. Try adjusting the query or enroll a new student.
                        </p>
                        <button
                            onClick={() => navigate('/school/students/new')}
                            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                        >
                            + Enroll New Student
                        </button>
                    </div>
                ) : (
                    students.map((student) => {
                        const classNameFormatted = student.classId?.name || 'Class 6';
                        const sectionNameFormatted = student.sectionId?.name || 'A';
                        const isStudentActive = student.status === 'ACTIVE';

                        return (
                            <div
                                key={student._id}
                                onClick={() => navigate(`/school/students/${student._id}`)}
                                className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs hover:shadow-md hover:border-blue-100 transition-all cursor-pointer flex items-center gap-3 active:scale-[0.99]"
                            >
                                {/* Student Avatar */}
                                <div className="h-11 w-11 rounded-full overflow-hidden bg-slate-100 shrink-0 ring-1 ring-slate-200">
                                    {student.photoUrl ? (
                                        <img
                                            src={student.photoUrl}
                                            alt={student.firstName}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm">
                                            {student.firstName?.[0]}
                                            {student.lastName?.[0]}
                                        </div>
                                    )}
                                </div>

                                {/* Student Metadata */}
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-xs font-bold text-slate-900 truncate">
                                        {student.firstName} {student.lastName}
                                    </h3>
                                    <p className="text-[11px] text-slate-700 font-semibold mt-0.5 truncate">
                                        {classNameFormatted}
                                        {sectionNameFormatted ? `${sectionNameFormatted}` : ''} | Roll No. {student.rollNo}
                                    </p>
                                </div>

                                {/* Status Pill Badge */}
                                <div className="shrink-0">
                                    <span
                                        className={`px-2.5 py-1 text-[10px] font-semibold rounded-full tracking-wide ${
                                            isStudentActive
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                                        }`}
                                    >
                                        {student.status === 'ACTIVE' ? 'Active' : student.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
