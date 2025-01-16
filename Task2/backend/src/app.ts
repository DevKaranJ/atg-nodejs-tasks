import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cryptoRoutes from "./routes/cryptoRoutes";
import redisClient from "./config/redis";
import { Server } from "socket.io";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization'
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/api", cryptoRoutes);

// Test Redis Connection
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

// Initialize Socket.io
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Attach Socket.io to the server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow frontend to connect
        methods: ["GET", "POST"]
    }
});

// Handle Socket.io connections
io.on("connection", (socket) => {
    console.log("New client connected");

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

export { io };
