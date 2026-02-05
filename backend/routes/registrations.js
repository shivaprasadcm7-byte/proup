const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

// @route   POST /api/registrations
// @desc    Register for an event
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { eventId } = req.body;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if already registered
        const existingRegistration = await Registration.findOne({
            user: req.user.id,
            event: eventId,
        });

        if (existingRegistration) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        // Create registration
        const registration = await Registration.create({
            user: req.user.id,
            event: eventId,
            status: 'confirmed',
        });

        // Update event registration count
        event.registrationCount += 1;
        await event.save();

        // Add event to user's registered events
        await User.findByIdAndUpdate(req.user.id, {
            $push: { registeredEvents: eventId },
        });

        const populatedRegistration = await Registration.findById(registration._id)
            .populate('event')
            .populate('user', 'name email');

        // Send confirmation email to the user
        try {
            const user = await User.findById(req.user.id);
            if (user && user.email) {
                const emailMessage = `
Hello ${user.name || 'Attendee'},

🎉 You have successfully registered for the event!

📌 Event Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
📛 Event: ${event.title}
📅 Date: ${event.date}
📍 Location: ${event.location || 'TBA'}
🎫 Status: Confirmed
━━━━━━━━━━━━━━━━━━━━━━━━━━━

We look forward to seeing you there!

Best regards,
The Proup Team
                `.trim();

                await sendEmail({
                    email: user.email,
                    subject: `✅ Registration Confirmed: ${event.title}`,
                    message: emailMessage,
                });
                console.log(`Confirmation email sent to ${user.email}`);
            }
        } catch (emailError) {
            // Log email error but don't fail the registration
            console.error('Failed to send confirmation email:', emailError.message);
        }

        res.status(201).json({
            success: true,
            data: populatedRegistration,
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/registrations/user/:userId
// @desc    Get user's registrations
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
    try {
        // Make sure user can only view their own registrations
        if (req.params.userId !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const registrations = await Registration.find({ user: req.params.userId })
            .populate('event')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: registrations.length,
            data: registrations,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/registrations/event/:eventId
// @desc    Get event's registrations (for organizers)
// @access  Private
router.get('/event/:eventId', protect, async (req, res) => {
    try {
        const registrations = await Registration.find({ event: req.params.eventId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: registrations.length,
            data: registrations,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/registrations/:id
// @desc    Cancel registration
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id);

        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        // Make sure user owns the registration
        if (registration.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Update event registration count
        const event = await Event.findById(registration.event);
        if (event) {
            event.registrationCount = Math.max(0, event.registrationCount - 1);
            await event.save();
        }

        // Remove event from user's registered events
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { registeredEvents: registration.event },
        });

        await registration.deleteOne();

        res.json({
            success: true,
            message: 'Registration cancelled successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/registrations/check/:eventId
// @desc    Check if user is registered for event
// @access  Private
router.get('/check/:eventId', protect, async (req, res) => {
    try {
        const registration = await Registration.findOne({
            user: req.user.id,
            event: req.params.eventId,
        });

        res.json({
            success: true,
            isRegistered: !!registration,
            registration: registration || null,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
