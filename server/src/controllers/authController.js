const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findByField, insertOne, findById } = require('../utils/fileStore');

function signToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

async function register(req, res, next) {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existing = findByField('users.json', 'email', email.toLowerCase().trim());
    if (existing.length) {
      return res.status(409).json({ message: 'Email already registered on YATRA' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = insertOne('users.json', {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      phone: phone || '',
      preferences: { cuisine: [], priceLevel: 'mid' },
    });
    const token = signToken(user);
    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const users = findByField('users.json', 'email', email.toLowerCase().trim());
    const user = users[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = signToken(user);
    res.json({ token, user: sanitizeUser(user) });
  } catch (e) {
    next(e);
  }
}

function me(req, res, next) {
  try {
    const user = findById('users.json', req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(sanitizeUser(user));
  } catch (e) {
    next(e);
  }
}

function logout(req, res) {
  res.json({ success: true, message: 'Logged out — YATRA (JWT stateless)' });
}

module.exports = { register, login, me, logout, sanitizeUser, signToken };
