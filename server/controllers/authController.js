const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const passport = require("passport");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/emailService");

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    user = new User({
      name,
      email,
      password,
      cart: [],
      emailVerificationToken,
      emailVerificationExpires,
      authProvider: "local",
    });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, emailVerificationToken);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail registration if email fails, but log it
    }

    res.status(201).json({
      msg: "Registration successful. Please check your email to verify your account.",
      user: { id: user._id, name, email, isVerified: false },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // Check if user is verified (skip for Google OAuth users)
    if (user.authProvider === "local" && !user.isVerified) {
      return res.status(400).json({
        msg: "Please verify your email before logging in. Check your email for verification link.",
        requiresVerification: true,
      });
    }

    // Only check password for local users
    if (user.authProvider === "local") {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email,
        role: user.role,
        cart: user.cart,
        isVerified: user.isVerified,
        authProvider: user.authProvider,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // console.log('🔍 Getting profile for user ID:', req.user.id);

    const user = await User.findById(req.user.id)
      .select("-password")
      .populate({
        path: "wishlist",
        select: "title price images type",
        match: { _id: { $exists: true } },
      })
      .populate({
        path: "orders",
        select: "orderNumber totalPrice status createdAt",
      })
      .populate("cart._id", "title price images");

    if (!user) {
      // console.error('❌ User not found for ID:', req.user.id);
      return res.status(404).json({ msg: "User not found" });
    }

    // console.log('✅ Profile loaded successfully for:', user.email);
    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, email, address, profileImage, cart, wishlist } = req.body;
  try {
    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (address) updateFields.address = address; // Now accepts object
    if (profileImage) updateFields.profileImage = profileImage;
    if (cart) updateFields.cart = cart;
    if (wishlist !== undefined) updateFields.wishlist = wishlist; // Allow wishlist updates

    // Use findByIdAndUpdate to avoid version conflicts
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Email verification
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ msg: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Resend verification email
exports.resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ msg: "Email is already verified" });
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = emailVerificationExpires;
    await user.save();

    // Send verification email
    await sendVerificationEmail(email, emailVerificationToken);

    res.json({ msg: "Verification email sent successfully" });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Google OAuth handlers
exports.googleAuth = (req, res, next) => {
  // Check if Google strategy is available
  if (!passport._strategy("google")) {
    return res.status(503).json({
      msg: "Google OAuth is not configured. Please check your environment variables.",
    });
  }

  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
};

exports.googleAuthCallback = (req, res) => {
  // This will be handled by passport
};

exports.googleAuthSuccess = async (req, res) => {
  try {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  } catch (err) {
    console.error("Google auth success error:", err);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ msg: "User with this email does not exist" });
    }

    // Check if user is a local user (has password)
    if (user.authProvider !== "local" || !user.password) {
      return res.status(400).json({
        msg: "Password reset is only available for email/password accounts",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(email, resetToken);

    res.json({ msg: "Password reset email sent successfully" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired reset token" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear reset token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({
      msg: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Add to wishlist with improved duplicate prevention
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  // Validate productId
  if (!productId) {
    return res.status(400).json({ msg: "Product ID is required" });
  }

  try {
    // Use atomic operation to prevent race conditions
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $addToSet: { wishlist: productId }, // $addToSet prevents duplicates automatically
      },
      { new: true }
    )
      .populate({
        path: "wishlist",
        select: "name price images category",
      })
      .select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if the product was actually added (to provide appropriate response)
    const wasAdded = user.wishlist.some(
      (item) => item._id.toString() === productId.toString()
    );

    if (!wasAdded) {
      return res.status(400).json({ msg: "Product already in wishlist" });
    }

    res.json(user);
  } catch (err) {
    console.error("Add to wishlist error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Remove from wishlist with improved error handling
exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.body;

  // Validate productId
  if (!productId) {
    return res.status(400).json({ msg: "Product ID is required" });
  }

  try {
    // Use atomic operation to remove from wishlist
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { wishlist: productId }, // $pull removes all matching elements
      },
      { new: true }
    )
      .populate({
        path: "wishlist",
        select: "name price images category",
      })
      .select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Remove from wishlist error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
