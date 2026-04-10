const { readData, findById, insertOne, updateOne } = require('../utils/fileStore');

const NIGHT_RATES = { budget: 2000, mid: 4000, luxury: 8000 };

function randomDigits(n) {
  let s = '';
  for (let i = 0; i < n; i += 1) s += Math.floor(Math.random() * 10);
  return s;
}

function confirmationNumber() {
  return `YATRA-HTL-${randomDigits(6)}`;
}

function nightsBetween(checkIn, checkOut) {
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  const diff = Math.ceil((b - a) / 86400000);
  return Math.max(1, diff || 1);
}

function emitNotification(io, userId, message) {
  if (!io) return;
  io.to(`user:${userId}`).emit('notification:new', { message, type: 'BOOKING' });
}

async function createHotelBooking(req, res, next) {
  try {
    const {
      poiId,
      poiName,
      poiType,
      address,
      phone,
      checkIn,
      checkOut,
      bookingDate,
      timeSlot,
      guests,
      specialRequests,
      priceLevel,
      totalCost: clientTotalCost,
      paymentMethod,
    } = req.body;

    if (!poiName || !poiType || (poiType !== 'HOTEL' && poiType !== 'RESTAURANT')) {
      return res.status(400).json({ message: 'poiName and poiType (HOTEL or RESTAURANT) required' });
    }

    const pois = await readData('poi.json');
    const poi = poiId ? pois.find((p) => p.id === poiId) : null;
    const level = priceLevel || poi?.priceLevel || 'mid';

    let totalCost = 0;
    let checkInOut = { checkIn: checkIn || null, checkOut: checkOut || null };
    let restBookingDate = bookingDate || null;
    let restTimeSlot = timeSlot || null;

    if (poiType === 'HOTEL') {
      if (!checkIn || !checkOut) {
        return res.status(400).json({ message: 'checkIn and checkOut required for hotel bookings' });
      }
      if (new Date(checkOut) <= new Date(checkIn)) {
        return res.status(400).json({ message: 'Check-out must be after check-in' });
      }
      const nights = nightsBetween(checkIn, checkOut);
      const rate = NIGHT_RATES[level] ?? NIGHT_RATES.mid;
      totalCost = rate * nights;
    } else {
      totalCost = 0;
      if (!bookingDate) {
        return res.status(400).json({ message: 'bookingDate required for restaurant bookings' });
      }
    }

    // Allow client to pass computed cost for display; never increase server-calculated total.
    if (typeof clientTotalCost === 'number' && clientTotalCost >= 0) {
      totalCost = Math.min(totalCost, clientTotalCost);
    }

    const row = await insertOne('hotelBookings.json', {
      userId: req.userId,
      poiId: poiId || poi?.id || null,
      poiName,
      poiType,
      address: address || poi?.address || '',
      phone: phone || poi?.phone || '',
      priceLevel: level,
      checkIn: checkInOut.checkIn,
      checkOut: checkInOut.checkOut,
      bookingDate: restBookingDate,
      timeSlot: restTimeSlot,
      guests: Math.max(1, Number(guests) || 1),
      specialRequests: specialRequests || '',
      totalCost,
      paymentMethod: paymentMethod || 'unknown',
      status: 'CONFIRMED',
      confirmationNumber: confirmationNumber(),
    });

    const notif = await insertOne('notifications.json', {
      userId: req.userId,
      message:
        poiType === 'HOTEL'
          ? `🏨 YATRA hotel booking confirmed: ${poiName} — ${row.confirmationNumber} (₹${totalCost})`
          : `🍽️ YATRA table reservation: ${poiName} — ${row.confirmationNumber} (free)`,
      type: 'BOOKING',
      read: false,
      sentAt: new Date().toISOString(),
    });

    const io = req.app.get('io');
    emitNotification(io, req.userId, notif.message);

    res.status(201).json(row);
  } catch (e) {
    next(e);
  }
}

async function listHotelBookings(req, res, next) {
  try {
    const list = (await readData('hotelBookings.json')).filter((b) => b.userId === req.userId);
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(list);
  } catch (e) {
    next(e);
  }
}

async function cancelHotelBooking(req, res, next) {
  try {
    const b = await findById('hotelBookings.json', req.params.id);
    if (!b || b.userId !== req.userId) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (b.status === 'CANCELLED') {
      return res.json({ success: true, booking: b });
    }
    const updated = await updateOne('hotelBookings.json', b.id, {
      status: 'CANCELLED',
      cancelledAt: new Date().toISOString(),
    });
    const io = req.app.get('io');
    emitNotification(io, req.userId, `Booking ${b.confirmationNumber} cancelled on YATRA`);
    res.json({ success: true, booking: updated });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  createHotelBooking,
  listHotelBookings,
  cancelHotelBooking,
};
