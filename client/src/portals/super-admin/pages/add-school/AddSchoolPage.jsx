import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateSchoolMutation } from '../../../../store/api/superAdminApi';

import StepIndicator from './components/StepIndicator';
import StepBasicInfo from './components/StepBasicInfo';
import StepBranding from './components/StepBranding';
import StepPlansFeatures from './components/StepPlansFeatures';
import StepReviewCreate from './components/StepReviewCreate';

import SchoolCreatedSuccessModal from './components/SchoolCreatedSuccessModal';
import InviteAdminModal from './components/InviteAdminModal';
import EmailPreviewModal from './components/EmailPreviewModal';

const DEFAULT_FORM_STATE = {
    name: '',
    code: '',
    tagline: 'Inspiring Excellence in Education',
    schoolType: 'K-12 School',
    board: 'CBSE',
    contactEmail: '',
    contactPhone: '',
    principalName: '',
    website: '',
    address: {
        line1: '',
        line2: '',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201309',
        country: 'India',
    },
    theme: 'MODERN',
    primaryColor: '#2563EB',
    secondaryColor: '#3B82F6',
    accentColor: '#F59E0B',
    logoUrl: '',
    coverImageUrl: '',
    plan: 'STANDARD',
    modulesEnabled: [
        'STUDENT_MANAGEMENT',
        'TEACHER_MANAGEMENT',
        'CLASSES_SECTIONS',
        'TIMETABLE',
        'ASSIGNMENTS',
        'ONLINE_EXAMS',
        'STUDY_MATERIAL',
        'LIVE_CLASSES',
        'NOTICE_BOARD',
        'CHAT',
        'FEE_MANAGEMENT',
        'PAYROLL',
    ],
};

export default function AddSchoolPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [form, setForm] = useState(DEFAULT_FORM_STATE);

    // Modal states
    const [createdSchool, setCreatedSchool] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showEmailPreview, setShowEmailPreview] = useState(false);
    const [emailPreviewData, setEmailPreviewData] = useState(null);

    const [createSchool, { isLoading: isCreating }] = useCreateSchoolMutation();

    const handleFieldChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleResetForm = () => {
        setForm(DEFAULT_FORM_STATE);
        setStep(0);
        setCreatedSchool(null);
        setShowSuccessModal(false);
        setShowInviteModal(false);
        setShowEmailPreview(false);
        setEmailPreviewData(null);
    };

    const handleSubmit = async () => {
        // Validation check
        if (!form.name.trim() || !form.code.trim() || !form.contactEmail.trim()) {
            toast.error('Please fill in all required fields (School Name, Code, and Contact Email).');
            setStep(0);
            return;
        }

        try {
            const res = await createSchool(form).unwrap();
            const schoolData = res?.data?.school || res?.school || { ...form, _id: res?.data?._id || 'new' };
            setCreatedSchool(schoolData);
            setShowSuccessModal(true);
            toast.success('🎉 School created and tenant provisioned successfully!');
        } catch (err) {
            console.error('Create school error:', err);
            toast.error(err?.data?.message || 'Failed to create school. Please try again.');
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            {/* Top Navigation & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/super-admin/schools')}
                        className="p-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold tracking-wide uppercase">
                                <Sparkles size={11} className="text-blue-600" />
                                Multi-Tenant Provisioning
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display mt-0.5">
                            Add New School
                        </h1>
                        <p className="text-xs text-slate-700 font-medium">
                            Configure institutional profile, branding, subscriptions, and dispatch admin invitations.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate('/super-admin/schools')}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {/* 4-Step Progress Indicator */}
            <StepIndicator currentStep={step} onStepClick={(s) => setStep(s)} />

            {/* Step Content */}
            <div className="transition-all duration-300">
                {step === 0 && (
                    <StepBasicInfo
                        form={form}
                        onChange={handleFieldChange}
                        onNext={() => setStep(1)}
                    />
                )}

                {step === 1 && (
                    <StepBranding
                        form={form}
                        onChange={handleFieldChange}
                        onNext={() => setStep(2)}
                        onBack={() => setStep(0)}
                    />
                )}

                {step === 2 && (
                    <StepPlansFeatures
                        form={form}
                        onChange={handleFieldChange}
                        onNext={() => setStep(3)}
                        onBack={() => setStep(1)}
                    />
                )}

                {step === 3 && (
                    <StepReviewCreate
                        form={form}
                        onJumpToStep={(s) => setStep(s)}
                        onBack={() => setStep(2)}
                        onSubmit={handleSubmit}
                        isSubmitting={isCreating}
                    />
                )}
            </div>

            {/* Modal Dialogs matching Image 2 Screens 5, 6, 7 & 8 */}
            {showSuccessModal && (
                <SchoolCreatedSuccessModal
                    school={createdSchool}
                    onResetForm={handleResetForm}
                    onOpenInviteModal={() => {
                        setShowSuccessModal(false);
                        setShowInviteModal(true);
                    }}
                />
            )}

            {showInviteModal && (
                <InviteAdminModal
                    school={createdSchool}
                    onClose={() => setShowInviteModal(false)}
                    onOpenEmailPreview={(previewData) => {
                        setEmailPreviewData(previewData);
                        setShowEmailPreview(true);
                    }}
                />
            )}

            {showEmailPreview && (
                <EmailPreviewModal
                    emailData={emailPreviewData}
                    onClose={() => setShowEmailPreview(false)}
                />
            )}
        </div>
    );
}
