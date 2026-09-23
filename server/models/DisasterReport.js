const mongoose = require('mongoose');

const disasterReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { 
    type: String, 
    enum: ['flood', 'earthquake', 'fire', 'cyclone', 'accident', 'landslide', 'tsunami', 'other'] 
  },
  description: { type: String },
  images: [{ type: String }],
  videos: [{ type: String }],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],
    address: String
  },
  severity: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'] 
  },
  aiScore: { type: Number, min: 0, max: 100 },
  status: { 
    type: String, 
    enum: ['reported', 'verified', 'responding', 'resolved'], 
    default: 'reported' 
  },
  affectedCount: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

disasterReportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('DisasterReport', disasterReportSchema);
