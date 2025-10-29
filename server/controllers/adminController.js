const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const MarriageBooking = require('../models/MarriageBooking');
const Review = require('../models/Review');

exports.getDashboardData = async (req, res) => {
    try {
        // Get total counts
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalBookings = await MarriageBooking.countDocuments();
        const totalReviews = await Review.countDocuments();

        // Get recent orders
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .populate('products.product', 'name price')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get recent bookings
        const recentBookings = await MarriageBooking.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get recent reviews
        const recentReviews = await Review.find()
            .populate('user', 'name')
            .populate('product', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        // Calculate monthly revenue (orders from last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const monthlyOrders = await Order.find({
            createdAt: { $gte: thirtyDaysAgo },
            status: { $in: ['completed', 'delivered'] }
        });

        const monthlyRevenue = monthlyOrders.reduce((total, order) => {
            return total + (order.totalAmount || 0);
        }, 0);

        // Get order status distribution
        const orderStatuses = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get booking status distribution
        const bookingStatuses = await MarriageBooking.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get average rating
        const avgRatingResult = await Review.aggregate([
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: '$rating' }
                }
            }
        ]);
        const averageRating = avgRatingResult.length > 0 ? avgRatingResult[0].avgRating : 0;

        const dashboardData = {
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalBookings,
                totalReviews,
                monthlyRevenue: Math.round(monthlyRevenue),
                averageRating: Math.round(averageRating * 10) / 10
            },
            recentOrders: recentOrders.map(order => ({
                id: order._id,
                user: order.user?.name || 'Guest',
                email: order.user?.email || '',
                totalAmount: order.totalAmount,
                status: order.status,
                createdAt: order.createdAt,
                itemCount: order.products?.length || 0
            })),
            recentBookings: recentBookings.map(booking => ({
                id: booking._id,
                user: booking.user?.name || booking.name,
                email: booking.user?.email || booking.email,
                productType: booking.productType,
                eventDate: booking.eventDate,
                status: booking.status,
                createdAt: booking.createdAt
            })),
            recentReviews: recentReviews.map(review => ({
                id: review._id,
                user: review.user?.name || 'Anonymous',
                product: review.product?.name || 'Unknown Product',
                rating: review.rating,
                comment: review.comment?.substring(0, 100) + (review.comment?.length > 100 ? '...' : ''),
                createdAt: review.createdAt
            })),
            orderStatuses: orderStatuses.map(status => ({
                status: status._id,
                count: status.count
            })),
            bookingStatuses: bookingStatuses.map(status => ({
                status: status._id,
                count: status.count
            }))
        };

        res.json(dashboardData);
    } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(500).json({
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }
};

exports.getSystemHealth = async (req, res) => {
    try {
        const health = {
            status: 'healthy',
            timestamp: new Date(),
            database: 'connected',
            uptime: process.uptime()
        };
        res.json(health);
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            error: error.message
        });
    }
};