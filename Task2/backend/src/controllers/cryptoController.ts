import { Request, Response } from "express";
import { fetchLatestPrices, getCachedPrices, checkAlerts, subscribeToPriceAlerts } from "../services/cryptoService";

// Store user subscriptions in memory (for simplicity)
const userSubscriptions: { [key: string]: { threshold: number }[] } = {};

// Endpoint to subscribe to notifications
export const subscribeToNotifications = (req: Request, res: Response) => {
    const { cryptoId, threshold } = req.body;

    if (!cryptoId || !threshold) {
        return res.status(400).json({ message: "Invalid subscription data" });
    }

    subscribeToPriceAlerts(cryptoId, threshold); // Call the new function to handle subscriptions
    res.status(200).json({ message: "Subscribed to notifications" });
};

// Function to check price change and trigger alert if necessary
export const checkPriceChange = async (req: Request, res: Response) => {
    const { cryptoId, newPrice } = req.body;

    if (!cryptoId || newPrice === undefined) {
        return res.status(400).json({ message: "Invalid input data" });
    }

    await checkAlerts(cryptoId, newPrice);
    res.status(200).json({ message: "Price checked and alerts processed." });
};

// Updated function to get cryptocurrency prices
export const getCryptoPrices = async (req: Request, res: Response) => {
    const { coinId } = req.params; // Get coinId from request parameters
    try {
        const prices = await fetchLatestPrices(); // Fetch all prices
        if (coinId) {
            // Fetch price for a specific cryptocurrency
            const specificPrice = prices.find(price => price.name === coinId);
            if (specificPrice) {
                return res.json(specificPrice);
            } else {
                return res.status(404).json({ message: "Cryptocurrency not found" });
            }
        } else {
            // Fetch all prices
            return res.json(prices);
        }
    } catch (error) {
        res.status(500).send("Error fetching latest prices");
    }
};

export const getCachedCryptoPrices = async (req: Request, res: Response) => {
    try {
        const cachedPrices = await getCachedPrices();
        res.json(cachedPrices);
    } catch (error) {
        res.status(500).send("Error fetching cached prices");
    }
};

export { userSubscriptions };
