const express = require('express');
const router = express.Router();
const { 
  registerVolunteer, 
  getVolunteers, 
  getMyProfile,
  acceptMission, 
  completeMission 
} = require('../controllers/volunteerController');
const auth = require('../middleware/auth');

router.post('/register', auth, registerVolunteer);
router.get('/', auth, getVolunteers);
router.get('/me', auth, getMyProfile);
router.put('/accept/:sosId', auth, acceptMission);
router.put('/complete/:sosId', auth, completeMission);

module.exports = router;
