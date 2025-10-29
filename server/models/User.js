const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Made optional for Google OAuth users
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profileImage: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },
    savedAddresses: [
      {
        label: String, // e.g., "Home", "Office", "Parent's House"
        firstName: String,
        lastName: String,
        street: String,
        apartment: String,
        city: String,
        state: String,
        pincode: String,
        phone: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    cart: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        title: String,
        price: Number,
        images: [{ url: String }],
        quantity: { type: Number, default: 1 },
      },
    ],
    // Email verification fields
    isVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    // Google OAuth fields
    googleId: String,
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    // Password reset fields
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
