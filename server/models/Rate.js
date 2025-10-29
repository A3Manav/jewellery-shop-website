const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
    goldRate: { type: Number, required: true },
    silverRate: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Rate', rateSchema);