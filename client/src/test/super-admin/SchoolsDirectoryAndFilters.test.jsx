import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../testUtils';
import SchoolsDataTable from '../../portals/super-admin/pages/schools/components/SchoolsDataTable';
import SchoolsFilterBar from '../../portals/super-admin/pages/schools/components/SchoolsFilterBar';

describe('Schools Directory & Filter Component Tests', () => {
    describe('SchoolsFilterBar', () => {
        it('renders search input and triggers onSearch callback on change', () => {
            const onSearchMock = vi.fn();
            renderWithProviders(
                <SchoolsFilterBar
                    search=""
                    onSearchChange={onSearchMock}
                    boardFilter="ALL"
                    onBoardChange={() => {}}
                    planFilter="ALL"
                    onPlanChange={() => {}}
                    statusFilter="ALL"
                    onStatusChange={() => {}}
                />
            );

            const searchInput = screen.getByPlaceholderText(/Search by school name/i);
            expect(searchInput).toBeInTheDocument();

            fireEvent.change(searchInput, { target: { value: 'Delhi Public' } });
            expect(onSearchMock).toHaveBeenCalledWith('Delhi Public');
        });

        it('triggers filter changes when dropdown values are selected', () => {
            const onBoardChangeMock = vi.fn();
            renderWithProviders(
                <SchoolsFilterBar
                    search=""
                    onSearchChange={() => {}}
                    boardFilter="ALL"
                    onBoardChange={onBoardChangeMock}
                    planFilter="ALL"
                    onPlanChange={() => {}}
                    statusFilter="ALL"
                    onStatusChange={() => {}}
                />
            );

            const selects = screen.getAllByRole('combobox');
            expect(selects.length).toBeGreaterThan(0);

            // Select Board dropdown
            fireEvent.change(selects[0], { target: { value: 'CBSE' } });
            expect(onBoardChangeMock).toHaveBeenCalledWith('CBSE');
        });
    });

    describe('SchoolsDataTable', () => {
        it('renders empty state when schools list is empty', () => {
            renderWithProviders(<SchoolsDataTable schools={[]} isLoading={false} />);

            expect(screen.getByText('No Schools Found')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /\+ Provision New School/i })).toBeInTheDocument();
        });

        it('renders school rows with name, code, board, and plan badges', () => {
            const mockSchools = [
                {
                    _id: 'sch1',
                    name: 'Delhi Public Academy',
                    code: 'DPA101',
                    contactEmail: 'contact@dpa.edu',
                    board: 'CBSE',
                    plan: 'STANDARD',
                    subscriptionStatus: 'ACTIVE',
                    studentCount: 1250,
                    staffCount: 85,
                    address: { city: 'New Delhi', state: 'Delhi' },
                },
                {
                    _id: 'sch2',
                    name: 'St. Xavier High School',
                    code: 'SXH202',
                    contactEmail: 'info@stxavier.edu',
                    board: 'ICSE',
                    plan: 'PRO',
                    subscriptionStatus: 'TRIAL',
                    studentCount: 820,
                    staffCount: 52,
                    address: { city: 'Mumbai', state: 'Maharashtra' },
                },
            ];

            renderWithProviders(<SchoolsDataTable schools={mockSchools} isLoading={false} />);

            // Both schools are present in the table
            expect(screen.getByText('Delhi Public Academy')).toBeInTheDocument();
            expect(screen.getByText(/DPA101/i)).toBeInTheDocument();
            expect(screen.getByText('St. Xavier High School')).toBeInTheDocument();
            expect(screen.getByText(/SXH202/i)).toBeInTheDocument();

            // Badges
            expect(screen.getByText('CBSE')).toBeInTheDocument();
            expect(screen.getByText('ICSE')).toBeInTheDocument();
            expect(screen.getByText('STANDARD')).toBeInTheDocument();
            expect(screen.getByText('PRO')).toBeInTheDocument();
        });
    });
});
