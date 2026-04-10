const express = require('express');
const {
  createHotelBooking,
  listHotelBookings,
  cancelHotelBooking,
} = require('../controllers/hotelBookingController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.post('/', createHotelBooking);
router.get('/', listHotelBookings);
router.put('/:id/cancel', cancelHotelBooking);

module.exports = router;
