import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../testUtils';
import OnboardingKanbanBoard from '../../portals/super-admin/pages/onboarding/components/OnboardingKanbanBoard';
import OnboardingHeader from '../../portals/super-admin/pages/onboarding/components/OnboardingHeader';
import OnboardingSchoolCard from '../../portals/super-admin/pages/onboarding/components/OnboardingSchoolCard';

describe('Super Admin School Onboarding Pipeline Suite', () => {
    const mockPipeline = {
        pendingSetup: [
            {
                _id: 'school-1',
                name: 'Greenfield Public School',
                code: 'GPS001',
                board: 'CBSE',
                plan: 'STANDARD',
                email: 'contact@greenfield.edu',
                address: { city: 'Bengaluru', state: 'Karnataka' },
                adminUser: null,
            },
        ],
        awaitingInvite: [
            {
                _id: 'school-2',
                name: 'Oakridge International School',
                code: 'OIS002',
                board: 'IB',
                plan: 'ENTERPRISE',
                email: 'principal@oakridge.edu',
                address: { city: 'Hyderabad', state: 'Telangana' },
                adminUser: { name: 'Dr. Ramesh Rao', email: 'ramesh@oakridge.edu', isVerified: false },
            },
        ],
        completed: [
            {
                _id: 'school-3',
                name: 'Delhi World School',
                code: 'DWS003',
                board: 'ICSE',
                plan: 'PRO',
                email: 'admin@delhiworld.edu',
                address: { city: 'New Delhi', state: 'Delhi' },
                adminUser: { name: 'Sunita Mehra', email: 'sunita@delhiworld.edu', isVerified: true },
            },
        ],
        total: 3,
    };

    it('should render OnboardingHeader with correct statistics and quick action button', () => {
        renderWithProviders(
            <OnboardingHeader pipeline={mockPipeline} />
        );

        expect(screen.getByText(/School Onboarding Pipeline/i)).toBeInTheDocument();
        expect(screen.getByText(/Monitor new institutional tenants/i)).toBeInTheDocument();
        expect(screen.getByText(/Onboard New School/i)).toBeInTheDocument();
        expect(screen.getByText('Setup Pending')).toBeInTheDocument();
        expect(screen.getByText('Awaiting Admin Invite')).toBeInTheDocument();
    });

    it('should render all 3 Kanban columns with their respective titles and counts', () => {
        renderWithProviders(
            <OnboardingKanbanBoard pipeline={mockPipeline} onInviteAdmin={vi.fn()} />
        );

        // Column Titles
        expect(screen.getByText('Setup & Configuration')).toBeInTheDocument();
        expect(screen.getByText('Admin Activation')).toBeInTheDocument();
        expect(screen.getByText('Operational & Live')).toBeInTheDocument();

        // School Names rendered in columns
        expect(screen.getByText('Greenfield Public School')).toBeInTheDocument();
        expect(screen.getByText('Oakridge International School')).toBeInTheDocument();
        expect(screen.getByText('Delhi World School')).toBeInTheDocument();
    });

    it('should render empty state message when a column has no schools', () => {
        const emptyPipeline = {
            pendingSetup: [],
            awaitingInvite: [],
            completed: [],
            total: 0,
        };

        renderWithProviders(
            <OnboardingKanbanBoard pipeline={emptyPipeline} onInviteAdmin={vi.fn()} />
        );

        const emptyNotices = screen.getAllByText('No schools in this stage');
        expect(emptyNotices).toHaveLength(3);
    });

    it('should trigger onInviteAdmin callback when Invite Admin / Send Invite button is clicked on an eligible card', () => {
        const handleInvite = vi.fn();
        const schoolToInvite = mockPipeline.awaitingInvite[0];

        renderWithProviders(
            <OnboardingSchoolCard
                school={schoolToInvite}
                stageKey="awaitingInvite"
                onInviteAdmin={handleInvite}
            />
        );

        expect(screen.getByText('Oakridge International School')).toBeInTheDocument();
        const inviteBtn = screen.getByRole('button', { name: /Send Invite/i });
        expect(inviteBtn).toBeInTheDocument();

        fireEvent.click(inviteBtn);
        expect(handleInvite).toHaveBeenCalledTimes(1);
        expect(handleInvite).toHaveBeenCalledWith(schoolToInvite);
    });

    it('should render school badges, codes, and location correctly in card view', () => {
        const school = mockPipeline.pendingSetup[0];

        renderWithProviders(
            <OnboardingSchoolCard
                school={school}
                stageKey="pendingSetup"
                onInviteAdmin={vi.fn()}
            />
        );

        expect(screen.getByText(/GPS001/)).toBeInTheDocument();
        expect(screen.getByText('STANDARD')).toBeInTheDocument();
        expect(screen.getByText(/Bengaluru/)).toBeInTheDocument();
    });
});
