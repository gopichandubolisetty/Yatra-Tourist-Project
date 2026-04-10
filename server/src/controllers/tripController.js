const { readData, findById, insertOne, updateOne, findByField } = require('../utils/fileStore');

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function tripDistanceKm(stops) {
  const sorted = [...stops].sort((a, b) => a.order - b.order);
  let km = 0;
  for (let i = 1; i < sorted.length; i++) {
    const a = sorted[i - 1].location;
    const b = sorted[i].location;
    if (a && b) km += haversineKm(a.lat, a.lng, b.lat, b.lng);
  }
  return Math.round(km * 100) / 100;
}

function interpolateRoute(stops) {
  const sorted = [...stops].sort((a, b) => a.order - b.order);
  const waypoints = [];
  const segments = 8;
  for (let i = 0; i < sorted.length - 1; i++) {
    const A = sorted[i].location;
    const B = sorted[i + 1].location;
    if (!A || !B) continue;
    for (let s = 0; s <= segments; s++) {
      const t = s / segments;
      waypoints.push({
        lat: A.lat + (B.lat - A.lat) * t,
        lng: A.lng + (B.lng - A.lng) * t,
      });
    }
  }
  return waypoints;
}

async function createTrip(req, res, next) {
  try {
    const { name, startTime, endTime, estimatedCost, stops: stopInput, currentLocation } =
      req.body;
    if (!name || !startTime || !endTime) {
      return res.status(400).json({ message: 'Trip name and dates required' });
    }
    const stopsArr = Array.isArray(stopInput) ? stopInput : [];
    if (stopsArr.length > 5) {
      return res.status(400).json({ message: 'Maximum 5 stops allowed on YATRA' });
    }
    const trip = await insertOne('trips.json', {
      userId: req.userId,
      name: String(name).trim(),
      startTime,
      endTime,
      status: 'PLANNED',
      estimatedCost: estimatedCost != null ? Number(estimatedCost) : 0,
      currentLocation: currentLocation || { lat: 0, lng: 0 },
    });
    await Promise.all(
      stopsArr.map((s, idx) =>
        insertOne('stops.json', {
          tripId: trip.id,
          order: s.order != null ? s.order : idx + 1,
          name: s.name || `Stop ${idx + 1}`,
          address: s.address || '',
          location: s.location || { lat: 0, lng: 0 },
          type: s.type || 'WAYPOINT',
        })
      )
    );
    await insertOne('notifications.json', {
      userId: req.userId,
      message: `🗺️ Your Yatra trip ${trip.name} has been planned!`,
      type: 'RIDE',
      read: false,
      sentAt: new Date().toISOString(),
    });
    const allStops = await findByField('stops.json', 'tripId', trip.id);
    res.status(201).json({ ...trip, stops: allStops.sort((a, b) => a.order - b.order) });
  } catch (e) {
    next(e);
  }
}

async function listTrips(req, res, next) {
  try {
    const [tripsAll, stops] = await Promise.all([readData('trips.json'), readData('stops.json')]);
    const trips = tripsAll.filter((t) => t.userId === req.userId);
    const withStops = trips.map((t) => ({
      ...t,
      stops: stops.filter((s) => s.tripId === t.id).sort((a, b) => a.order - b.order),
    }));
    withStops.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(withStops);
  } catch (e) {
    next(e);
  }
}

async function getTrip(req, res, next) {
  try {
    const trip = await findById('trips.json', req.params.id);
    if (!trip || trip.userId !== req.userId) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    const stops = (await findByField('stops.json', 'tripId', trip.id)).sort(
      (a, b) => a.order - b.order
    );
    const bookings = (await readData('bookings.json')).filter(
      (b) => b.tripId === trip.id && b.userId === req.userId
    );
    res.json({ ...trip, stops, bookings });
  } catch (e) {
    next(e);
  }
}

async function updateTrip(req, res, next) {
  try {
    const trip = await findById('trips.json', req.params.id);
    if (!trip || trip.userId !== req.userId) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    const allowed = ['name', 'startTime', 'endTime', 'status', 'estimatedCost', 'currentLocation'];
    const updates = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });
    const updated = await updateOne('trips.json', trip.id, updates);
    const stops = (await findByField('stops.json', 'tripId', trip.id)).sort(
      (a, b) => a.order - b.order
    );
    res.json({ ...updated, stops });
  } catch (e) {
    next(e);
  }
}

async function deleteTrip(req, res, next) {
  try {
    const trip = await findById('trips.json', req.params.id);
    if (!trip || trip.userId !== req.userId) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    await updateOne('trips.json', trip.id, { status: 'CANCELLED' });
    res.json({ success: true, message: 'Trip cancelled on YATRA' });
  } catch (e) {
    next(e);
  }
}

async function mockRoute(req, res, next) {
  try {
    const trip = await findById('trips.json', req.params.id);
    if (!trip || trip.userId !== req.userId) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    const stops = (await findByField('stops.json', 'tripId', trip.id)).sort(
      (a, b) => a.order - b.order
    );
    if (stops.length < 2) {
      return res.json({
        waypoints: [],
        totalDistance: 0,
        estimatedDuration: 0,
      });
    }
    const totalDistance = tripDistanceKm(stops);
    const estimatedDuration = Math.round(totalDistance * 2.5 + 5);
    res.json({
      waypoints: interpolateRoute(stops),
      totalDistance,
      estimatedDuration,
    });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  createTrip,
  listTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  mockRoute,
  tripDistanceKm,
  haversineKm,
};
