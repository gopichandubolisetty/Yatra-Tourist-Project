const express = require('express');
const {
  createOrPreviewBooking,
  listBookings,
  getBooking,
  cancelBooking,
} = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.post('/', createOrPreviewBooking);
router.get('/', listBookings);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
