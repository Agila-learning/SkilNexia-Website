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

// @desc    Download a certificate PDF
// @route   GET /api/certificates/:id/download
// @access  Private/Student
const downloadCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id)
            .populate('user', 'name')
            .populate('course', 'title');

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        // Verify ownership or Admin role
        if (certificate.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to download this certificate' });
        }

        // Generate PDF on the fly and stream directly to response
        const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Certificate_${certificate.certificateId}.pdf`);

        doc.pipe(res);

        // Simple elegant design
        doc.rect(20, 20, 802, 555).lineWidth(10).stroke('#1e293b'); // Dark Slate Border
        doc.rect(30, 30, 782, 535).lineWidth(2).stroke('#6366f1'); // Indigo inner border

        doc.moveDown(3);
        doc.font('Helvetica-Bold').fontSize(40).fillColor('#0f172a').text('Certificate of Completion', { align: 'center' });
        doc.moveDown(1.5);
        doc.font('Helvetica').fontSize(20).fillColor('#64748b').text('This is to humbly certify that', { align: 'center' });
        doc.moveDown(1);
        doc.font('Helvetica-Bold').fontSize(35).fillColor('#4338ca').text(certificate.user.name.toUpperCase(), { align: 'center' });
        doc.moveDown(1);
        doc.font('Helvetica').fontSize(18).fillColor('#64748b').text('has successfully completed the enterprise course program', { align: 'center' });
        doc.moveDown(1);
        doc.font('Helvetica-Bold').fontSize(25).fillColor('#0f172a').text(certificate.course.title, { align: 'center' });

        doc.moveDown(3);
        doc.fontSize(14).fillColor('#94a3b8').text(`Certificate ID: ${certificate.certificateId}`, 100, 480);
        doc.text(`Issued On: ${new Date(certificate.createdAt).toLocaleDateString()}`, 600, 480);

        doc.end();

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMyCertificates,
    generateCertificate,
    downloadCertificate,
};
