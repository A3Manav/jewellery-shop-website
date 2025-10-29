const mongoose = require('mongoose');

const marriageBookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Made optional for guest bookings
    productType: { type: String, required: true },
    eventDate: { type: Date, required: true },
    message: { type: String }, // Special requirements and preferences
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    budgetRange: {
        type: String,
        enum: ['', 'under-50k', '50k-1l', '1l-2l', '2l-5l', 'above-5l'],
        default: ''
    },
    numberOfItems: {
        type: String,
        enum: ['', '1-5', '6-10', '11-20', '20+'],
        default: ''
    },
    customDesignRequest: { type: Boolean, default: false },
    preferredContactMethod: {
        type: String,
        enum: ['phone', 'whatsapp', 'email'],
        default: 'phone'
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    // Legacy fields (kept for backward compatibility)
    items: [{
        name: { type: String },
        type: { type: String },
        quantity: { type: Number, min: 1 },
        description: { type: String },
    }],
    goldWeight: { type: Number },
    silverWeight: { type: Number },
    details: { type: String }, // Legacy field - now using 'message'
    whatsapp: { type: String } // Legacy field
}, { timestamps: true });

module.exports = mongoose.model('MarriageBooking', marriageBookingSchema);