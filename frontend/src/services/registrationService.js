import api from './api';

const registrationService = {
    // Register for an event
    registerForEvent: async (eventId) => {
        try {
            const response = await api.post('/registrations', { eventId });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get user's registrations
    getUserRegistrations: async (userId) => {
        try {
            const response = await api.get(`/registrations/user/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Check if user is registered for event
    checkRegistration: async (eventId) => {
        try {
            const response = await api.get(`/registrations/check/${eventId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Cancel registration
    cancelRegistration: async (registrationId) => {
        try {
            const response = await api.delete(`/registrations/${registrationId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get event registrations (for organizers)
    getEventRegistrations: async (eventId) => {
        try {
            const response = await api.get(`/registrations/event/${eventId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default registrationService;
