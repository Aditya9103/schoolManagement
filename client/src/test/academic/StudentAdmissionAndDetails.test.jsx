import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../testUtils';
import AddStudentPage from '../../portals/school-erp/pages/students/AddStudentPage';
import StudentDetailPage from '../../portals/school-erp/pages/students/StudentDetailPage';

// Mock RTK Query hooks for Student & Class API
vi.mock('../../store/api/classApi', () => ({
    classApi: {
        reducerPath: 'classApi',
        reducer: (state = {}) => state,
        middleware: () => (next) => (action) => next(action),
    },
    useGetClassesQuery: () => ({
        data: {
            data: [
                {
                    _id: 'class-1',
                    name: 'Class 10',
                    sections: [
                        { _id: 'sec-a', name: 'A' },
                        { _id: 'sec-b', name: 'B' },
                    ],
                },
            ],
        },
        isLoading: false,
    }),
}));

const mockStudent = {
    _id: 'student-123',
    firstName: 'Aarav',
    lastName: 'Sharma',
    admissionNo: 'ADM2026-0042',
    rollNo: 14,
    status: 'ACTIVE',
    dateOfBirth: '2010-05-15T00:00:00.000Z',
    bloodGroup: 'B+',
    fatherName: 'Rajesh Sharma',
    motherName: 'Sunita Sharma',
    address: '42 MG Road, Indiranagar',
    emergencyContact: '+919876543210',
    classId: { name: 'Class 10' },
    sectionId: { name: 'A' },
    documents: [],
};

let currentStudentMock = mockStudent;
let isStudentLoading = false;

vi.mock('../../store/api/studentApi', () => ({
    studentApi: {
        reducerPath: 'studentApi',
        reducer: (state = {}) => state,
        middleware: () => (next) => (action) => next(action),
    },
    useGetStudentsQuery: () => ({
        data: { data: [mockStudent], pagination: { total: 1 } },
        isLoading: false,
    }),
    useGetStudentByIdQuery: () => ({
        data: { data: currentStudentMock },
        isLoading: isStudentLoading,
    }),
    useCreateStudentMutation: () => [
        vi.fn().mockReturnValue({ unwrap: () => Promise.resolve({ data: { _id: 'new-std-1' } }) }),
        { isLoading: false },
    ],
    useAddStudentDocumentMutation: () => [vi.fn(), { isLoading: false }],
    useRemoveStudentDocumentMutation: () => [vi.fn(), { isLoading: false }],
}));

describe('School ERP Student Admission and Details Suite', () => {
    it('should render AddStudentPage multi-step wizard and advance between steps', async () => {
        const { container } = renderWithProviders(<AddStudentPage />);

        // Header and Step 1: Personal Details
        expect(screen.getByText('New Admission')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g. Aarav')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g. Sharma')).toBeInTheDocument();

        // Fill Step 1 required fields
        fireEvent.change(screen.getByPlaceholderText('e.g. Aarav'), {
            target: { value: 'Rohan' },
        });
        fireEvent.change(screen.getByPlaceholderText('e.g. Sharma'), {
            target: { value: 'Verma' },
        });
        const dobInput = container.querySelector('input[type="date"]');
        fireEvent.change(dobInput, {
            target: { value: '2012-04-10' },
        });

        // Click "Next Step →" to go to Step 2
        const nextBtn = screen.getByRole('button', { name: /Next Step →/i });
        fireEvent.click(nextBtn);

        // Step 2 should now be visible
        expect(screen.getByText('Class & Academic Assignment')).toBeInTheDocument();

        // Select Class and Section in Step 2
        const selects = document.querySelectorAll('select');
        // Class select is the first select on step 2
        fireEvent.change(selects[0], { target: { value: 'class-1' } });
        // After class is selected, section select is populated
        const updatedSelects = document.querySelectorAll('select');
        fireEvent.change(updatedSelects[1], { target: { value: 'sec-a' } });

        // Advance to Step 3: Parent & Contact
        fireEvent.click(screen.getByRole('button', { name: /Next Step →/i }));

        expect(screen.getByText('Parent & Emergency Contact')).toBeInTheDocument();
    });

    it('should render StudentDetailPage with student header, status, and personal details tab', () => {
        currentStudentMock = mockStudent;
        isStudentLoading = false;

        renderWithProviders(<StudentDetailPage />);

        expect(screen.getByText('Student Profile')).toBeInTheDocument();
        expect(screen.getByText('Aarav Sharma')).toBeInTheDocument();
        expect(screen.getByText(/Roll No\.\s*14/i)).toBeInTheDocument();
        expect(screen.getByText('ACTIVE')).toBeInTheDocument();

        // Check Personal tab fields
        expect(screen.getByText('Rajesh Sharma')).toBeInTheDocument();
        expect(screen.getByText('Sunita Sharma')).toBeInTheDocument();
        expect(screen.getByText('B+')).toBeInTheDocument();
    });

    it('should switch between Personal, Academic, and Documents tabs on StudentDetailPage', async () => {
        currentStudentMock = mockStudent;
        isStudentLoading = false;

        renderWithProviders(<StudentDetailPage />);

        // Switch to Academic Tab
        const academicTab = screen.getByRole('button', { name: 'Academic' });
        fireEvent.click(academicTab);

        expect(screen.getByText('Academic Year')).toBeInTheDocument();
        expect(screen.getByText('Class & Section')).toBeInTheDocument();
        expect(screen.getByText('Class 10 - A')).toBeInTheDocument();

        // Switch to Documents Tab
        const documentsTab = screen.getByRole('button', { name: 'Documents' });
        fireEvent.click(documentsTab);

        expect(screen.getByText('Uploaded Documents')).toBeInTheDocument();
        expect(screen.getByText('No documents uploaded yet')).toBeInTheDocument();
    });

    it('should render Student not found when student does not exist', () => {
        currentStudentMock = null;
        isStudentLoading = false;

        renderWithProviders(<StudentDetailPage />);

        expect(screen.getByText('Student not found')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Back to Students' })).toBeInTheDocument();
    });
});
