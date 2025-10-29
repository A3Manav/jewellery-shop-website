const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const rateController = require('../controllers/rateController');

router.post('/', adminAuth, rateController.updateRate);
router.get('/', rateController.getRate);

module.exports = router;