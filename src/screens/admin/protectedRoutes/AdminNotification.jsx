/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Sidebar from "../../../components/admin/Sidebar";
import Header from "../../../components/admin/Header";
import { supabase } from "../../../database/supabase";

const  AdminNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    fetchNotifications();

    const interval = setInterval(() => {
      checkAndNotifyAllEvents();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("content, sent_at")
        .order("sent_at", { ascending: false });
      console.log(data)
      if (error) {
        setError(error.message);
      } else {
        setNotifications(data);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false)
    }
  };

  const checkAndNotifyAllEvents = async () => {
    try {
      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select("event_id");

      if (eventsError) {
        console.error("Error fetching events:", eventsError);
        return;
      }

      for (const event of events) {
        await checkAndNotifyEventFull(event.event_id);
      }

      fetchNotifications();
    } catch (err) {
      console.error("Error checking events:", err);
    }
  };

  const checkAndNotifyEventFull = async (eventId) => {
    try {
      const { data: required, error: requiredError } = await supabase
        .from("musicians_required")
        .select("guitarist, keyboardist, vocalists, bassist, percussionist")
        .eq("event_id", eventId)
        .single();
  
      if (requiredError) {
        console.error("Error fetching musician requirements:", requiredError);
        return;
      }
  
      const totalRequired =
        required.guitarist +
        required.keyboardist +
        required.vocalists +
        required.bassist +
        required.percussionist;
  
      const { data: participants, error: participantsError } = await supabase
        .from("participation")
        .select("*") 
        .eq("event_id", eventId);
  
      if (participantsError) {
        console.error("Error fetching participants:", participantsError);
        return;
      }
  
      if (participants.length >= totalRequired) {
        const { data: existingNotification } = await supabase
          .from("notifications")
          .select("id")
          .eq("event_id", eventId)
          .single();
  
        if (!existingNotification) {
          const { error: notificationError } = await supabase
            .from("notifications")
            .insert([
              {
                event_id: eventId,
                user_id: null,
                notification_type: "web",
                content: `The event with ID ${eventId} has reached full capacity.`,
                sent_at: new Date(),
              },
            ]);
  
          if (notificationError) {
            console.error("Error inserting notification:", notificationError);
          } else {
            console.log(`Notification sent for event ${eventId}`);
          }
        }
      }
    } catch (err) {
      console.error("Error checking event capacity:", err);
    }
  };
  

  return (
    <div className="min-h-screen flex bg-[#FBEBF1]">
      <Sidebar />
      <div className="flex-1">
        <Header title="Notifications" />
        <div className="p-6">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Admin Notifications</h2>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : notifications.length > 0 ? (
              <ul className="space-y-4">
                {notifications.map((notification, index) => (
                  <li
                    key={index}
                    className="p-4 border rounded-md shadow-sm bg-gray-100"
                  >
                    <p className="text-gray-700">{notification.content}</p>
                    <span className="text-gray-500 text-sm">
                      Sent at: {new Date(notification.sent_at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notifications to display.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotification;
