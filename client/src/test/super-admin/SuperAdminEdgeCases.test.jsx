import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../testUtils';
import SchoolsDataTable from '../../portals/super-admin/pages/schools/components/SchoolsDataTable';
import SchoolsFilterBar from '../../portals/super-admin/pages/schools/components/SchoolsFilterBar';

describe('Super Admin Schools Edge Cases Suite', () => {
    const mockSchools = [
        {
            _id: 'school-edge-1',
            name: 'Apex Academy with Missing Address',
            code: 'APX999',
            board: 'UNKNOWN_BOARD',
            plan: 'CUSTOM',
            email: 'admin@apex.edu',
            phone: '+919876543210',
            address: null, // Null address edge case
            isActive: true,
            createdAt: '2026-01-01T00:00:00.000Z',
        },
        {
            _id: 'school-edge-2',
            name: 'Minimal Info High School',
            code: 'MIH002',
            board: 'CBSE',
            plan: 'PRO',
            email: 'info@minimal.edu',
            phone: '',
            address: { city: 'Pune', state: 'Maharashtra' },
            isActive: false,
            createdAt: '2026-02-15T00:00:00.000Z',
        },
    ];

    it('should handle school records with null address and unknown boards gracefully without crashing', () => {
        renderWithProviders(
            <SchoolsDataTable
                schools={mockSchools}
                isLoading={false}
                total={2}
                page={1}
                limit={10}
                onPageChange={vi.fn()}
            />
        );

        expect(screen.getByText('Apex Academy with Missing Address')).toBeInTheDocument();
        expect(screen.getByText(/APX999/)).toBeInTheDocument();
        expect(screen.getByText('UNKNOWN_BOARD')).toBeInTheDocument();
        // Location renders N/A, N/A when address is null
        expect(screen.getByText(/N\/A,\s*N\/A/)).toBeInTheDocument();
    });

    it('should render empty state message when schools array is empty', () => {
        renderWithProviders(
            <SchoolsDataTable
                schools={[]}
                isLoading={false}
                total={0}
                page={1}
                limit={10}
                onPageChange={vi.fn()}
            />
        );

        expect(screen.getByText('No Schools Found')).toBeInTheDocument();
        expect(screen.getByText(/No schools match your search or filter criteria/i)).toBeInTheDocument();
    });

    it('should toggle action menu dropdown and allow clicking Invite Admin', async () => {
        const handleInvite = vi.fn();

        renderWithProviders(
            <SchoolsDataTable
                schools={mockSchools}
                isLoading={false}
                total={2}
                page={1}
                limit={10}
                onPageChange={vi.fn()}
                onInviteAdmin={handleInvite}
            />
        );

        // Click action menu button for the first row (the button inside the Actions td)
        const row = screen.getByText('Apex Academy with Missing Address').closest('tr');
        const buttons = row.querySelectorAll('button');
        const actionBtn = buttons[buttons.length - 1];

        fireEvent.click(actionBtn);

        // Check if menu items become visible
        const inviteBtn = await screen.findByText('Invite Admin');
        expect(inviteBtn).toBeInTheDocument();

        fireEvent.click(inviteBtn);
        expect(handleInvite).toHaveBeenCalledWith(mockSchools[0]);
    });

    it('should handle special characters in filter search without regex exceptions', () => {
        const handleSearch = vi.fn();

        renderWithProviders(
            <SchoolsFilterBar
                search=""
                onSearchChange={handleSearch}
                boardFilter="ALL"
                onBoardChange={vi.fn()}
                planFilter="ALL"
                onPlanChange={vi.fn()}
                statusFilter="ALL"
                onStatusChange={vi.fn()}
                onReset={vi.fn()}
            />
        );

        const searchInput = screen.getByPlaceholderText(/Search by school name, short code, city or state/i);
        fireEvent.change(searchInput, { target: { value: '[[**test??+$$' } });

        expect(handleSearch).toHaveBeenCalledWith('[[**test??+$$');
    });

    it('should trigger onReset when Clear button is clicked', () => {
        const handleReset = vi.fn();

        renderWithProviders(
            <SchoolsFilterBar
                search="Delhi"
                onSearchChange={vi.fn()}
                boardFilter="CBSE"
                onBoardChange={vi.fn()}
                planFilter="PRO"
                onPlanChange={vi.fn()}
                statusFilter="ACTIVE"
                onStatusChange={vi.fn()}
                onReset={handleReset}
            />
        );

        const clearBtn = screen.getByRole('button', { name: /Clear/i });
        fireEvent.click(clearBtn);

        expect(handleReset).toHaveBeenCalledTimes(1);
    });
});
