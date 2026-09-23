const express = require('express');
const router = express.Router();
const { 
  createSOS, 
  getAllSOS, 
  getMySOS,
  getSOSById, 
  updateSOSStatus 
} = require('../controllers/sosController');
const auth = require('../middleware/auth');

router.post('/', auth.optionalAuth, createSOS);
router.get('/', auth, getAllSOS);
router.get('/my', auth, getMySOS);
router.get('/:id', auth, getSOSById);
router.put('/:id/status', auth, updateSOSStatus);

module.exports = router;
