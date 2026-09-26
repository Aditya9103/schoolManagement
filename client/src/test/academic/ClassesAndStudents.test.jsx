import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../testUtils';
import StudentIdCardModal from '../../portals/school-erp/pages/students/components/StudentIdCardModal';
import StudentsListPage from '../../portals/school-erp/pages/students/StudentsListPage';
import ClassesPage from '../../portals/school-erp/pages/classes/ClassesPage';
import { ROLES } from '../../store/slices/authSlice';

describe('Academic & Student Portal Component Tests', () => {
    describe('StudentIdCardModal', () => {
        it('renders student identity card modal with QR code and student info', () => {
            const mockStudent = {
                _id: 'stu123',
                firstName: 'Aarav',
                lastName: 'Patel',
                admissionNo: 'ADM-2025-0042',
                rollNo: 15,
                bloodGroup: 'B+',
                classId: { name: 'Class 10' },
                sectionId: { name: 'A' },
                schoolId: {
                    name: 'Delhi Public Academy',
                    address: { city: 'Noida, Uttar Pradesh' },
                },
                parentPhone: '+919876543210',
            };

            renderWithProviders(
                <StudentIdCardModal student={mockStudent} onClose={() => {}} />
            );

            expect(screen.getByText('Student Identity Card')).toBeInTheDocument();
            expect(screen.getByText('Aarav Patel')).toBeInTheDocument();
            expect(screen.getByText(/ADM-2025-0042/i)).toBeInTheDocument();
            expect(screen.getByText('Delhi Public Academy')).toBeInTheDocument();
            expect(screen.getByText(/Roll #15/i)).toBeInTheDocument();
        });

        it('triggers onClose when close icon button is clicked', () => {
            const onCloseMock = vi.fn();
            const mockStudent = {
                _id: 'stu123',
                firstName: 'Aarav',
                lastName: 'Patel',
                admissionNo: 'ADM-2025-0042',
            };

            renderWithProviders(
                <StudentIdCardModal student={mockStudent} onClose={onCloseMock} />
            );

            const closeButtons = screen.getAllByRole('button');
            fireEvent.click(closeButtons[0]);

            expect(onCloseMock).toHaveBeenCalled();
        });
    });

    describe('StudentsListPage', () => {
        it('renders page header, search input, and add student action button', () => {
            renderWithProviders(<StudentsListPage />, {
                preloadedState: {
                    auth: {
                        isAuthenticated: true,
                        user: { role: ROLES.SCHOOL_ADMIN, schoolId: 'sch_1' },
                    },
                },
            });

            expect(screen.getByRole('heading', { name: 'Students' })).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Search by name/i)).toBeInTheDocument();
            expect(screen.getByLabelText('Add Student')).toBeInTheDocument();
        });
    });

    describe('ClassesPage', () => {
        it('renders Classes and Sections overview heading and Add Class trigger', () => {
            renderWithProviders(<ClassesPage />, {
                preloadedState: {
                    auth: {
                        isAuthenticated: true,
                        user: { role: ROLES.SCHOOL_ADMIN, schoolId: 'sch_1' },
                    },
                },
            });

            expect(screen.getByRole('heading', { name: /Classes & Sections/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Add Class/i })).toBeInTheDocument();
        });
    });
});
