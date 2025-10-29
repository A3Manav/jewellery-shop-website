const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createReview,
    getProductReviews,
    getUserReviews,
    updateReview,
    deleteReview,
    reportReview,
    markHelpful,
    canReviewProduct
} = require('../controllers/reviewController');

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', auth, createReview);

// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for a specific product
// @access  Public
router.get('/product/:productId', getProductReviews);

// @route   GET /api/reviews/user
// @desc    Get current user's reviews
// @access  Private
router.get('/user', auth, getUserReviews);

// @route   GET /api/reviews/can-review/:productId
// @desc    Check if user can review a product
// @access  Private
router.get('/can-review/:productId', auth, canReviewProduct);

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', auth, updateReview);

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, deleteReview);

// @route   POST /api/reviews/:id/report
// @desc    Report a review
// @access  Private
router.post('/:id/report', auth, reportReview);

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Private
router.post('/:id/helpful', auth, markHelpful);

module.exports = router;