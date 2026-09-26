import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, render } from '@testing-library/react';
import EditRoleMatrixPanel from '../../portals/school-erp/pages/roles/components/EditRoleMatrixPanel';
import RolesListPanel from '../../portals/school-erp/pages/roles/components/RolesListPanel';
import RoleSummaryPanel from '../../portals/school-erp/pages/roles/components/RoleSummaryPanel';
import { renderWithProviders } from '../testUtils';

const mockModules = [
    {
        id: 'academic',
        name: 'Academic & Curriculum',
        description: 'Manage classes, sections, subjects, timetables and exams',
        icon: 'BookOpen',
        color: 'blue',
        features: [
            {
                id: 'classes_sections',
                label: 'Classes & Sections',
                desc: 'Manage classes, divisions and room assignments',
                otherLabel: 'Assign Class Teacher',
            },
            {
                id: 'academic_attendance',
                label: 'Attendance',
                desc: 'Mark and oversee student attendance registers',
                otherLabel: 'Bulk Mark',
            },
        ],
    },
    {
        id: 'finance',
        name: 'Finance & Accounts',
        description: 'Manage fee structures, collections, invoices and expenses',
        icon: 'Wallet',
        color: 'amber',
        features: [
            {
                id: 'fees_collection',
                label: 'Fees & Payments',
                desc: 'Collect fees and record receipts',
                otherLabel: 'Send Reminders',
            },
        ],
    },
];

const mockRole = {
    _id: 'role_teacher_1',
    name: 'Teacher',
    description: 'Faculty member managing classroom instruction',
    isSystemRole: true,
    userCount: 42,
    permissions: {
        classes_sections: {
            pageAccess: true,
            view: true,
            create: false,
            edit: false,
            delete: false,
            export: false,
            other: { 'Assign Class Teacher': false },
        },
        academic_attendance: {
            pageAccess: true,
            view: true,
            create: true,
            edit: true,
            delete: false,
            export: true,
            other: { 'Bulk Mark': true },
        },
        fees_collection: {
            pageAccess: false,
            view: false,
            create: false,
            edit: false,
            delete: false,
            export: false,
            other: {},
        },
    },
};

const mockRolesList = [
    {
        _id: 'role_admin_1',
        name: 'School Admin',
        description: 'Full administrative access',
        isSystemRole: true,
        userCount: 2,
        permissions: {},
    },
    {
        _id: 'role_teacher_1',
        name: 'Teacher',
        description: 'Faculty member managing classroom instruction',
        isSystemRole: true,
        userCount: 42,
        permissions: mockRole.permissions,
    },
    {
        _id: 'role_accountant_1',
        name: 'Accountant',
        description: 'Fee collection and financial books',
        isSystemRole: true,
        userCount: 3,
        permissions: {},
    },
];

describe('Roles & Permissions Suite', () => {
    it('should render EditRoleMatrixPanel with role details, modules, and permission table', () => {
        const handleSave = vi.fn();
        const handleCopy = vi.fn();

        render(
            <EditRoleMatrixPanel
                role={mockRole}
                moduleDefinitions={mockModules}
                onSaveChanges={handleSave}
                onCopyRole={handleCopy}
                isSaving={false}
            />
        );

        // Header info
        expect(screen.getByText('Edit Role')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Teacher')).toBeInTheDocument();
        expect(
            screen.getByDisplayValue('Faculty member managing classroom instruction')
        ).toBeInTheDocument();

        // Modules accordion headers
        expect(screen.getByText('Academic & Curriculum')).toBeInTheDocument();
        expect(screen.getByText('Finance & Accounts')).toBeInTheDocument();

        // Features rows
        expect(screen.getByText('Classes & Sections')).toBeInTheDocument();
        expect(screen.getByText('Attendance')).toBeInTheDocument();
        expect(screen.getByText('Fees & Payments')).toBeInTheDocument();
    });

    it('should toggle permission checkboxes and enable save changes button', () => {
        const handleSave = vi.fn();

        render(
            <EditRoleMatrixPanel
                role={mockRole}
                moduleDefinitions={mockModules}
                onSaveChanges={handleSave}
                onCopyRole={vi.fn()}
                isSaving={false}
            />
        );

        // Find checkbox buttons (which have role="checkbox")
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes.length).toBeGreaterThan(0);

        // Click the first checkbox to toggle permission
        fireEvent.click(checkboxes[0]);

        // Unsaved changes button should be active
        const saveBtn = screen.getByRole('button', { name: /save changes/i });
        expect(saveBtn).toBeInTheDocument();

        fireEvent.click(saveBtn);
        expect(handleSave).toHaveBeenCalled();
    });

    it('should render RolesListPanel and allow searching and filtering roles', () => {
        const handleSelect = vi.fn();
        const handleCreate = vi.fn();

        render(
            <RolesListPanel
                roles={mockRolesList}
                selectedRoleId="role_teacher_1"
                onSelectRole={handleSelect}
                onCreateRole={handleCreate}
                onCopyRole={vi.fn()}
                onDeleteRole={vi.fn()}
                onResetRole={vi.fn()}
            />
        );

        expect(
            screen.getByRole('heading', { name: /All Roles/i })
        ).toBeInTheDocument();
        expect(screen.getByText('School Admin')).toBeInTheDocument();
        expect(screen.getByText('Teacher')).toBeInTheDocument();
        expect(screen.getByText('Accountant')).toBeInTheDocument();

        // Filter via search
        const searchInput = screen.getByPlaceholderText('Search roles...');
        fireEvent.change(searchInput, { target: { value: 'Account' } });

        expect(screen.getByText('Accountant')).toBeInTheDocument();
        expect(screen.queryByText('School Admin')).not.toBeInTheDocument();
    });

    it('should render RoleSummaryPanel with metrics and quick actions', () => {
        const handleCopy = vi.fn();
        const handleReset = vi.fn();

        render(
            <RoleSummaryPanel
                role={{ ...mockRole, assignedUsersCount: 42 }}
                moduleDefinitions={mockModules}
                onCopyRole={handleCopy}
                onResetRole={handleReset}
            />
        );

        expect(screen.getByText(/Role Summary/i)).toBeInTheDocument();
        expect(screen.getByText('42')).toBeInTheDocument(); // Assigned Users
        expect(screen.getByText(/Quick Actions/i)).toBeInTheDocument();
        expect(screen.getByText(/Permission Tips/i)).toBeInTheDocument();
    });
});
