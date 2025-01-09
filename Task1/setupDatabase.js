const { Client } = require('pg');
require('dotenv').config();

// Get database connection details from .env file
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

// Create a client instance to connect to PostgreSQL
const client = new Client({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
});

// Connect to PostgreSQL
client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL successfully');
  })
  .catch(err => {
    console.error('Error connecting to PostgreSQL:', err.stack);
    process.exit(1);
  });

// Create the database and tables
const setupDatabase = async () => {
  try {
    // Create the database if it doesn't exist
    const createDatabaseQuery = `CREATE DATABASE "${DB_NAME}";`;

    try {
      await client.query(createDatabaseQuery);
      console.log(`Database "${DB_NAME}" created successfully.`);
    } catch (err) {
      if (err.code === '42P04') {
        console.log(`Database "${DB_NAME}" already exists.`);
      } else {
        throw err;
      }
    }

    // Now connect to the newly created or existing database
    const dbClient = new Client({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
    });

    await dbClient.connect();

    // Create the users table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await dbClient.query(createTableQuery);
    console.log('Users table has been created or already exists.');

    // Close the database connection
    await dbClient.end();
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error during database setup:', error);
  } finally {
    client.end();
  }
};

// Run the database setup
setupDatabase();

