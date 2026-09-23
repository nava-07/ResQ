const express = require('express');
const router = express.Router();
const { 
  createDisaster, 
  getAllDisasters, 
  getDisasterStats,
  getDisasterById, 
  updateDisaster, 
  deleteDisaster 
} = require('../controllers/disasterController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/', auth, createDisaster);
router.get('/', getAllDisasters);
router.get('/stats', getDisasterStats);
router.get('/:id', getDisasterById);
router.put('/:id', auth, updateDisaster);
router.delete('/:id', auth, roleCheck(['admin']), deleteDisaster);

module.exports = router;
