const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');

// @route   GET /api/admin/dashboard
// @desc    Get dashboard data
// @access  Admin only
router.get('/dashboard', adminAuth, adminController.getDashboardData);

// @route   GET /api/admin/health
// @desc    Get system health status
// @access  Admin only
router.get('/health', adminAuth, adminController.getSystemHealth);

module.exports = router;