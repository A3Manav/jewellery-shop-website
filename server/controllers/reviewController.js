const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    try {
        const { product, rating, comment, title } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!product || !rating || !comment) {
            return res.status(400).json({ message: 'Product, rating, and comment are required' });
        }

        // Check if product exists
        const existingProduct = await Product.findById(product);
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({ user: userId, product });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        // Create new review
        const review = new Review({
            user: userId,
            product,
            rating: Number(rating),
            comment: comment.trim(),
            title: title?.trim() || null
        });

        await review.save();

        // Populate user info for response
        await review.populate('user', 'name email');

        res.status(201).json({
            message: 'Review created successfully',
            review
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;

        // Build sort object
        const sortObj = {};
        sortObj[sort] = order === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get reviews with pagination
        const reviews = await Review.find({
            product: productId,
            status: 'active'
        })
            .populate('user', 'name')
            .sort(sortObj)
            .skip(skip)
            .limit(Number(limit));

        // Get total count
        const total = await Review.countDocuments({
            product: productId,
            status: 'active'
        });

        // Get rating distribution
        const ratingDistribution = await Review.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(productId), status: 'active' } },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            reviews,
            pagination: {
                current: Number(page),
                total: Math.ceil(total / limit),
                count: total,
                limit: Number(limit)
            },
            ratingDistribution
        });
    } catch (error) {
        console.error('Get product reviews error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/user
// @access  Private
const getUserReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const reviews = await Review.find({ user: userId })
            .populate('product', 'title images price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Review.countDocuments({ user: userId });

        res.json({
            reviews,
            pagination: {
                current: Number(page),
                total: Math.ceil(total / limit),
                count: total,
                limit: Number(limit)
            }
        });
    } catch (error) {
        console.error('Get user reviews error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment, title } = req.body;
        const userId = req.user.id;

        // Find review
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user owns the review
        if (review.user.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }

        // Check if review can be edited (within 24 hours)
        if (!review.canEdit()) {
            return res.status(400).json({ message: 'Reviews can only be edited within 24 hours of creation' });
        }

        // Update fields
        if (rating !== undefined) review.rating = Number(rating);
        if (comment !== undefined) review.comment = comment.trim();
        if (title !== undefined) review.title = title?.trim() || null;

        await review.save();
        await review.populate('user', 'name email');

        res.json({
            message: 'Review updated successfully',
            review
        });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Find review
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user owns the review or is admin
        if (review.user.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        await review.remove();

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Report a review
// @route   POST /api/reviews/:id/report
// @access  Private
const reportReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { reason } = req.body;

        // Find review
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user already reported this review
        if (review.reportedBy.includes(userId)) {
            return res.status(400).json({ message: 'You have already reported this review' });
        }

        // Add user to reportedBy array
        review.reportedBy.push(userId);
        await review.save();

        res.json({ message: 'Review reported successfully' });
    } catch (error) {
        console.error('Report review error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
const markHelpful = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.helpfulVotes += 1;
        await review.save();

        res.json({
            message: 'Marked as helpful',
            helpfulVotes: review.helpfulVotes
        });
    } catch (error) {
        console.error('Mark helpful error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Check if user can review product
// @route   GET /api/reviews/can-review/:productId
// @access  Private
const canReviewProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            user: userId,
            product: productId
        });

        res.json({
            canReview: !existingReview,
            hasReviewed: !!existingReview,
            review: existingReview || null
        });
    } catch (error) {
        console.error('Can review product error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createReview,
    getProductReviews,
    getUserReviews,
    updateReview,
    deleteReview,
    reportReview,
    markHelpful,
    canReviewProduct
};