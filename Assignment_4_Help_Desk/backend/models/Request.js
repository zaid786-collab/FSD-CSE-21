const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
    {
        studentName: {
            type: String,
            required: [true, "Student name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"]
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: {
                values: ["Academic", "Hostel", "Transport", "Library", "Infrastructure", "IT Support", "Other"],
                message: "{VALUE} is not a valid category"
            }
        },
        description: {
            type: String,
            required: [true, "Problem description is required"],
            trim: true
        },
        priority: {
            type: String,
            required: [true, "Priority is required"],
            enum: {
                values: ["Low", "Medium", "High"],
                message: "{VALUE} is not a valid priority level"
            }
        }
    },
    {
        timestamps: true,
        collection: "requests"
    }
);

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
