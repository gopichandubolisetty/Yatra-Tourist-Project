const express = require('express');
const {
  listNotifications,
  markRead,
  markAllRead,
  removeNotification,
} = require('../controllers/notificationController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/', listNotifications);
router.put('/read-all', markAllRead);
router.put('/:id/read', markRead);
router.delete('/:id', removeNotification);

module.exports = router;
