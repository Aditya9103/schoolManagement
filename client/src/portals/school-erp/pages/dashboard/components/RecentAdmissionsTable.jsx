import React from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';

export default function RecentAdmissionsTable({ admissions, data }) {
    const rawList = data || admissions;
    const list = rawList && rawList.length > 0 ? rawList : [
        { id: '1', name: 'Aarav Mehta', class: 'Class 1', admissionDate: '22 Sep 2026', status: 'Confirmed', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
        { id: '2', name: 'Saanvi Gupta', class: 'Class 6', admissionDate: '21 Sep 2026', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
        { id: '3', name: 'Kabir Singh', class: 'Class 3', admissionDate: '20 Sep 2026', status: 'Confirmed', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop' },
        { id: '4', name: 'Ananya Patel', class: 'Class 9', admissionDate: '19 Sep 2026', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
        { id: '5', name: 'Vihaan Kumar', class: 'Class 2', admissionDate: '18 Sep 2026', status: 'Confirmed', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-4 sm:p-5 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight whitespace-nowrap">
                    Recent Admissions
                </h3>
                <Link
                    to="/school/students"
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline whitespace-nowrap"
                >
                    View All
                </Link>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr className="border-b border-slate-100 text-slate-700 font-extrabold font-semibold text-[10px] uppercase tracking-wider">
                            <th className="pb-2 pl-1 w-6">#</th>
                            <th className="pb-2 px-1">Student Name</th>
                            <th className="pb-2 px-1">Class</th>
                            <th className="pb-2 px-1">Admission Date</th>
                            <th className="pb-2 px-1">Status</th>
                            <th className="pb-2 pr-1 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {list.slice(0, 5).map((student, index) => (
                            <tr key={student.id || index} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-2 pl-1 font-mono text-slate-600 font-semibold font-bold text-[11px]">
                                    {index + 1}
                                </td>
                                <td className="py-2 px-1">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={student.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
                                            alt={student.name}
                                            className="h-6 w-6 rounded-full object-cover border border-slate-200 shrink-0"
                                        />
                                        <span className="font-bold text-slate-800 whitespace-nowrap text-xs">
                                            {student.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-2 px-1 text-slate-600 font-medium whitespace-nowrap text-xs">
                                    {student.class}
                                </td>
                                <td className="py-2 px-1 text-slate-700 font-semibold font-medium text-[11px] whitespace-nowrap">
                                    {student.admissionDate}
                                </td>
                                <td className="py-2 px-1 whitespace-nowrap">
                                    <span
                                        className={`inline-flex px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${
                                            student.status === 'Confirmed'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}
                                    >
                                        {student.status}
                                    </span>
                                </td>
                                <td className="py-2 pr-1 text-right">
                                    <button
                                        type="button"
                                        aria-label="Actions"
                                        className="p-1 text-slate-600 font-medium hover:text-slate-600 rounded-lg hover:bg-slate-100"
                                    >
                                        <MoreVertical size={13} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
