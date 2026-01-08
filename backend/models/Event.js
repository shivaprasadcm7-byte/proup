const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
            trim: true,
            maxlength: [200, 'Title cannot be more than 200 characters'],
        },
        date: {
            type: String,
            required: [true, 'Please add a date'],
        },
        image: {
            type: String,
            required: [true, 'Please add an image URL'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            maxlength: [2000, 'Description cannot be more than 2000 characters'],
        },
        location: {
            type: String,
        },
        price: {
            type: String,
            required: [true, 'Please add a price'],
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
            enum: ['Science', 'Wellness', 'Career', 'Finance', 'Hackathon', 'Marketing', 'Technology', 'Education', 'Other'],
        },
        duration: {
            type: String,
        },
        capacity: {
            type: String,
        },
        popularity: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        eventType: {
            type: String,
            required: [true, 'Please specify event type'],
            enum: ['online', 'offline', 'hybrid'],
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        registrationCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Event', eventSchema);
