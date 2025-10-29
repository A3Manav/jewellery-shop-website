const Address = require("../models/Address");

// Get all addresses for logged-in user
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort({
      isDefault: -1,
      createdAt: -1,
    });
    res.json(addresses);
  } catch (err) {
    console.error("Get addresses error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Create new address
exports.createAddress = async (req, res) => {
  try {
    const {
      type,
      firstName,
      lastName,
      phone,
      street,
      apartment,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    // Validation
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !street ||
      !city ||
      !state ||
      !pincode
    ) {
      return res
        .status(400)
        .json({ msg: "Please provide all required fields" });
    }

    const address = new Address({
      user: req.user.id,
      type: type || "home",
      firstName,
      lastName,
      phone,
      street,
      apartment,
      city,
      state,
      pincode,
      isDefault: isDefault || false,
    });

    await address.save();
    res.json(address);
  } catch (err) {
    console.error("Create address error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ msg: "Address not found" });
    }

    // Check if address belongs to user
    if (address.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const {
      type,
      firstName,
      lastName,
      phone,
      street,
      apartment,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    // Update fields
    if (type) address.type = type;
    if (firstName) address.firstName = firstName;
    if (lastName) address.lastName = lastName;
    if (phone) address.phone = phone;
    if (street) address.street = street;
    if (apartment !== undefined) address.apartment = apartment;
    if (city) address.city = city;
    if (state) address.state = state;
    if (pincode) address.pincode = pincode;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();
    res.json(address);
  } catch (err) {
    console.error("Update address error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ msg: "Address not found" });
    }

    // Check if address belongs to user
    if (address.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await address.deleteOne();
    res.json({ msg: "Address deleted successfully" });
  } catch (err) {
    console.error("Delete address error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Set default address
exports.setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ msg: "Address not found" });
    }

    // Check if address belongs to user
    if (address.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // Set all addresses to non-default
    await Address.updateMany(
      { user: req.user.id },
      { $set: { isDefault: false } }
    );

    // Set this address as default
    address.isDefault = true;
    await address.save();

    res.json(address);
  } catch (err) {
    console.error("Set default address error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
