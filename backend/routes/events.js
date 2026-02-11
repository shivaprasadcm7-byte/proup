const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

// Helper: escape regex special characters to prevent ReDoS / injection
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { search, category, eventType, sort } = req.query;

        // Build filter query
        let query = {};

        if (search) {
            const sanitizedSearch = escapeRegex(search);
            query.$or = [
                { title: { $regex: sanitizedSearch, $options: 'i' } },
                { description: { $regex: sanitizedSearch, $options: 'i' } },
            ];
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        if (eventType && eventType !== 'all') {
            query.eventType = eventType;
        }

        // Build sort options
        let sortOptions = {};
        if (sort === 'popularity') {
            sortOptions = { popularity: -1 };
        } else if (sort === 'date') {
            sortOptions = { date: 1 };
        } else {
            sortOptions = { createdAt: -1 };
        }

        const events = await Event.find(query).sort(sortOptions).populate('organizer', 'name email');

        res.json({
            success: true,
            count: events.length,
            data: events,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', validateObjectId('id'), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer', 'name email');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({
            success: true,
            data: event,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (Organizers only)
router.post(
    '/',
    [
        protect,
        authorize('organizer'),
        [
            body('title').trim().notEmpty().withMessage('Title is required').escape(),
            body('date').notEmpty().withMessage('Date is required'),
            body('image').notEmpty().withMessage('Image URL is required'),
            body('description').trim().notEmpty().withMessage('Description is required'),
            body('price').notEmpty().withMessage('Price is required'),
            body('category').notEmpty().withMessage('Category is required'),
            body('eventType').isIn(['online', 'offline', 'hybrid']).withMessage('Invalid event type'),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Whitelist allowed fields — prevents mass assignment of organizer, registrationCount, etc.
            const { title, date, image, description, location, price, category, duration, capacity, eventType } = req.body;

            const eventData = {
                title,
                date,
                image,
                description,
                location,
                price,
                category,
                duration,
                capacity,
                eventType,
                organizer: req.user.id,  // Always set from authenticated user
            };

            const event = await Event.create(eventData);

            res.status(201).json({
                success: true,
                data: event,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Organizer of the event only)
router.put('/:id', protect, authorize('organizer'), validateObjectId('id'), async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Make sure user is event organizer
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }

        // Whitelist allowed update fields — prevents overwriting organizer, registrationCount, etc.
        const allowedFields = ['title', 'date', 'image', 'description', 'location', 'price', 'category', 'duration', 'capacity', 'eventType'];
        const updateData = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }

        event = await Event.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        res.json({
            success: true,
            data: event,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Organizer of the event only)
router.delete('/:id', protect, authorize('organizer'), validateObjectId('id'), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Make sure user is event organizer
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }

        await event.deleteOne();

        res.json({
            success: true,
            message: 'Event deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
