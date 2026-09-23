const DisasterReport = require('../models/DisasterReport');

exports.createDisaster = async (req, res) => {
  try {
    const aiScoreMock = Math.floor(Math.random() * (100 - 40 + 1) + 40);
    
    const disaster = await DisasterReport.create({
      ...req.body,
      userId: req.user._id,
      aiScore: aiScoreMock
    });
    
    const io = req.app.get('io');
    if (io) {
      io.emit('new-alert', { type: 'disaster', data: disaster });
    }
    
    res.status(201).json({ success: true, data: disaster });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllDisasters = async (req, res) => {
  try {
    const { type, severity, status, page = 1, limit = 10 } = req.query;
    let query = {};
    
    if (type) query.type = type;
    if (severity) query.severity = severity;
    if (status) query.status = status;
    
    const skip = (page - 1) * limit;
    
    const disasters = await DisasterReport.find(query)
      .populate('userId', 'name email phone')
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-createdAt');
      
    const total = await DisasterReport.countDocuments(query);
    
    res.json({ 
      success: true, 
      count: disasters.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: disasters 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDisasterById = async (req, res) => {
  try {
    const disaster = await DisasterReport.findById(req.params.id)
      .populate('userId', 'name email phone');
      
    if (!disaster) {
      return res.status(404).json({ success: false, message: 'Disaster not found' });
    }
    
    res.json({ success: true, data: disaster });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDisaster = async (req, res) => {
  try {
    let disaster = await DisasterReport.findById(req.params.id);
    
    if (!disaster) {
      return res.status(404).json({ success: false, message: 'Disaster not found' });
    }
    
    disaster = await DisasterReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, data: disaster });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDisaster = async (req, res) => {
  try {
    const disaster = await DisasterReport.findById(req.params.id);
    
    if (!disaster) {
      return res.status(404).json({ success: false, message: 'Disaster not found' });
    }
    
    await disaster.deleteOne();
    
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDisasterStats = async (req, res) => {
  try {
    const stats = await DisasterReport.aggregate([
      {
        $group: {
          _id: { type: "$type", status: "$status", severity: "$severity" },
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
