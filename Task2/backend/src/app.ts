import express from "express";
import dotenv from "dotenv";
import redisClient from "./config/redis";  // Import the Redis client
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Test Redis Connection (you can put this code here for testing)
app.get("/test-redis", async (req, res) => {
    try {
        // Check if Redis is connected by setting and getting a value
        await redisClient.set("test_key", "Hello Redis!");
        const value = await redisClient.get("test_key");
        res.send(`Redis Test: ${value}`);  // Should return 'Hello Redis!'
    } catch (error) {
        res.status(500).send("Error with Redis connection");
    }
});

// Main Route
app.get("/", (req, res) => {
    res.send("Crypto Monitoring Backend is Running!");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
