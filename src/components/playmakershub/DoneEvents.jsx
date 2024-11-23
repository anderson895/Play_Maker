import { useEffect, useState } from "react";
import { fetchPastEvents } from "../../database/supabase";

const DoneEvents = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPastEvents = async () => {
      try {
        const data = await fetchPastEvents();
        setPastEvents(data);
      } catch (error) {
        console.error("Failed to fetch past events:", error);
      } finally {
        setLoading(false);
      }
    };

    getPastEvents();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-6">
      {pastEvents.length > 0 ? (
        pastEvents.map((event) => (
          <div
            key={event.event_id}
            className="bg-gray-800 p-4 rounded shadow-md"
          >
            <h3 className="text-xl font-bold text-white">
              {event.event_title}
            </h3>
            <p className="text-gray-400">
              {new Date(event.start_date).toLocaleDateString()} -{" "}
              {new Date(event.end_date).toLocaleDateString()} |{" "}
              {event.bookings.event_location}
            </p>
            <p className="text-gray-300">
              Organizer: {event.bookings.organizer_first_name}{" "}
              {event.bookings.organizer_last_name}
            </p>
            <p className="text-gray-300">
              Total Musicians Required: {event.totalMusicians}
            </p>
            <p className="text-blue-500 cursor-pointer">View Details</p>
          </div>
        ))
      ) : (
        <p className="text-white">No past events available</p>
      )}
    </div>
  );
};

export default DoneEvents;
