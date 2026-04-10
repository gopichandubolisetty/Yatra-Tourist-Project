const User = require('../models/User');
const Trip = require('../models/Trip');
const Stop = require('../models/Stop');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const POI = require('../models/POI');
const HotelBooking = require('../models/HotelBooking');

const modelMap = {
  users: User,
  'users.json': User,
  trips: Trip,
  'trips.json': Trip,
  stops: Stop,
  'stops.json': Stop,
  bookings: Booking,
  'bookings.json': Booking,
  payments: Payment,
  'payments.json': Payment,
  notifications: Notification,
  'notifications.json': Notification,
  poi: POI,
  'poi.json': POI,
  hotelBookings: HotelBooking,
  'hotelBookings.json': HotelBooking,
};

function getModel(filename) {
  const key = String(filename || '').trim();
  const Model = modelMap[key];
  if (!Model) {
    throw new Error(`Unknown data collection: ${filename}`);
  }
  return Model;
}

async function readData(filename) {
  const Model = getModel(filename);
  return await Model.find({}).lean();
}

async function insertOne(filename, object) {
  const Model = getModel(filename);
  const doc = new Model(object);
  const saved = await doc.save();
  return saved.toObject();
}

async function findById(filename, id) {
  const Model = getModel(filename);
  return await Model.findOne({ id }).lean();
}

async function findByField(filename, field, value) {
  const Model = getModel(filename);
  return await Model.find({ [field]: value }).lean();
}

async function updateOne(filename, id, updates) {
  const Model = getModel(filename);
  return await Model.findOneAndUpdate({ id }, updates, { new: true }).lean();
}

async function deleteOne(filename, id) {
  const Model = getModel(filename);
  const result = await Model.findOneAndDelete({ id }).lean();
  return !!result;
}

async function writeData(filename, data) {
  const Model = getModel(filename);
  if (!Array.isArray(data)) {
    throw new Error('writeData expects an array');
  }
  await Model.deleteMany({});
  if (data.length) {
    await Model.insertMany(data);
  }
  return true;
}

module.exports = {
  readData,
  writeData,
  findById,
  findByField,
  insertOne,
  updateOne,
  deleteOne,
};
