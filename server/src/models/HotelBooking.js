const mongoose = require('mongoose');
const { generateId } = require('../utils/generateId');

const hotelBookingSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, index: true, default: generateId },
    userId: String,
    poiId: String,
    poiName: String,
    poiType: String,
    address: String,
    phone: String,
    checkIn: String,
    checkOut: String,
    bookingDate: String,
    timeSlot: String,
    guests: Number,
    specialRequests: String,
    totalCost: Number,
    paymentMethod: String,
    confirmationNumber: String,
    status: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('HotelBooking', hotelBookingSchema);

