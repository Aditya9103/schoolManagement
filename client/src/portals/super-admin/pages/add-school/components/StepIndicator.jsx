import React from 'react';
import { Check } from 'lucide-react';

export default function StepIndicator({ currentStep, onStepClick }) {
    const steps = [
        { num: 0, label: 'Basic Information', desc: 'School details & contact' },
        { num: 1, label: 'Branding & Customization', desc: 'Logo, domain and appearance' },
        { num: 2, label: 'Plans & Features', desc: 'Subscription and modules' },
        { num: 3, label: 'Review & Create', desc: 'Confirm and launch' },
    ];

    return (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {steps.map((step) => {
                    const isCompleted = currentStep > step.num;
                    const isCurrent = currentStep === step.num;

                    return (
                        <div
                            key={step.num}
                            onClick={() => isCompleted && onStepClick?.(step.num)}
                            className={`flex items-start gap-3 p-3 rounded-2xl transition-all ${
                                isCompleted ? 'cursor-pointer hover:bg-slate-50 border border-transparent hover:border-slate-200' : ''
                            } ${isCurrent ? 'bg-blue-50/70 border border-blue-200 shadow-xs' : 'border border-transparent'}`}
                        >
                            <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                                    isCompleted
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : isCurrent
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-4 ring-blue-100'
                                        : 'bg-slate-100 border border-slate-300 text-slate-700 font-bold'
                                }`}
                            >
                                {isCompleted ? <Check size={14} strokeWidth={3} /> : step.num + 1}
                            </div>
                            <div className="min-w-0">
                                <p
                                    className={`text-xs leading-tight truncate ${
                                        isCurrent
                                            ? 'text-blue-950 font-black'
                                            : isCompleted
                                            ? 'text-slate-900 font-bold'
                                            : 'text-slate-700 font-semibold'
                                    }`}
                                >
                                    {step.label}
                                </p>
                                <p className={`text-[10px] truncate mt-0.5 ${
                                    isCurrent ? 'text-blue-700 font-medium' : isCompleted ? 'text-slate-600 font-medium' : 'text-slate-500 font-medium'
                                }`}>
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
