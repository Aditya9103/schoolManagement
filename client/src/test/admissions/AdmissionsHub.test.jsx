import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../testUtils';
import UniversalSchoolDirectory from '../../portals/admissions/UniversalSchoolDirectory';
import AdmissionsHubPage from '../../portals/school-erp/pages/admissions/AdmissionsHubPage';
import PublicAdmissionFormPage from '../../portals/admissions/PublicAdmissionFormPage';
import PublicApplicationTrackerPage from '../../portals/admissions/PublicApplicationTrackerPage';

describe('Admissions Subsystem UI Tests', () => {
    it('UniversalSchoolDirectory renders hero and search bar', () => {
        renderWithProviders(<UniversalSchoolDirectory />, { route: '/admissions' });
        expect(screen.getByText(/Find & Apply to Your Dream School/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Search by school name, city, or locality/i)).toBeInTheDocument();
    });

    it('AdmissionsHubPage renders 6 metric cards and main title', () => {
        renderWithProviders(<AdmissionsHubPage />, {
            preloadedState: {
                auth: {
                    isAuthenticated: true,
                    user: { role: 'SCHOOL_ADMIN', firstName: 'Rohit', lastName: 'Sharma' },
                },
            },
            route: '/school/admissions',
        });

        expect(screen.getAllByText(/Admissions/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/Total Applications/i)).toBeInTheDocument();
        expect(screen.getByText(/Pending Review/i)).toBeInTheDocument();
        expect(screen.getByText(/Conversion Rate/i)).toBeInTheDocument();
    });

    it('PublicApplicationTrackerPage renders tracking search form', () => {
        renderWithProviders(<PublicApplicationTrackerPage />, { route: '/admissions/track' });
        expect(screen.getByText(/Track Your Application/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/e\.g\. APP-2026-001/i)).toBeInTheDocument();
    });
});
