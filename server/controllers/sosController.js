const SOSRequest = require('../models/SOSRequest');

exports.createSOS = async (req, res) => {
  try {
    const sosData = {
      ...req.body
    };
    if (req.user) {
      sosData.citizen = req.user._id;
    }
    const sos = await SOSRequest.create(sosData);
    
    const io = req.app.get('io');
    if (io) {
      io.emit('sos-alert', sos);
    }
    
    res.status(201).json({ success: true, data: sos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllSOS = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let query = {};
    if (status) query.status = status;
    
    const skip = (page - 1) * limit;
    
    const requests = await SOSRequest.find(query)
      .populate('citizen', 'name phone location')
      .populate('assignedTeam', 'name phone')
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-createdAt');
      
    const total = await SOSRequest.countDocuments(query);
    
    res.json({ 
      success: true,
      count: requests.length,
      total,
      data: requests 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSOSById = async (req, res) => {
  try {
    const sos = await SOSRequest.findById(req.params.id)
      .populate('citizen', 'name phone location')
      .populate('assignedTeam', 'name phone');
      
    if (!sos) {
      return res.status(404).json({ success: false, message: 'SOS Request not found' });
    }
    
    res.json({ success: true, data: sos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSOSStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let sos = await SOSRequest.findById(req.params.id);
    
    if (!sos) {
      return res.status(404).json({ success: false, message: 'SOS Request not found' });
    }
    
    sos.status = status;
    if (status === 'accepted') {
      sos.assignedTeam = req.user._id;
    }
    
    await sos.save();
    
    const updatedSOS = await SOSRequest.findById(sos._id)
      .populate('citizen', 'name phone')
      .populate('assignedTeam', 'name phone');
      
    const io = req.app.get('io');
    if (io) {
      io.emit('rescue-update', updatedSOS);
    }
    
    res.json({ success: true, data: updatedSOS });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMySOS = async (req, res) => {
  try {
    const requests = await SOSRequest.find({ citizen: req.user._id })
      .populate('assignedTeam', 'name phone')
      .sort('-createdAt');
      
    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
