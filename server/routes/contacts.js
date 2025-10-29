const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const adminAuth = require('../middleware/adminAuth');

// Public routes
router.post('/', contactController.submitContact);

// Admin routes (protected)
router.get('/', adminAuth, contactController.getAllContacts);
router.get('/stats', adminAuth, contactController.getContactStats);
router.get('/:id', adminAuth, contactController.getContactById);
router.put('/:id/status', adminAuth, contactController.updateContactStatus);
router.delete('/:id', adminAuth, contactController.deleteContact);

module.exports = router;