const { readData, findById, updateOne } = require('../utils/fileStore');
const { sanitizeUser } = require('./authController');

function getProfile(req, res, next) {
  try {
    const user = findById('users.json', req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(sanitizeUser(user));
  } catch (e) {
    next(e);
  }
}

function updateProfile(req, res, next) {
  try {
    const user = findById('users.json', req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { name, phone, preferences } = req.body;
    const updates = {};
    if (name != null) updates.name = String(name).trim();
    if (phone != null) updates.phone = phone;
    if (preferences != null) {
      updates.preferences = {
        ...user.preferences,
        ...preferences,
      };
    }
    const updated = updateOne('users.json', user.id, updates);
    res.json(sanitizeUser(updated));
  } catch (e) {
    next(e);
  }
}

function history(req, res, next) {
  try {
    const trips = readData('trips.json').filter((t) => t.userId === req.userId);
    const bookings = readData('bookings.json').filter((b) => b.userId === req.userId);
    const bookingIds = new Set(bookings.map((b) => b.id));
    const payments = readData('payments.json').filter((p) => bookingIds.has(p.bookingId));
    res.json({
      trips: trips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      bookings: bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      payments: payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { getProfile, updateProfile, history };
