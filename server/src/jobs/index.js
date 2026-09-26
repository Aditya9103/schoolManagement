/**
 * jobs/index.js — PrimeSchoolOs Background Jobs Registry.
 * Phase 1: Stubs registered here. Phase 4+ will wire node-cron jobs.
 * E.g. subscription expiry checker, attendance reminder, fee reminder.
 */
import logger from '../utils/logger.js';

/**
 * initializeJobs — Called once on server startup after DB connection.
 */
export const initializeJobs = () => {
    logger.info('[Jobs] Background job registry initialized (Phase 1 — no active jobs)');

    // Phase 4+: Uncomment and implement:
    // scheduleSubscriptionExpiryChecker();   // daily at midnight
    // scheduleAttendanceReminder();          // daily at 7:30 AM
    // scheduleFeeReminderJob();              // weekly
};
