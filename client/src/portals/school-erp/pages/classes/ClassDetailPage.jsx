import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    BookOpen,
    Users,
    Layers,
    UserCheck,
    Plus,
    Calendar,
    Phone,
    Mail,
    Edit3,
    GraduationCap,
    Clock,
    ChevronRight,
    Sparkles,
    CheckCircle2,
} from 'lucide-react';
import {
    useGetClassDetailsQuery,
} from '../../../../store/api/classApi';
import AssignTeacherModal from './components/AssignTeacherModal';
import AddSectionModal from './components/AddSectionModal';
import ClassSectionsPage from './ClassSectionsPage';
import ClassStudentsPage from './ClassStudentsPage';
import ClassSubjectsPage from './ClassSubjectsPage';
import ClassTimetablePage from './ClassTimetablePage';

export default function ClassDetailPage() {
    const { classId } = useParams();
    const navigate = useNavigate();

    const { data: detailsRes, isLoading } = useGetClassDetailsQuery(classId);
    const classData = detailsRes?.data;

    // Sub-tab selection
    const [activeTab, setActiveTab] = useState('Overview');

    // Modals
    const [isChangeTeacherOpen, setIsChangeTeacherOpen] = useState(false);
    const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="py-20 text-center">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-medium text-slate-700">Loading class details...</p>
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-600 font-medium mb-3">Class not found</p>
                <button
                    onClick={() => navigate('/school/classes')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                    Back to Classes
                </button>
            </div>
        );
    }

    const {
        classDoc,
        sections = [],
        enrolledCount = 0,
        totalCapacity = 0,
        boysCount = 0,
        girlsCount = 0,
    } = classData;

    const classTeacher = classDoc?.classTeacherId || classData.classTeacher;

    const availableSeats = Math.max(0, totalCapacity - enrolledCount);
    const occupancyRate = totalCapacity > 0 ? Math.round((enrolledCount / totalCapacity) * 100) : 0;
    const boysPct = enrolledCount > 0 ? Math.round((boysCount / enrolledCount) * 100) : 54;
    const girlsPct = 100 - boysPct;

    const SUB_TABS = ['Overview', 'Sections', 'Students', 'Subjects', 'Timetable'];

    return (
        <div className="space-y-6">
            {/* Header / Breadcrumb navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/school/classes')}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        title="Back to Overview"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-black text-slate-900">{classDoc?.name}</h2>
                            <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-bold uppercase">
                                {classDoc?.classCode || 'C1'}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold">
                                Active
                            </span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium mt-0.5">
                            Grade Level: <span className="font-semibold text-slate-700">{classDoc?.gradeLevel?.replace('_', ' ') || 'PRIMARY'}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsAddSectionOpen(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
                    >
                        <Plus size={15} />
                        Add Section
                    </button>
                </div>
            </div>

            {/* Hero Cover Photo Card */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white p-6 md:p-8 shadow-sm">
                {classDoc?.coverImageUrl && (
                    <img
                        src={classDoc.coverImageUrl}
                        alt={classDoc.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-25"
                    />
                )}
                <div className="relative z-10 max-w-2xl space-y-2">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase">
                        Academic Grade Profile
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{classDoc?.name}</h1>
                    <p className="text-sm text-blue-100 italic">
                        "{classDoc?.tagline || 'Building strong foundations for lifelong learning and intellectual curiosity.'}"
                    </p>
                </div>
            </div>

            {/* Sub-tab Navigation */}
            <div className="border-b border-slate-200">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                    {SUB_TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                                activeTab === tab
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sub-tab Content */}
            {activeTab === 'Overview' && (
                <div className="space-y-6">
                    {/* Quick Specs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Class Code</p>
                            <h4 className="text-xl font-black text-slate-900 mt-1">{classDoc?.classCode || 'C1'}</h4>
                            <p className="text-[11px] text-slate-600 font-medium mt-0.5">Assigned Identifier</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Total Capacity</p>
                            <h4 className="text-xl font-black text-slate-900 mt-1">{totalCapacity}</h4>
                            <p className="text-[11px] text-slate-600 font-medium mt-0.5">Across {sections.length} Sections</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Available Seats</p>
                            <h4 className="text-xl font-black text-emerald-700 mt-1">{availableSeats}</h4>
                            <p className="text-[11px] text-slate-600 font-medium mt-0.5">{occupancyRate}% Enrolled</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Academic Status</p>
                            <h4 className="text-xl font-black text-blue-700 mt-1">Active</h4>
                            <p className="text-[11px] text-slate-600 font-medium mt-0.5">Curriculum running</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Class Teacher Card */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-slate-900">Class In-Charge Educator</h3>
                                    <button
                                        onClick={() => setIsChangeTeacherOpen(true)}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                    >
                                        <Edit3 size={13} /> {classTeacher ? 'Change' : 'Assign'}
                                    </button>
                                </div>

                                {classTeacher ? (
                                    <div className="flex items-center gap-4">
                                        {classTeacher.profilePhotoUrl ? (
                                            <img
                                                src={classTeacher.profilePhotoUrl}
                                                alt={classTeacher.firstName}
                                                className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-100 shadow-xs"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-xs">
                                                {classTeacher.firstName?.[0] || 'T'}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-base font-bold text-slate-900">
                                                {classTeacher.firstName} {classTeacher.lastName || ''}
                                            </h4>
                                            <p className="text-xs text-blue-600 font-semibold">{classTeacher.designation || 'Class Teacher'}</p>
                                            <div className="space-y-1 mt-2 text-xs text-slate-600">
                                                {classTeacher.email && (
                                                    <p className="flex items-center gap-1.5">
                                                        <Mail size={13} className="text-slate-600 font-medium" />
                                                        <span>{classTeacher.email}</span>
                                                    </p>
                                                )}
                                                {classTeacher.phone && (
                                                    <p className="flex items-center gap-1.5 text-[11px] text-slate-700 font-semibold">
                                                        <Phone size={13} className="text-slate-600 font-medium" />
                                                        <span>{classTeacher.phone}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        <UserCheck size={28} className="mx-auto mb-2 text-slate-600 font-medium" />
                                        <p className="text-xs font-semibold text-slate-700">No Educator Assigned</p>
                                        <p className="text-[11px] text-slate-600 font-semibold mt-0.5">Click "Assign" to appoint a class teacher</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700 font-medium">
                                <span>Status: {classTeacher ? 'Assigned' : 'Vacant'}</span>
                                <span className={`font-semibold ${classTeacher ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {classTeacher ? 'Active Duty' : 'Action Required'}
                                </span>
                            </div>
                        </div>

                        {/* Quick Actions Panel */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                            <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setIsAddSectionOpen(true)}
                                    className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left flex flex-col justify-between group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <Plus size={16} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-800">Add Section</span>
                                    <span className="text-[10px] text-slate-600 font-semibold">Create new division</span>
                                </button>

                                <button
                                    onClick={() => navigate('/school/students/new')}
                                    className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-left flex flex-col justify-between group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <GraduationCap size={16} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-800">Add Students</span>
                                    <span className="text-[10px] text-slate-600 font-semibold">Direct enrollment</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('Subjects')}
                                    className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-left flex flex-col justify-between group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <BookOpen size={16} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-800">Assign Subjects</span>
                                    <span className="text-[10px] text-slate-600 font-semibold">Curriculum setup</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('Timetable')}
                                    className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all text-left flex flex-col justify-between group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <Clock size={16} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-800">View Timetable</span>
                                    <span className="text-[10px] text-slate-600 font-semibold">Weekly schedule</span>
                                </button>
                            </div>
                        </div>

                        {/* Class Strength & Demographics */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 mb-3">Strength & Demographics</h3>
                                <div className="space-y-4">
                                    {/* Overall Capacity Bar */}
                                    <div>
                                        <div className="flex items-center justify-between text-xs mb-1.5">
                                            <span className="text-slate-500 font-semibold">Total Occupancy</span>
                                            <span className="font-bold text-slate-900">{enrolledCount} / {totalCapacity} ({occupancyRate}%)</span>
                                        </div>
                                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 rounded-full"
                                                style={{ width: `${occupancyRate}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Gender Breakdown */}
                                    <div className="pt-2 border-t border-slate-100 space-y-2">
                                        <span className="text-xs font-bold text-slate-700 block">Gender Distribution</span>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-blue-700 font-semibold flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-blue-500" /> Boys: {boysCount} ({boysPct}%)
                                            </span>
                                            <span className="text-pink-700 font-semibold flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-pink-500" /> Girls: {girlsCount} ({girlsPct}%)
                                            </span>
                                        </div>
                                        <div className="w-full h-2.5 bg-pink-100 rounded-full overflow-hidden flex">
                                            <div
                                                className="h-full bg-blue-500"
                                                style={{ width: `${boysPct}%` }}
                                            />
                                            <div
                                                className="h-full bg-pink-500"
                                                style={{ width: `${girlsPct}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700 font-medium">
                                <span>3 Allocated Sections</span>
                                <span className="font-semibold text-blue-600 cursor-pointer" onClick={() => setActiveTab('Sections')}>
                                    Explore Sections →
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Embedded Sections Preview */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Sections in {classDoc?.name}</h3>
                                <p className="text-xs text-slate-700 font-medium">Student enrollment and capacity breakdown per division</p>
                            </div>
                            <button
                                onClick={() => setActiveTab('Sections')}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700"
                            >
                                View All Sections →
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {sections.map((sec) => (
                                <div key={sec._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-black text-slate-900">Section {sec.name}</span>
                                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                            {sec.status || 'Active'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-700 font-medium mb-3">Room: <span className="font-semibold text-slate-700">{sec.roomNumber || 'Room 101'}</span></p>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-500">Students</span>
                                            <span className="font-bold text-slate-800">26 / {sec.capacity || 30}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-600 rounded-full" style={{ width: '86%' }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Sub-tab 2: Sections */}
            {activeTab === 'Sections' && (
                <ClassSectionsPage targetClassId={classId} />
            )}

            {/* Sub-tab 3: Students */}
            {activeTab === 'Students' && (
                <ClassStudentsPage targetClassId={classId} />
            )}

            {/* Sub-tab 4: Subjects */}
            {activeTab === 'Subjects' && (
                <ClassSubjectsPage targetClassId={classId} />
            )}

            {/* Sub-tab 5: Timetable */}
            {activeTab === 'Timetable' && (
                <ClassTimetablePage targetClassId={classId} />
            )}

            {/* Modals */}
            <AssignTeacherModal
                isOpen={isChangeTeacherOpen}
                onClose={() => setIsChangeTeacherOpen(false)}
                targetType="class"
                targetId={classId}
                targetName={classDoc?.name}
                currentTeacherId={classTeacher?._id}
            />
            <AddSectionModal
                isOpen={isAddSectionOpen}
                onClose={() => setIsAddSectionOpen(false)}
                defaultClassId={classId}
            />
        </div>
    );
}
