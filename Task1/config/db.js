const { Client } = require('pg');
require('dotenv').config();

// Get database connection details from .env file
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

// Create a client instance to connect to PostgreSQL
const client = new Client({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
});

// Connect to PostgreSQL
client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL successfully');
  })
  .catch(err => {
    console.error('Error connecting to PostgreSQL:', err.stack);
    process.exit(1);  // Exit the process on connection failure
  });

module.exports = client;
