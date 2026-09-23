const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  skills: [{ type: String }],
  availability: { type: Boolean, default: true },
  missionsCompleted: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  badges: [{ type: String }],
  currentMission: { type: mongoose.Schema.Types.ObjectId, ref: 'SOSRequest' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
