const mongoose = require('mongoose');
const { generateId } = require('../utils/generateId');

const paymentSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, index: true, default: generateId },
    bookingId: String,
    amount: Number,
    method: String,
    status: String,
    gateway: String,
    transactionId: String,
    meta: Object,
    note: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);

