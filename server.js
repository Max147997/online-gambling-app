// ========== server.js ==========
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');

// Express-App initialisieren
const app = express();

// Statisches Frontend ausliefern
app.use(express.static('public'));

// JSON-Parser und Session-Middleware
app.use(bodyParser.json());
app.use(session({
  secret: 'dein_geheimes_session_schluessel',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/gamblingdb' })
}));

// Routen importieren
const gamesRoutes = require('./routes/games');
const authRoutes = require('./routes/auth');

// MongoDB-Verbindung
mongoose.connect('mongodb://localhost:27017/gamblingdb')
  .then(() => console.log('✅ MongoDB verbunden'))
  .catch(err => console.error('🚨 MongoDB-Verbindungsfehler:', err));

// Routen mounten
app.use('/', authRoutes);
app.use('/games', gamesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server läuft auf Port ${PORT}`));