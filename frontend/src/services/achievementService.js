import api from './api';

/**
 * Get current user's achievements
 */
export const getMyAchievements = async () => {
    const response = await api.get('/achievements/my');
    return response.data;
};

/**
 * Get achievement statistics for current user
 */
export const getAchievementStats = async () => {
    const response = await api.get('/achievements/stats');
    return response.data;
};

/**
 * Get achievements for a specific user
 */
export const getUserAchievements = async (userId) => {
    const response = await api.get(`/achievements/user/${userId}`);
    return response.data;
};

/**
 * Get achievements for a specific event
 */
export const getEventAchievements = async (eventId) => {
    const response = await api.get(`/achievements/event/${eventId}`);
    return response.data;
};

/**
 * Get organizer's events for prize assignment
 */
export const getOrganizerEvents = async () => {
    const response = await api.get('/achievements/organizer/events');
    return response.data;
};

/**
 * Get participants of an event for prize assignment
 */
export const getEventParticipants = async (eventId) => {
    const response = await api.get(`/achievements/organizer/events/${eventId}/participants`);
    return response.data;
};

/**
 * Award an achievement to a user (organizers only)
 */
export const awardAchievement = async (achievementData) => {
    const response = await api.post('/achievements', achievementData);
    return response.data;
};

/**
 * Update an achievement
 */
export const updateAchievement = async (achievementId, updateData) => {
    const response = await api.put(`/achievements/${achievementId}`, updateData);
    return response.data;
};

/**
 * Delete an achievement
 */
export const deleteAchievement = async (achievementId) => {
    const response = await api.delete(`/achievements/${achievementId}`);
    return response.data;
};
