/**
 * constants.js — Application-wide constants for PrimeSchoolOs.
 *
 * Single source of truth for enums, config values, and permission strings.
 */

// User Roles
export const ROLES = Object.freeze({
    SUPER_ADMIN: 'SUPER_ADMIN',
    SCHOOL_ADMIN: 'SCHOOL_ADMIN',
    TEACHER: 'TEACHER',
    ACCOUNTANT: 'ACCOUNTANT',
    LIBRARIAN: 'LIBRARIAN',
    FRONT_OFFICE: 'FRONT_OFFICE',
    DRIVER: 'DRIVER',
    PARENT: 'PARENT',
    STUDENT: 'STUDENT',
});

export const ALL_ROLES = [
    'SUPER_ADMIN','SCHOOL_ADMIN','TEACHER','ACCOUNTANT',
    'LIBRARIAN','FRONT_OFFICE','DRIVER','PARENT','STUDENT',
];

export const SCHOOL_STAFF_ROLES = [
    'SCHOOL_ADMIN','TEACHER','ACCOUNTANT','LIBRARIAN','FRONT_OFFICE',
];

export const PERMISSIONS = Object.freeze({
    SCHOOL_CREATE: 'school:create',
    SCHOOL_READ: 'school:read',
    SCHOOL_UPDATE: 'school:update',
    SCHOOL_DELETE: 'school:delete',
    SCHOOL_MANAGE_SUBSCRIPTION: 'school:manage_subscription',
    STUDENT_CREATE: 'student:create',
    STUDENT_READ: 'student:read',
    STUDENT_UPDATE: 'student:update',
    STUDENT_READ_OWN: 'student:read:own',
    ATTENDANCE_MARK: 'attendance:mark',
    ATTENDANCE_READ: 'attendance:read',
    ATTENDANCE_READ_OWN: 'attendance:read:own',
    FEE_MANAGE: 'fee:manage',
    FEE_COLLECT: 'fee:collect',
    FEE_READ_OWN: 'fee:read:own',
    FEE_READ_ALL: 'fee:read:all',
    HOMEWORK_CREATE: 'homework:create',
    HOMEWORK_READ: 'homework:read',
    HOMEWORK_SUBMIT: 'homework:submit',
    HOMEWORK_GRADE: 'homework:grade',
    EXAM_CREATE: 'exam:create',
    EXAM_READ: 'exam:read',
    EXAM_MARK_ENTRY: 'exam:mark_entry',
    EXAM_PUBLISH: 'exam:publish',
    TRANSPORT_MANAGE: 'transport:manage',
    TRANSPORT_TRACK: 'transport:track',
    TRANSPORT_DRIVE: 'transport:drive',
    NOTICE_PUBLISH: 'notice:publish',
    NOTICE_READ: 'notice:read',
    TIMETABLE_MANAGE: 'timetable:manage',
    TIMETABLE_READ: 'timetable:read',
    LEAVE_APPLY: 'leave:apply',
    LEAVE_APPROVE: 'leave:approve',
    LEAVE_READ: 'leave:read',
    LIBRARY_MANAGE: 'library:manage',
    LIBRARY_BORROW: 'library:borrow',
    PAYROLL_MANAGE: 'payroll:manage',
    PAYROLL_READ_OWN: 'payroll:read:own',
    ANALYTICS_VIEW: 'analytics:view',
    SETTINGS_MANAGE: 'settings:manage',
});

export const ROLE_PERMISSIONS = Object.freeze({
    SUPER_ADMIN: Object.values({
        SCHOOL_CREATE: 'school:create', SCHOOL_READ: 'school:read',
        SCHOOL_UPDATE: 'school:update', SCHOOL_DELETE: 'school:delete',
        SCHOOL_MANAGE_SUBSCRIPTION: 'school:manage_subscription',
        STUDENT_CREATE: 'student:create', STUDENT_READ: 'student:read',
        STUDENT_UPDATE: 'student:update', STUDENT_READ_OWN: 'student:read:own',
        ATTENDANCE_MARK: 'attendance:mark', ATTENDANCE_READ: 'attendance:read',
        ANALYTICS_VIEW: 'analytics:view', SETTINGS_MANAGE: 'settings:manage',
    }),
    SCHOOL_ADMIN: ['student:create','student:read','student:update','attendance:mark',
        'attendance:read','fee:manage','fee:collect','fee:read:all','homework:create',
        'homework:read','homework:grade','exam:create','exam:read','exam:mark_entry',
        'exam:publish','transport:manage','transport:track','notice:publish','notice:read',
        'timetable:manage','timetable:read','leave:approve','leave:read','library:manage',
        'library:borrow','payroll:manage','analytics:view','settings:manage'],
    TEACHER: ['student:read','attendance:mark','attendance:read','homework:create',
        'homework:read','homework:grade','exam:read','exam:mark_entry','notice:read',
        'timetable:read','leave:apply','leave:read','library:borrow','payroll:read:own'],
    ACCOUNTANT: ['fee:manage','fee:collect','fee:read:all','student:read','analytics:view',
        'payroll:manage','payroll:read:own','notice:read','leave:apply'],
    LIBRARIAN: ['library:manage','library:borrow','student:read','notice:read',
        'leave:apply','payroll:read:own'],
    FRONT_OFFICE: ['student:create','student:read','fee:collect','fee:read:all',
        'notice:read','leave:apply','payroll:read:own'],
    DRIVER: ['transport:drive','transport:track','student:read','attendance:mark','notice:read'],
    PARENT: ['student:read:own','attendance:read:own','fee:read:own','homework:read',
        'homework:submit','exam:read','transport:track','notice:read','timetable:read','leave:apply'],
    STUDENT: ['student:read:own','attendance:read:own','fee:read:own','homework:read',
        'homework:submit','exam:read','notice:read','timetable:read','library:borrow'],
});

export const OTP_CONFIG = Object.freeze({
    LENGTH: 6,
    EXPIRES_IN_MINUTES: 10,
    MAX_ATTEMPTS: 10,
    MAX_RESENDS: 10,
    CHANNELS: Object.freeze({ EMAIL: 'EMAIL', WHATSAPP: 'WHATSAPP' }),
    PURPOSES: Object.freeze({
        LOGIN: 'LOGIN',
        REGISTER: 'REGISTER',
        FORGOT_PASSWORD: 'FORGOT_PASSWORD',
        CHANGE_EMAIL: 'CHANGE_EMAIL',
    }),
});

export const JWT_CONFIG = Object.freeze({
    ACCESS_EXPIRES: '15m',
    REFRESH_EXPIRES: '7d',
    REFRESH_EXPIRES_MS: 7 * 24 * 60 * 60 * 1000,
    ISSUER: 'primeschoolos-api',
    AUDIENCE: 'primeschoolos-client',
});

export const ACCOUNT_SECURITY = Object.freeze({
    MAX_FAILED_LOGINS: 10,
    LOCK_DURATION_MINUTES: 15,
    PASSWORD_HISTORY_COUNT: 5,
    BCRYPT_SALT_ROUNDS: 2,
});

export const PAGINATION = Object.freeze({
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
});

export const SUBSCRIPTION_PLANS = Object.freeze({
    BASIC: 'BASIC',
    PRO: 'PRO',
    ENTERPRISE: 'ENTERPRISE',
});

export const SCHOOL_BOARDS = Object.freeze({
    CBSE: 'CBSE',
    ICSE: 'ICSE',
    STATE: 'STATE',
    IB: 'IB',
    CAMBRIDGE: 'CAMBRIDGE',
    OTHER: 'OTHER',
});
