const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ url: String, public_id: String }],
    description: { type: String },
    type: {
        type: String,
        required: true,
        enum: ['Jewelry', 'Pot Items', 'Fashion Products', 'Gift Items']
    },
    trending: { type: Boolean, default: false },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    discriminatorKey: 'type',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual to populate reviews
productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product'
});

const Product = mongoose.model('Product', productSchema);

// Jewelry specific schema
const Jewelry = Product.discriminator('Jewelry', new mongoose.Schema({
    weight: { type: Number, required: true },
    hallmarked: { type: Boolean, default: false },
    attributes: {
        material: { type: String, required: true },
        gemstone: { type: String },
        purity: { type: String, required: true }
    }
}));

// Pot Items specific schema
const PotItem = Product.discriminator('Pot Items', new mongoose.Schema({
    attributes: {
        material: { type: String, required: true },
        capacity: { type: String },
        type: { type: String }
    }
}));

// Fashion Products specific schema
const FashionProduct = Product.discriminator('Fashion Products', new mongoose.Schema({
    attributes: {
        fabric: { type: String, required: true },
        brand: { type: String },
        size: { type: String, required: true },
        color: { type: String, required: true },
        pattern: { type: String }
    }
}));

// Gift Items specific schema
const GiftItem = Product.discriminator('Gift Items', new mongoose.Schema({
    attributes: {
        customization: { type: String, required: true },
        occasion: { type: String },
        personalizationOptions: { type: String },
        giftType: { type: String }
    }
}));

module.exports = Product;