import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
    Plus,
    Layers,
    UserCheck,
    Building2,
    Edit2,
    Trash2,
    AlertCircle,
    CheckCircle2,
    MoreVertical,
    ChevronDown,
    Users,
    ArrowLeft,
    Check,
} from 'lucide-react';
import {
    useGetClassesQuery,
    useDeleteSectionMutation,
} from '../../../../store/api/classApi';
import SectionFormModal from './components/SectionFormModal';
import AssignTeacherModal from './components/AssignTeacherModal';
import toast from 'react-hot-toast';

export default function ClassSectionsPage({ targetClassId = null }) {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Support query param ?classId=... or prop or route param
    const routeClassId = targetClassId || params.classId || searchParams.get('classId');

    const { data: classesRes, isLoading } = useGetClassesQuery();
    const classes = classesRes?.data || [];

    const [selectedClassId, setSelectedClassId] = useState(routeClassId || '');

    useEffect(() => {
        if (routeClassId) {
            setSelectedClassId(routeClassId);
        } else if (classes.length > 0 && !selectedClassId) {
            setSelectedClassId(classes[0]._id);
        }
    }, [routeClassId, classes]);

    // Handle class dropdown change and update URL params smoothly
    const handleClassChange = (newClassId) => {
        setSelectedClassId(newClassId);
        setSearchParams({ classId: newClassId });
    };

    // Modals
    const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
    const [editingSection, setEditingSection] = useState(null);
    const [assignTeacherTarget, setAssignTeacherTarget] = useState(null);

    const [deleteSection, { isLoading: isDeleting }] = useDeleteSectionMutation();

    // Find currently active class
    const activeClass = classes.find((c) => c._id === selectedClassId) || classes[0];
    const sections = activeClass?.sections || [];

    const totalCapacity = sections.reduce((acc, s) => acc + (s.capacity || 30), 0);
    const totalEnrolled = sections.reduce((acc, s) => acc + (s.studentCount || 0), 0);
    const totalAvailable = Math.max(0, totalCapacity - totalEnrolled);
    const overallUtilization = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

    const handleDeleteSection = async (secId, secName) => {
        if (!window.confirm(`Are you sure you want to permanently delete Section ${secName}?`)) return;
        try {
            await deleteSection({ classId: activeClass._id, sectionId: secId }).unwrap();
            toast.success(`Section ${secName} deleted successfully`);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to delete section');
        }
    };

    if (isLoading) {
        return (
            <div className="py-24 text-center">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-semibold text-slate-700 font-medium">Loading sections roster...</p>
            </div>
        );
    }

    // Dynamic colors for distribution bar
    const sectionColors = [
        'bg-blue-600',
        'bg-indigo-600',
        'bg-violet-600',
        'bg-sky-500',
        'bg-teal-500',
        'bg-emerald-500',
    ];

    return (
        <div className="space-y-6">
            {/* Header / Selector */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm">
                        <Layers size={22} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-slate-900 tracking-tight">
                                {activeClass?.name || 'Class'} Sections Roster
                            </h2>
                            <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider">
                                {activeClass?.classCode || activeClass?.name || 'CLS'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium mt-0.5">
                            Manage divisions, physical classroom allocations, student caps, and assigned educators
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Class Selector Dropdown */}
                    {classes.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-700 hidden sm:inline">Active Class:</span>
                            <select
                                value={selectedClassId}
                                onChange={(e) => handleClassChange(e.target.value)}
                                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                            >
                                {classes.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name} ({c.sections?.length || 0} Sections)
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button
                        onClick={() => setIsAddSectionOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all whitespace-nowrap"
                    >
                        <Plus size={16} />
                        <span>Add Section</span>
                    </button>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Allocated Sections</p>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">{sections.length} Divisions</h3>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">Under {activeClass?.name}</p>
                </div>
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Total Enrolled</p>
                    <h3 className="text-2xl font-black text-blue-700 mt-1">{totalEnrolled} Students</h3>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">{totalCapacity} Maximum Capacity</p>
                </div>
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Available Seats</p>
                    <h3 className="text-2xl font-black text-emerald-700 mt-1">{totalAvailable} Open</h3>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">Vacancies for intake</p>
                </div>
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Seat Utilization</p>
                    <h3 className="text-2xl font-black text-indigo-700 mt-1">{overallUtilization}%</h3>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">Average occupancy</p>
                </div>
            </div>

            {/* Section Distribution Segmented Bar (Dynamic) */}
            {sections.length > 0 && totalCapacity > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-slate-900">Section Distribution & Share</span>
                        <span className="text-slate-600 font-medium">Student enrollment parity</span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
                        {sections.map((sec, idx) => {
                            const enrolled = sec.studentCount || 0;
                            const share = totalEnrolled > 0 ? Math.round((enrolled / totalEnrolled) * 100) : Math.round(100 / sections.length);
                            return (
                                <div
                                    key={sec._id}
                                    className={`${sectionColors[idx % sectionColors.length]}h-full transition-all`}
                                    style={{ width: `${share}%` }}
                                    title={`Section ${sec.name}: ${share}% (${enrolled} students)`}
                                />
                            );
                        })}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-1">
                        {sections.map((sec, idx) => {
                            const enrolled = sec.studentCount || 0;
                            const share = totalEnrolled > 0 ? Math.round((enrolled / totalEnrolled) * 100) : Math.round(100 / sections.length);
                            return (
                                <span key={sec._id} className="flex items-center gap-1.5 text-slate-800">
                                    <span className={`w-2.5 h-2.5 rounded-full ${sectionColors[idx % sectionColors.length]}`} />
                                    Section {sec.name} ({share}%) • {enrolled} students
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Sections Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Divisions List</h3>
                        <p className="text-xs text-slate-600 font-medium">Class {activeClass?.name} active sections</p>
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                        Showing {sections.length} divisions
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-100/80 text-slate-700 font-extrabold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                                <th className="py-3.5 px-4">Section</th>
                                <th className="py-3.5 px-4">Section Educator</th>
                                <th className="py-3.5 px-4">Classroom</th>
                                <th className="py-3.5 px-4">Enrolled / Capacity</th>
                                <th className="py-3.5 px-4">Available</th>
                                <th className="py-3.5 px-4">Utilization</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                            {sections.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-12 text-center text-slate-600 font-medium">
                                        <Layers size={32} className="mx-auto mb-2 text-slate-300" />
                                        <p className="text-xs font-semibold text-slate-600">No sections found for {activeClass?.name}</p>
                                        <p className="text-[11px] text-slate-600 font-semibold mt-0.5">Click "+ Add Section" to create the first section</p>
                                    </td>
                                </tr>
                            ) : (
                                sections.map((sec, idx) => {
                                    const enrolled = sec.studentCount || 0;
                                    const cap = sec.capacity || 30;
                                    const avail = Math.max(0, cap - enrolled);
                                    const utilPct = cap > 0 ? Math.round((enrolled / cap) * 100) : 0;
                                    const teacher = sec.classTeacherId;
                                    const teacherName = teacher
                                        ? `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim()
                                        : null;

                                    return (
                                        <tr key={sec._id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="w-8 h-8 rounded-xl bg-blue-100/70 text-blue-700 font-black flex items-center justify-center text-xs border border-blue-200/60">
                                                        {sec.name}
                                                    </span>
                                                    <div>
                                                        <span className="font-bold text-slate-900 block">
                                                            Section {sec.name}
                                                        </span>
                                                        <span className="text-[10px] text-slate-600 font-semibold font-mono">
                                                            {sec.code || `${activeClass?.name || 'C'}-${sec.name}`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {teacherName ? (
                                                    <div className="flex items-center gap-2.5">
                                                        {teacher.profilePhotoUrl ? (
                                                            <img
                                                                src={teacher.profilePhotoUrl}
                                                                alt={teacherName}
                                                                className="w-7 h-7 rounded-full object-cover border border-slate-200"
                                                            />
                                                        ) : (
                                                            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                                                                {teacherName[0]}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-slate-900 font-extrabold">{teacherName}</p>
                                                            <p className="text-[10px] text-slate-600 font-semibold">Class Educator</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setAssignTeacherTarget({
                                                            id: sec._id,
                                                            name: `${activeClass.name} - Section ${sec.name}`,
                                                            teacherId: null,
                                                        })}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 text-[11px] font-bold border border-amber-200 transition-colors"
                                                    >
                                                        <UserCheck size={12} />
                                                        <span>Assign Teacher</span>
                                                    </button>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-slate-800">
                                                {sec.roomNumber ? (
                                                    <span className="flex items-center gap-1.5">
                                                        <Building2 size={13} className="text-slate-500" />
                                                        {sec.roomNumber}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-500 italic font-medium">Not set</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="font-extrabold text-slate-900">{enrolled}</span>
                                                <span className="text-slate-600 font-semibold"> / {cap}</span>
                                            </td>
                                            <td className="py-3.5 px-4 font-extrabold text-emerald-700">
                                                {avail}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                                    utilPct >= 90
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {utilPct}% Full
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2.5 py-0.5 rounded-full border font-bold text-[10px] ${
                                                    sec.status === 'Inactive'
                                                        ? 'bg-slate-100 text-slate-600 border-slate-200'
                                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                }`}>
                                                    {sec.status || 'Active'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => setAssignTeacherTarget({
                                                            id: sec._id,
                                                            name: `${activeClass.name} - Section ${sec.name}`,
                                                            teacherId: sec.classTeacherId?._id || null,
                                                        })}
                                                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-colors"
                                                        title="Assign or reassign educator"
                                                    >
                                                        Teacher
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingSection(sec)}
                                                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                                        title="Edit Section Details"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSection(sec._id, sec.name)}
                                                        disabled={isDeleting}
                                                        className="p-1.5 text-slate-600 font-medium hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                                        title="Delete Section"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Room Allocation Cards */}
            {sections.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-700 font-extrabold uppercase tracking-wider">
                        Classroom Infrastructure & Physical Spaces
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {sections.map((sec, idx) => (
                            <div key={sec._id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900">
                                            {sec.roomNumber || `Room Unassigned`}
                                        </h4>
                                        <p className="text-[11px] text-slate-700 font-semibold">
                                            Assigned to <span className="font-bold text-blue-600">Section {sec.name}</span>
                                        </p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                                    Cap: {sec.capacity || 30}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modals */}
            <SectionFormModal
                isOpen={isAddSectionOpen}
                onClose={() => setIsAddSectionOpen(false)}
                defaultClassId={activeClass?._id}
            />

            {editingSection && (
                <SectionFormModal
                    isOpen={!!editingSection}
                    onClose={() => setEditingSection(null)}
                    initialData={editingSection}
                    defaultClassId={activeClass?._id}
                />
            )}

            <AssignTeacherModal
                isOpen={!!assignTeacherTarget}
                onClose={() => setAssignTeacherTarget(null)}
                targetType="section"
                targetId={assignTeacherTarget?.id}
                targetName={assignTeacherTarget?.name}
                currentTeacherId={assignTeacherTarget?.teacherId}
            />
        </div>
    );
}
