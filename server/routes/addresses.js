const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const addressController = require("../controllers/addressController");

// @route   GET /api/addresses
// @desc    Get all addresses for logged-in user
// @access  Private
router.get("/", auth, addressController.getAddresses);

// @route   POST /api/addresses
// @desc    Create new address
// @access  Private
router.post("/", auth, addressController.createAddress);

// @route   PUT /api/addresses/:id
// @desc    Update address
// @access  Private
router.put("/:id", auth, addressController.updateAddress);

// @route   DELETE /api/addresses/:id
// @desc    Delete address
// @access  Private
router.delete("/:id", auth, addressController.deleteAddress);

// @route   PUT /api/addresses/:id/default
// @desc    Set address as default
// @access  Private
router.put("/:id/default", auth, addressController.setDefaultAddress);

module.exports = router;
