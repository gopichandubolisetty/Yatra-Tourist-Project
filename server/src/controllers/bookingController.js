const { v4: uuidv4 } = require('uuid');
const {
  readData,
  findById,
  insertOne,
  updateOne,
  findByField,
} = require('../utils/fileStore');
const { tripDistanceKm } = require('./tripController');

const PROVIDERS = [
  {
    provider: 'YatraRide',
    vehicleType: 'Sedan',
    multiplier: 1.0,
    eta: '8 min',
    rating: 4.7,
    logo: '🚗',
  },
  {
    provider: 'SwiftCab',
    vehicleType: 'SUV',
    multiplier: 1.4,
    eta: '5 min',
    rating: 4.5,
    logo: '🚙',
  },
  {
    provider: 'BharatDrive',
    vehicleType: 'Van',
    multiplier: 1.7,
    eta: '12 min',
    rating: 4.9,
    logo: '🚐',
  },
];

function priceCab(distanceKm, multiplier) {
  return Math.round(50 + distanceKm * 12 * multiplier);
}

function priceAuto(distanceKm) {
  return Math.round(30 + distanceKm * 8);
}

async function getTripDistance(tripId) {
  const stops = (await findByField('stops.json', 'tripId', tripId)).sort(
    (a, b) => a.order - b.order
  );
  if (stops.length < 2) return 5;
  return tripDistanceKm(stops) || 5;
}

function buildOptions(distanceKm) {
  const options = PROVIDERS.map((p) => ({
    ...p,
    cost: priceCab(distanceKm, p.multiplier),
    currency: 'INR',
  }));
  if (distanceKm < 20) {
    options.push({
      provider: 'YatraRide',
      vehicleType: 'Auto',
      multiplier: 1,
      eta: '4 min',
      rating: 4.6,
      logo: '🛺',
      cost: priceAuto(distanceKm),
      currency: 'INR',
    });
  }
  return options;
}

function emitNotification(io, userId, payload) {
  if (!io) return;
  io.to(`user:${userId}`).emit('notification:new', payload);
}

async function createOrPreviewBooking(req, res, next) {
  try {
    const { tripId, preview } = req.body;
    if (!tripId) {
      return res.status(400).json({ message: 'tripId required' });
    }
    const trip = await findById('trips.json', tripId);
    if (!trip || trip.userId !== req.userId) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    const distanceKm = await getTripDistance(tripId);
    const options = buildOptions(distanceKm);

    if (preview) {
      return res.json({ distanceKm, options });
    }

    const { provider, vehicleType, pickupTime, cost } = req.body;
    if (!provider || !vehicleType) {
      return res.status(400).json({
        message: 'provider and vehicleType required (or use preview: true for options)',
      });
    }
    const match = options.find(
      (o) => o.provider === provider && o.vehicleType === vehicleType
    );
    const finalCost = match ? match.cost : cost != null ? Number(cost) : priceCab(distanceKm, 1);

    const booking = await insertOne('bookings.json', {
      tripId,
      userId: req.userId,
      provider,
      vehicleType,
      cost: finalCost,
      status: 'PENDING',
      pickupTime: pickupTime || new Date().toISOString(),
      driverInfo: {
        name: '',
        phone: '',
        vehicle: '',
        plate: '',
        rating: 0,
      },
    });

    const io = req.app.get('io');
    const notif = await insertOne('notifications.json', {
      userId: req.userId,
      message: `Booking created with ${provider} on YATRA — complete payment to confirm`,
      type: 'RIDE',
      read: false,
      sentAt: new Date().toISOString(),
    });
    emitNotification(io, req.userId, {
      message: notif.message,
      type: notif.type,
    });

    res.status(201).json({ ...booking, rideOptions: options });
  } catch (e) {
    next(e);
  }
}

async function listBookings(req, res, next) {
  try {
    const list = (await readData('bookings.json')).filter((b) => b.userId === req.userId);
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(list);
  } catch (e) {
    next(e);
  }
}

async function getBooking(req, res, next) {
  try {
    const b = await findById('bookings.json', req.params.id);
    if (!b || b.userId !== req.userId) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const trip = await findById('trips.json', b.tripId);
    res.json({ ...b, trip: trip || null });
  } catch (e) {
    next(e);
  }
}

async function cancelBooking(req, res, next) {
  try {
    const b = await findById('bookings.json', req.params.id);
    if (!b || b.userId !== req.userId) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const payments = (await readData('payments.json')).filter((p) => p.bookingId === b.id);
    const paid = payments.some((p) => p.status === 'SUCCESS');
    if (paid) {
      await insertOne('payments.json', {
        bookingId: b.id,
        amount: b.cost,
        status: 'SUCCESS',
        method: 'refund',
        transactionId: `YATRA-REFUND-${uuidv4().slice(0, 8)}`,
        gateway: 'YatraPay',
        note: 'Refund processed (mock)',
      });
    }
    await updateOne('bookings.json', b.id, { status: 'CANCELLED' });
    const io = req.app.get('io');
    emitNotification(io, req.userId, {
      message: `Your Yatra booking with ${b.provider} was cancelled`,
      type: 'RIDE',
    });
    res.json({ success: true, refunded: paid });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  createOrPreviewBooking,
  listBookings,
  getBooking,
  cancelBooking,
  buildOptions,
  getTripDistance,
};
