/**
 * Formatting utilities for consistent display across the app
 */

/**
 * Format minutes into human-readable duration
 * @param {number} mins - Duration in minutes
 * @returns {string} Formatted duration (e.g., "1h 30min", "45min")
 */
export const formatTime = (mins) => {
    if (!mins && mins !== 0) return '--:--';

    if (mins < 60) {
        return `${mins} MIN`;
    }

    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;

    if (minutes === 0) {
        return `${hours} HR`;
    }

    return `${hours} HR ${minutes} MIN`;
};

/**
 * Format currency amount
 * @param {number} amount - Amount in dollars
 * @returns {string} Formatted currency (e.g., "$12.50")
 */
export const formatMoney = (amount) => {
    if (!amount || amount <= 0) return '$0.00';
    return `$${amount.toFixed(2)}`;
};

/**
 * Format date to time string
 * @param {Date} date - Date object
 * @returns {string} Formatted time (e.g., "2:30 PM")
 */
export const formatEndTime = (date) => {
    if (!date) return '--:--';

    try {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    } catch (error) {
        return '--:--';
    }
};

/**
 * Format date to relative time
 * @param {Date} date - Date object
 * @returns {string} Relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
    if (!date) return '';

    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

/**
 * Format license plate for display
 * @param {string} plate - Raw plate string
 * @returns {string} Formatted plate (e.g., "ABC-1234")
 */
export const formatPlate = (plate) => {
    if (!plate) return '';

    // Remove all non-alphanumeric characters and uppercase
    const cleaned = plate.replace(/[^A-Z0-9]/gi, '').toUpperCase();

    // Add hyphen after 3 characters if length > 3
    if (cleaned.length > 3) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    }

    return cleaned;
};