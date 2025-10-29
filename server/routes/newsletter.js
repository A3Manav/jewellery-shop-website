const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const adminAuth = require('../middleware/adminAuth');

// Public routes
router.post('/subscribe', newsletterController.subscribe);
router.post('/unsubscribe', newsletterController.unsubscribe);

// Admin routes (protected)
router.get('/', adminAuth, newsletterController.getSubscribers);
router.get('/stats', adminAuth, newsletterController.getSubscriberStats);

module.exports = router;