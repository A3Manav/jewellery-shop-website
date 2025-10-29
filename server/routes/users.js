const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const userController = require('../controllers/userController');

router.get('/', adminAuth, userController.getUsers);
router.put('/:id', adminAuth, userController.updateUser);

module.exports = router;