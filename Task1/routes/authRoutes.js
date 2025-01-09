const express = require('express');
const { register, login, resetPassword, updatePassword } = require('../controllers/authController');
const router = express.Router();

// User registration route
router.post('/register', register);

// User login route
router.post('/login', login);

// Password reset route
router.post('/reset-password', resetPassword);

// Update password route
router.post('/update-password', updatePassword);

module.exports = router;
