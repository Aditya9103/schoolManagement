/**
 * rooms.js — PrimeSchoolOs Socket.IO room name constants.
 * Naming convention: domain_entityId
 */
export const ROOMS = {
    // Platform-level room (Super Admin only)
    PLATFORM: 'platform',

    // School-scoped rooms (all users in a school)
    SCHOOL: (schoolId) => `school_${schoolId}`,
    SCHOOL_ADMIN: (schoolId) => `school_admin_${schoolId}`,
    TEACHER: (schoolId) => `school_teacher_${schoolId}`,
    PARENT: (schoolId) => `school_parent_${schoolId}`,
    DRIVER: (schoolId) => `school_driver_${schoolId}`,

    // User-specific room (for private notifications)
    USER: (userId) => `user_${userId}`,

    // Transport tracking
    BUS: (vehicleId) => `bus_${vehicleId}`,
};

export default ROOMS;
