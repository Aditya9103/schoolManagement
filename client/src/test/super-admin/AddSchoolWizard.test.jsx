import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../testUtils';
import StepIndicator from '../../portals/super-admin/pages/add-school/components/StepIndicator';
import StepBasicInfo from '../../portals/super-admin/pages/add-school/components/StepBasicInfo';
import StepPlansFeatures from '../../portals/super-admin/pages/add-school/components/StepPlansFeatures';
import SchoolCreatedSuccessModal from '../../portals/super-admin/pages/add-school/components/SchoolCreatedSuccessModal';
import EmailPreviewModal from '../../portals/super-admin/pages/add-school/components/EmailPreviewModal';

describe('Super Admin Add School Wizard Component Tests', () => {
    describe('StepIndicator', () => {
        it('renders all 4 provisioning steps', () => {
            renderWithProviders(<StepIndicator currentStep={0} onStepClick={() => {}} />);

            expect(screen.getByText('Basic Information')).toBeInTheDocument();
            expect(screen.getByText('Branding & Customization')).toBeInTheDocument();
            expect(screen.getByText('Plans & Features')).toBeInTheDocument();
            expect(screen.getByText('Review & Create')).toBeInTheDocument();
        });
    });

    describe('StepBasicInfo', () => {
        it('renders required input fields for school details', () => {
            const mockForm = {
                name: 'Heritage International School',
                code: 'HIS',
                contactEmail: 'admin@heritage.edu',
                contactPhone: '+919876543210',
                board: 'CBSE',
            };

            renderWithProviders(
                <StepBasicInfo form={mockForm} onChange={() => {}} onNext={() => {}} />
            );

            expect(screen.getByPlaceholderText(/Greenwood International School/i)).toHaveValue('Heritage International School');
            expect(screen.getByPlaceholderText(/GWS/i)).toHaveValue('HIS');
            expect(screen.getByRole('button', { name: /Save & Continue/i })).toBeInTheDocument();
        });

        it('calls onNext when valid form is submitted', () => {
            const onNextMock = vi.fn();
            const mockForm = {
                name: 'Heritage International School',
                code: 'HIS',
                contactEmail: 'admin@heritage.edu',
                contactPhone: '+919876543210',
                board: 'CBSE',
                address: {
                    line1: '123 Knowledge Park',
                    state: 'Uttar Pradesh',
                    city: 'Noida',
                    pincode: '201309',
                },
            };

            const { container } = renderWithProviders(
                <StepBasicInfo form={mockForm} onChange={() => {}} onNext={onNextMock} />
            );

            const form = container.querySelector('form');
            fireEvent.submit(form);

            expect(onNextMock).toHaveBeenCalled();
        });
    });

    describe('StepPlansFeatures', () => {
        it('renders plan options (Basic, Standard, Premium, Enterprise)', () => {
            const mockForm = { plan: 'STANDARD' };

            renderWithProviders(
                <StepPlansFeatures form={mockForm} onChange={() => {}} onNext={() => {}} onPrev={() => {}} />
            );

            expect(screen.getByText('Basic')).toBeInTheDocument();
            expect(screen.getByText('Standard')).toBeInTheDocument();
            expect(screen.getByText('Premium')).toBeInTheDocument();
            expect(screen.getByText('Enterprise')).toBeInTheDocument();
        });
    });

    describe('SchoolCreatedSuccessModal', () => {
        it('renders school created confirmation and action buttons', () => {
            const mockCreatedSchool = {
                name: 'Zenith Global Academy',
                code: 'ZGA',
            };

            renderWithProviders(
                <SchoolCreatedSuccessModal
                    school={mockCreatedSchool}
                    onResetForm={() => {}}
                    onOpenInviteModal={() => {}}
                />
            );

            expect(screen.getByText(/School Created Successfully!/i)).toBeInTheDocument();
            expect(screen.getByText(/has been added to your multi-tenant ecosystem/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Invite School Administrator/i })).toBeInTheDocument();
        });
    });

    describe('EmailPreviewModal', () => {
        it('renders invitation preview with activation link and temporary password', () => {
            const mockEmailData = {
                schoolName: 'JPS Bal Vidya Mandir',
                recipientName: 'School Administrator',
                recipientEmail: 'admin@jpsbvm.edu.in',
                temporaryPassword: 'Password@123',
            };

            renderWithProviders(<EmailPreviewModal emailData={mockEmailData} onClose={() => {}} />);

            expect(screen.getByText(/Transactional Email Preview/i)).toBeInTheDocument();
            expect(screen.getAllByText(/JPS Bal Vidya Mandir/i).length).toBeGreaterThan(0);
            expect(screen.getByText('Password@123')).toBeInTheDocument();

            const activateBtn = screen.getByRole('link', { name: /Activate Account & Set Password/i });
            expect(activateBtn).toBeInTheDocument();
            expect(activateBtn.getAttribute('href')).toContain('/auth/login?invitedSchool=JPS%20Bal%20Vidya%20Mandir&email=admin%40jpsbvm.edu.in');
        });
    });
});
