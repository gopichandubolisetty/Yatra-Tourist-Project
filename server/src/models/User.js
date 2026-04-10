const mongoose = require('mongoose');
const { generateId } = require('../utils/generateId');

const userSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, index: true, default: generateId },
    name: String,
    email: { type: String, unique: true },
    phone: String,
    passwordHash: String,
    preferences: {
      cuisine: [String],
      priceLevel: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

