const mongoose = require('mongoose');

const sosRequestSchema = new mongoose.Schema({
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],
    address: String
  },
  message: { type: String },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    default: 'high' 
  },
  assignedTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'on_the_way', 'rescued', 'closed'], 
    default: 'pending' 
  },
  responseTime: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

sosRequestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('SOSRequest', sosRequestSchema);
