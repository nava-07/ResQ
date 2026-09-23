const express = require('express');
const router = express.Router();
const { 
  createResource, 
  getAllResources, 
  getResourceStats,
  updateResource, 
  deleteResource 
} = require('../controllers/resourceController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/', auth, roleCheck(['admin']), createResource);
router.get('/', getAllResources);
router.get('/stats', getResourceStats);
router.put('/:id', auth, roleCheck(['admin']), updateResource);
router.delete('/:id', auth, roleCheck(['admin']), deleteResource);

module.exports = router;
