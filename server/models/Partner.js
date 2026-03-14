const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        logo: {
            type: String, // Logo URL
            required: true,
        },
        website: {
            type: String,
        },
        description: {
            type: String,
        },
        category: {
            type: String,
            enum: ['IT', 'Consulting', 'EdTech', 'Startup', 'Other'],
            default: 'IT',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Partner', partnerSchema);
