const express = require('express');
const router = express.Router();
const { 
  createAlert, 
  getAllAlerts, 
  updateAlert, 
  deleteAlert 
} = require('../controllers/alertController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/', auth, roleCheck(['admin']), createAlert);
router.get('/', getAllAlerts);
router.put('/:id', auth, roleCheck(['admin']), updateAlert);
router.delete('/:id', auth, roleCheck(['admin']), deleteAlert);

module.exports = router;
