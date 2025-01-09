const bcrypt = require('bcryptjs');
const { registerUser, findUserByUsername } = require('../models/userModel');
const { validateUserData } = require('../utils/validate');

// Register user function
const register = async (req, res) => {
  const { username, email, password } = req.body;
  
  // Validate input data
  const errors = validateUserData(username, email, password);
  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Register user in the DB
    const result = await registerUser(username, email, passwordHash);
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Database error' });
  }
};

// Login user function
const login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await findUserByUsername(username);
    
    if (!user) return res.status(400).json({ message: 'User not found' });
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Reset password function
const resetPassword = async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  try {
    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Here you would save the reset token to the database associated with the user
    // For example: await saveResetToken(email, resetToken);

    // Send email with reset link to the user using nodemailer (mailservice needed)
    // const transporter = nodemailer.createTransport({
    //   service: 'Gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
    });

    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updatePassword = async (req, res) => {
  const { token, newPassword } = req.body;

  // Validate new password
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  try {
    const user = await findUserByToken(token);
    if (!user) return res.status(400).json({ message: 'Invalid or expired token.' });

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    // await updateUserPassword(user.id, passwordHash);

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { register, login, resetPassword, updatePassword };
