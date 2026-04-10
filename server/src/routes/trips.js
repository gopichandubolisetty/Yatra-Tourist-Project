const express = require('express');
const {
  createTrip,
  listTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  mockRoute,
} = require('../controllers/tripController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.post('/', createTrip);
router.get('/', listTrips);
router.get('/:id', getTrip);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);
router.post('/:id/route', mockRoute);

module.exports = router;
