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

const setupDatabase = async () => {
  try {
    // Step 1: Connect to PostgreSQL without specifying a database (to create it if not exists)
    await client.connect();
    console.log('Connected to PostgreSQL successfully.');

    // Step 2: Create the database if it doesn't exist
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

    // Step 3: Reconnect to the newly created or existing database
    const dbClient = new Client({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
    });

    await dbClient.connect();

    // Step 4: Create the users table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reset_token VARCHAR(255)  -- Add the reset_token column here
      );
    `;

    await dbClient.query(createTableQuery);
    console.log('Users table has been created or already exists.');

    // Step 5: Ensure the reset_token column exists in the users table
    const addResetTokenQuery = `
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'reset_token') THEN
          ALTER TABLE users ADD COLUMN reset_token VARCHAR(255);
        END IF;
      END;
      $$;
    `;

    await dbClient.query(addResetTokenQuery);
    console.log('Reset token column ensured in the users table.');

    // Step 6: Close the database connection
    await dbClient.end();
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error during database setup:', error);
  } finally {
    client.end(); // Ensure the initial connection is also closed
  }
};

setupDatabase();
