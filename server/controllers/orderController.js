const Order = require("../models/Order");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  const {
    products,
    totalAmount,
    paymentMode,
    address,
    shippingAddress,
    customerInfo,
  } = req.body;
  try {
    console.log("📦 Creating order with data:", {
      products: products?.length,
      totalAmount,
      paymentMode,
      hasShippingAddress: !!shippingAddress,
      hasAddress: !!address,
    });

    // Validate products have required fields
    if (!products || products.length === 0) {
      return res.status(400).json({ msg: "No products in order" });
    }

    // Ensure each product has price, quantity, and product ID
    const validatedProducts = products.map((item) => ({
      product: item.product,
      quantity: item.quantity || 1,
      price: item.price || 0,
    }));

    console.log("✅ Validated products:", validatedProducts);

    const orderId = `AK-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const order = new Order({
      orderId,
      user: req.user.id,
      products: validatedProducts,
      totalAmount,
      paymentMode,
      address,
      shippingAddress: shippingAddress || {
        firstName: customerInfo?.firstName,
        lastName: customerInfo?.lastName,
        email: customerInfo?.email,
        phone: address?.phone,
        street: address?.street,
        city: address?.city,
        state: address?.state,
        pincode: address?.pincode,
      },
      customerInfo,
    });
    await order.save();

    console.log("✅ Order created successfully:", orderId);

    if (paymentMode === "Razorpay") {
      const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: orderId,
      };
      const razorpayOrder = await razorpay.orders.create(options);
      return res.json({ order, razorpayOrder });
    }

    res.json(order);
  } catch (err) {
    console.error("❌ Order creation error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "products.product"
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("products.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "Order not found" });
    order.status = status;
    // Use validateBeforeSave: false to skip validation for old orders without price field
    await order.save({ validateBeforeSave: false });
    res.json(order);
  } catch (err) {
    console.error("❌ Update order status error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    console.log("🔴 Cancel order request:", {
      orderId: req.params.id,
      userId: req.user?.id,
    });

    const order = await Order.findById(req.params.id);

    if (!order) {
      console.log("❌ Order not found");
      return res.status(404).json({ msg: "Order not found" });
    }

    console.log("📦 Order found:", {
      orderId: order.orderId,
      status: order.status,
      orderUserId: order.user.toString(),
      requestUserId: req.user.id,
    });

    // Check if order belongs to the user
    if (order.user.toString() !== req.user.id) {
      console.log("❌ Unauthorized - user mismatch");
      return res
        .status(403)
        .json({ msg: "Not authorized to cancel this order" });
    }

    // Only allow cancellation if order is not shipped or delivered
    if (order.status === "shipped" || order.status === "delivered") {
      console.log("❌ Cannot cancel - order already shipped/delivered");
      return res.status(400).json({
        msg: "Cannot cancel order that has been shipped or delivered",
      });
    }

    order.status = "cancelled";

    // Use validateBeforeSave: false to skip validation for old orders without price field
    await order.save({ validateBeforeSave: false });

    console.log("✅ Order cancelled successfully:", order.orderId);
    res.json({ msg: "Order cancelled successfully", order });
  } catch (err) {
    console.error("❌ Cancel order error:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: "products.product",
        select: "title price images description",
      })
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Check if order belongs to the user (unless admin)
    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ msg: "Not authorized to view this order" });
    }

    console.log("📋 Order details fetched:", {
      orderId: order.orderId,
      products: order.products?.length,
      hasShippingAddress: !!order.shippingAddress,
      shippingAddress: order.shippingAddress,
      hasAddress: !!order.address,
      address: order.address,
      status: order.status,
    });

    res.json(order);
  } catch (err) {
    console.error("❌ Get order error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
