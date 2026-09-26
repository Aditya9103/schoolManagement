import React from 'react';
import { MoreVertical, School as SchoolIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetAllSchoolsQuery } from '../../../../../store/api/superAdminApi';

export default function RecentSchoolsTable() {
    const navigate = useNavigate();
    const { data: schoolsRes, isLoading } = useGetAllSchoolsQuery({ limit: 5 });
    const schools = schoolsRes?.data?.schools || [];

    const getPlanBadge = (plan) => {
        const p = (plan || 'STANDARD').toUpperCase();
        switch (p) {
            case 'PREMIUM':
                return 'bg-blue-50 text-blue-700 border-blue-200/60';
            case 'ENTERPRISE':
                return 'bg-purple-50 text-purple-700 border-purple-200/60';
            case 'BASIC':
                return 'bg-sky-50 text-sky-700 border-sky-200/60';
            default:
                return 'bg-amber-50 text-amber-700 border-amber-200/60';
        }
    };

    const getStatusBadge = (status) => {
        const s = (status || 'ACTIVE').toUpperCase();
        switch (s) {
            case 'ACTIVE':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
            case 'TRIAL':
                return 'bg-blue-50 text-blue-700 border-blue-200/60';
            case 'EXPIRING_SOON':
                return 'bg-amber-50 text-amber-700 border-amber-200/60';
            default:
                return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 pb-3">
                <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">Recent Schools</h3>
                    <p className="text-xs text-slate-600 font-medium">Newly onboarded educational institutions</p>
                </div>
                <Link
                    to="/super-admin/schools"
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors"
                >
                    View All →
                </Link>
            </div>

            <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr className="border-b-2 border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                            <th className="pb-3 font-bold">School Name</th>
                            <th className="pb-3 font-bold">Location</th>
                            <th className="pb-3 font-bold">Students</th>
                            <th className="pb-3 font-bold">Plan</th>
                            <th className="pb-3 font-bold">Status</th>
                            <th className="pb-3 font-bold">Joined On</th>
                            <th className="pb-3 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/80">
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="py-6 text-center text-slate-500 font-medium">
                                    Loading schools...
                                </td>
                            </tr>
                        ) : schools.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-6 text-center text-slate-500 font-medium">
                                    No schools found
                                </td>
                            </tr>
                        ) : (
                            schools.map((school) => {
                                const location = school.address?.city
                                    ? `${school.address.city}, ${school.address.state || 'IN'}`
                                    : 'Noida, UP';
                                const joinedDate = school.createdAt
                                    ? new Date(school.createdAt).toLocaleDateString('en-GB', {
                                          day: '2-digit',
                                          month: 'short',
                                          year: 'numeric',
                                      })
                                    : '12 Jan 2026';

                                return (
                                    <tr
                                        key={school._id}
                                        className="hover:bg-slate-50 transition-colors group cursor-pointer"
                                        onClick={() => navigate('/super-admin/schools')}
                                    >
                                        <td className="py-3.5 pr-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-200">
                                                    {school.logoUrl ? (
                                                        <img
                                                            src={school.logoUrl}
                                                            alt={school.name}
                                                            className="h-full w-full object-cover rounded-xl"
                                                        />
                                                    ) : (
                                                        <SchoolIcon size={18} />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 text-sm truncate">
                                                        {school.name}
                                                    </p>
                                                    <p className="text-xs text-slate-600 font-mono font-medium">
                                                        {school.code} • {school.board || 'CBSE'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 text-slate-700 font-semibold whitespace-nowrap">
                                            {location}
                                        </td>
                                        <td className="py-3.5 font-bold text-slate-900 text-sm whitespace-nowrap">
                                            {(school.studentCount || 1245).toLocaleString()}
                                        </td>
                                        <td className="py-3.5 whitespace-nowrap">
                                            <span
                                                className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getPlanBadge(
                                                    school.plan
                                                )}`}
                                            >
                                                {school.plan || 'Standard'}
                                            </span>
                                        </td>
                                        <td className="py-3.5 whitespace-nowrap">
                                            <span
                                                className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getStatusBadge(
                                                    school.subscriptionStatus
                                                )}`}
                                            >
                                                {school.subscriptionStatus || 'Active'}
                                            </span>
                                        </td>
                                        <td className="py-3 text-slate-700 font-semibold font-medium whitespace-nowrap text-[11px]">
                                            {joinedDate}
                                        </td>
                                        <td className="py-3 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate('/super-admin/schools');
                                                }}
                                                className="p-1.5 text-slate-600 font-medium hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <MoreVertical size={14} />
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
    );
}
