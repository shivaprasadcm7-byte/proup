import api from './api';

const eventService = {
    // Get all events
    getAllEvents: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            if (filters.search) params.append('search', filters.search);
            if (filters.category) params.append('category', filters.category);
            if (filters.eventType) params.append('eventType', filters.eventType);
            if (filters.sort) params.append('sort', filters.sort);

            const response = await api.get(`/events?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get single event
    getEventById: async (id) => {
        try {
            const response = await api.get(`/events/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Create new event
    createEvent: async (eventData) => {
        try {
            const response = await api.post('/events', eventData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update event
    updateEvent: async (id, eventData) => {
        try {
            const response = await api.put(`/events/${id}`, eventData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Delete event
    deleteEvent: async (id) => {
        try {
            const response = await api.delete(`/events/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default eventService;
