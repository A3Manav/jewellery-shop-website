const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const marriageBookingController = require('../controllers/marriageBookingController');

// Optional auth middleware - allows both authenticated and guest bookings
const optionalAuth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
        // If token exists, use auth middleware
        return auth(req, res, next);
    }
    // If no token, continue without authentication
    req.user = null;
    next();
};

router.post('/', optionalAuth, marriageBookingController.createBooking);
router.get('/', auth, marriageBookingController.getBookings);
router.get('/all', adminAuth, marriageBookingController.getAllBookings);
router.put('/:id', adminAuth, marriageBookingController.updateBookingStatus);

module.exports = router;