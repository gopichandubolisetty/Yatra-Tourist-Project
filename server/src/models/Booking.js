const mongoose = require('mongoose');
const { generateId } = require('../utils/generateId');

const bookingSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, index: true, default: generateId },
    tripId: String,
    userId: String,
    provider: String,
    vehicleType: String,
    cost: Number,
    status: String,
    pickupTime: String,
    driverInfo: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);

