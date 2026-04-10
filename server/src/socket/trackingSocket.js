const jwt = require('jsonwebtoken');
const { readData, findByField } = require('../utils/fileStore');

const driverIntervals = new Map();

function clearDriverSim(tripId) {
  const id = driverIntervals.get(tripId);
  if (id) {
    clearInterval(id);
    driverIntervals.delete(tripId);
  }
}

function startDriverSim(io, tripId) {
  if (driverIntervals.has(tripId)) return;
  const bookings = readData('bookings.json').filter(
    (b) => b.tripId === tripId && b.status === 'CONFIRMED'
  );
  if (!bookings.length) return;

  const stops = findByField('stops.json', 'tripId', tripId).sort(
    (a, b) => a.order - b.order
  );
  const pickupStop = stops.find((s) => s.type === 'PICKUP') || stops[0];
  const pickup = pickupStop?.location || { lat: 12.97, lng: 77.59 };

  let dLat = pickup.lat + 0.08;
  let dLng = pickup.lng + 0.08;
  const driverName = bookings[0].driverInfo?.name || 'Yatra Driver';

  const intervalId = setInterval(() => {
    dLat += (pickup.lat - dLat) * 0.12;
    dLng += (pickup.lng - dLng) * 0.12;
    io.to(`trip:${tripId}`).emit('driver:moved', {
      lat: dLat,
      lng: dLng,
      driverName,
    });
  }, 5000);

  driverIntervals.set(tripId, intervalId);
}

function initTrackingSocket(io) {
  io.on('connection', (socket) => {
    socket.on('authenticate', (payload) => {
      try {
        const token = payload?.token;
        if (!token) return;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.join(`user:${decoded.userId}`);
        socket.yatraUserId = decoded.userId;
      } catch {
        /* ignore */
      }
    });

    socket.on('join:trip', ({ tripId }) => {
      if (!tripId) return;
      socket.join(`trip:${tripId}`);
      startDriverSim(io, tripId);
    });

    socket.on('leave:trip', ({ tripId }) => {
      if (tripId) socket.leave(`trip:${tripId}`);
    });

    socket.on('location:update', ({ tripId, lat, lng, timestamp }) => {
      if (!tripId || lat == null || lng == null) return;
      io.to(`trip:${tripId}`).emit('location:changed', {
        lat,
        lng,
        timestamp: timestamp || new Date().toISOString(),
      });
    });
  });
}

module.exports = { initTrackingSocket, clearDriverSim };
