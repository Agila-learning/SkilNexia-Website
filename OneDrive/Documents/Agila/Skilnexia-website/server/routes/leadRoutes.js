const express = require('express');
const router = express.Router();
const { createLead, getLeads, updateLeadStatus, getMyLeads } = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route to submit an inquiry
router.post('/', createLead);

// Protected routes for Candidate
router.get('/me', protect, getMyLeads);

// Protected routes for HR / Admin
router.get('/', protect, authorize('hr', 'admin'), getLeads);
router.put('/:id', protect, authorize('hr', 'admin'), updateLeadStatus);

module.exports = router;
