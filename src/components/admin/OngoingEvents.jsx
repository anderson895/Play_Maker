import { useState, useEffect } from "react";
import EventCard from "./EventCard";
import { retrieveOngoingEvents } from "../../database/supabase";

const OngoingEvents = () => {
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOngoingEvents = async () => {
      try {
        const data = await retrieveOngoingEvents();
        setOngoingEvents(data);
        console.log(data);
      } catch (err) {
        setError("Failed to retrieve ongoing events.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOngoingEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {ongoingEvents.length > 0 ? (
        ongoingEvents.map((event, index) => (
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
            department={event.department}
            organization={event.bookings.event_type_name}
            participants={0}
            maxParticipants={event.totalMusicians}
          />
        ))
      ) : (
        <div>No ongoing events available.</div>
      )}
    </div>
  );
};

export default OngoingEvents;
