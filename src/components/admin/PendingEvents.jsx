import { useState, useEffect } from "react";
import EventCard from "./EventCard";
import { retrievePendingEvents } from "../../database/supabase";

const PendingEvents = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingEvents = async () => {
      try {
        const events = await retrievePendingEvents();
        setPendingEvents(events);
        setLoading(false);
        console.log(events);
      } catch (error) {
        console.error("Error fetching pending events:", error);
        setLoading(false);
      }
    };

    fetchPendingEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (pendingEvents.length === 0) {
    return <div>No pending events found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {pendingEvents.map((event, index) => (
        <EventCard
          key={index}
          eventId={event.event_id}
          eventTitle={event.event_title}
          organizer={`${event.bookings.organizer_first_name} ${event.bookings.organizer_last_name}`}
          email={event.bookings.organizer_email}
          location={event.bookings.event_location}
          genre={event.genre}
          theme={event.theme}
          eventStart={{
            date: event.start_date,
            time: event.start_time,
          }}
          eventEnd={{
            date: event.end_date,
            time: event.end_time,
          }}
          status={event.event_status}
          department={event.bookings.event_type_name}
          participants={event.participants}
          maxParticipants={event.maxParticipants}
        />
      ))}
    </div>
  );
};

export default PendingEvents;
