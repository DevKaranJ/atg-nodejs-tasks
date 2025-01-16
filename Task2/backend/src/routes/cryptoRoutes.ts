import express from "express";
import type { Request, Response } from 'express';
import { getCryptoPrices, checkPriceChange, getCachedCryptoPrices } from "../controllers/cryptoController";
import { setAlertCriteria } from "../services/alertService"; // Import the function to set alert criteria

const router = express.Router();

// Route to get the current prices of cryptocurrencies
router.get("/prices", getCryptoPrices);

// Route to check price change and trigger alert if necessary
router.post("/check-price-change", async (req: Request, res: Response): Promise<void> => {
    try {
        await checkPriceChange(req, res);
    } catch (error) {
        console.error("Error handling price change request:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Route to get cached cryptocurrency prices from Redis
router.get("/cached-prices", getCachedCryptoPrices);

// Route to set alert criteria
router.post("/set-alert-criteria", async (req: Request, res: Response): Promise<void> => {
    try {
        const { threshold } = req.body;
        if (typeof threshold !== "number") {
            res.status(400).json({ message: "Invalid threshold value" });
            return;
        }
        await setAlertCriteria(threshold);
        res.status(200).json({ message: "Alert criteria set successfully" });
    } catch (error) {
        console.error("Error setting alert criteria:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
