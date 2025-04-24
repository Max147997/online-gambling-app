// ========== routes/auth.js ==========
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Registrierung
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hash });
    req.session.userId = newUser._id;
    res.status(201).json({ message: 'Account erstellt', coins: newUser.coins });
  } catch (err) {
    res.status(400).json({ error: 'Benutzername existiert bereits' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
  }
  req.session.userId = user._id;
  res.json({ message: 'Erfolgreich eingeloggt', coins: user.coins });
});

// Münzstand abfragen
router.get('/balance', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Nicht eingeloggt' });
  const user = await User.findById(req.session.userId);
  res.json({ coins: user.coins });
});

module.exports = router;