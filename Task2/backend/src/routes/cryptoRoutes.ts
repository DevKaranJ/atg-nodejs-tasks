import express from "express";
import { getCryptoPrices, checkPriceChange, getCachedCryptoPrices } from "../controllers/cryptoController";

const router = express.Router();

// Route to get the current prices of cryptocurrencies
router.get("/prices", getCryptoPrices);

// Route to check price change and trigger alert if necessary
router.post("/check-price-change", async (req, res) => {
    try {
        await checkPriceChange(req, res);
    } catch (error) {
        console.error("Error handling price change request:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Route to get cached cryptocurrency prices from Redis
router.get("/cached-prices", getCachedCryptoPrices);

export default router;
