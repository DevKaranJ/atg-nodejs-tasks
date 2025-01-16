import { getCryptoPricesFromAPI } from "../utils/helpers";
import { sendAlert } from "./alertService";
import redisClient from "../config/redis";

// Fetch the latest cryptocurrency prices from the API
export const fetchLatestPrices = async () => {
    try {
        const prices = await getCryptoPricesFromAPI();
        
        // Cache the prices in Redis with an expiration of 1 hour
        await redisClient.set("cryptoPrices", JSON.stringify(prices), { EX: 3600 });
        
        return prices;
    } catch (error) {
        console.error("Error fetching latest prices:", error);
        throw new Error("Failed to fetch latest prices.");
    }
};

// Get the cached cryptocurrency prices from Redis
export const getCachedPrices = async () => {
    try {
        const cachedPrices = await redisClient.get("cryptoPrices");
        if (cachedPrices) {
            return JSON.parse(cachedPrices);
        }
        return null;
    } catch (error) {
        console.error("Error fetching cached prices:", error);
        throw new Error("Failed to fetch cached prices.");
    }
};

/**
 * Processes the price change and checks if the alert threshold is met.
 * @param cryptoId The cryptocurrency ID (e.g., BTC, ETH)
 * @param previousPrice The previous price
 * @param currentPrice The current price
 * @param threshold The price change threshold to trigger an alert
 */
export const processPriceChange = (cryptoId: string, previousPrice: number, currentPrice: number, threshold: number) => {
    const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;

    // Check if the price change exceeds the threshold
    if (Math.abs(priceChange) >= threshold) {
        // Trigger an alert
        sendAlert(cryptoId, priceChange, currentPrice);
        return true;
    }
    return false;
};
