const { v4: uuidv4 } = require('uuid');
const { readData, findById, insertOne, updateOne, findByField } = require('../utils/fileStore');

const DRIVER_NAMES = [
  'Ravi Kumar',
  'Suresh Babu',
  'Mohammed Salim',
  'Priya Sharma',
  'Arjun Reddy',
  'Lakshmi Devi',
  'Vijay Singh',
  'Anita Patel',
  'Rahul Gupta',
  'Kavitha Nair',
];

const VEHICLES = [
  'Honda City - White',
  'Maruti Swift - Silver',
  'Toyota Innova - Grey',
  'Hyundai Creta - Blue',
  'Tata Nexon - Red',
  'Mahindra XUV300 - Black',
  'Maruti Ertiga - White',
];

const NEAR_LABELS = ['Benz Circle', 'MG Road', 'City Center', 'Railway Station', 'Bus Stand', 'IT SEZ'];

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomIndianMobile() {
  const first = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
  const rest = String(Math.floor(100000000 + Math.random() * 900000000));
  const num = `${first}${rest}`.slice(0, 10);
  return `+91 ${num.slice(0, 5)} ${num.slice(5)}`;
}

function randomPlate() {
  const st = randomPick(['AP', 'TS', 'KA', 'TN', 'MH', 'DL']);
  const dist = String(Math.floor(10 + Math.random() * 89)).padStart(2, '0');
  const a = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const b = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const num = String(Math.floor(1000 + Math.random() * 9000));
  return `${st} ${dist} ${a}${b} ${num}`;
}

/**
 * Rich driver assignment for post-payment UX (pickup-based location offset).
 */
function generateDriverInfo(booking) {
  const trip = findById('trips.json', booking.tripId);
  const stops = findByField('stops.json', 'tripId', booking.tripId).sort((a, b) => a.order - b.order);
  const pickup = stops.find((s) => s.type === 'PICKUP') || stops[0];
  const baseLat = pickup?.location?.lat ?? trip?.currentLocation?.lat ?? 16.5062;
  const baseLng = pickup?.location?.lng ?? trip?.currentLocation?.lng ?? 80.648;
  const parts = (pickup?.address || '').split(',').map((x) => x.trim()).filter(Boolean);
  const cityName = parts.length >= 2 ? parts[parts.length - 2] : parts[parts.length - 1] || 'Vijayawada';

  const name = randomPick(DRIVER_NAMES);
  const rating = 4.2 + Math.random() * 0.69;
  const offsetLat = (Math.random() * 0.02 + 0.01) * (Math.random() < 0.5 ? -1 : 1);
  const offsetLng = (Math.random() * 0.02 + 0.01) * (Math.random() < 0.5 ? -1 : 1);

  return {
    name,
    vehicle: randomPick(VEHICLES),
    plate: randomPlate(),
    phone: randomIndianMobile(),
    rating: Math.round(rating * 10) / 10,
    photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    eta: `${Math.floor(5 + Math.random() * 8)} minutes`,
    currentLocation: {
      lat: Math.round((baseLat + offsetLat) * 1e6) / 1e6,
      lng: Math.round((baseLng + offsetLng) * 1e6) / 1e6,
    },
    locationName: `Near ${randomPick(NEAR_LABELS)}, ${cityName}`,
  };
}

function emitNotification(io, userId, payload) {
  if (!io) return;
  io.to(`user:${userId}`).emit('notification:new', payload);
}

function emitBookingUpdated(io, bookingId, status) {
  if (!io) return;
  io.emit('booking:updated', { bookingId, status });
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function processPayment(req, res, next) {
  try {
    const { bookingId, amount, method, cardLast4, upiId } = req.body;
    if (!bookingId || amount == null || !method) {
      return res.status(400).json({ message: 'bookingId, amount, and method required' });
    }
    const booking = findById('bookings.json', bookingId);
    if (!booking || booking.userId !== req.userId) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await delay(1500);

    const success = Math.random() < 0.95;
    const txnId = `YATRA-TXN-${uuidv4()}`;

    if (!success) {
      insertOne('payments.json', {
        bookingId,
        amount: Number(amount),
        status: 'FAILED',
        method,
        transactionId: txnId,
        gateway: 'YatraPay',
        meta: { cardLast4, upiId },
      });
      return res.status(402).json({
        message: 'Payment failed — please try another method on YATRA',
        success: false,
      });
    }

    insertOne('payments.json', {
      bookingId,
      amount: Number(amount),
      status: 'SUCCESS',
      method,
      transactionId: txnId,
      gateway: 'YatraPay',
      meta: { cardLast4, upiId },
    });

    const driverInfo = generateDriverInfo(booking);

    updateOne('bookings.json', bookingId, {
      status: 'CONFIRMED',
      driverInfo,
    });

    const amt = Number(amount);
    const msg = `🎉 Yatra Ride Confirmed! Driver ${driverInfo.name} is on the way in ${driverInfo.vehicle} (₹${amt} paid)`;
    const notif = insertOne('notifications.json', {
      userId: req.userId,
      message: msg,
      type: 'RIDE',
      read: false,
      sentAt: new Date().toISOString(),
    });

    insertOne('notifications.json', {
      userId: req.userId,
      message: `✅ Payment of ₹${amt} received. Transaction ID: ${txnId}`,
      type: 'RIDE',
      read: false,
      sentAt: new Date().toISOString(),
    });

    const io = req.app.get('io');
    emitNotification(io, req.userId, { message: notif.message, type: 'RIDE' });
    emitBookingUpdated(io, bookingId, 'CONFIRMED');

    res.json({
      success: true,
      transactionId: txnId,
      amount: amt,
      bookingId: booking.id,
      tripId: booking.tripId,
      driverInfo,
      message: 'Payment successful via YatraPay',
    });
  } catch (e) {
    next(e);
  }
}

function listPayments(req, res, next) {
  try {
    const myBookingIds = new Set(
      readData('bookings.json').filter((b) => b.userId === req.userId).map((b) => b.id)
    );
    const payments = readData('payments.json').filter((p) => myBookingIds.has(p.bookingId));
    payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(payments);
  } catch (e) {
    next(e);
  }
}

module.exports = { processPayment, listPayments, generateDriverInfo };
