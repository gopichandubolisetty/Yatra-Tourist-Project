const { readData } = require('../utils/fileStore');

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

function nearby(req, res, next) {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ message: 'lat and lng query params required' });
    }
    const type = (req.query.type || 'ALL').toUpperCase();
    const radius = parseFloat(req.query.radius) || 10;
    const minRating = parseFloat(req.query.minRating) || 0;
    const cuisine = req.query.cuisine;
    const priceLevel = req.query.priceLevel;

    let pois = readData('poi.json');
    pois = pois.map((p) => ({
      ...p,
      distanceKm: haversineKm(lat, lng, p.location.lat, p.location.lng),
    }));

    pois = pois.filter((p) => p.distanceKm <= radius && p.rating >= minRating);

    if (type === 'HOTEL') pois = pois.filter((p) => p.category === 'HOTEL');
    else if (type === 'RESTAURANT') pois = pois.filter((p) => p.category === 'RESTAURANT');

    if (priceLevel) {
      pois = pois.filter((p) => p.priceLevel === priceLevel);
    }
    if (cuisine) {
      const c = String(cuisine).toLowerCase();
      pois = pois.filter(
        (p) => p.category === 'RESTAURANT' && String(p.cuisine || '').toLowerCase().includes(c)
      );
    }

    pois.sort((a, b) => b.rating - a.rating || a.distanceKm - b.distanceKm);
    res.json(pois);
  } catch (e) {
    next(e);
  }
}

module.exports = { nearby, haversineKm };
