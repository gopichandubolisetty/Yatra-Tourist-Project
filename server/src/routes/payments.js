const express = require('express');
const { processPayment, listPayments } = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.post('/process', processPayment);
router.get('/', listPayments);

module.exports = router;
