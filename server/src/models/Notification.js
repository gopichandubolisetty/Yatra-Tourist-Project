const mongoose = require('mongoose');
const { generateId } = require('../utils/generateId');

const notificationSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, index: true, default: generateId },
    userId: String,
    type: String,
    message: String,
    read: Boolean,
    sentAt: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);

