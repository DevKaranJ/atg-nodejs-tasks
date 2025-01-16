import axios from "axios";
import pool from "../config/db";

const seedCryptocurrencies = async () => {
    const url = "https://api.coingecko.com/api/v3/coins/markets";
    try {
        const response = await axios.get(url, {
            params: {
                vs_currency: "usd",
                order: "market_cap_desc",
                per_page: 100,
                page: 1,
            },
        });

        for (const coin of response.data) {
            await pool.query(
                `INSERT INTO cryptocurrencies (api_id, name, symbol, image_url)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (api_id) DO NOTHING`,
                [coin.id, coin.name, coin.symbol, coin.image]
            );
        }

        console.log("Cryptocurrencies seeded successfully!");
    } catch (error) {
        console.error("Error seeding cryptocurrencies:", error);
    } finally {
        pool.end();
    }
};

seedCryptocurrencies();
