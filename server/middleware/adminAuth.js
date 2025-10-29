const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) token = req.header("x-auth-token");

  if (!token) {
    console.log("❌ Admin auth failed: No token provided");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔍 Admin auth check:", {
      userId: decoded.id,
      role: decoded.role,
    });

    if (decoded.role !== "admin") {
      console.log("❌ Admin auth failed: User is not admin", {
        userId: decoded.id,
        role: decoded.role,
      });
      return res.status(403).json({
        msg: "Access denied: Admin only",
        currentRole: decoded.role,
        requiredRole: "admin",
      });
    }

    req.user = decoded;
    console.log("✅ Admin auth successful:", decoded.id);
    next();
  } catch (err) {
    console.log("❌ Admin auth failed: Invalid token", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
