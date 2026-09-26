import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    BookOpen,
    Users,
    Layers,
    UserCheck,
    LayoutGrid,
    Table,
    Edit2,
    Trash2,
    MoreVertical,
    ChevronRight,
    GraduationCap,
    Clock,
    Filter,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import {
    useGetClassesQuery,
    useGetOverviewStatsQuery,
    useDeleteClassMutation,
} from '../../../../store/api/classApi';
import ClassFormModal from './components/ClassFormModal';
import SectionFormModal from './components/SectionFormModal';
import toast from 'react-hot-toast';

const GRADE_PILLS = [
    { label: 'All Classes', value: 'ALL' },
    { label: 'Pre-Primary', value: 'PRE_PRIMARY' },
    { label: 'Primary', value: 'PRIMARY' },
    { label: 'Middle', value: 'MIDDLE' },
    { label: 'Secondary', value: 'SECONDARY' },
    { label: 'Senior Secondary', value: 'SENIOR_SECONDARY' },
];

export default function ClassesOverviewPage() {
    const navigate = useNavigate();

    // Query data
    const { data: statsRes } = useGetOverviewStatsQuery();
    const stats = statsRes?.data || {
        totalClasses: 0,
        totalSections: 0,
        totalStudents: 0,
        totalTeachers: 0,
    };

    const { data: classesRes, isLoading } = useGetClassesQuery();
    const classes = classesRes?.data || [];

    const [deleteClass] = useDeleteClassMutation();

    // Filter & view states
    const [selectedGrade, setSelectedGrade] = useState('ALL');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

    // Modals
    const [isAddClassOpen, setIsAddClassOpen] = useState(false);
    const [classToEdit, setClassToEdit] = useState(null);
    const [addSectionTarget, setAddSectionTarget] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Delete handler
    const handleDeleteClass = async (classId, className) => {
        if (!window.confirm(`Are you sure you want to delete ${className}? This will remove associated sections, subjects, and timetable.`)) {
            return;
        }

        try {
            await deleteClass(classId).unwrap();
            toast.success(`Class ${className} deleted successfully`);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to delete class');
        }
    };

    // Filter classes
    const filteredClasses = useMemo(() => {
        return classes.filter((cls) => {
            const matchesGrade = selectedGrade === 'ALL' || cls.gradeLevel === selectedGrade;
            const matchesStatus =
                selectedStatus === 'ALL' ||
                (selectedStatus === 'Active' && cls.isActive !== false) ||
                (selectedStatus === 'Inactive' && cls.isActive === false);
            const matchesSearch =
                !searchTerm.trim() ||
                cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cls.classCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cls.tagline?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesGrade && matchesStatus && matchesSearch;
        });
    }, [classes, selectedGrade, selectedStatus, searchTerm]);

    return (
        <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total Classes</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.totalClasses || classes.length}</h3>
                        <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                            <span>Active curriculum grades</span>
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <BookOpen size={24} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total Sections</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.totalSections}</h3>
                        <p className="text-[11px] text-blue-700 font-semibold flex items-center gap-1 mt-1">
                            <span>Allocated class divisions</span>
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Layers size={24} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total Students</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.totalStudents?.toLocaleString() || 0}</h3>
                        <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                            <span>Enrolled in active classes</span>
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center">
                        <GraduationCap size={24} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total Teachers</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.totalTeachers}</h3>
                        <p className="text-[11px] text-purple-700 font-semibold flex items-center gap-1 mt-1">
                            <span>Assigned educators</span>
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center">
                        <UserCheck size={24} />
                    </div>
                </div>
            </div>

            {/* Filter and Action Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Grade Level Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
                        {GRADE_PILLS.map((pill) => (
                            <button
                                key={pill.value}
                                onClick={() => setSelectedGrade(pill.value)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                    selectedGrade === pill.value
                                        ? 'bg-slate-900 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                {pill.label}
                            </button>
                        ))}
                    </div>

                    {/* Add Class Button */}
                    <button
                        onClick={() => {
                            setClassToEdit(null);
                            setIsAddClassOpen(true);
                        }}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 active:scale-95 transition-all whitespace-nowrap"
                    >
                        <Plus size={16} />
                        <span>Add Class</span>
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                        {/* Search Bar */}
                        <div className="relative w-full sm:w-64">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search class name, code, quote..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                            />
                        </div>

                        {/* Status Dropdown */}
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="ALL">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    {/* View Switcher */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="text-xs text-slate-600 font-semibold">
                            Showing <span className="font-extrabold text-slate-900">{filteredClasses.length}</span> classes
                        </span>
                        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                                    viewMode === 'grid' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-700 hover:text-slate-950'
                                }`}
                                title="Grid View"
                            >
                                <LayoutGrid size={15} />
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                                    viewMode === 'table' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-700 hover:text-slate-950'
                                }`}
                                title="Table View"
                            >
                                <Table size={15} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Content: Cards Grid or Table */}
            {isLoading ? (
                <div className="py-20 text-center">
                    <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-xs font-medium text-slate-700">Loading academic classes...</p>
                </div>
            ) : filteredClasses.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <BookOpen size={40} className="mx-auto text-slate-300 mb-3" />
                    <h3 className="text-base font-bold text-slate-800">No classes found</h3>
                    <p className="text-xs text-slate-700 font-medium max-w-sm mx-auto mt-1 mb-4">
                        No classes match your current search or grade filter. Try changing your filters or add a new class.
                    </p>
                    <button
                        onClick={() => {
                            setClassToEdit(null);
                            setIsAddClassOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
                    >
                        <Plus size={15} />
                        Add First Class
                    </button>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredClasses.map((cls) => {
                        const enrolled = cls.totalStudents || 0;
                        const capacity = cls.totalCapacity || (cls.sections?.length || 1) * (cls.defaultCapacity || 30);
                        const pct = capacity > 0 ? Math.min(100, Math.round((enrolled / capacity) * 100)) : 0;
                        const teacherName = cls.classTeacherId?.firstName
                            ? `${cls.classTeacherId.firstName} ${cls.classTeacherId.lastName || ''}`.trim()
                            : (cls.classTeacherName || 'Not Assigned');
                        const bannerImage = cls.bannerUrl || cls.coverImageUrl || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80';

                        return (
                            <div
                                key={cls._id}
                                className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 overflow-hidden flex flex-col relative"
                            >
                                {/* Card Header with classroom thumbnail visual */}
                                <div className="h-32 relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 p-4 flex flex-col justify-between text-white">
                                    <img
                                        src={bannerImage}
                                        alt={cls.name}
                                        className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="relative z-10 flex items-center justify-between">
                                        <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase">
                                            {cls.classCode || cls.name.slice(0, 3)}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md text-[11px] font-bold text-white">
                                                {cls.gradeLevel ? cls.gradeLevel.replace('_', ' ') : 'PRIMARY'}
                                            </span>

                                            {/* 3-dots action menu */}
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveMenuId(activeMenuId === cls._id ? null : cls._id);
                                                    }}
                                                    className="w-7 h-7 rounded-lg bg-black/30 hover:bg-black/50 backdrop-blur-md flex items-center justify-center text-white transition-colors"
                                                >
                                                    <MoreVertical size={14} />
                                                </button>

                                                {activeMenuId === cls._id && (
                                                    <div
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="absolute right-0 top-8 z-30 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 text-xs animate-in fade-in"
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                setActiveMenuId(null);
                                                                navigate(`/school/classes/${cls._id}`);
                                                            }}
                                                            className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-semibold"
                                                        >
                                                            <BookOpen size={14} className="text-slate-600 font-medium" />
                                                            <span>View Details</span>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setActiveMenuId(null);
                                                                setClassToEdit(cls);
                                                                setIsAddClassOpen(true);
                                                            }}
                                                            className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-semibold"
                                                        >
                                                            <Edit2 size={14} className="text-blue-700 font-bold" />
                                                            <span>Edit Class</span>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setActiveMenuId(null);
                                                                setAddSectionTarget(cls._id);
                                                            }}
                                                            className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-semibold"
                                                        >
                                                            <Plus size={14} className="text-indigo-700 font-bold" />
                                                            <span>Add Section</span>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setActiveMenuId(null);
                                                                navigate(`/school/classes/timetable?classId=${cls._id}`);
                                                            }}
                                                            className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-semibold"
                                                        >
                                                            <Clock size={14} className="text-purple-700 font-bold" />
                                                            <span>View Timetable</span>
                                                        </button>
                                                        <div className="my-1 border-t border-slate-100" />
                                                        <button
                                                            onClick={() => {
                                                                setActiveMenuId(null);
                                                                handleDeleteClass(cls._id, cls.name);
                                                            }}
                                                            className="w-full px-3.5 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold"
                                                        >
                                                            <Trash2 size={14} className="text-red-500" />
                                                            <span>Delete Class</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative z-10 cursor-pointer" onClick={() => navigate(`/school/classes/${cls._id}`)}>
                                        <h4 className="text-lg font-black tracking-tight">{cls.name}</h4>
                                        <p className="text-[11px] text-blue-100 line-clamp-1">{cls.tagline || 'Standard Academic Grade'}</p>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                                    {/* Sections list */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[11px] font-bold text-slate-700 uppercase">Sections ({cls.sections?.length || 0})</span>
                                            <button
                                                type="button"
                                                onClick={() => setAddSectionTarget(cls._id)}
                                                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                                            >
                                                <Plus size={12} /> Add Section
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(cls.sections && cls.sections.length > 0) ? (
                                                cls.sections.map((sec) => (
                                                    <button
                                                        key={sec._id}
                                                        type="button"
                                                        onClick={() => navigate(`/school/classes/sections?classId=${cls._id}&sectionId=${sec._id}`)}
                                                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 text-xs font-bold text-slate-800 transition-colors"
                                                    >
                                                        Sec {sec.name}
                                                    </button>
                                                ))
                                            ) : (
                                                <span className="text-xs text-slate-700 font-medium italic">No sections created</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Student Capacity Progress */}
                                    <div>
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-slate-700 font-bold">Class Strength</span>
                                            <span className="font-extrabold text-slate-900">
                                                {enrolled} / {capacity} <span className="text-slate-600 font-semibold">({pct}%)</span>
                                            </span>
                                        </div>
                                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    pct > 90 ? 'bg-amber-500' : 'bg-blue-600'
                                                }`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Card Footer: Class Teacher & Details button */}
                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                                                {teacherName[0]}
                                            </div>
                                            <div>
                                                <p className="text-slate-900 font-extrabold truncate max-w-[130px]">{teacherName}</p>
                                                <p className="text-[10px] text-slate-600 font-semibold">Class Educator</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/school/classes/${cls._id}`)}
                                            className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 group-hover:translate-x-0.5 transition-all text-xs"
                                        >
                                            Details <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Table View */
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-100/80 text-slate-700 font-extrabold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                                    <th className="py-3.5 px-4">Class</th>
                                    <th className="py-3.5 px-4">Code</th>
                                    <th className="py-3.5 px-4">Grade Level</th>
                                    <th className="py-3.5 px-4">Sections</th>
                                    <th className="py-3.5 px-4">Capacity</th>
                                    <th className="py-3.5 px-4">Class Teacher</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {filteredClasses.map((cls) => {
                                    const teacherName = cls.classTeacherId?.firstName
                                        ? `${cls.classTeacherId.firstName} ${cls.classTeacherId.lastName || ''}`.trim()
                                        : (cls.classTeacherName || 'Not Assigned');
                                    return (
                                        <tr
                                            key={cls._id}
                                            className="hover:bg-slate-50/70 transition-colors"
                                        >
                                            <td className="py-3.5 px-4 font-extrabold text-slate-900 cursor-pointer" onClick={() => navigate(`/school/classes/${cls._id}`)}>
                                                {cls.name}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-800 uppercase font-mono font-bold">{cls.classCode || '-'}</td>
                                            <td className="py-3.5 px-4">
                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-bold text-[11px]">
                                                    {cls.gradeLevel ? cls.gradeLevel.replace('_', ' ') : 'PRIMARY'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="flex gap-1">
                                                    {(cls.sections || []).map((sec) => (
                                                        <span key={sec._id} className="px-2 py-0.5 bg-slate-100 rounded text-slate-800 font-bold text-[10px]">
                                                            {sec.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-800 font-semibold">
                                                {cls.totalStudents || 0} / {cls.totalCapacity || 90}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-800 font-semibold">{teacherName}</td>

                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setClassToEdit(cls);
                                                            setIsAddClassOpen(true);
                                                        }}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-bold"
                                                        title="Edit Class"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClass(cls._id, cls.name)}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-bold"
                                                        title="Delete Class"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modals */}
            <ClassFormModal
                isOpen={isAddClassOpen}
                onClose={() => {
                    setIsAddClassOpen(false);
                    setClassToEdit(null);
                }}
                classToEdit={classToEdit}
            />
            <SectionFormModal
                isOpen={!!addSectionTarget}
                onClose={() => setAddSectionTarget(null)}
                defaultClassId={addSectionTarget}
            />
        </div>
    );
}
