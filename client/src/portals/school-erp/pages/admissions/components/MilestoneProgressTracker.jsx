import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';

const MILESTONES = [
    { id: 1, key: 'SUBMITTED', label: 'Submitted' },
    { id: 2, key: 'UNDER_REVIEW', label: 'Documents Under Review' },
    { id: 3, key: 'TEST_SCHEDULED', label: 'Entrance Test Scheduled' },
    { id: 4, key: 'TEST_COMPLETED', label: 'Test Completed' },
    { id: 5, key: 'RESULT', label: 'Result' },
    { id: 6, key: 'DECISION', label: 'Admission Decision' },
    { id: 7, key: 'FEE_PAYMENT', label: 'Fee Payment' },
    { id: 8, key: 'ENROLLED', label: 'Enrolled' },
];

export default function MilestoneProgressTracker({ status = 'SUBMITTED', entranceTest, fees }) {
    // Map status to current active milestone index (1 to 8)
    const getActiveMilestoneIndex = () => {
        switch (status) {
            case 'SUBMITTED':
            case 'New Application':
                return 1;
            case 'DOCS_PENDING':
            case 'Document Pending':
            case 'UNDER_REVIEW':
            case 'Under Review':
                return 2;
            case 'TEST_SCHEDULED':
            case 'INTERVIEW_SCHEDULED':
            case 'Entrance Test':
                return 3;
            case 'TEST_COMPLETED':
                return entranceTest?.marksObtained != null ? 5 : 4;
            case 'APPROVED':
            case 'Selected':
            case 'WAITLISTED':
            case 'Waitlisted':
            case 'REJECTED':
            case 'Rejected':
                return fees?.isPaid ? 7 : 6;
            case 'ENROLLED':
            case 'Admitted':
                return 8;
            default:
                return 1;
        }
    };

    const activeIndex = getActiveMilestoneIndex();

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6 overflow-x-auto">
            <div className="min-w-[780px] flex items-center justify-between relative">
                {/* Horizontal Background connector track */}
                <div className="absolute top-4.5 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

                {MILESTONES.map((step, idx) => {
                    const stepNumber = idx + 1;
                    const isCompleted = stepNumber < activeIndex;
                    const isCurrent = stepNumber === activeIndex;
                    const isUpcoming = stepNumber > activeIndex;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center flex-1 text-center">
                            {/* Milestone Circle */}
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                    isCompleted
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : isCurrent
                                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md'
                                        : 'bg-white border-2 border-slate-300 text-slate-400'
                                }`}
                            >
                                {isCompleted ? (
                                    <Check size={16} strokeWidth={2.5} />
                                ) : (
                                    <span>{stepNumber}</span>
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={`mt-2.5 text-xs font-semibold max-w-[95px] leading-tight transition-colors ${
                                    isCurrent
                                        ? 'text-blue-700 font-bold'
                                        : isCompleted
                                        ? 'text-slate-800'
                                        : 'text-slate-400'
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
