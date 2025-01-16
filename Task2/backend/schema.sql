-- Table: cryptocurrencies
CREATE TABLE cryptocurrencies (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(50) NOT NULL UNIQUE, -- ID from CoinGecko API
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    image_url TEXT, -- URL for the coin's image
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: prices
CREATE TABLE prices (
    id SERIAL PRIMARY KEY,
    crypto_id INT NOT NULL REFERENCES cryptocurrencies(id) ON DELETE CASCADE,
    usd_price DECIMAL(20, 8) NOT NULL,
    usd_market_cap DECIMAL(20, 8),
    usd_24h_vol DECIMAL(20, 8),
    usd_24h_change DECIMAL(10, 6),
    last_updated_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: alerts
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    crypto_id INT NOT NULL REFERENCES cryptocurrencies(id) ON DELETE CASCADE,
    threshold DECIMAL(20, 8) NOT NULL,
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('above', 'below')), -- Alert condition
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: trending_coins
CREATE TABLE trending_coins (
    id SERIAL PRIMARY KEY,
    crypto_id INT NOT NULL REFERENCES cryptocurrencies(id) ON DELETE CASCADE,
    market_cap_rank INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
