/**
 * XSS Sanitization Middleware
 * Strips HTML tags and dangerous patterns from all string values
 * in req.body, req.query, and req.params to prevent Cross-Site Scripting attacks.
 * 
 * Works alongside Helmet's X-XSS-Protection header for defense-in-depth.
 */

// Strip HTML tags, event handlers, javascript: URIs, and data: URIs
const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;

    return str
        // Remove <script>...</script> blocks (including content)
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove all HTML tags
        .replace(/<\/?[^>]+(>|$)/g, '')
        // Remove javascript: and data: URI schemes
        .replace(/javascript\s*:/gi, '')
        .replace(/data\s*:/gi, '')
        // Remove on* event handlers (onerror=, onclick=, etc.)
        .replace(/\bon\w+\s*=\s*["']?[^"'>]*["']?/gi, '')
        // Remove style expressions (expression(), url())
        .replace(/expression\s*\(/gi, '')
        // Encode remaining dangerous characters
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
};

const sanitizeValue = (value) => {
    if (typeof value === 'string') {
        return sanitizeString(value);
    }
    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }
    if (value !== null && typeof value === 'object') {
        return sanitizeObject(value);
    }
    return value;
};

const sanitizeObject = (obj) => {
    const sanitized = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            sanitized[key] = sanitizeValue(obj[key]);
        }
    }
    return sanitized;
};

const xssSanitize = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body);
    }
    if (req.query && typeof req.query === 'object') {
        req.query = sanitizeObject(req.query);
    }
    if (req.params && typeof req.params === 'object') {
        req.params = sanitizeObject(req.params);
    }
    next();
};

module.exports = xssSanitize;
