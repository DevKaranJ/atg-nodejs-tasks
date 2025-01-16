import axios from "axios";
import pool from "../config/db";

const syncPrices = async () => {
    try {
        const { rows: cryptocurrencies } = await pool.query("SELECT id, api_id FROM cryptocurrencies");

        const ids = cryptocurrencies.map((crypto: any) => crypto.api_id).join(",");
        const url = "https://api.coingecko.com/api/v3/simple/price";
        const response = await axios.get(url, {
            params: {
                ids,
                vs_currencies: "usd",
                include_market_cap: true,
                include_24hr_vol: true,
                include_24hr_change: true,
            },
        });

        for (const crypto of cryptocurrencies) {
            const data = response.data[crypto.api_id];
            if (data) {
                await pool.query(
                    `INSERT INTO prices (crypto_id, usd_price, usd_market_cap, usd_24h_vol, usd_24h_change, last_updated_at)
                     VALUES ($1, $2, $3, $4, $5, NOW())
                     ON CONFLICT (crypto_id) DO UPDATE
                     SET usd_price = $2, usd_market_cap = $3, usd_24h_vol = $4, usd_24h_change = $5, last_updated_at = NOW()`,
                    [crypto.id, data.usd, data.usd_market_cap, data.usd_24h_vol, data.usd_24h_change]
                );
            }
        }

        console.log("Prices synced successfully!");
    } catch (error) {
        console.error("Error syncing prices:", error);
    } finally {
        pool.end();
    }
};

syncPrices();
