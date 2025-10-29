const Product = require('../models/Product');
const crypto = require('crypto');

// Helper function to process product data
const processProductData = (req, type) => {
    const baseData = {
        productId: crypto.randomBytes(5).toString('hex').slice(0, 9),
        title: req.body.title,
        price: parseFloat(req.body.price),
        discount: parseFloat(req.body.discount) || 0,
        category: req.body.category,
        description: req.body.description,
        type: type,
        trending: req.body.trending === 'true' || req.body.trending === true
    };

    const images = req.files?.map(file => ({
        url: file.path,
        public_id: file.filename
    })) || [];

    return { baseData, images };
};

// Helper to parse attributes if needed
function parseAttributes(req) {
    if (req.body.attributes && typeof req.body.attributes === 'string') {
        try {
            req.body.attributes = JSON.parse(req.body.attributes);
        } catch (e) {
            throw new Error('Invalid attributes JSON');
        }
    }
}

// Create Jewelry Product
exports.createJewelry = async (req, res) => {
    try {
        parseAttributes(req);
        const { baseData, images } = processProductData(req, 'Jewelry');
        const attrs = req.body.attributes || {};
        const jewelryData = {
            ...baseData,
            weight: parseFloat(req.body.weight),
            hallmarked: req.body.hallmarked === 'true' || req.body.hallmarked === true,
            attributes: {
                material: attrs.material,
                gemstone: attrs.gemstone,
                purity: attrs.purity
            },
            images
        };
        const product = new Product(jewelryData);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Create Pot Item
exports.createPotItem = async (req, res) => {
    try {
        parseAttributes(req);
        const { baseData, images } = processProductData(req, 'Pot Items');
        const attrs = req.body.attributes || {};
        const potItemData = {
            ...baseData,
            attributes: {
                material: attrs.material,
                capacity: attrs.capacity,
                type: attrs.type
            },
            images
        };
        const product = new Product(potItemData);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Create Fashion Product
exports.createFashionProduct = async (req, res) => {
    try {
        parseAttributes(req);
        const { baseData, images } = processProductData(req, 'Fashion Products');
        const attrs = req.body.attributes || {};
        const fashionData = {
            ...baseData,
            attributes: {
                fabric: attrs.fabric,
                brand: attrs.brand,
                size: attrs.size,
                color: attrs.color,
                pattern: attrs.pattern
            },
            images
        };
        const product = new Product(fashionData);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Create Gift Item
exports.createGiftItem = async (req, res) => {
    try {
        parseAttributes(req);
        const { baseData, images } = processProductData(req, 'Gift Items');
        const attrs = req.body.attributes || {};
        const giftData = {
            ...baseData,
            attributes: {
                customization: attrs.customization,
                occasion: attrs.occasion,
                personalizationOptions: attrs.personalizationOptions,
                giftType: attrs.giftType
            },
            images
        };
        const product = new Product(giftData);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Create Product (Unified Endpoint)
exports.createProduct = async (req, res) => {
    const type = req.body.type;
    if (type === 'Jewelry') return exports.createJewelry(req, res);
    if (type === 'Pot Items') return exports.createPotItem(req, res);
    if (type === 'Fashion Products') return exports.createFashionProduct(req, res);
    if (type === 'Gift Items') return exports.createGiftItem(req, res);
    return res.status(400).json({ error: 'Invalid product type' });
};

// Get all products with filtering
// Get all products with filtering
exports.getProducts = async (req, res) => {
    try {
        const { type, category, search, minPrice, maxPrice, sort, trending } = req.query;
        const query = {};

        if (type) {
            const types = type.split(',').map(t => t.trim());
            query.type = types.length > 1 ? { $in: types } : types[0];
        }
        if (category) query.category = category;
        if (trending) query.trending = trending === 'true';
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { productId: { $regex: search, $options: 'i' } }
            ];
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        let sortOption = {};
        if (sort === 'price-asc') sortOption.price = 1;
        else if (sort === 'price-desc') sortOption.price = -1;
        else if (sort === 'newest' || trending) sortOption.createdAt = -1;

        const products = await Product.find(query)
            .sort(sortOption)
            .populate('category');

        res.json(products);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// Get single product
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update common fields
        product.title = req.body.title || product.title;
        product.price = parseFloat(req.body.price) || product.price;
        product.discount = parseFloat(req.body.discount) || product.discount;
        product.category = req.body.category || product.category;
        product.description = req.body.description || product.description;
        product.trending = req.body.trending === 'true' || req.body.trending === true || product.trending;

        // Update type-specific fields
        if (product.type === 'Jewelry') {
            product.weight = parseFloat(req.body.weight) || product.weight;
            product.hallmarked = req.body.hallmarked === 'true' || req.body.hallmarked === true || product.hallmarked;
            product.attributes.material = req.body.material || product.attributes.material;
            product.attributes.gemstone = req.body.gemstone || product.attributes.gemstone;
            product.attributes.purity = req.body.purity || product.attributes.purity;
        } else if (product.type === 'Pot Items') {
            product.attributes.material = req.body.material || product.attributes.material;
            product.attributes.capacity = req.body.capacity || product.attributes.capacity;
            product.attributes.type = req.body.type || product.attributes.type;
        } else if (product.type === 'Fashion Products') {
            product.attributes.fabric = req.body.fabric || product.attributes.fabric;
            product.attributes.brand = req.body.brand || product.attributes.brand;
            product.attributes.size = req.body.size || product.attributes.size;
            product.attributes.color = req.body.color || product.attributes.color;
            product.attributes.pattern = req.body.pattern || product.attributes.pattern;
        } else if (product.type === 'Gift Items') {
            product.attributes.customization = req.body.customization || product.attributes.customization;
            product.attributes.occasion = req.body.occasion || product.attributes.occasion;
            product.attributes.personalizationOptions = req.body.personalizationOptions || product.attributes.personalizationOptions;
            product.attributes.giftType = req.body.giftType || product.attributes.giftType;
        }

        // Update images if new ones are provided
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                url: file.path,
                public_id: file.filename
            }));
            product.images = newImages;
        }

        product.updatedAt = Date.now();
        await product.save();

        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};