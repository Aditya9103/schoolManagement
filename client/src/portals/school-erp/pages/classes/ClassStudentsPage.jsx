import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    GraduationCap,
    Users,
    Filter,
    ChevronDown,
    Mail,
    Phone,
    Eye,
    Download,
    Check,
} from 'lucide-react';
import {
    useGetClassStudentsQuery,
    useGetClassesQuery,
} from '../../../../store/api/classApi';

export default function ClassStudentsPage({ targetClassId = null }) {
    const params = useParams();
    const navigate = useNavigate();
    const classId = targetClassId || params.classId;

    const { data: classesRes } = useGetClassesQuery();
    const classes = classesRes?.data || [];
    const activeClass = classes.find((c) => c._id === classId) || classes[0];

    const [selectedSection, setSelectedSection] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);

    const { data: studentsRes, isLoading } = useGetClassStudentsQuery(
        { classId: activeClass?._id, section: selectedSection !== 'ALL' ? selectedSection : undefined },
        { skip: !activeClass?._id }
    );
    const studentsData = studentsRes?.data;
    const studentsList = studentsData?.students || [];

    // Filter students by search
    const filteredStudents = useMemo(() => {
        return studentsList.filter((s) => {
            const matchesSearch =
                !searchTerm.trim() ||
                s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.admissionNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.guardianName?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [studentsList, searchTerm]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedStudents(filteredStudents.map((s) => s.id));
        } else {
            setSelectedStudents([]);
        }
    };

    const handleToggleSelect = (id) => {
        setSelectedStudents((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    if (isLoading) {
        return (
            <div className="py-20 text-center">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-medium text-slate-700">Loading student roster...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header & Quick Stat Pills */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-slate-900">
                                {activeClass?.name || 'Class'} Student Roster
                            </h2>
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-bold uppercase">
                                {activeClass?.classCode || 'C1'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium">Complete student directory with roll numbers, sections and guardians</p>
                    </div>

                    <button
                        onClick={() => navigate('/school/students/new')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 active:scale-95 transition-all self-start sm:self-auto"
                    >
                        <Plus size={16} />
                        <span>Add Student</span>
                    </button>
                </div>

                {/* Metric Counter Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                        <span className="text-[11px] font-semibold text-slate-700 block">Total Enrolled</span>
                        <span className="text-lg font-black text-slate-900">{studentsList.length || 78}</span>
                    </div>
                    <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                        <span className="text-[11px] font-semibold text-blue-700 block">Boys</span>
                        <span className="text-lg font-black text-blue-700">42</span>
                    </div>
                    <div className="p-3 bg-pink-50/60 rounded-xl border border-pink-100">
                        <span className="text-[11px] font-semibold text-pink-700 block">Girls</span>
                        <span className="text-lg font-black text-pink-700">36</span>
                    </div>
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                        <span className="text-[11px] font-semibold text-emerald-700 block">New Admissions</span>
                        <span className="text-lg font-black text-emerald-700">14</span>
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Live Search */}
                    <div className="relative w-full sm:w-72">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by name, roll no, guardian..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 font-semibold"
                        />
                    </div>

                    {/* Section Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                        {['ALL', 'A', 'B', 'C'].map((sec) => (
                            <button
                                key={sec}
                                onClick={() => setSelectedSection(sec)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                    selectedSection === sec
                                        ? 'bg-slate-900 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                {sec === 'ALL' ? 'All Sections' : `Sec ${sec}`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-600 font-medium">
                    <span>Showing <span className="font-extrabold text-slate-900">{filteredStudents.length}</span> students</span>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-100/80 text-slate-700 font-extrabold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                                <th className="py-3.5 px-4 w-10">
                                    <input
                                        type="checkbox"
                                        checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                                        onChange={handleSelectAll}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="py-3.5 px-4">Roll / Adm No</th>
                                <th className="py-3.5 px-4">Student Name</th>
                                <th className="py-3.5 px-4">Section</th>
                                <th className="py-3.5 px-4">Gender</th>
                                <th className="py-3.5 px-4">Father / Guardian</th>
                                <th className="py-3.5 px-4">Enrollment Date</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Profile</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="py-12 text-center text-slate-600 font-semibold">
                                        No students found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((stu) => {
                                    const isSelected = selectedStudents.includes(stu.id);
                                    return (
                                        <tr
                                            key={stu.id}
                                            className={`hover:bg-slate-50/80 transition-colors ${
                                                isSelected ? 'bg-blue-50/40' : ''
                                            }`}
                                        >
                                            <td className="py-3.5 px-4">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleToggleSelect(stu.id)}
                                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                                                {stu.admissionNumber}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-2.5">
                                                    <img
                                                        src={stu.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80'}
                                                        alt={stu.name}
                                                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                                    />
                                                    <span className="font-bold text-slate-900">{stu.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[11px]">
                                                    Sec {stu.section}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                                    stu.gender === 'Female'
                                                        ? 'bg-pink-50 text-pink-700 border border-pink-200'
                                                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                                                }`}>
                                                    {stu.gender}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-700">
                                                <p className="font-semibold">{stu.guardianName}</p>
                                                <p className="text-[10px] text-slate-600 font-semibold">{stu.guardianPhone}</p>
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-500">
                                                {stu.enrollmentDate}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                                                    {stu.status || 'Active'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <button
                                                    onClick={() => navigate(`/school/students/${stu.id}`)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-bold inline-flex items-center gap-1"
                                                >
                                                    <Eye size={14} /> View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
