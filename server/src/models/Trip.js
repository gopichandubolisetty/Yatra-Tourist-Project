const mongoose = require('mongoose');
const { generateId } = require('../utils/generateId');

const tripSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, index: true, default: generateId },
    userId: String,
    name: String,
    startTime: String,
    endTime: String,
    status: String,
    estimatedCost: Number,
    currentLocation: { lat: Number, lng: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);

