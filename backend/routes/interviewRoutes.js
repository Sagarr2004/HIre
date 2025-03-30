import express from "express";
import { getInterviewByUserId } from "../controllers/interview.controllers.js";

const router = express.Router();

router.get("/:userId", getInterviewByUserId);

export default router;
