import pool from "../config/db";

const createTables = async () => {
    // Create tables for cryptocurrencies, prices, alerts, and trending_coins
    const queries = `
        CREATE TABLE IF NOT EXISTS cryptocurrencies (
            id SERIAL PRIMARY KEY,
            api_id VARCHAR(50) NOT NULL UNIQUE,
            name VARCHAR(100) NOT NULL,
            symbol VARCHAR(10) NOT NULL,
            image_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS prices (
            id SERIAL PRIMARY KEY,
            crypto_id INT NOT NULL REFERENCES cryptocurrencies(id) ON DELETE CASCADE,
            usd_price DECIMAL(20, 8) NOT NULL,
            usd_market_cap DECIMAL(20, 8),
            usd_24h_vol DECIMAL(20, 8),
            usd_24h_change DECIMAL(10, 6),
            last_updated_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS alerts (
            id SERIAL PRIMARY KEY,
            crypto_id INT NOT NULL REFERENCES cryptocurrencies(id) ON DELETE CASCADE,
            threshold DECIMAL(20, 8) NOT NULL,
            direction VARCHAR(10) NOT NULL CHECK (direction IN ('above', 'below')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS trending_coins (
            id SERIAL PRIMARY KEY,
            crypto_id INT NOT NULL REFERENCES cryptocurrencies(id) ON DELETE CASCADE,
            market_cap_rank INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(queries);
        console.log("Tables created successfully!");
    } catch (error) {
        console.error("Error creating tables:", error);
    } finally {
        pool.end();
    }
};

createTables();
