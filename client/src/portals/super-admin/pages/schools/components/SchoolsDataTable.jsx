import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    School,
    MapPin,
    MoreVertical,
    UserPlus,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    CheckCircle2,
    Power,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useToggleSchoolStatusMutation } from '../../../../../store/api/superAdminApi';

const PLAN_BADGES = {
    BASIC: 'bg-slate-100 text-slate-700 border-slate-200',
    STANDARD: 'bg-blue-50 text-blue-700 border-blue-200',
    PRO: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    PREMIUM: 'bg-purple-50 text-purple-700 border-purple-200',
    ENTERPRISE: 'bg-amber-50 text-amber-800 border-amber-200',
};

const BOARD_BADGES = {
    CBSE: 'bg-sky-50 text-sky-700 border-sky-200',
    ICSE: 'bg-rose-50 text-rose-700 border-rose-200',
    STATE: 'bg-teal-50 text-teal-700 border-teal-200',
    IB: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CAMBRIDGE: 'bg-violet-50 text-violet-700 border-violet-200',
};

export default function SchoolsDataTable({
    schools = [],
    isLoading = false,
    pagination = {},
    onPageChange,
    onInviteAdmin,
}) {
    const navigate = useNavigate();
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [toggleStatus, { isLoading: isToggling }] = useToggleSchoolStatusMutation();

    const handleToggleStatus = async (school, e) => {
        e?.stopPropagation();
        setActiveMenuId(null);
        try {
            await toggleStatus(school._id).unwrap();
            toast.success(
                `${school.name} status updated to ${school.isActive ? 'Inactive' : 'Active'}`
            );
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to toggle school status');
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-3.5">
                            <div className="h-10 w-10 rounded-2xl bg-slate-200" />
                            <div className="space-y-1.5">
                                <div className="h-3 w-40 bg-slate-200 rounded-md" />
                                <div className="h-2.5 w-24 bg-slate-100 rounded-md" />
                            </div>
                        </div>
                        <div className="h-4 w-16 bg-slate-200 rounded-md" />
                        <div className="h-4 w-14 bg-slate-100 rounded-md" />
                        <div className="h-4 w-20 bg-slate-200 rounded-md" />
                    </div>
                ))}
            </div>
        );
    }

    if (!schools.length) {
        return (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-12 text-center flex flex-col items-center">
                <div className="h-16 w-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <School size={28} />
                </div>
                <h3 className="text-base font-bold text-slate-800 font-display">No Schools Found</h3>
                <p className="text-xs text-slate-600 font-semibold mt-1 max-w-sm">
                    No schools match your search or filter criteria. Try adjusting filters or create a new school tenant.
                </p>
                <button
                    onClick={() => navigate('/super-admin/schools/new')}
                    className="mt-4 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/20"
                >
                    + Provision New School
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="bg-slate-100/80 border-b-2 border-slate-200 text-slate-700 uppercase tracking-wider text-[11px] font-bold">
                            <th className="text-left px-5 py-3.5">School / Institutional Tenant</th>
                            <th className="text-left px-4 py-3.5">Location</th>
                            <th className="text-left px-4 py-3.5">Board</th>
                            <th className="text-left px-4 py-3.5">Plan</th>
                            <th className="text-left px-4 py-3.5">Status</th>
                            <th className="text-right px-4 py-3.5">Students</th>
                            <th className="text-right px-4 py-3.5">Staff</th>
                            <th className="text-center px-4 py-3.5">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/70">
                        {schools.map((school) => {
                            const isMenuOpen = activeMenuId === school._id;
                            const city = school.address?.city || 'N/A';
                            const state = school.address?.state || 'N/A';
                            const planKey = (school.plan || 'STANDARD').toUpperCase();
                            const boardKey = (school.board || 'CBSE').toUpperCase();

                            return (
                                <tr
                                    key={school._id}
                                    className="hover:bg-blue-50/30 transition-colors group cursor-default"
                                >
                                    {/* School Name & Code */}
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden shrink-0 shadow-xs ring-1 ring-slate-300">
                                                {school.logoUrl ? (
                                                    <img
                                                        src={school.logoUrl}
                                                        alt={school.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span>{school.code?.slice(0, 3) || 'SCH'}</span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate max-w-[200px] sm:max-w-xs text-sm">
                                                        {school.name}
                                                    </p>
                                                    {school.onboardingStatus === 'COMPLETED' && (
                                                        <span title="Fully Onboarded">
                                                            <CheckCircle2 size={13} className="text-emerald-700 font-bold shrink-0" />
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-700 font-semibold font-mono mt-0.5">
                                                    {school.code} • {school.contactEmail || 'No email'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Location */}
                                    <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={13} className="text-slate-500 shrink-0" />
                                            <span>{city}, {state}</span>
                                        </div>
                                    </td>

                                    {/* Board */}
                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <span
                                            className={`inline-block px-2.5 py-0.5 rounded-lg border text-[11px] font-bold ${
                                                BOARD_BADGES[boardKey] || 'bg-slate-50 text-slate-800 border-slate-300'
                                            }`}
                                        >
                                            {boardKey}
                                        </span>
                                    </td>

                                    {/* Subscription Plan */}
                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${
                                                PLAN_BADGES[planKey] || 'bg-slate-50 text-slate-800 border-slate-300'
                                            }`}
                                        >
                                            {planKey === 'ENTERPRISE' && <Sparkles size={11} className="text-amber-800 font-bold" />}
                                            {planKey}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${
                                                school.isActive
                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                                    : 'bg-rose-50 text-rose-800 border-rose-300'
                                            }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${
                                                    school.isActive ? 'bg-emerald-600' : 'bg-rose-600'
                                                }`}
                                            />
                                            {school.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>

                                    {/* Students Count */}
                                    <td className="px-4 py-3.5 text-right font-black text-slate-900 whitespace-nowrap text-sm">
                                        {(school.stats?.studentCount ?? 0).toLocaleString()}
                                    </td>

                                    {/* Staff Count */}
                                    <td className="px-4 py-3.5 text-right font-bold text-slate-700 whitespace-nowrap">
                                        {(school.stats?.staffCount ?? 0).toLocaleString()}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3.5 text-center relative whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button
                                                onClick={() => onInviteAdmin?.(school)}
                                                className="h-8 w-8 flex items-center justify-center rounded-xl text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition-colors"
                                                title="Invite School Admin via Brevo"
                                            >
                                                <UserPlus size={16} />
                                            </button>

                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveMenuId(isMenuOpen ? null : school._id);
                                                    }}
                                                    className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                                                >
                                                    <MoreVertical size={16} />
                                                </button>

                                                {/* Dropdown Menu */}
                                                {isMenuOpen && (
                                                    <div
                                                        className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-30 text-left animate-in fade-in zoom-in-95 duration-150"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                setActiveMenuId(null);
                                                                onInviteAdmin?.(school);
                                                            }}
                                                            className="w-full px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                                                        >
                                                            <UserPlus size={14} className="text-blue-600" />
                                                            Invite Admin
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleToggleStatus(school, e)}
                                                            disabled={isToggling}
                                                            className="w-full px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 flex items-center gap-2"
                                                        >
                                                            <Power
                                                                size={14}
                                                                className={
                                                                    school.isActive ? 'text-rose-600' : 'text-emerald-600'
                                                                }
                                                            />
                                                            {school.isActive ? 'Deactivate School' : 'Activate School'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
                    <span>
                        Page <strong className="text-slate-900 font-bold">{pagination.page}</strong> of{' '}
                        <strong className="text-slate-900 font-bold">{pagination.totalPages}</strong> ({pagination.total} schools)
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => onPageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="h-8 w-8 flex items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 transition-colors shadow-2xs"
                        >
                            <ChevronLeft size={15} />
                        </button>
                        <button
                            onClick={() => onPageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                            className="h-8 w-8 flex items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 transition-colors shadow-2xs"
                        >
                            <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
