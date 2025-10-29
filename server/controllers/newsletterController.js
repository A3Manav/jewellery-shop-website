const NewsletterSubscriber = require('../models/NewsletterSubscriber');

// Subscribe to newsletter
exports.subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({
                message: 'Email is required'
            });
        }

        // Check if email is already subscribed
        const existingSubscriber = await NewsletterSubscriber.findOne({ email: email.toLowerCase().trim() });

        if (existingSubscriber) {
            if (existingSubscriber.isActive) {
                return res.status(409).json({
                    message: 'Email is already subscribed to our newsletter'
                });
            } else {
                // Reactivate subscription
                existingSubscriber.isActive = true;
                existingSubscriber.subscribedAt = new Date();
                await existingSubscriber.save();

                return res.status(200).json({
                    message: 'Subscription reactivated successfully'
                });
            }
        }

        // Create new subscriber
        const subscriber = new NewsletterSubscriber({
            email: email.toLowerCase().trim()
        });

        await subscriber.save();

        res.status(201).json({
            message: 'Successfully subscribed to newsletter',
            subscriber: {
                id: subscriber._id,
                email: subscriber.email,
                subscribedAt: subscriber.subscribedAt
            }
        });

    } catch (error) {
        console.error('Newsletter subscription error:', error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Email is already subscribed to our newsletter'
            });
        }

        res.status(500).json({
            message: 'Failed to subscribe to newsletter',
            error: error.message
        });
    }
};

// Get all newsletter subscribers (Admin only)
exports.getSubscribers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const subscribers = await NewsletterSubscriber.find({ isActive: true })
            .sort({ subscribedAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('email subscribedAt createdAt');

        const total = await NewsletterSubscriber.countDocuments({ isActive: true });

        res.status(200).json({
            subscribers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalSubscribers: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({
            message: 'Failed to fetch subscribers',
            error: error.message
        });
    }
};

// Get subscriber statistics (Admin only)
exports.getSubscriberStats = async (req, res) => {
    try {
        const totalSubscribers = await NewsletterSubscriber.countDocuments({ isActive: true });

        // Get subscribers from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newSubscribers = await NewsletterSubscriber.countDocuments({
            isActive: true,
            subscribedAt: { $gte: thirtyDaysAgo }
        });

        // Get subscribers from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const weeklySubscribers = await NewsletterSubscriber.countDocuments({
            isActive: true,
            subscribedAt: { $gte: sevenDaysAgo }
        });

        res.status(200).json({
            totalSubscribers,
            newSubscribers,
            weeklySubscribers
        });

    } catch (error) {
        console.error('Get subscriber stats error:', error);
        res.status(500).json({
            message: 'Failed to fetch subscriber statistics',
            error: error.message
        });
    }
};

// Unsubscribe from newsletter
exports.unsubscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required'
            });
        }

        const subscriber = await NewsletterSubscriber.findOneAndUpdate(
            { email: email.toLowerCase().trim() },
            { isActive: false },
            { new: true }
        );

        if (!subscriber) {
            return res.status(404).json({
                message: 'Subscriber not found'
            });
        }

        res.status(200).json({
            message: 'Successfully unsubscribed from newsletter'
        });

    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({
            message: 'Failed to unsubscribe from newsletter',
            error: error.message
        });
    }
};