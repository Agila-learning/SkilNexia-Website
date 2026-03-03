const Certificate = require('../models/Certificate');
const PDFDocument = require('pdfkit');
const cloudinary = require('cloudinary').v2;

// @desc    Get user certificates
// @route   GET /api/certificates/my
// @access  Private/Student
const getMyCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({ user: req.user._id })
            .populate('course', 'title');
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate a certificate
// @route   POST /api/certificates/generate
// @access  Private/Admin
const generateCertificate = async (req, res) => {
    try {
        const { userId, courseId, userName, courseName } = req.body;

        const certificateId = `SKLX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // PDF Generation Logic (Basic)
        const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            let pdfData = Buffer.concat(buffers);

            // Upload to Cloudinary (Need to configure cloudinary first)
            // For now, let's just save the record with a placeholder

            const certificate = new Certificate({
                user: userId,
                course: courseId,
                certificateId,
                // pdfUrl: ... (uploaded url)
            });

            await certificate.save();
            res.status(201).json(certificate);
        });

        doc.fontSize(30).text('Certificate of Completion', { align: 'center' });
        doc.moveDown();
        doc.fontSize(20).text('This is to certify that', { align: 'center' });
        doc.fontSize(25).text(userName, { align: 'center', underline: true });
        doc.fontSize(20).text('has successfully completed the course', { align: 'center' });
        doc.fontSize(25).text(courseName, { align: 'center', underline: true });
        doc.fontSize(15).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.fontSize(15).text(`Certificate ID: ${certificateId}`, { align: 'center' });

        doc.end();

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMyCertificates,
    generateCertificate,
};
