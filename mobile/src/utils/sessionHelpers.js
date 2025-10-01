/**
 * Helper functions for session calculations and state management
 */

/**
 * calculate session state based on remaining time
 * @param {number|null} remainingMinutes - mins remaining, null if unknown
 * @returns {string} session state: 'active', 'expiring', 'expired'
 */
export const calculateSessionState = (remainingMinutes) => {
    if (remainingMinutes === null || remainingMinutes === undefined) {
        return 'active';
    }

    if (remainingMinutes === 0) {
        return 'expired';
    }

    if (remainingMinutes <= 10) {
        return 'expiring';
    }

    return 'active';
};

/**
 * calculate progress percentage for session
 * @param {number} elapsed - elapsed minutes
 * @param {number} total - total duration in minutes
 * @returns {number} progress from 0 to 1
 */
export const calculateProgress = (elapsed, total) => {
    if (!total || total <= 0) return 0;
    if (!elapsed || elapsed < 0) return 0;

    const progress = elapsed / total;
    return Math.min(1, Math.max(0, progress));
};

/**
 * calculate cost for a given duration and rate
 * @param {number} minutes - duration in minutes
 * @param {number} hourlyRate - rate per hour
 * @returns {number} total cost
 */
export const calculateCost = (minutes, hourlyRate) => {
    if (!minutes || !hourlyRate) return 0;

    const hours = minutes / 60;
    return Number((hours * hourlyRate).toFixed(2));
};

/**
 * validate session data
 * @param {object} session - session object
 * @returns {boolean} session is valid or not
 */
export const isValidSession = (session) => {
    if (!session) return false;

    const required = [
        'id',
        'startedAt',
        'scheduledEnd',
        'vehiclePlate',
        'hourlyRate',
        'duration'
    ];

    return required.every(field => session[field] !== undefined);
};

/**
 * check if session needs attention (expiring soon)
 * @param {number} remainingMinutes - mins remaining
 * @returns {boolean} session needs attention or not
 */
export const needsAttention = (remainingMinutes) => {
    return remainingMinutes !== null && remainingMinutes <= 10 && remainingMinutes > 0;
};

/**
 * get recommended extension duration based on current state
 * @param {number} remainingMinutes - current remaining mins
 * @returns {number[]} array of recommended extension durations in minutes
 */
export const getRecommendedExtensions = (remainingMinutes) => {
    if (remainingMinutes <= 5) {
        // urgent: offer shorter extensions first
        return [15, 30, 60, 120];
    }

    if (remainingMinutes <= 15) {
        // getting low: balanced options
        return [30, 60, 120, 180];
    }

    // plenty of time: longer extensions
    return [60, 120, 180, 240];
};

/**
 * create session summary for notifications or history
 * @param {object} session - session object
 * @param {number} elapsedMinutes - elapsed time
 * @returns {object} summary object
 */
export const createSessionSummary = (session, elapsedMinutes) => {
    if (!session) return null;

    // return formatted summary
    return {
        location: `${session.spotId} - ${session.locationName}`,
        vehicle: session.vehiclePlate,
        duration: session.duration,
        elapsed: elapsedMinutes,
        cost: session.totalCost,
        startTime: new Date(session.startedAt),
        endTime: new Date(session.scheduledEnd),
    };
};