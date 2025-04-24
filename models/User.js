// ========== models/User.js ==========
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  coins:    { type: Number, default: 1000 }
});

module.exports = mongoose.model('User', UserSchema);
