import { Request, Response } from "express";
import redisClient from "../config/redis";
import { getCryptoPricesFromAPI } from "../utils/helpers"; // Function to fetch prices from CoinGecko

// Price change threshold for alerting (you can adjust this value)
const PRICE_THRESHOLD = 5; // Alert when price changes by 5% or more

// Function to get the current crypto prices
export const getCryptoPrices = async (req: Request, res: Response) => {
    try {
        const prices = await getCryptoPricesFromAPI();
        res.json(prices);
    } catch (error) {
        res.status(500).send("Error fetching prices");
    }
};

// Function to check and trigger alerts based on price change
export const checkAlerts = async (req: Request, res: Response) => {
    try {
        const { cryptoId, newPrice } = req.body;
        
        // Get last saved price from Redis cache
        const lastPrice = await redisClient.get(cryptoId);

        if (lastPrice) {
            // Calculate percentage change
            const priceChange = ((newPrice - parseFloat(lastPrice)) / parseFloat(lastPrice)) * 100;

            // If the price change exceeds the threshold, send an alert
            if (Math.abs(priceChange) >= PRICE_THRESHOLD) {
                await sendAlert(cryptoId, priceChange, newPrice);
                await redisClient.set(cryptoId, newPrice.toString()); // Update the last price in Redis
            }
        } else {
            // If no price is found in Redis, save the new price
            await redisClient.set(cryptoId, newPrice.toString());
        }

        res.status(200).send("Price checked and alerts processed.");
    } catch (error) {
        res.status(500).send("Error checking alerts");
    }
};

// Function to send an alert (email, notification, etc.)
export const sendAlert = async (cryptoId: string, priceChange: number, newPrice: number) => {
    // Implement alert logic (e.g., email or SMS alert)
    console.log(`Alert: ${cryptoId} price changed by ${priceChange}% to $${newPrice}`);
    // You can integrate actual alerting services (like sending emails here)
};
