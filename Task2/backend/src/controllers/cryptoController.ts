import { Request, Response } from "express";
import { fetchLatestPrices, getCachedPrices, processPriceChange } from "../services/cryptoService";

// Controller to get the current prices of cryptocurrencies
export const getCryptoPrices = async (req: Request, res: Response) => {
    try {
        const prices = await fetchLatestPrices();
        res.json(prices);
    } catch (error) {
        console.error("Error fetching crypto prices:", error);
        res.status(500).json({ message: "Error fetching crypto prices." });
    }
};

// Controller to get cached cryptocurrency prices from Redis
export const getCachedCryptoPrices = async (req: Request, res: Response) => {
    try {
        const cachedPrices = await getCachedPrices();
        if (cachedPrices) {
            res.json(cachedPrices);
        } else {
            res.status(404).json({ message: "No cached data found" });
        }
    } catch (error) {
        console.error("Error fetching cached crypto prices:", error);
        res.status(500).json({ message: "Error fetching cached crypto prices." });
    }
};

// Controller to check price change and trigger alert if necessary
export const checkPriceChange = async (req: Request, res: Response) => {
    const { cryptoId, previousPrice, currentPrice, threshold } = req.body;

    // Validate the inputs
    if (typeof cryptoId !== "string" || cryptoId.trim() === "" || isNaN(previousPrice) || isNaN(currentPrice) || isNaN(threshold)) {
        return res.status(400).json({ message: "Invalid input values" });
    }    

    try {
        const priceChangeDetected = processPriceChange(cryptoId, Number(previousPrice), Number(currentPrice), Number(threshold));

        if (priceChangeDetected) {
            res.status(200).json({ message: "Price change alert triggered!" });
        } else {
            res.status(200).json({ message: "No significant price change detected." });
        }
    } catch (error) {
        console.error("Error processing price change:", error);
        res.status(500).json({ message: "Error processing price change." });
    }
};
