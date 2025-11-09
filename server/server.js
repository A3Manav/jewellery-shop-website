const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");

dotenv.config();

const passport = require("./config/passport");
const connectDB = require("./config/db");
const app = express();




// Session configuration for Google OAuth


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

// SEO Routes - should be before other routes



    const Product = require("./models/Product");
    const Category = require("./models/Category");

    const [products, categories] = await Promise.all([
      Product.find({ isActive: true }).select("_id updatedAt").lean(),
      Category.find().select("_id name updatedAt").lean(),
    ]);

 





// Add caching headers middleware
app.use("/api", (req, res, next) => {
  // Cache static content for 1 year, API responses for 5 minutes
  if (req.url.includes("products") || req.url.includes("categories")) {
    res.set("Cache-Control", "public, max-age=300"); // 5 minutes
  } else {
    res.set("Cache-Control", "public, max-age=60"); // 1 minute
  }
  res.set("ETag", `"${Date.now()}"`);
  next();
});

const carouselRoutes = require("./routes/carousel");

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/rates", require("./routes/rates"));
app.use("/api/marriage-bookings", require("./routes/marriageBookings"));
app.use("/api/users", require("./routes/users")); // New route for user management
app.use("/api/carousel", carouselRoutes);
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/editorials", require("./routes/editorials")); // Editorial routes
app.use("/api/admin", require("./routes/admin")); // Admin dashboard routes
app.use("/api/contacts", require("./routes/contacts")); // Contact form routes
app.use("/api/newsletter", require("./routes/newsletter")); // Newsletter routes
app.use("/api/addresses", require("./routes/addresses")); // Saved addresses routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
