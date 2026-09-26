import React, { useState } from 'react';
import { useGetOnboardingPipelineQuery } from '../../../../store/api/superAdminApi';
import OnboardingHeader from './components/OnboardingHeader';
import OnboardingKanbanBoard from './components/OnboardingKanbanBoard';
import InviteAdminModal from '../add-school/components/InviteAdminModal';
import EmailPreviewModal from '../add-school/components/EmailPreviewModal';

export default function SchoolOnboardingPage() {
    const { data, isLoading } = useGetOnboardingPipelineQuery(undefined, {
        pollingInterval: 30000,
    });

    const [selectedSchoolForInvite, setSelectedSchoolForInvite] = useState(null);
    const [emailPreviewData, setEmailPreviewData] = useState(null);

    const pipeline = data?.data || data || {
        pendingSetup: [],
        awaitingInvite: [],
        completed: [],
        total: 0,
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
            {/* Header with summary stats */}
            <OnboardingHeader pipeline={pipeline} />

            {/* Kanban Pipeline Board */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[1, 2, 3].map((col) => (
                        <div
                            key={col}
                            className="bg-slate-50/60 rounded-3xl p-4 border border-slate-200/80 min-h-[480px] animate-pulse space-y-3"
                        >
                            <div className="h-12 bg-slate-200 rounded-2xl" />
                            <div className="h-32 bg-slate-200 rounded-2xl" />
                            <div className="h-32 bg-slate-200 rounded-2xl" />
                        </div>
                    ))}
                </div>
            ) : (
                <OnboardingKanbanBoard
                    pipeline={pipeline}
                    onInviteAdmin={(school) => setSelectedSchoolForInvite(school)}
                />
            )}

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
