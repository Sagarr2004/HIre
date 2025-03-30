import { Interview } from "../models/Interview.models.js";

export const getInterviewByUserId = async (req, res) => {
    try {
        console.log("Running");
        const { userId } = req.params;
        console.log("UserId:", userId);

        const interview = await Interview.findOne({ userId });

        console.log("Interview:", interview);  // Log the result from MongoDB

        return res.status(200).json({ success: true, interview });

    } catch (error) {
        console.error("Error fetching interview details:", error);
        res.status(500).json({ message: error.message, success: false }); // More detailed error
    }
};
