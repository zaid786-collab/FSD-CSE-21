const express = require("express");
const mongoose = require("mongoose");
const Request = require("../models/Request");

const router = express.Router();

// -------------------------------------------------------------
// 1. GET /api/requests - Get all requests
// -------------------------------------------------------------
router.get("/", async (req, res) => {
    try {
        const requests = await Request.find().sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ message: "Something went wrong while fetching requests." });
    }
});

// -------------------------------------------------------------
// 2. GET /api/requests/:id - Get a single request by MongoDB _id
// -------------------------------------------------------------
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Request not found" });
        }

        const request = await Request.findById(id);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.status(200).json(request);
    } catch (error) {
        console.error("Error fetching request by ID:", error);
        res.status(500).json({ message: "Something went wrong while retrieving the request." });
    }
});

// -------------------------------------------------------------
// 3. POST /api/requests - Create a new request
// -------------------------------------------------------------
router.post("/", async (req, res) => {
    try {
        const { studentName, email, category, description, priority } = req.body;

        // Manual check for quick user-friendly message
        if (!studentName || !email || !category || !description || !priority) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newRequest = new Request({
            studentName,
            email,
            category,
            description,
            priority
        });

        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (error) {
        console.error("Error creating request:", error);
        // Handle Mongoose validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({ message: messages.join(", ") });
        }
        res.status(500).json({ message: "Something went wrong while saving the request." });
    }
});

// -------------------------------------------------------------
// 4. PUT /api/requests/:id - Update an existing request
// -------------------------------------------------------------
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Request not found" });
        }

        const { studentName, email, category, description, priority } = req.body;

        if (!studentName || !email || !category || !description || !priority) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const updatedRequest = await Request.findByIdAndUpdate(
            id,
            { studentName, email, category, description, priority },
            { new: true, runValidators: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.status(200).json(updatedRequest);
    } catch (error) {
        console.error("Error updating request:", error);
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({ message: messages.join(", ") });
        }
        res.status(500).json({ message: "Something went wrong while updating the request." });
    }
});

// -------------------------------------------------------------
// 5. DELETE /api/requests/:id - Delete a request
// -------------------------------------------------------------
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Request not found" });
        }

        const deletedRequest = await Request.findByIdAndDelete(id);

        if (!deletedRequest) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.status(200).json({ message: "Request deleted successfully" });
    } catch (error) {
        console.error("Error deleting request:", error);
        res.status(500).json({ message: "Something went wrong while deleting the request." });
    }
});

module.exports = router;
