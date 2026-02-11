const mongoose = require('mongoose');

/**
 * Validate ObjectId Middleware
 * Validates that route parameters are valid MongoDB ObjectIds.
 * Prevents CastError crashes and potential injection via malformed IDs.
 * 
 * @param  {...string} paramNames - The route parameter names to validate (e.g., 'id', 'eventId')
 */
const validateObjectId = (...paramNames) => {
    return (req, res, next) => {
        for (const param of paramNames) {
            if (req.params[param] && !mongoose.Types.ObjectId.isValid(req.params[param])) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid ${param} format`,
                });
            }
        }
        next();
    };
};

module.exports = validateObjectId;
