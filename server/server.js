const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");

dotenv.config();

const passport = require("./config/passport");
const connectDB = require("./config/db");
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://abhushankalakendra.vercel.app"], // your frontend origin
    credentials: true, // allow cookies and auth headers
  })
);

// Session configuration for Google OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret-key-here",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      httpOnly: true, // Prevent XSS attacks
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

// SEO Routes - should be before other routes
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /checkout
Disallow: /profile
Disallow: /login
Disallow: /register
Disallow: /reset-password
Disallow: /verify-email

# Performance optimization
Crawl-delay: 1

# Sitemap
Sitemap: https://abhushankalakendra.vercel.app/sitemap.xml`);
});

app.get("/sitemap.xml", async (req, res) => {
  try {
    const baseUrl = "https://abhushankalakendra.vercel.app";

    // Static pages
    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/store", priority: "0.9", changefreq: "daily" },
      { url: "/marriage-booking", priority: "0.8", changefreq: "weekly" },
      { url: "/contact-us", priority: "0.7", changefreq: "monthly" },
      { url: "/terms-and-conditions", priority: "0.5", changefreq: "yearly" },
      { url: "/refund-return-policy", priority: "0.5", changefreq: "yearly" },
    ];

    // Fetch products and categories for dynamic URLs
    const Product = require("./models/Product");
    const Category = require("./models/Category");

    const [products, categories] = await Promise.all([
      Product.find({ isActive: true }).select("_id updatedAt").lean(),
      Category.find().select("_id name updatedAt").lean(),
    ]);

    // Generate sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static pages
    staticPages.forEach((page) => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Add category pages
    categories.forEach((category) => {
      sitemap += `
  <url>
    <loc>${baseUrl}/store?category=${category._id}</loc>
    <lastmod>${category.updatedAt.toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Add product pages
    products.forEach((product) => {
      sitemap += `
  <url>
    <loc>${baseUrl}/product/${product._id}</loc>
    <lastmod>${product.updatedAt.toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    res.type("application/xml");
    res.send(sitemap);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
});

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
