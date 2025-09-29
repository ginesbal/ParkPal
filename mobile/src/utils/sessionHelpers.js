/**
 * Helper functions for session calculations and state management
 */

/**
 * Calculate session state based on remaining time
 * @param {number|null} remainingMinutes - Minutes remaining in session
 * @returns {string} Session state: 'active', 'expiring', or 'expired'
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
 * Calculate progress percentage for session
 * @param {number} elapsed - Elapsed minutes
 * @param {number} total - Total duration in minutes
 * @returns {number} Progress from 0 to 1
 */
export const calculateProgress = (elapsed, total) => {
    if (!total || total <= 0) return 0;
    if (!elapsed || elapsed < 0) return 0;

    const progress = elapsed / total;
    return Math.min(1, Math.max(0, progress));
};

/**
 * Calculate cost for a given duration and rate
 * @param {number} minutes - Duration in minutes
 * @param {number} hourlyRate - Rate per hour
 * @returns {number} Total cost
 */
export const calculateCost = (minutes, hourlyRate) => {
    if (!minutes || !hourlyRate) return 0;

    const hours = minutes / 60;
    return Number((hours * hourlyRate).toFixed(2));
};

/**
 * Validate session data
 * @param {object} session - Session object
 * @returns {boolean} Whether session is valid
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
 * Check if session needs attention (expiring soon)
 * @param {number} remainingMinutes - Minutes remaining
 * @returns {boolean} Whether user should be alerted
 */
export const needsAttention = (remainingMinutes) => {
    return remainingMinutes !== null && remainingMinutes <= 10 && remainingMinutes > 0;
};

/**
 * Get recommended extension duration based on current state
 * @param {number} remainingMinutes - Current remaining time
 * @returns {number[]} Array of recommended extension durations in minutes
 */
export const getRecommendedExtensions = (remainingMinutes) => {
    if (remainingMinutes <= 5) {
        // Urgent: offer shorter extensions first
        return [15, 30, 60, 120];
    }

    if (remainingMinutes <= 15) {
        // Getting low: balanced options
        return [30, 60, 120, 180];
    }

    // Plenty of time: longer extensions
    return [60, 120, 180, 240];
};

/**
 * Create session summary for notifications or history
 * @param {object} session - Session object
 * @param {number} elapsedMinutes - Elapsed time
 * @returns {object} Summary object
 */
export const createSessionSummary = (session, elapsedMinutes) => {
    if (!session) return null;

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