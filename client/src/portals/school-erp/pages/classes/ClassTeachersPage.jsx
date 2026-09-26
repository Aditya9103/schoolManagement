import React, { useState } from 'react';
import {
    UserCheck,
    Plus,
    Search,
    Mail,
    Phone,
    Edit3,
    Calendar,
    BookOpen,
    CheckCircle2,
} from 'lucide-react';
import { useGetClassTeachersQuery } from '../../../../store/api/classApi';
import AssignTeacherModal from './components/AssignTeacherModal';

export default function ClassTeachersPage() {
    const { data: teachersRes, isLoading } = useGetClassTeachersQuery();
    const teachersData = teachersRes?.data || { classTeachers: [], sectionTeachers: [] };

    const [activeTab, setActiveTab] = useState('classTeachers'); // 'classTeachers' | 'sectionTeachers'
    const [searchTerm, setSearchTerm] = useState('');
    const [assignTarget, setAssignTarget] = useState(null);

    const activeList = activeTab === 'classTeachers' ? teachersData.classTeachers : teachersData.sectionTeachers;

    const filteredList = activeList.filter((item) => {
        const query = searchTerm.toLowerCase();
        const teacherName = `${item.teacher?.firstName || ''} ${item.teacher?.lastName || ''}`.toLowerCase();
        const className = (item.className || '').toLowerCase();
        return teacherName.includes(query) || className.includes(query);
    });

    if (isLoading) {
        return (
            <div className="py-20 text-center">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-medium text-slate-700">Loading educators directory...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center">
                        <UserCheck size={22} />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Faculty & Teachers Directory</h2>
                        <p className="text-xs text-slate-700 font-medium">Overview of educators assigned as class and division in-charges</p>
                    </div>
                </div>

                <button
                    onClick={() => setAssignTarget({ type: 'class', id: '', name: 'Class' })}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 active:scale-95 transition-all self-start sm:self-auto"
                >
                    <Plus size={16} />
                    <span>Assign Educator</span>
                </button>
            </div>

            {/* Filter and Tab Navigation */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab('classTeachers')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            activeTab === 'classTeachers'
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        Class Teachers ({teachersData.classTeachers?.length || 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('sectionTeachers')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            activeTab === 'sectionTeachers'
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        Section Teachers ({teachersData.sectionTeachers?.length || 0})
                    </button>
                </div>

                <div className="relative w-full sm:w-72">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 font-medium" />
                    <input
                        type="text"
                        placeholder="Search educator or class..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 font-medium"
                    />
                </div>
            </div>

            {/* Directory Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-100/90/80 text-slate-700 font-extrabold font-bold border-b border-slate-200 uppercase tracking-wider">
                                <th className="py-3.5 px-4">{activeTab === 'classTeachers' ? 'Class' : 'Class & Section'}</th>
                                <th className="py-3.5 px-4">Educator / Teacher In-Charge</th>
                                <th className="py-3.5 px-4">Contact Info</th>
                                <th className="py-3.5 px-4">Assigned On</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                            {filteredList.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-slate-600 font-medium">
                                        No teacher assignments found.
                                    </td>
                                </tr>
                            ) : (
                                filteredList.map((item) => {
                                    const teacher = item.teacher || {};
                                    const fullName = `${teacher.firstName || 'Faculty'} ${teacher.lastName || 'Member'}`.trim();
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-black flex items-center justify-center text-xs">
                                                        {item.classCode || (item.sectionName ? `Sec ${item.sectionName}` : 'C')}
                                                    </span>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{item.className}</p>
                                                        {item.sectionName && (
                                                            <p className="text-[10px] text-slate-700 font-semibold">Section {item.sectionName}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={teacher.profilePhotoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80'}
                                                        alt={fullName}
                                                        className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-slate-900">{fullName}</p>
                                                        <p className="text-[11px] text-blue-600 font-medium">
                                                            {activeTab === 'classTeachers' ? 'Class Teacher' : 'Section Teacher'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600">
                                                <p className="flex items-center gap-1.5">
                                                    <Mail size={12} className="text-slate-600 font-medium" />
                                                    <span>{teacher.email || 'teacher@school.com'}</span>
                                                </p>
                                                <p className="flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold mt-0.5">
                                                    <Phone size={12} className="text-slate-600 font-medium" />
                                                    <span>{teacher.phone || '+91 98765 43210'}</span>
                                                </p>
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-500">
                                                {item.assignedOn || '12 Apr 2026'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                                                    {item.status || 'Active'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <button
                                                    onClick={() => setAssignTarget({
                                                        type: activeTab === 'classTeachers' ? 'class' : 'section',
                                                        id: item.id,
                                                        name: item.className,
                                                        currentTeacherId: item.teacher?._id,
                                                    })}
                                                    className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 rounded-lg font-bold text-xs inline-flex items-center gap-1"
                                                >
                                                    <Edit3 size={13} /> Change
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

            {/* Modal */}
            <AssignTeacherModal
                isOpen={!!assignTarget}
                onClose={() => setAssignTarget(null)}
                targetType={assignTarget?.type || 'class'}
                targetId={assignTarget?.id}
                targetName={assignTarget?.name}
                currentTeacherId={assignTarget?.currentTeacherId}
            />
        </div>
    );
}
