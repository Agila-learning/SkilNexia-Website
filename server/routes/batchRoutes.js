const express = require('express');
const router = express.Router({ mergeParams: true });
const { getBatchesByCourse, createBatch, updateBatch, completeBatch, addLecture } = require('../controllers/batchController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getBatchesByCourse)
    .post(protect, authorize('admin', 'hr'), createBatch);

router.route('/:batchId')
    .put(protect, authorize('trainer', 'admin'), updateBatch);

router.route('/:batchId/complete')
    .put(protect, authorize('trainer', 'admin'), completeBatch);

router.route('/:batchId/lectures')
    .post(protect, authorize('trainer', 'admin'), addLecture);

module.exports = router;
