const cloudinary = require('../config/cloudinary');

// @desc    Upload file to Cloudinary
// @route   POST /api/upload
// @access  Private
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Convert buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
            resource_type: 'auto', // Auto detect image, video, raw
            folder: 'skilnexia',
        });

        res.json({
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            type: result.resource_type,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { uploadFile };
