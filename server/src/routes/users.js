const express = require('express');
const { getProfile, updateProfile, history } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/history', history);

module.exports = router;
