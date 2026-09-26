import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../testUtils';
import StudentDetailPage from '../../portals/school-erp/pages/students/StudentDetailPage';
import StudentIdCardModal from '../../portals/school-erp/pages/students/components/StudentIdCardModal';
import AddStudentPage from '../../portals/school-erp/pages/students/AddStudentPage';

const edgeCaseStudent = {
    _id: 'student-edge-nulls',
    firstName: 'Priya',
    lastName: '',
    admissionNo: 'ADM-NULL-99',
    rollNo: null,
    status: null, // Unknown status fallback
    dateOfBirth: null, // Missing DOB
    bloodGroup: null, // Missing blood group
    fatherName: null,
    motherName: null,
    address: null,
    emergencyContact: null,
    classId: null,
    sectionId: null,
    schoolId: {
        _id: 'sch-1',
        name: 'Greenfield Public School',
        address: { city: 'Bengaluru' },
    },
    documents: [
        {
            _id: 'doc-1',
            title: 'Birth Certificate',
            type: 'PDF',
            url: 'https://s3.amazonaws.com/sms/doc1.pdf',
            createdAt: '2026-01-01',
        },
    ],
};

const mockRemoveDoc = vi.fn();

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
                    _id: 'class-9',
                    name: 'Grade 9',
                    sections: [
                        { _id: 'sec-9a', name: 'Section 9A' },
                        { _id: 'sec-9b', name: 'Section 9B' },
                    ],
                },
            ],
        },
        isLoading: false,
    }),
}));

vi.mock('../../store/api/studentApi', () => ({
    studentApi: {
        reducerPath: 'studentApi',
        reducer: (state = {}) => state,
        middleware: () => (next) => (action) => next(action),
    },
    useGetStudentByIdQuery: () => ({
        data: { data: edgeCaseStudent },
        isLoading: false,
    }),
    useCreateStudentMutation: () => [vi.fn(), { isLoading: false }],
    useAddStudentDocumentMutation: () => [vi.fn(), { isLoading: false }],
    useRemoveStudentDocumentMutation: () => [mockRemoveDoc, { isLoading: false }],
}));

describe('School ERP Academic & Student Edge Cases Suite', () => {
    it('should render StudentDetailPage safely when all optional fields and dates are null', () => {
        renderWithProviders(<StudentDetailPage />);

        expect(screen.getByText(/Priya/)).toBeInTheDocument();
        // Fallback for null DOB
        expect(screen.getByText('Not provided')).toBeInTheDocument();
        // Fallback for null blood group
        expect(screen.getByText('Not specified')).toBeInTheDocument();
    });

    it('should render StudentIdCardModal with student details and trigger window.print when clicked', () => {
        const handleClose = vi.fn();
        const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

        renderWithProviders(
            <StudentIdCardModal
                student={edgeCaseStudent}
                onClose={handleClose}
            />
        );

        // Verify ID Card elements
        expect(screen.getByText('Student Identity Card')).toBeInTheDocument();
        expect(screen.getByText(/Priya/)).toBeInTheDocument();
        expect(screen.getByText('ADM-NULL-99')).toBeInTheDocument();

        // Click Print ID Card button
        const printBtn = screen.getByRole('button', { name: /Print ID Card/i });
        fireEvent.click(printBtn);
        expect(printSpy).toHaveBeenCalled();

        printSpy.mockRestore();
    });

    it('should dynamically populate sections when a class is selected in AddStudentPage', () => {
        const { container } = renderWithProviders(<AddStudentPage />);

        // Fill Step 1 required fields
        fireEvent.change(screen.getByPlaceholderText('e.g. Aarav'), {
            target: { value: 'Priya' },
        });
        fireEvent.change(screen.getByPlaceholderText('e.g. Sharma'), {
            target: { value: 'Patel' },
        });
        const dobInput = container.querySelector('input[type="date"]');
        fireEvent.change(dobInput, {
            target: { value: '2011-09-20' },
        });

        // Advance to Step 2
        const nextBtn = screen.getByRole('button', { name: /Next Step →/i });
        fireEvent.click(nextBtn);

        // Class selection dropdown
        const classSelect = container.querySelectorAll('select')[0];
        fireEvent.change(classSelect, { target: { value: 'class-9' } });

        // Section dropdown should now contain Section 9A and Section 9B
        expect(screen.getByText(/Section 9A/i)).toBeInTheDocument();
        expect(screen.getByText(/Section 9B/i)).toBeInTheDocument();
    });
});
