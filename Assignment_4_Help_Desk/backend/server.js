// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const requestRoutes = require("./routes/requestRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus_help_desk";

// Middleware
app.use(cors());
app.use(express.json());

// Health Check route
app.get("/", (req, res) => {
    res.json({ message: "Campus Help Desk API is up and running!" });
});

// REST API Routes
app.use("/api/requests", requestRoutes);

// Connect to MongoDB using Mongoose
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Successfully connected to MongoDB:", MONGO_URI);
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    });
