const bcrypt = require('bcryptjs');
const { registerUser, findUserByUsername, saveResetToken, findUserByToken, updateUserPassword, findUserByEmail } = require('../models/userModel');
const { validateUserData } = require('../utils/validate');
const crypto = require('crypto');

// Register user function
const register = async (req, res) => {
  const { username, email, password } = req.body;
  
  // Validate input data
  const errors = validateUserData(username, email, password);
  if (errors.length > 0) return res.status(400).json({ message: errors.join(', ') });

  try {
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Register user in the DB
    const result = await registerUser(username, email, passwordHash);
    res.status(201).json({ message: 'User registered successfully', userId: result.id });
  } catch (error) {
    // Handle unique constraint errors
    if (error.code === '23505') {
      if (error.detail.includes('Key (username)')) {
        return res.status(400).json({ message: 'Username already exists. Please choose a different username.' });
      }
      if (error.detail.includes('Key (email)')) {
        return res.status(400).json({ message: 'Email already exists. Please choose a different email.' });
      }
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
};

// Login user function
const login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await findUserByUsername(username);
    
    if (!user) return res.status(400).json({ message: 'User not found. Please check your username.' });
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
};

// Reset password function
const resetPassword = async (req, res) => {
  const { email } = req.body;

  // Validate email format
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  try {
    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User with this email not found.' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Save the reset token in the database associated with the user
    await saveResetToken(email, resetToken);

    // Log the token to console for manual copying and testing)
    console.log('Reset Token:', resetToken);

    return res.status(200).json({ message: 'Password reset token generated successfully. Please check the console for the token.' });
  } catch (error) {
    console.error('Error during password reset:', error);
    return res.status(500).json({ message: 'Internal server error while generating reset token.' });
  }
};

// Update password function
const updatePassword = async (req, res) => {
  const { token, newPassword } = req.body;

  // Validate new password
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  try {
    // Check if the token is valid and find associated user
    const user = await findUserByToken(token);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token. Please request a new one.' });
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await updateUserPassword(user.id, passwordHash);

    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error during password update:', error);
    return res.status(500).json({ message: 'Internal server error while updating the password.' });
  }
};

module.exports = { register, login, resetPassword, updatePassword };
