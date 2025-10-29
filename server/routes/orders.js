const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const orderController = require("../controllers/orderController");

router.post("/", auth, orderController.createOrder);
router.get("/", auth, orderController.getOrders);
router.get("/all", adminAuth, orderController.getAllOrders);
router.get("/:id", auth, orderController.getOrderById);
router.put("/:id", adminAuth, orderController.updateOrderStatus);
router.put("/:id/cancel", auth, orderController.cancelOrder);

module.exports = router;
