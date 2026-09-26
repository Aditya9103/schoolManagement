import React from 'react';
import { ArrowLeft, ArrowRight, Crown, Zap } from 'lucide-react';

const PLANS = [
    {
        id: 'BASIC',
        name: 'Basic',
        price: '₹19,999',
        period: '/year',
        desc: 'Essential features for small schools / up to 500 students',
        badge: null,
    },
    {
        id: 'STANDARD',
        name: 'Standard',
        price: '₹24,999',
        period: '/year',
        desc: 'Advanced features for growing schools / up to 1,500 students',
        badge: 'Most Popular',
    },
    {
        id: 'PREMIUM',
        name: 'Premium',
        price: '₹49,999',
        period: '/year',
        desc: 'Full feature suite for large institutions / up to 3,000 students',
        badge: null,
    },
    {
        id: 'ENTERPRISE',
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        desc: 'Multi-campus institutions, dedicated support & unlimited students',
        badge: 'Contact Us',
    },
];

const MODULE_CATEGORIES = [
    {
        category: 'Academic Management',
        modules: [
            { id: 'STUDENT_MANAGEMENT', label: 'Student Management', desc: 'Manage student profiles, admission, enrollment' },
            { id: 'TEACHER_MANAGEMENT', label: 'Teacher Management', desc: 'Manage staff and teacher profiles' },
            { id: 'CLASSES_SECTIONS', label: 'Classes & Sections', desc: 'Create and manage classes' },
            { id: 'TIMETABLE', label: 'Timetable', desc: 'Schedule classes and subjects' },
        ],
    },
    {
        category: 'Learning Management',
        modules: [
            { id: 'ASSIGNMENTS', label: 'Assignments', desc: 'Create and manage assignments' },
            { id: 'ONLINE_EXAMS', label: 'Online Exams', desc: 'Conduct and evaluate exams' },
            { id: 'STUDY_MATERIAL', label: 'Study Material', desc: 'Share digital learning content' },
            { id: 'LIVE_CLASSES', label: 'Live Classes', desc: 'Conduct live online classes' },
        ],
    },
    {
        category: 'Communication',
        modules: [
            { id: 'ANNOUNCEMENTS', label: 'Announcements', desc: 'Send circulars to students and parents' },
            { id: 'MESSAGES', label: 'Messages', desc: 'Internal messaging system' },
            { id: 'PARENT_PORTAL', label: 'Parent Portal', desc: 'Parent mobile app access and notifications' },
            { id: 'EMAIL_SMS', label: 'Email & SMS Notifications', desc: 'Automated Brevo & WhatsApp updates' },
        ],
    },
];

export default function StepPlansFeatures({ form, onChange, onNext, onBack }) {
    const selectedPlan = form.plan || 'STANDARD';
    const enabledModules = form.modulesEnabled || [];

    const toggleModule = (id) => {
        if (enabledModules.includes(id)) {
            onChange(
                'modulesEnabled',
                enabledModules.filter((m) => m !== id)
            );
        } else {
            onChange('modulesEnabled', [...enabledModules, id]);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const all = MODULE_CATEGORIES.flatMap((c) => c.modules.map((m) => m.id));
            onChange('modulesEnabled', all);
        } else {
            onChange('modulesEnabled', []);
        }
    };

    const allModuleIds = MODULE_CATEGORIES.flatMap((c) => c.modules.map((m) => m.id));
    const isAllSelected = allModuleIds.every((id) => enabledModules.includes(id));

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
            <div>
                <h3 className="text-lg font-black text-slate-900 font-display">Subscription Plan & Modules</h3>
                <p className="text-xs font-medium text-slate-600 mt-0.5">Select a subscription plan and enable features for this school.</p>
            </div>

            {/* 4 Plan Cards */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Crown size={15} className="text-amber-800 font-bold" />
                    Subscription Plan
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {PLANS.map((plan) => {
                        const isSelected = selectedPlan === plan.id;
                        return (
                            <div
                                key={plan.id}
                                onClick={() => onChange('plan', plan.id)}
                                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                                    isSelected
                                        ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20'
                                        : 'border-slate-300 hover:border-slate-400 bg-white shadow-2xs'
                                }`}
                            >
                                {plan.badge && (
                                    <span
                                        className={`absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                            plan.badge === 'Most Popular'
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'bg-slate-900 text-white shadow-xs'
                                        }`}
                                    >
                                        {plan.badge}
                                    </span>
                                )}

                                <div>
                                    <h5 className="text-sm font-black text-slate-900">{plan.name}</h5>
                                    <div className="mt-2 flex items-baseline gap-1">
                                        <span className="text-xl font-black text-slate-900 font-display">
                                            {plan.price}
                                        </span>
                                        <span className="text-xs text-slate-600 font-semibold">
                                            {plan.period}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                                        {plan.desc}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className={`mt-4 w-full h-9 rounded-xl text-xs font-bold transition-all ${
                                        isSelected
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'bg-slate-100 border border-slate-200 text-slate-800 hover:bg-slate-200'
                                    }`}
                                >
                                    {isSelected ? 'Selected' : 'Select'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modules Selection with Select All checkbox */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Zap size={15} className="text-blue-600" />
                        Module Selection
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-blue-600 hover:text-blue-800">
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span>Select All</span>
                    </label>
                </div>

                <div className="space-y-4">
                    {MODULE_CATEGORIES.map((cat) => (
                        <div key={cat.category} className="space-y-2">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                {cat.category}
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {cat.modules.map((mod) => {
                                    const isChecked = enabledModules.includes(mod.id);
                                    return (
                                        <div
                                            key={mod.id}
                                            onClick={() => toggleModule(mod.id)}
                                            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                                                isChecked
                                                    ? 'border-blue-400 bg-blue-50/60 shadow-2xs'
                                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => {}} // handled by parent div
                                                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0 cursor-pointer"
                                            />
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-900 leading-tight">
                                                    {mod.label}
                                                </p>
                                                <p className="text-[11px] text-slate-600 leading-snug mt-0.5 font-medium">
                                                    {mod.desc}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 h-11 px-5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 text-xs transition-all shadow-xs"
                >
                    <ArrowLeft size={15} /> Back
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    className="flex items-center gap-2 h-11 px-7 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-blue-600/25 transition-all"
                >
                    Next Step <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}
