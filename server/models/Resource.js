const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],
    address: String
  },
  category: { 
    type: String, 
    enum: ['food', 'water', 'medicine', 'shelter', 'vehicle', 'blood', 'clothing', 'equipment'] 
  },
  status: { 
    type: String, 
    enum: ['available', 'low', 'depleted'], 
    default: 'available' 
  },
  lastUpdated: { type: Date, default: Date.now }
});

resourceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Resource', resourceSchema);
