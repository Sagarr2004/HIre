import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }, // Applicant who has been scheduled for the interview

    jobId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Job", 
        required: true 
    }, // Job for which the interview is scheduled

    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
        required: true
    }, // Application related to the interview

    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    }, // The company conducting the interview

    interviewDate: { 
        type: Date, 
        required: true 
    }, // Scheduled date and time for the interview

    status: {
        type: String,
        enum: ["scheduled", "completed", "cancelled"],
        default: "scheduled"
    }, // Status of the interview

    notes: { 
        type: String 
    } // Additional details about the interview
}, { timestamps: true });

export const Interview = mongoose.model("Interview", interviewSchema);
