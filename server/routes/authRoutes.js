const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  googleAuth,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateRegister,
  validateLogin,
} = require('../middleware/validator');

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/google', googleAuth);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;

