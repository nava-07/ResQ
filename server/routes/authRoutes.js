const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getProfile, 
  updateProfile,
  getAllUsers,
  updateUserRole,
  deleteUser
} = require('../controllers/authController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

// Admin user management routes
router.get('/users', auth, roleCheck(['admin']), getAllUsers);
router.put('/users/:id', auth, roleCheck(['admin']), updateUserRole);
router.delete('/users/:id', auth, roleCheck(['admin']), deleteUser);

module.exports = router;
