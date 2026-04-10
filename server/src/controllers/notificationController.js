const { readData, writeData, findById, updateOne, deleteOne } = require('../utils/fileStore');

function listNotifications(req, res, next) {
  try {
    let list = readData('notifications.json').filter((n) => n.userId === req.userId);
    list.sort((a, b) => new Date(b.sentAt || b.createdAt) - new Date(a.sentAt || a.createdAt));
    res.json(list);
  } catch (e) {
    next(e);
  }
}

function markRead(req, res, next) {
  try {
    const n = findById('notifications.json', req.params.id);
    if (!n || n.userId !== req.userId) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    const updated = updateOne('notifications.json', n.id, { read: true });
    res.json(updated);
  } catch (e) {
    next(e);
  }
}

function markAllRead(req, res, next) {
  try {
    const all = readData('notifications.json');
    const nextRows = all.map((n) =>
      n.userId === req.userId ? { ...n, read: true } : n
    );
    writeData('notifications.json', nextRows);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
}

function removeNotification(req, res, next) {
  try {
    const n = findById('notifications.json', req.params.id);
    if (!n || n.userId !== req.userId) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    deleteOne('notifications.json', n.id);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  listNotifications,
  markRead,
  markAllRead,
  removeNotification,
};
