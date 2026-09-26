import React, { useState } from 'react';
import { useGetAllSchoolsQuery } from '../../../../store/api/superAdminApi';
import SchoolsFilterBar from './components/SchoolsFilterBar';
import SchoolsDataTable from './components/SchoolsDataTable';
import InviteAdminModal from '../add-school/components/InviteAdminModal';
import EmailPreviewModal from '../add-school/components/EmailPreviewModal';

export default function AllSchoolsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [boardFilter, setBoardFilter] = useState('ALL');
    const [planFilter, setPlanFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Modal state for quick invite from table
    const [selectedSchoolForInvite, setSelectedSchoolForInvite] = useState(null);
    const [emailPreviewData, setEmailPreviewData] = useState(null);

    // Build query params
    const queryParams = {
        page,
        limit: 15,
        ...(search && { search }),
        ...(boardFilter !== 'ALL' && { board: boardFilter }),
        ...(planFilter !== 'ALL' && { plan: planFilter }),
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
    };

    const { data, isLoading, isFetching, refetch } = useGetAllSchoolsQuery(queryParams);

    const schools = data?.data?.schools || data?.schools || [];
    const pagination = {
        total: data?.data?.total ?? data?.total ?? schools.length,
        page: data?.data?.page ?? data?.page ?? 1,
        limit: data?.data?.limit ?? data?.limit ?? 15,
        totalPages: data?.data?.totalPages ?? data?.totalPages ?? 1,
    };

    const handleReset = () => {
        setSearch('');
        setBoardFilter('ALL');
        setPlanFilter('ALL');
        setStatusFilter('ALL');
        setPage(1);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                        All Schools Directory
                    </h1>
                    <p className="text-xs text-slate-700 font-medium mt-0.5">
                        Manage institutional tenants, onboarded schools, subscription tiers, and tenant administrators.
                    </p>
                </div>
                <div className="text-xs font-semibold text-slate-700 font-medium bg-white px-3.5 py-1.5 rounded-2xl border border-slate-200/80 shadow-xs shrink-0 self-start sm:self-auto">
                    Total: <span className="font-bold text-slate-900">{pagination.total || schools.length}</span> Institutions
                </div>
            </div>

            {/* Filter Bar */}
            <SchoolsFilterBar
                search={search}
                onSearchChange={(val) => {
                    setSearch(val);
                    setPage(1);
                }}
                boardFilter={boardFilter}
                onBoardChange={(val) => {
                    setBoardFilter(val);
                    setPage(1);
                }}
                planFilter={planFilter}
                onPlanChange={(val) => {
                    setPlanFilter(val);
                    setPage(1);
                }}
                statusFilter={statusFilter}
                onStatusChange={(val) => {
                    setStatusFilter(val);
                    setPage(1);
                }}
                onReset={handleReset}
                onRefresh={refetch}
                isFetching={isFetching}
            />

            {/* Data Table */}
            <SchoolsDataTable
                schools={schools}
                isLoading={isLoading}
                pagination={pagination}
                onPageChange={(p) => setPage(p)}
                onInviteAdmin={(school) => setSelectedSchoolForInvite(school)}
            />

            {/* Admin Invite Modal */}
            {selectedSchoolForInvite && (
                <InviteAdminModal
                    school={selectedSchoolForInvite}
                    onClose={() => setSelectedSchoolForInvite(null)}
                    onOpenEmailPreview={(preview) => {
                        setEmailPreviewData(preview);
                    }}
                />
            )}

            {/* Email Preview Modal */}
            {emailPreviewData && (
                <EmailPreviewModal
                    emailData={emailPreviewData}
                    onClose={() => setEmailPreviewData(null)}
                />
            )}
        </div>
    );
}
