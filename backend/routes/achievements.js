const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Achievement = require('../models/Achievement');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/achievements/my
// @desc    Get current user's achievements
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const achievements = await Achievement.find({ user: req.user.id })
            .populate('event', 'title date image category')
            .populate('issuedBy', 'name')
            .sort({ issuedDate: -1 });

        res.json({
            success: true,
            count: achievements.length,
            data: achievements,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/achievements/stats
// @desc    Get achievement stats for current user
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        // Count registrations (events attended)
        const eventsAttended = await Registration.countDocuments({ user: req.user.id });

        // Count achievements by type
        const certifications = await Achievement.countDocuments({
            user: req.user.id,
            type: 'certification'
        });

        const prizes = await Achievement.countDocuments({
            user: req.user.id,
            type: 'prize'
        });

        // Calculate total points
        const pointsResult = await Achievement.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: null, totalPoints: { $sum: '$points' } } }
        ]);

        const totalPoints = pointsResult.length > 0 ? pointsResult[0].totalPoints : 0;

        res.json({
            success: true,
            data: {
                eventsAttended,
                certifications,
                prizes,
                totalPoints,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/achievements/user/:userId
// @desc    Get all achievements for a specific user
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
    try {
        const achievements = await Achievement.find({ user: req.params.userId })
            .populate('event', 'title date image category')
            .populate('issuedBy', 'name')
            .sort({ issuedDate: -1 });

        res.json({
            success: true,
            count: achievements.length,
            data: achievements,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/achievements/event/:eventId
// @desc    Get all achievements for a specific event
// @access  Private
router.get('/event/:eventId', protect, async (req, res) => {
    try {
        const achievements = await Achievement.find({ event: req.params.eventId })
            .populate('user', 'name email')
            .populate('issuedBy', 'name')
            .sort({ position: 1, issuedDate: -1 });

        res.json({
            success: true,
            count: achievements.length,
            data: achievements,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/achievements/organizer/events
// @desc    Get organizer's events with participant info for prize assignment
// @access  Private (Organizers only)
router.get('/organizer/events', protect, authorize('organizer'), async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user.id })
            .select('title date image category registrationCount')
            .sort({ date: -1 });

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

// @route   GET /api/achievements/organizer/events/:eventId/participants
// @desc    Get participants of an event for prize assignment
// @access  Private (Organizers only)
router.get('/organizer/events/:eventId/participants', protect, authorize('organizer'), async (req, res) => {
    try {
        // Verify organizer owns this event
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.organizer.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to view participants for this event' });
        }

        // Get registrations with user info
        const registrations = await Registration.find({ event: req.params.eventId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        // Get existing achievements for this event
        const existingAchievements = await Achievement.find({ event: req.params.eventId })
            .select('user type position');

        // Map participants with their existing achievements
        const participants = registrations.map(reg => {
            const userAchievements = existingAchievements.filter(
                a => a.user.toString() === reg.user._id.toString()
            );
            return {
                _id: reg.user._id,
                name: reg.user.name,
                email: reg.user.email,
                registrationDate: reg.createdAt,
                achievements: userAchievements,
            };
        });

        res.json({
            success: true,
            count: participants.length,
            data: participants,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/achievements
// @desc    Award an achievement to a user
// @access  Private (Organizers only)
router.post(
    '/',
    [
        protect,
        authorize('organizer'),
        [
            body('userId').notEmpty().withMessage('User ID is required'),
            body('eventId').notEmpty().withMessage('Event ID is required'),
            body('type').isIn(['certification', 'prize', 'achievement']).withMessage('Invalid achievement type'),
            body('title').trim().notEmpty().withMessage('Title is required'),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { userId, eventId, type, title, description, position, points } = req.body;

            // Verify organizer owns this event
            const event = await Event.findById(eventId);
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
            if (event.organizer.toString() !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized to award achievements for this event' });
            }

            // Check if user is registered for the event
            const registration = await Registration.findOne({ user: userId, event: eventId });
            if (!registration) {
                return res.status(400).json({ message: 'User is not registered for this event' });
            }

            // Check for duplicate prize position
            if (type === 'prize' && position) {
                const existingPrize = await Achievement.findOne({
                    event: eventId,
                    type: 'prize',
                    position: position,
                });
                if (existingPrize) {
                    return res.status(400).json({
                        message: `Position ${position} has already been awarded for this event`
                    });
                }
            }

            // Calculate points based on type and position
            let calculatedPoints = points || 10;
            if (type === 'prize' && position) {
                if (position === 1) calculatedPoints = 50;
                else if (position === 2) calculatedPoints = 30;
                else if (position === 3) calculatedPoints = 20;
            } else if (type === 'certification') {
                calculatedPoints = 15;
            }

            const achievement = await Achievement.create({
                user: userId,
                event: eventId,
                type,
                title,
                description: description || '',
                position: type === 'prize' ? position : undefined,
                issuedBy: req.user.id,
                points: calculatedPoints,
            });

            const populatedAchievement = await Achievement.findById(achievement._id)
                .populate('user', 'name email')
                .populate('event', 'title date')
                .populate('issuedBy', 'name');

            res.status(201).json({
                success: true,
                data: populatedAchievement,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// @route   PUT /api/achievements/:id
// @desc    Update an achievement
// @access  Private (Organizers only)
router.put('/:id', protect, authorize('organizer'), async (req, res) => {
    try {
        let achievement = await Achievement.findById(req.params.id);

        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }

        // Verify organizer issued this achievement
        if (achievement.issuedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this achievement' });
        }

        const { title, description, position, points } = req.body;

        achievement = await Achievement.findByIdAndUpdate(
            req.params.id,
            { title, description, position, points },
            { new: true, runValidators: true }
        )
            .populate('user', 'name email')
            .populate('event', 'title date')
            .populate('issuedBy', 'name');

        res.json({
            success: true,
            data: achievement,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/achievements/:id
// @desc    Delete an achievement
// @access  Private (Organizers only)
router.delete('/:id', protect, authorize('organizer'), async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id);

        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }

        // Verify organizer issued this achievement
        if (achievement.issuedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this achievement' });
        }

        await achievement.deleteOne();

        res.json({
            success: true,
            message: 'Achievement deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
