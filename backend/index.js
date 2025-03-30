import express from "express";// import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";


import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import { Notification } from "./models/notifications.models.js";
import alumniRoutes from "./routes/alumini.route.js"
import mongoose from "mongoose"
import interviewRoutes from "./routes/interviewRoutes.js"
import {Job} from "./models/job.model.js"
import { Interview } from "./models/Interview.models.js";

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
app.use("/api/alumni", alumniRoutes);
// app.use("/api/interviews", interviewRoutes);

app.get("/interviews/67a0f2fe173fa25918a0f035", async (req, res) => {
  try {
      const { userId } = "67a0f2fe173fa25918a0f035";

      // Directly search for userId as a string (without converting to ObjectId)
      const interview = await Interview.findOne({ userId });

      if (!interview) {
          return res.status(404).json({ success: true, interview: null, message: "No interview found" });
      }

      res.status(200).json({ success: true, interview });
  } catch (error) {
      console.error("Error fetching interview:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Delete all notifications
app.delete("/api/v1/job/deleteNotifications", async (req, res) => {
    try {
        await Notification.deleteMany({});
        res.json({ message: "✅ Notifications deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message || "❌ Error deleting notifications" });
    }
});

app.get('/api/jobs/:id', async (req, res) => {
  try {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: "Job not found" });
      res.json(job);
  } catch (error) {
      res.status(500).json({ message: "Error fetching job details" });
  }
});


// app.get("/api/get-jobById/:interviewId", async (req, res) => {
//     try {
//       const { interviewId } = req.params;
  
//       if (!interviewId) {
//         return res.status(400).json({ success: false, message: "Interview ID is required" });
//       }
  
//       const interview = await Interview.findById(interviewId);
//       if (!interview) {
//         return res.status(404).json({ success: false, message: "Interview not found" });
//       }
  
//       const job = await Job.findById(interview.jobId);
//       if (!job) {
//         return res.status(404).json({ success: false, message: "Job not found" });
//       }
  
//       res.json({ success: true, job });
//     } catch (error) {
//       console.error("Error fetching job details:", error);
//       res.status(500).json({ success: false, message: "Internal server error" });
//     }
//   });
  

const recruiterSchema = new mongoose.Schema({
    name: String,
    domain: String,
    skills: [String],
  });
  
  const Recruiter = mongoose.model("Recruiter", recruiterSchema);
  
  app.post("/api/recruiters/add", async (req, res) => {
    try {
      const { name, domain, skills } = req.body;
      const newRecruiter = new Recruiter({ name, domain, skills });
      await newRecruiter.save();
      res.json({ success: true, message: "Recruiter added successfully!" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error." });
    }
  });
  
  app.get("/api/recruiters", async (req, res) => {
    const recruiters = await Recruiter.find();
    res.json(recruiters);
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
