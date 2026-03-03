const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge params to get courseId from parent router
const { getBatchesByCourse, createBatch, updateBatch, completeBatch } = require('../controllers/batchController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getBatchesByCourse)
    .post(protect, authorize('admin', 'hr'), createBatch);

router.route('/:batchId')
    .put(protect, authorize('trainer', 'admin'), updateBatch);

router.route('/:batchId/complete')
    .put(protect, authorize('trainer', 'admin'), completeBatch);

module.exports = router;
