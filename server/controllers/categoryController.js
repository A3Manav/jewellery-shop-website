const Category = require("../models/Category");
const cloudinary = require("../utils/cloudinary");

// Create category with type
exports.createCategory = async (req, res) => {
  try {
    console.log("📝 Create category request:", {
      body: req.body,
      file: req.file
        ? { filename: req.file.originalname, size: req.file.size }
        : null,
      user: req.user?.id,
    });

    const { name, type } = req.body;

    // Validate input
    if (!name || !type) {
      console.log("❌ Validation failed:", { name, type });
      return res.status(400).json({
        msg: "Name and type are required",
        received: { name, type },
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name, type });
    if (existingCategory) {
      console.log("❌ Category already exists:", { name, type });
      return res
        .status(400)
        .json({ msg: "Category already exists for this type" });
    }

    // Upload image if provided
    let imageData = {};
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "categories",
      });
      imageData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const category = new Category({
      name,
      type,
      image: imageData,
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error("Create error:", err.message, err.stack);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get all categories with optional type filter
exports.getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type === "non-jewelry") query.type = { $ne: "Jewelry" };
    else if (type) query.type = type;

    const categories = await Category.find(query).sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    console.error("Get categories error:", err.message, err.stack);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    // Check for duplicate name in the same type
    if (name && type) {
      const existingCategory = await Category.findOne({
        name,
        type,
        _id: { $ne: req.params.id },
      });
      if (existingCategory) {
        return res
          .status(400)
          .json({ msg: "Category name already exists for this type" });
      }
    }

    // Update image if provided
    if (req.file) {
      if (category.image.public_id) {
        await cloudinary.uploader.destroy(category.image.public_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "categories",
      });
      category.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // Update fields
    category.name = name || category.name;
    category.type = type || category.type;
    category.updatedAt = Date.now();

    await category.save();
    res.json(category);
  } catch (err) {
    console.error("Update error:", err.message, err.stack);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    // Delete image from Cloudinary if exists
    if (category.image.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id);
    }

    await category.deleteOne();
    res.json({ msg: "Category deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err.message, err.stack);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    console.error("Get category error:", err.message, err.stack);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Invalid category ID format" });
    }
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.getCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    if (!type) {
      return res.status(400).json({ msg: "Type is required" });
    }

    // 👇 Add 'image' to the selected fields
    const categories = await Category.find({ type })
      .select("name _id image")
      .sort({ name: 1 });

    res.json(categories);
  } catch (err) {
    console.error("Get categories by type error:", err.message, err.stack);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
