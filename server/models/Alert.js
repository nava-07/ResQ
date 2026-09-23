const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ['info', 'warning', 'danger', 'critical'] 
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],
    address: String
  },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

alertSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Alert', alertSchema);
