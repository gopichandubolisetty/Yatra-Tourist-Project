const { readData, writeData, findById, updateOne, deleteOne } = require('../utils/fileStore');

async function listNotifications(req, res, next) {
  try {
    let list = (await readData('notifications.json')).filter((n) => n.userId === req.userId);
    list.sort((a, b) => new Date(b.sentAt || b.createdAt) - new Date(a.sentAt || a.createdAt));
    res.json(list);
  } catch (e) {
    next(e);
  }
}

async function markRead(req, res, next) {
  try {
    const n = await findById('notifications.json', req.params.id);
    if (!n || n.userId !== req.userId) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    const updated = await updateOne('notifications.json', n.id, { read: true });
    res.json(updated);
  } catch (e) {
    next(e);
  }
}

async function markAllRead(req, res, next) {
  try {
    const all = await readData('notifications.json');
    const nextRows = all.map((n) => (n.userId === req.userId ? { ...n, read: true } : n));
    await writeData('notifications.json', nextRows);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
}

async function removeNotification(req, res, next) {
  try {
    const n = await findById('notifications.json', req.params.id);
    if (!n || n.userId !== req.userId) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    await deleteOne('notifications.json', n.id);
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
