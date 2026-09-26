import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../testUtils';
import HeroBanner from '../../portals/super-admin/pages/dashboard/components/HeroBanner';
import StatsSummary from '../../portals/super-admin/pages/dashboard/components/StatsSummary';
import { ROLES } from '../../store/slices/authSlice';

describe('Super Admin Dashboard Component Tests', () => {
    it('HeroBanner renders admin greeting and motivational message', () => {
        renderWithProviders(<HeroBanner />, {
            preloadedState: {
                auth: {
                    isAuthenticated: true,
                    user: { firstName: 'Aditya', role: ROLES.SUPER_ADMIN },
                },
            },
        });

        // Greets admin by name
        expect(screen.getByText(/Welcome back, Aditya! 👋/i)).toBeInTheDocument();
        expect(screen.getByText(/building a better future for thousands of students/i)).toBeInTheDocument();
    });

    it('StatsSummary renders the core platform metrics cards', () => {
        renderWithProviders(<StatsSummary />);

        // Metric Card Labels
        expect(screen.getByText('Total Schools')).toBeInTheDocument();
        expect(screen.getByText('Total Students')).toBeInTheDocument();
        expect(screen.getByText('Total Staff')).toBeInTheDocument();
        expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    });
});
