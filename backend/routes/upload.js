const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const uploadOptions = {
            folder: 'proup-events',
            resource_type: 'image',
            // Automatic format optimization (WebP for supported browsers)
            fetch_format: 'auto',
            // Automatic quality optimization
            quality: 'auto',
            // Limit max width for performance
            transformation: [
                { width: 1200, crop: 'limit' }
            ],
            ...options
        };

        const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        uploadStream.end(fileBuffer);
    });
};

// @route   POST /api/upload
// @desc    Upload an image to Cloudinary
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer, {
            public_id: `event_${Date.now()}`
        });

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully to cloud storage',
            data: {
                imageUrl: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
                size: result.bytes
            }
        });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading image to cloud storage'
        });
    }
});

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
    if (error instanceof require('multer').MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 5MB'
            });
        }
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    next();
});

module.exports = router;

