/* eslint-disable no-console */
require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./db');
const { readData, writeData, insertOne, findByField } = require('./fileStore');
const User = require('../models/User');
const Trip = require('../models/Trip');
const Stop = require('../models/Stop');

const DEMO_EMAIL = 'demo@yatra.com';
const DEMO_PASSWORD = 'demo123';
const DEMO_NAME = 'Demo Traveller';

function loadPoiFile() {
  const poiPath = path.join(__dirname, '../../data/poi.json');
  if (!fs.existsSync(poiPath)) {
    console.warn('poi.json missing — run full project setup');
    return [];
  }
  const pois = JSON.parse(fs.readFileSync(poiPath, 'utf8'));
  if (!Array.isArray(pois) || pois.length < 30) {
    console.warn('poi.json should have 30+ entries');
  }
  return Array.isArray(pois) ? pois : [];
}

async function seed() {
  await connectDB();

  // Seed POI collection from the bundled JSON if empty/small.
  const existingPois = await readData('poi.json');
  if (!existingPois || existingPois.length < 30) {
    const pois = loadPoiFile();
    if (pois.length) {
      await writeData('poi.json', pois);
      console.log(`Seeded POIs: ${pois.length}`);
    }
  }

  const demoEmail = DEMO_EMAIL.toLowerCase().trim();
  let demo = (await findByField('users.json', 'email', demoEmail))[0];

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  if (!demo) {
    demo = await insertOne('users.json', {
      name: DEMO_NAME,
      email: demoEmail,
      passwordHash,
      phone: '+91 98765 43210',
      preferences: { cuisine: ['South Indian', 'Hyderabadi'], priceLevel: 'mid' },
    });
    console.log('Created demo user:', DEMO_EMAIL);
  } else {
    await User.updateOne({ id: demo.id }, { passwordHash });
    console.log('Updated demo user password');
    demo = await User.findOne({ id: demo.id }).lean();
  }

  const demoId = demo.id;

  // Remove old demo trips/stops without touching other users.
  const demoTrips = await Trip.find({ userId: demoId }).lean();
  const demoTripIds = demoTrips.map((t) => t.id);
  if (demoTripIds.length) {
    await Stop.deleteMany({ tripId: { $in: demoTripIds } });
    await Trip.deleteMany({ id: { $in: demoTripIds } });
  }

  const now = new Date();
  const trip1 = await insertOne('trips.json', {
    userId: demoId,
    name: 'Hyderabad Heritage Yatra',
    startTime: new Date(now.getTime() + 86400000).toISOString(),
    endTime: new Date(now.getTime() + 3 * 86400000).toISOString(),
    status: 'PLANNED',
    estimatedCost: 2450,
    currentLocation: { lat: 17.385, lng: 78.4867 },
  });

  const trip2 = await insertOne('trips.json', {
    userId: demoId,
    name: 'Goa Beach Escape',
    startTime: new Date(now.getTime() - 7 * 86400000).toISOString(),
    endTime: new Date(now.getTime() - 5 * 86400000).toISOString(),
    status: 'COMPLETED',
    estimatedCost: 8900,
    currentLocation: { lat: 15.2993, lng: 74.124 },
  });

  const trip3 = await insertOne('trips.json', {
    userId: demoId,
    name: 'Vijayawada Culture & Heritage Yatra',
    startTime: new Date(now.getTime() + 2 * 86400000).toISOString(),
    endTime: new Date(now.getTime() + 3 * 86400000).toISOString(),
    status: 'PLANNED',
    estimatedCost: 3200,
    currentLocation: { lat: 16.5062, lng: 80.648 },
  });

  const stopsT1 = [
    {
      tripId: trip1.id,
      order: 1,
      name: 'Charminar Pickup',
      address: 'Charminar, Hyderabad',
      location: { lat: 17.3616, lng: 78.4747 },
      type: 'PICKUP',
    },
    {
      tripId: trip1.id,
      order: 2,
      name: 'Hussain Sagar',
      address: 'Tank Bund, Hyderabad',
      location: { lat: 17.4239, lng: 78.4738 },
      type: 'WAYPOINT',
    },
    {
      tripId: trip1.id,
      order: 3,
      name: 'Gachibowli IT Park',
      address: 'Gachibowli, Hyderabad',
      location: { lat: 17.4401, lng: 78.3489 },
      type: 'DROPOFF',
    },
  ];

  const stopsT2 = [
    {
      tripId: trip2.id,
      order: 1,
      name: 'Dabolim Airport',
      address: 'Goa Airport',
      location: { lat: 15.3808, lng: 73.8314 },
      type: 'PICKUP',
    },
    {
      tripId: trip2.id,
      order: 2,
      name: 'Baga Beach',
      address: 'Baga, North Goa',
      location: { lat: 15.5557, lng: 73.7557 },
      type: 'WAYPOINT',
    },
    {
      tripId: trip2.id,
      order: 3,
      name: 'The Leela Goa',
      address: 'Mobor, Cavelossim',
      location: { lat: 15.2581, lng: 73.9208 },
      type: 'DROPOFF',
    },
  ];

  const stopsT3 = [
    {
      tripId: trip3.id,
      order: 1,
      name: 'Kanaka Durga Temple',
      address: 'Indrakeeladri, Vijayawada',
      location: { lat: 16.5193, lng: 80.6305 },
      type: 'PICKUP',
    },
    {
      tripId: trip3.id,
      order: 2,
      name: 'Prakasam Barrage',
      address: 'Krishna River, Vijayawada',
      location: { lat: 16.508, lng: 80.6156 },
      type: 'WAYPOINT',
    },
    {
      tripId: trip3.id,
      order: 3,
      name: 'Undavalli Caves',
      address: 'Undavalli, Amaravati Road',
      location: { lat: 16.4753, lng: 80.6011 },
      type: 'WAYPOINT',
    },
    {
      tripId: trip3.id,
      order: 4,
      name: 'Bhavani Island',
      address: 'Krishna River, Vijayawada',
      location: { lat: 16.52, lng: 80.59 },
      type: 'WAYPOINT',
    },
    {
      tripId: trip3.id,
      order: 5,
      name: 'Victoria Jubilee Museum',
      address: 'Governorpet, Vijayawada',
      location: { lat: 16.5085, lng: 80.6212 },
      type: 'DROPOFF',
    },
  ];

  await Promise.all([
    ...stopsT1.map((s) => insertOne('stops.json', s)),
    ...stopsT2.map((s) => insertOne('stops.json', s)),
    ...stopsT3.map((s) => insertOne('stops.json', s)),
  ]);

  await insertOne('notifications.json', {
    userId: demoId,
    message: `🗺️ Your Yatra trip ${trip1.name} has been planned!`,
    type: 'RIDE',
    read: false,
    sentAt: new Date().toISOString(),
  });

  await insertOne('notifications.json', {
    userId: demoId,
    message: `🏛️ ${trip3.name} is ready — explore Kanaka Durga, the Barrage & Undavalli!`,
    type: 'RIDE',
    read: false,
    sentAt: new Date().toISOString(),
  });

  console.log('Seeded 3 demo trips (incl. Vijayawada) with stops and notifications.');
  console.log('Login:', DEMO_EMAIL, '/', DEMO_PASSWORD);
}

async function seedWithRetry(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await seed();
      console.log('Seed completed successfully');
      await mongoose.disconnect().catch(() => {});
      process.exit(0);
    } catch (error) {
      console.log(`Seed attempt ${i + 1} failed:`, error.message);
      await mongoose.disconnect().catch(() => {});
      if (i < retries - 1) {
        console.log('Retrying in 3 seconds...');
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }
  console.log('All retry attempts failed');
  process.exit(1);
}

seedWithRetry();
