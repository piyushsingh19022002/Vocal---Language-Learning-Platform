import { logActivity } from './api';

/**
 * Activity Tracker Utility
 * Provides easy-to-use functions for tracking user activities
 */

class ActivityTracker {
    constructor() {
        this.sessionStartTime = null;
        this.activityType = null;
        this.details = {};
    }

    /**
     * Start tracking an activity session
     * @param {string} activityType - Type of activity ('speaking', 'listening', 'vocabulary', 'course')
     * @param {object} details - Additional details about the activity
     */
    startSession(activityType, details = {}) {
        this.sessionStartTime = Date.now();
        this.activityType = activityType;
        this.details = details;
    }

    /**
     * End the current session and log the activity
     * @param {object} additionalDetails - Any additional details to add when ending
     * @returns {Promise} - Promise that resolves when activity is logged
     */
    async endSession(additionalDetails = {}) {
        if (!this.sessionStartTime || !this.activityType) {
            console.warn('No active session to end');
            return null;
        }

        const duration = Math.round((Date.now() - this.sessionStartTime) / 1000); // in seconds

        try {
            const result = await logActivity({
                activityType: this.activityType,
                duration,
                details: {
                    ...this.details,
                    ...additionalDetails,
                    completed: true
                }
            });

            // Reset session
            this.sessionStartTime = null;
            this.activityType = null;
            this.details = {};

            return result;
        } catch (error) {
            console.error('Error logging activity:', error);
            throw error;
        }
    }

    /**
     * Update session details without ending the session
     * @param {object} newDetails - Details to merge with existing details
     */
    updateDetails(newDetails) {
        this.details = {
            ...this.details,
            ...newDetails
        };
    }

    /**
     * Get current session duration in seconds
     * @returns {number} - Duration in seconds
     */
    getCurrentDuration() {
        if (!this.sessionStartTime) {
            return 0;
        }
        return Math.round((Date.now() - this.sessionStartTime) / 1000);
    }

    /**
     * Check if there's an active session
     * @returns {boolean}
     */
    hasActiveSession() {
        return this.sessionStartTime !== null;
    }
}

// Export a singleton instance for easy use
export const activityTracker = new ActivityTracker();

// Also export the class for creating multiple instances if needed
export default ActivityTracker;
