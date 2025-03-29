import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "sonner";

const socket = io("http://localhost:8000", { transports: ["websocket"] });

const Alerts = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    // Fetch notifications from the backend
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/v1/job/getNotifications", {
          withCredentials: true,
        });
        setNotifications(data.notifications.map((n) => n.message));
      } catch (error) {
        console.error("Error fetching notifications:", error.response?.data?.message || error.message);
      }
    };

    fetchNotifications();

    // Listen for new job postings
    socket.on("newJobPosted", (data) => {
      setNotifications((prev) => [...prev, data.message]);
    });

    // Auto-delete notifications after 5 minutes (300,000 ms)
    const deleteTimeout = setTimeout(async () => {
      try {
          const res  = await axios.delete("http://localhost:8000/api/v1/job/deleteNotifications", {
          withCredentials: true,
        });
        // Clear from frontend
        if(res.data.message){
            setNotifications([]);
            toast.success(res.data.message);
            window.location.reload()
        }
        
      } catch (error) {
        console.error("Error deleting notifications:", error.response?.data?.message || error.message);
      }
    }, 10000); // Change to 10 * 60 * 1000 for 10 min

    return () => {
      socket.off("newJobPosted");
      socket.disconnect();
      clearTimeout(deleteTimeout);
    };
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        📢 Student Notifications
      </h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No new notifications</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif, index) => (
            <div
              key={index}
              className="p-3 bg-blue-100 border-l-4 border-blue-500 text-blue-900 rounded-md shadow-sm"
            >
              {notif}
            </div>
          ))}
        </div>
    )}
   </div>
  );
};

export default Alerts;
