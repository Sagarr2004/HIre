import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export default function CalendarComponent() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState({});

  useEffect(() => {
    const fetchUserId = () => {
      const token = Cookies.get("token");
      if (!token) {
        console.warn("No token found in cookies! Ensure you are logged in.");
        return null;
      }

      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);
        return decodedToken.userId || null;
      } catch (error) {
        console.error("Invalid token!", error);
        return null;
      }
    };

    const userId = fetchUserId();
    if (!userId) {
      console.warn("User ID is missing. Cannot fetch interviews.");
      return;
    }

    console.log("Fetching interviews for user:", userId);

    const fetchInterviewDetails = async (userId) => {
      try {
        const response = await fetch(`http://localhost:8000/api/interviews/${userId}`);
        const data = await response.json();
        console.log("Full API Response:", data);

        if (!data.success || !data.interview) {
          console.warn("Unexpected API response structure or no interview found:", data);
          return;
        }

        const interviewNotes = {};
        const interview = data.interview;

        if (interview && interview.date) {
          // Assuming interview.date is a string (e.g., '2025-03-31')
          interviewNotes[new Date(interview.date).toDateString()] = interview.message || "Interview Scheduled";
        } else {
          console.warn("Interview date is missing:", interview);
        }

        console.log("Final Processed Interview Notes:", interviewNotes);
        setNotes(interviewNotes); // Update the notes state to highlight the date
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    // First useEffect - fetch interview details with userId fetched from the token
    fetchInterviewDetails("67a0f2fe173fa25918a0f035"); // Directly passing the ID as per your request

  }, []); // Empty dependency array, so this effect runs only once after the initial render

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold text-center mb-4">Interview Calendar</h2>

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={({ date }) =>
          // If the date exists in notes, apply the style
          notes[date.toDateString()] ? "bg-yellow-300 text-black font-bold rounded-full" : ""
        }
        className="w-full border rounded-lg p-2"
      />

      <p className="mt-4 text-center text-lg font-semibold">
        Selected Date: <span className="text-blue-500">{selectedDate.toDateString()}</span>
      </p>
    </div>
  );
}
