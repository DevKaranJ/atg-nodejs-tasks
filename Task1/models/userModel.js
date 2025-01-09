const db = require('../config/db');

// User registration query
const registerUser  = async (username, email, passwordHash) => {
  const query = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`;
  try {
    const result = await db.query(query, [username, email, passwordHash]);
    return result;
  } catch (error) {
    console.error('Error during user registration:', error);
    throw error;
  }
};

// User login query
const findUserByUsername = async (username) => {
  const query = `SELECT * FROM users WHERE username = $1`;
  const result = await db.query(query, [username]);
  return result.rows[0];
};

const saveResetToken = async (email, resetToken) => {
  const query = `UPDATE users SET reset_token = $1 WHERE email = $2`;
  await db.query(query, [resetToken, email]);
};

const findUserByToken = async (token) => {
  const query = `SELECT * FROM users WHERE reset_token = $1`;
  const result = await db.query(query, [token]);
  return result.rows[0];
};

const updateUserPassword = async (userId, passwordHash) => {
  const query = `UPDATE users SET password = $1, reset_token = NULL WHERE id = $2`;
  await db.query(query, [passwordHash, userId]);
};

module.exports = { registerUser, findUserByUsername, saveResetToken, findUserByToken, updateUserPassword };