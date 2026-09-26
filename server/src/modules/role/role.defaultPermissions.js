/**
 * role.defaultPermissions.js — Granular permission definitions and system role defaults
 * for PrimeSchoolOS.
 */

export const MODULE_DEFINITIONS = [
    {
        id: 'dashboard',
        name: 'Dashboard & Analytics',
        description: 'Access to dashboard, analytics and reports overview',
        icon: 'LayoutDashboard',
        color: 'rose',
        features: [
            { id: 'dashboard_main', label: 'Dashboard', desc: 'Main dashboard and overview', otherLabel: 'Manage Widgets' },
            { id: 'analytics_charts', label: 'Analytics', desc: 'Charts, statistics and insights', otherLabel: 'Export Charts' },
            { id: 'reports_overview', label: 'Reports', desc: 'School reports and data export', otherLabel: null },
            { id: 'notifications_system', label: 'Notifications', desc: 'View system notifications', otherLabel: null },
        ]
    },
    {
        id: 'students',
        name: 'Student Management',
        description: 'Manage student records, profiles and academic information',
        icon: 'Users',
        color: 'emerald',
        features: [
            { id: 'students_list', label: 'Students', desc: 'View and manage student records', otherLabel: null },
            { id: 'student_profile', label: 'Student Profile', desc: 'View detailed student information', otherLabel: 'Import' },
            { id: 'student_documents', label: 'Student Documents', desc: 'Manage student certificates and documents', otherLabel: 'Bulk Actions' },
            { id: 'student_promotion', label: 'Student Promotion', desc: 'Promote students to next class', otherLabel: null },
            { id: 'student_transfer', label: 'Student Transfer', desc: 'Manage student transfer and TC', otherLabel: null },
            { id: 'student_reports', label: 'Student Reports', desc: 'Generate student reports and export data', otherLabel: null },
        ]
    },
    {
        id: 'admissions',
        name: 'Admissions',
        description: 'Manage admissions, applications and approvals',
        icon: 'UserCheck',
        color: 'purple',
        features: [
            { id: 'admissions_apps', label: 'Applications', desc: 'View and manage admission applications', otherLabel: 'Approve / Reject' },
            { id: 'admissions_enquiry', label: 'Enquiry Management', desc: 'Manage enquiries and follow-ups', otherLabel: 'Send Email' },
            { id: 'admissions_onboarding', label: 'Student Onboarding', desc: 'New admissions registration and document verification', otherLabel: 'Verify Docs' },
        ]
    },
    {
        id: 'academic',
        name: 'Academic & Curriculum',
        description: 'Manage classes, sections, subjects, timetables and exams',
        icon: 'BookOpen',
        color: 'blue',
        features: [
            { id: 'classes_sections', label: 'Classes & Sections', desc: 'Manage classes, divisions and room assignments', otherLabel: 'Assign Class Teacher' },
            { id: 'subjects_curriculum', label: 'Subjects', desc: 'Manage curriculum, syllabi and subject allocations', otherLabel: null },
            { id: 'academic_timetable', label: 'Timetable', desc: 'Schedule and manage live class timetables', otherLabel: 'Auto-Generate' },
            { id: 'academic_attendance', label: 'Attendance', desc: 'Mark and oversee student attendance registers', otherLabel: 'Bulk Mark' },
            { id: 'exams_results', label: 'Exams & Results', desc: 'Conduct examinations, grades and report cards', otherLabel: 'Publish Results' },
            { id: 'homework_assignments', label: 'Homework & Assignments', desc: 'Assign and evaluate daily student homework', otherLabel: null },
        ]
    },
    {
        id: 'finance',
        name: 'Finance & Accounts',
        description: 'Manage fee structures, collections, invoices and expenses',
        icon: 'Wallet',
        color: 'amber',
        features: [
            { id: 'fees_collection', label: 'Fees & Payments', desc: 'Collect fees and record receipts', otherLabel: 'Send Reminders' },
            { id: 'invoices_billing', label: 'Invoices', desc: 'Generate and track student invoices', otherLabel: 'Print Invoices' },
            { id: 'scholarships_discounts', label: 'Scholarships', desc: 'Manage student scholarships and fee waivers', otherLabel: 'Approve Waivers' },
            { id: 'expenses_budget', label: 'Expenses', desc: 'Track school overheads and vendor payments', otherLabel: null },
            { id: 'financial_reports', label: 'Financial Reports', desc: 'Revenue, collection and cashflow audit reports', otherLabel: 'Auditor Export' },
        ]
    },
    {
        id: 'communication',
        name: 'Communication & Notices',
        description: 'School announcements, circulars and parent-teacher messaging',
        icon: 'Megaphone',
        color: 'sky',
        features: [
            { id: 'announcements_circulars', label: 'Announcements', desc: 'Publish school-wide circulars and alerts', otherLabel: 'SMS / WhatsApp' },
            { id: 'messages_chat', label: 'Messages', desc: 'Staff, parent and student messaging', otherLabel: null },
            { id: 'events_activities', label: 'Events & Activities', desc: 'Plan school calendar, functions and sports days', otherLabel: null },
            { id: 'parent_meetings', label: 'Parent Meetings', desc: 'Schedule PTM sessions and log feedback', otherLabel: null },
        ]
    },
    {
        id: 'operations',
        name: 'Operations & Facilities',
        description: 'Transport fleet, hostel, library and gate visitors',
        icon: 'Bus',
        color: 'orange',
        features: [
            { id: 'transport_fleet', label: 'Transport', desc: 'Manage buses, driver routes and stops', otherLabel: 'GPS Tracking' },
            { id: 'hostel_rooms', label: 'Hostel', desc: 'Manage dormitories, rooms and warden registers', otherLabel: null },
            { id: 'library_books', label: 'Library', desc: 'Book catalog, issues, returns and barcode scanner', otherLabel: 'Barcode Print' },
            { id: 'inventory_assets', label: 'Inventory', desc: 'Manage school equipment, stock and uniforms', otherLabel: null },
            { id: 'documents_repository', label: 'Documents', desc: 'Central digital document storage and archives', otherLabel: null },
            { id: 'gate_pass_visitors', label: 'Gate Pass & Visitors', desc: 'Visitor badges, check-in and student gate passes', otherLabel: 'Print Pass' },
        ]
    },
    {
        id: 'settings',
        name: 'Settings & Administration',
        description: 'School profile, staff roles, integrations and system configuration',
        icon: 'Settings',
        color: 'violet',
        features: [
            { id: 'school_profile', label: 'School Profile', desc: 'Update school details, logo and banner', otherLabel: null },
            { id: 'roles_permissions', label: 'Roles & Permissions', desc: 'Configure staff roles and permission matrix', otherLabel: 'Super Admin Override' },
            { id: 'integrations_api', label: 'Integrations', desc: 'Payment gateways, SMS providers and external APIs', otherLabel: 'Regenerate Keys' },
            { id: 'system_settings', label: 'System Settings', desc: 'Academic year, terms, working days and global rules', otherLabel: null },
        ]
    }
];

// Helper to build a permission object
const buildPerm = (pageAccess = false, view = false, create = false, edit = false, del = false, exp = false, other = {}) => ({
    pageAccess,
    view,
    create,
    edit,
    delete: del,
    export: exp,
    other: other || {}
});

// Full access map for School Admin
const fullPermissions = {};
MODULE_DEFINITIONS.forEach(mod => {
    mod.features.forEach(feat => {
        fullPermissions[feat.id] = buildPerm(true, true, true, true, true, true, feat.otherLabel ? { [feat.otherLabel]: true } : {});
    });
});

export const DEFAULT_SYSTEM_ROLES = [
    {
        name: 'School Admin',
        description: 'Full access to all modules and settings. Default system role with complete control.',
        badge: 'System',
        color: 'amber',
        icon: 'Crown',
        assignedUsersCount: 1,
        permissions: fullPermissions
    },
    {
        name: 'Principal',
        description: 'Overall school management, academic oversight, staff supervision and approvals.',
        badge: 'System',
        color: 'purple',
        icon: 'Award',
        assignedUsersCount: 1,
        permissions: (() => {
            const perms = {};
            MODULE_DEFINITIONS.forEach(mod => {
                mod.features.forEach(feat => {
                    const isSettings = mod.id === 'settings';
                    perms[feat.id] = buildPerm(true, true, !isSettings, !isSettings, false, true, feat.otherLabel ? { [feat.otherLabel]: true } : {});
                });
            });
            return perms;
        })()
    },
    {
        name: 'Vice Principal',
        description: 'Academic and administrative support, timetable, discipline and teacher coordination.',
        badge: 'System',
        color: 'blue',
        icon: 'Users',
        assignedUsersCount: 2,
        permissions: (() => {
            const perms = {};
            MODULE_DEFINITIONS.forEach(mod => {
                const allowed = ['dashboard', 'students', 'admissions', 'academic', 'communication'].includes(mod.id);
                mod.features.forEach(feat => {
                    perms[feat.id] = buildPerm(allowed, allowed, allowed, allowed, false, allowed, {});
                });
            });
            return perms;
        })()
    },
    {
        name: 'Teacher',
        description: 'Teaching staff with academic access: attendance, homework, exams and timetable.',
        badge: 'System',
        color: 'emerald',
        icon: 'BookOpen',
        assignedUsersCount: 86,
        permissions: (() => {
            const perms = {};
            MODULE_DEFINITIONS.forEach(mod => {
                mod.features.forEach(feat => {
                    if (['academic_attendance', 'homework_assignments'].includes(feat.id)) {
                        perms[feat.id] = buildPerm(true, true, true, true, false, false, {});
                    } else if (['students_list', 'student_profile', 'academic_timetable', 'exams_results', 'announcements_circulars'].includes(feat.id)) {
                        perms[feat.id] = buildPerm(true, true, false, false, false, false, {});
                    } else {
                        perms[feat.id] = buildPerm(false, false, false, false, false, false, {});
                    }
                });
            });
            return perms;
        })()
    },
    {
        name: 'Accountant',
        description: 'Finance, fees collection, invoice billing, expenses and cash flow management.',
        badge: 'System',
        color: 'cyan',
        icon: 'Wallet',
        assignedUsersCount: 8,
        permissions: (() => {
            const perms = {};
            MODULE_DEFINITIONS.forEach(mod => {
                mod.features.forEach(feat => {
                    if (mod.id === 'finance') {
                        perms[feat.id] = buildPerm(true, true, true, true, false, true, { 'Send Reminders': true, 'Print Invoices': true });
                    } else if (['dashboard_main', 'students_list', 'student_profile', 'announcements_circulars'].includes(feat.id)) {
                        perms[feat.id] = buildPerm(true, true, false, false, false, false, {});
                    } else {
                        perms[feat.id] = buildPerm(false, false, false, false, false, false, {});
                    }
                });
            });
            return perms;
        })()
    },
    {
        name: 'Receptionist',
        description: 'Front office operations, visitor check-in, admissions inquiries and phone logs.',
        badge: 'System',
        color: 'pink',
        icon: 'UserCheck',
        assignedUsersCount: 12,
        permissions: (() => {
            const perms = {};
            MODULE_DEFINITIONS.forEach(mod => {
                mod.features.forEach(feat => {
                    if (['admissions_apps', 'admissions_enquiry', 'gate_pass_visitors'].includes(feat.id)) {
                        perms[feat.id] = buildPerm(true, true, true, true, false, false, { 'Print Pass': true });
                    } else if (['students_list', 'announcements_circulars'].includes(feat.id)) {
                        perms[feat.id] = buildPerm(true, true, false, false, false, false, {});
                    } else {
                        perms[feat.id] = buildPerm(false, false, false, false, false, false, {});
                    }
                });
            });
            return perms;
        })()
    },
    {
        name: 'Librarian',
        description: 'Library book circulation, cataloging, barcode scanning and student reading history.',
        badge: 'System',
        color: 'amber',
        icon: 'BookMarked',
        assignedUsersCount: 3,
        permissions: (() => {
            const perms = {};
            MODULE_DEFINITIONS.forEach(mod => {
                mod.features.forEach(feat => {
                    if (feat.id === 'library_books') {
                        perms[feat.id] = buildPerm(true, true, true, true, true, true, { 'Barcode Print': true });
                    } else if (['students_list', 'student_profile', 'announcements_circulars'].includes(feat.id)) {
                        perms[feat.id] = buildPerm(true, true, false, false, false, false, {});
                    } else {
                        perms[feat.id] = buildPerm(false, false, false, false, false, false, {});
                    }
                });
            });
            return perms;
        })()
    },
    {
        name: 'Transport Manager',
        description: 'Transport fleet, routes, stops, bus allocation, driver logs and vehicle tracking.',
        badge: 'System',
        color: 'orange',
        icon: 'Bus',
        assignedUsersCount: 4,
        permissions: (() => {
            const perms = {};
            MODULE_DEFINITIONS.forEach(mod => {
                mod.features.forEach(feat => {
                    if (feat.id === 'transport_fleet') {
                        perms[feat.id] = buildPerm(true, true, true, true, false, true, { 'GPS Tracking': true });
                    } else if (['students_list', 'student_profile', 'announcements_circulars'].includes(feat.id)) {
                        perms[feat.id] = buildPerm(true, true, false, false, false, false, {});
                    } else {
                        perms[feat.id] = buildPerm(false, false, false, false, false, false, {});
                    }
                });
            });
            return perms;
        })()
    },
    {
        name: 'Hostel Warden',
        description: 'Hostel dormitories, room allocations, student attendance and resident health care.',
        badge: 'System',
        color: 'rose',
        icon: 'Building',
        assignedUsersCount: 3,
        permissions: (() => {
            const perms = {};
            MODULE_DEFINITIONS.forEach(mod => {
                mod.features.forEach(feat => {
                    if (feat.id === 'hostel_rooms') {
                        perms[feat.id] = buildPerm(true, true, true, true, false, false, {});
                    } else if (['students_list', 'student_profile', 'announcements_circulars'].includes(feat.id)) {
                        perms[feat.id] = buildPerm(true, true, false, false, false, false, {});
                    } else {
                        perms[feat.id] = buildPerm(false, false, false, false, false, false, {});
                    }
                });
            });
            return perms;
        })()
    },
    {
        name: 'HR Manager',
        description: 'Staff recruitment, employee documents, leaves, payroll and staff performance.',
        badge: 'System',
        color: 'violet',
        icon: 'Briefcase',
        assignedUsersCount: 2,
        permissions: (() => {
            const perms = {};
            MODULE_DEFINITIONS.forEach(mod => {
                mod.features.forEach(feat => {
                    if (['expenses_budget', 'announcements_circulars'].includes(feat.id)) {
                        perms[feat.id] = buildPerm(true, true, true, true, false, true, {});
                    } else if (['dashboard_main'].includes(feat.id)) {
                        perms[feat.id] = buildPerm(true, true, false, false, false, false, {});
                    } else {
                        perms[feat.id] = buildPerm(false, false, false, false, false, false, {});
                    }
                });
            });
            return perms;
        })()
    }
];
