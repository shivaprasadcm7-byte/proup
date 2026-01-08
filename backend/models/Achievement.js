const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required'],
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: [true, 'Event is required'],
        },
        type: {
            type: String,
            required: [true, 'Achievement type is required'],
            enum: ['certification', 'prize', 'achievement'],
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot be more than 200 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, 'Description cannot be more than 1000 characters'],
        },
        position: {
            type: Number,
            min: 1,
            max: 10,
        },
        issuedDate: {
            type: Date,
            default: Date.now,
        },
        issuedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Issuer is required'],
        },
        points: {
            type: Number,
            default: 10,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
achievementSchema.index({ user: 1, event: 1, type: 1 });

module.exports = mongoose.model('Achievement', achievementSchema);
