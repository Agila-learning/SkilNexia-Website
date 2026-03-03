const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge params to get courseId from parent router
const { getBatchesByCourse, createBatch } = require('../controllers/batchController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getBatchesByCourse)
    .post(protect, authorize('admin'), createBatch);

module.exports = router;
