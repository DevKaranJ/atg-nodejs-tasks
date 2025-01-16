import { Request, Response } from "express";
import { fetchLatestPrices, getCachedPrices, checkAlerts } from "../services/cryptoService";

// Store user subscriptions in memory (for simplicity)
const userSubscriptions: { [key: string]: { threshold: number }[] } = {};

// Endpoint to subscribe to notifications
export const subscribeToNotifications = (req: Request, res: Response) => {
    const { cryptoId, threshold } = req.body;

    if (!cryptoId || !threshold) {
        return res.status(400).json({ message: "Invalid subscription data" });
    }

    if (!userSubscriptions[cryptoId]) {
        userSubscriptions[cryptoId] = [];
    }

    userSubscriptions[cryptoId].push({ threshold });
    res.status(200).json({ message: "Subscribed to notifications", subscriptions: userSubscriptions[cryptoId] });
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

// Existing functions...

export const getCryptoPrices = async (req: Request, res: Response) => {
    try {
        const prices = await fetchLatestPrices();
        res.json(prices);
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
