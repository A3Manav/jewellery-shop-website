const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        validate: {
            validator: function (value) {
                return Number.isInteger(value);
            },
            message: 'Rating must be a whole number between 1 and 5'
        }
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        minlength: [10, 'Review comment must be at least 10 characters long'],
        maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    title: {
        type: String,
        trim: true,
        maxlength: [100, 'Review title cannot exceed 100 characters']
    },
    verified: {
        type: Boolean,
        default: false // Can be set to true if user has purchased the product
    },
    helpfulVotes: {
        type: Number,
        default: 0
    },
    reportedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['active', 'pending', 'hidden', 'deleted'],
        default: 'active'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index to prevent duplicate reviews from same user for same product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Index for efficient queries
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });
reviewSchema.index({ rating: -1 });

// Virtual for user info population
reviewSchema.virtual('userInfo', {
    ref: 'User',
    localField: 'user',
    foreignField: '_id',
    justOne: true
});

// Virtual for product info population
reviewSchema.virtual('productInfo', {
    ref: 'Product',
    localField: 'product',
    foreignField: '_id',
    justOne: true
});

// Method to check if review can be edited (within 24 hours)
reviewSchema.methods.canEdit = function () {
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    return (Date.now() - this.createdAt.getTime()) < twentyFourHours;
};

// Static method to calculate average rating for a product
reviewSchema.statics.calculateAverageRating = async function (productId) {
    const result = await this.aggregate([
        {
            $match: {
                product: new mongoose.Types.ObjectId(productId),
                status: 'active'
            }
        },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    if (result.length > 0) {
        // Update the product with calculated values
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            averageRating: Math.round(result[0].averageRating * 10) / 10, // Round to 1 decimal
            totalReviews: result[0].totalReviews
        });

        return {
            averageRating: result[0].averageRating,
            totalReviews: result[0].totalReviews
        };
    } else {
        // No reviews found
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            averageRating: 0,
            totalReviews: 0
        });

        return {
            averageRating: 0,
            totalReviews: 0
        };
    }
};

// Post middleware to update product rating after review changes
reviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post('remove', async function () {
    await this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post('findOneAndUpdate', async function () {
    if (this.getUpdate().$set && (this.getUpdate().$set.rating || this.getUpdate().$set.status)) {
        const review = await this.model.findOne(this.getQuery());
        if (review) {
            await this.model.calculateAverageRating(review.product);
        }
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;