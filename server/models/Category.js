const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['Jewelry', 'Pot Items', 'Fashion Products', 'Gift Items', 'Custom Printed Products'],
        default: 'Jewelry',
    },
    image: {
        url: String,
        public_id: String,
    },
}, { timestamps: true });

// Add index for better performance on type-based queries
categorySchema.index({ type: 1, name: 1 });

module.exports = mongoose.model('Category', categorySchema);