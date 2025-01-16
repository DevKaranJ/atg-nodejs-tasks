import { Request, Response } from "express";
import redisClient from "../config/redis";
import { getCryptoPricesFromAPI } from "../utils/helpers"; // Function to fetch prices from CoinGecko
import { EventEmitter } from 'events'; // Import EventEmitter for notifications

// Price change threshold for alerting (you can adjust this value)
let PRICE_THRESHOLD = 5; // Alert when price changes by 5% or more

// Create an instance of EventEmitter
const eventEmitter = new EventEmitter();

// Function to set user-defined alert criteria
export const setAlertCriteria = (threshold: number) => {
    PRICE_THRESHOLD = threshold;
};

// Function to get the current crypto prices
export const getCryptoPrices = async (req: Request, res: Response) => {
    try {
        const prices = await getCryptoPricesFromAPI();
        res.json(prices);
    } catch (error) {
        res.status(500).send("Error fetching prices");
    }
};

export const checkAlerts = async (req: Request, res: Response) => {
    const { cryptoId, newPrice, userThreshold } = req.body; // Accept user-defined threshold

    // Set user-defined threshold if provided
    if (userThreshold) {
        setAlertCriteria(userThreshold);
    }

    try {
        // Get last saved price from Redis cache
        const lastPrice = await redisClient.get(cryptoId);

        if (lastPrice) {
            // Calculate percentage change
            const priceChange = ((newPrice - parseFloat(lastPrice)) / parseFloat(lastPrice)) * 100;

            // If the price change exceeds the threshold, send an alert
            if (Math.abs(priceChange) >= PRICE_THRESHOLD) {
                sendAlert(cryptoId, priceChange, newPrice);
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

// Function to send an alert (notification)
export const sendAlert = (cryptoId: string, priceChange: number, newPrice: number) => {
    // Emit an event for the alert
    eventEmitter.emit('priceAlert', { cryptoId, priceChange, newPrice });
    console.log(`Alert: ${cryptoId} price changed by ${priceChange}% to $${newPrice}`);
};

export { eventEmitter };
