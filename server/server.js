require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const connectDB = require('./src/utils/db');
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');
const { initTrackingSocket } = require('./src/socket/trackingSocket');

const authRoutes = require('./src/routes/auth');
const tripRoutes = require('./src/routes/trips');
const bookingRoutes = require('./src/routes/bookings');
const paymentRoutes = require('./src/routes/payments');
const locationRoutes = require('./src/routes/location');
const notificationRoutes = require('./src/routes/notifications');
const userRoutes = require('./src/routes/users');
const hotelBookingRoutes = require('./src/routes/hotelBookings');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);
initTrackingSocket(io);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(limiter);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Yatra', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hotel-bookings', hotelBookingRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`YATRA server running on port ${PORT}`);
  });
});
