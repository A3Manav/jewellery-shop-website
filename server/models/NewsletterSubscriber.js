const mongoose = require('mongoose');

const newsletterSubscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    source: {
        type: String,
        default: 'footer'
    }
}, {
    timestamps: true
});

// Index for faster queries
newsletterSubscriberSchema.index({ email: 1 });
newsletterSubscriberSchema.index({ subscribedAt: -1 });

module.exports = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);