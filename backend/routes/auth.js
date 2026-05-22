const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');

// ───── SIGNUP ─────
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check all fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Save user to MongoDB
    const user = await User.create({
      username,
      email,
      password: hashed
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log(`✅ New user registered: ${user.email}`);

    res.status(201).json({
      token,
      username: user.username,
      email: user.email,
      message: 'Account created successfully'
    });

  } catch (err) {
    console.log('❌ Signup error:', err.message);
    res.status(500).json({ error: 'Signup failed. Try again.' });
  }
});

// ───── LOGIN ─────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check all fields
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'No account found with this email' });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log(`✅ User logged in: ${user.email}`);

    res.json({
      token,
      username: user.username,
      email: user.email,
      message: 'Login successful'
    });

  } catch (err) {
    console.log('❌ Login error:', err.message);
    res.status(500).json({ error: 'Login failed. Try again.' });
  }
});

// ───── GET PROFILE (protected) ─────
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch profile' });
  }
});

// ───── GET ALL USERS (for testing) ─────
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch users' });
  }
});

module.exports = router;