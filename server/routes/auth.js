const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const authController = require("../controllers/authController");

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  authController.register
);

router.post("/login", authController.login);
router.get("/profile", auth, authController.getProfile);
router.put("/profile", auth, authController.updateProfile);

// Email verification routes
router.get("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);

// Google OAuth routes
router.get("/google", authController.googleAuth);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/auth/error`,
  }),
  authController.googleAuthSuccess
);

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Wishlist routes
router.post("/wishlist/add", auth, authController.addToWishlist);
router.post("/wishlist/remove", auth, authController.removeFromWishlist);

module.exports = router;
