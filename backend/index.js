// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import dotenv from "dotenv";
// import http from "http";
// import { Server } from "socket.io";
// import path from "path";
// import { fileURLToPath } from "url";  // ✅ Required for __dirname
// import connectDB from "./utils/db.js";
// import userRoute from "./routes/user.route.js";
// import companyRoute from "./routes/company.route.js";
// import jobRoute from "./routes/job.route.js";
// import applicationRoute from "./routes/application.route.js";
// import { Notification } from "./models/notifications.models.js";
// import resumeRoutes from "./routes/resumeRoutes.js";

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// const corsOptions = {
//   origin: ["http://localhost:5173", "http://localhost:5174"],
//   credentials: true,
// };
// app.use(cors(corsOptions));

// // Create HTTP server and attach Socket.io
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173", "http://localhost:5174"],
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// // Middleware to inject io instance into each request
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // API routes
// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/company", companyRoute);
// app.use("/api/v1/job", jobRoute);
// app.use("/api/v1/application", applicationRoute);
// app.use("/api/v1/resume", resumeRoutes);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));  // ✅ Fixed

// // Route to delete all notifications
// app.delete("/api/v1/job/deleteNotifications", async (req, res) => {
//   try {
//     await Notification.deleteMany({}); // Delete all notifications
//     res.json({ message: "Notifications deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting notifications" });
//   }
// });

// // Global Error Handling
// app.use((err, req, res, next) => {
//   console.error("Unhandled Error:", err);
//   res.status(500).json({ message: "Internal Server Error" });
// });

// // Start server after DB connection
// const PORT = process.env.PORT || 8000;

// const startServer = async () => {
//   try {
//     await connectDB();
//     server.listen(PORT, () => console.log(`🚀 Server running at port ${PORT}`));
//   } catch (error) {
//     console.error("❌ Database connection failed:", error);
//     process.exit(1);
//   }
// };

// startServer();


import express from "express";
// import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import { Notification } from "./models/notifications.models.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"], credentials: true }));

// Inject io into requests
app.use((req, res, next) => {
    req.io = io;
    next();
});


// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/resume", resumeRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Delete all notifications
app.delete("/api/v1/job/deleteNotifications", async (req, res) => {
    try {
        await Notification.deleteMany({});
        res.json({ message: "✅ Notifications deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message || "❌ Error deleting notifications" });
    }
});

// Global Error Handling
app.use((err, req, res, next) => {
    console.error("❌ Unhandled Error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Start server after DB connection
const PORT = process.env.PORT || 8000;
const startServer = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => console.log(`🚀 Server running at port ${PORT}`));
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
};

startServer();
