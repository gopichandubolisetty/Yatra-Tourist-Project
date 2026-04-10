const mongoose = require('mongoose');
const { generateId } = require('../utils/generateId');

const poiSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, index: true, default: generateId },
    name: String,
    category: String,
    address: String,
    location: { lat: Number, lng: Number },
    rating: Number,
    reviewCount: Number,
    priceLevel: String,
    phone: String,
    cuisine: String,
    city: String,
    photoUrl: String,
    openNow: Boolean,
    amenities: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('POI', poiSchema);

