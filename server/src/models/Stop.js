const mongoose = require('mongoose');
const { generateId } = require('../utils/generateId');

const stopSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, index: true, default: generateId },
    tripId: String,
    order: Number,
    name: String,
    address: String,
    location: { lat: Number, lng: Number },
    type: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stop', stopSchema);

