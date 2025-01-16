import { getCryptoPricesFromAPI } from "../utils/helpers";
import { sendAlert } from "./alertService";
import redisClient from "../config/redis";

// Store user subscriptions in memory
const userSubscriptions: { [key: string]: Array<{ threshold: number }> } = {};

// Function to subscribe a user to price alerts
export const subscribeToPriceAlerts = (cryptoId: string, threshold: number) => {
    if (!userSubscriptions[cryptoId]) {
        userSubscriptions[cryptoId] = [];
    }
    userSubscriptions[cryptoId].push({ threshold }); // Store the user's subscription
    console.log(`User subscribed to alerts for ${cryptoId} with a threshold of ${threshold}%`);
};

// Fetch the latest cryptocurrency prices from the API
export const fetchLatestPrices = async () => {
    try {
        const prices = await getCryptoPricesFromAPI();
        
        // Transform the response into an array format
        const priceArray = Object.keys(prices).map(key => ({
            name: key,
            value: prices[key].usd, // Assuming the price is in USD
        }));

        // Cache the prices in Redis with an expiration of 1 hour
        await redisClient.set("cryptoPrices", JSON.stringify(priceArray), { EX: 3600 });
        
        return priceArray;
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

// Check alerts and notify users based on their subscriptions
export const checkAlerts = async (cryptoId: string, newPrice: number) => {
    const userSubscriptionsForCrypto = userSubscriptions[cryptoId] || [];

    // Get last saved price from Redis cache
    const lastPrice = await redisClient.get(cryptoId);

    if (lastPrice) {
        // Calculate percentage change
        const priceChange = ((newPrice - parseFloat(lastPrice)) / parseFloat(lastPrice)) * 100;

        // Check user subscriptions for alerts
        userSubscriptionsForCrypto.forEach((subscription: { threshold: number }) => {
            if (Math.abs(priceChange) >= subscription.threshold) {
                sendAlert(cryptoId, priceChange, newPrice);
            }
        });

        // Update the last price in Redis
        await redisClient.set(cryptoId, newPrice.toString());
    } else {
        // If no price is found in Redis, save the new price
        await redisClient.set(cryptoId, newPrice.toString());
    }
};

export { sendAlert, userSubscriptions };
