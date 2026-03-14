const express = require('express');
const router = express.Router();
const {
    getPartners,
    createPartner,
    updatePartner,
    deletePartner
} = require('../controllers/partnerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getPartners)
    .post(protect, authorize('admin'), createPartner);

router.route('/:id')
    .put(protect, authorize('admin'), updatePartner)
    .delete(protect, authorize('admin'), deletePartner);

module.exports = router;
