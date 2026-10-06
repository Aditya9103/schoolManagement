/**
 * eventBus.js — PrimeSchoolOS Central Domain Event Bus.
 * Pure native Node.js EventEmitter (Zero Redis / external broker dependency in v1).
 */

import { EventEmitter } from 'events';

class DomainEventBus extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(100);
    }

    /**
     * Publish a typed domain event across the system.
     * @param {string} type - Event identifier from DOMAIN_EVENTS
     * @param {object} payload - Event data payload
     */
    publish(type, payload = {}) {
        const eventEnvelope = {
            eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            schoolId: payload.schoolId || null,
            actorId: payload.actorId || null,
            timestamp: new Date().toISOString(),
            data: payload,
        };

        // Emit locally for in-process listeners (Socket.IO, Audit, Notification workers)
        this.emit(type, eventEnvelope);
        this.emit('*', eventEnvelope);

        return eventEnvelope;
    }
}

export const eventBus = new DomainEventBus();

export const DOMAIN_EVENTS = {
    // Academic & Structure
    ACADEMIC_YEAR_ACTIVATED: 'academic_year:activated',
    TEACHING_ASSIGNMENT_CREATED: 'teaching_assignment:created',
    TEACHING_ASSIGNMENT_DELETED: 'teaching_assignment:deleted',
    TIMETABLE_UPDATED: 'timetable:updated',

    // Students & Placement
    STUDENT_ENROLLED: 'student:enrolled',
    STUDENT_PROMOTED: 'student:promoted',
    STUDENT_TRANSFERRED: 'student:transferred',

    // Attendance Lifecycle
    ATTENDANCE_MARKED: 'attendance:marked',
    ATTENDANCE_CORRECTION_REQUESTED: 'attendance:correction_requested',
    ATTENDANCE_CORRECTION_RESOLVED: 'attendance:correction_resolved',

    // Homework Lifecycle
    HOMEWORK_PUBLISHED: 'homework:published',
    HOMEWORK_SUBMITTED: 'homework:submitted',
    HOMEWORK_EVALUATED: 'homework:evaluated',

    // Examination & Grading
    EXAM_SCHEDULED: 'exam:scheduled',
    MARKS_ENTERED: 'marks:entered',
    MARKS_SUBMITTED: 'marks:submitted',
    MARKS_VERIFIED: 'marks:verified',
    MARKS_PUBLISHED: 'marks:published',
    MARKS_LOCKED: 'marks:locked',
    MARKS_CORRECTION_REQUESTED: 'marks:correction_requested',

    // Finance & Fees
    FEE_ASSIGNED: 'fee:assigned',
    PAYMENT_INITIATED: 'payment:initiated',
    PAYMENT_CAPTURED: 'payment:captured',
    PAYMENT_FAILED: 'payment:failed',

    // Communication & People
    NOTICE_PUBLISHED: 'notice:published',
    NOTICE_UPDATED: 'notice:updated',
    MESSAGE_DISPATCHED: 'message:dispatched',
    ANNOUNCEMENT_BROADCAST: 'announcement:broadcast',
    LEAVE_APPLIED: 'leave:applied',
    LEAVE_APPROVED: 'leave:approved',
    STAFF_UPDATED: 'staff:updated',
    TEACHER_UPDATED: 'teacher:updated',

    // Transport Operations
    TRIP_STARTED: 'trip:started',
    STUDENT_BOARDED: 'student:boarded',
    STUDENT_DEBOARDED: 'student:deboarded',
    TRIP_COMPLETED: 'trip:completed',
};

export default eventBus;
