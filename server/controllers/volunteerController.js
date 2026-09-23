const Volunteer = require('../models/Volunteer');

exports.registerVolunteer = async (req, res) => {
  try {
    const { skills, availability } = req.body;
    
    let volunteer = await Volunteer.findOne({ user: req.user._id });
    if (volunteer) {
      return res.status(400).json({ success: false, message: 'Volunteer profile already exists' });
    }
    
    volunteer = await Volunteer.create({
      user: req.user._id,
      skills,
      availability
    });
    
    // Optionally update user role
    req.user.role = 'volunteer';
    await req.user.save();
    
    res.status(201).json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find()
      .populate('user', 'name email phone location');
      
    res.json({ success: true, count: volunteers.length, data: volunteers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ user: req.user._id })
      .populate('user', 'name email phone location')
      .populate('currentMission');
      
    if (!volunteer) {
      if (req.user.role === 'volunteer' || req.user.role === 'admin') {
        volunteer = await Volunteer.create({
          user: req.user._id,
          skills: ['First Aid', 'Emergency Relief'],
          availability: true,
          missionsCompleted: 1,
          points: 150,
          rating: 4.9
        });
        volunteer = await Volunteer.findById(volunteer._id)
          .populate('user', 'name email phone location');
        return res.json({ success: true, data: volunteer });
      }
      return res.status(404).json({ success: false, message: 'Volunteer profile not found' });
    }
    
    res.json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.acceptMission = async (req, res) => {
  try {
    const { sosId } = req.params;
    let volunteer = await Volunteer.findOne({ user: req.user._id });
    
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer profile not found' });
    }
    
    volunteer.currentMission = sosId;
    volunteer.availability = false;
    await volunteer.save();
    
    res.json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.completeMission = async (req, res) => {
  try {
    const { sosId } = req.params;
    let volunteer = await Volunteer.findOne({ user: req.user._id });
    
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer profile not found' });
    }
    
    if (volunteer.currentMission && volunteer.currentMission.toString() === sosId) {
      volunteer.missionsCompleted += 1;
      volunteer.points += 10;
      volunteer.currentMission = null;
      volunteer.availability = true;
      await volunteer.save();
      
      res.json({ success: true, data: volunteer });
    } else {
      res.status(400).json({ success: false, message: 'Mission mismatch' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
