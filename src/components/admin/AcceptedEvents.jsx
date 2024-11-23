import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { retrieveAcceptedEvents } from "../../database/supabase";

const AcceptedEvents = () => {
  const [acceptedEvents, setAcceptedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcceptedEvents = async () => {
      try {
        const data = await retrieveAcceptedEvents();
        setAcceptedEvents(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching accepted events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {acceptedEvents.length > 0 ? (
        acceptedEvents.map((event, index) => (
          <EventCard
            key={index}
            eventId={event.event_id}
            eventTitle={event.event_title}
            organizer={`${event.bookings.organizer_first_name} ${event.bookings.organizer_last_name}`}
            email={event.bookings.organizer_email}
            location={event.bookings.event_location}
            genre={event.genre}
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
        ))
      ) : (
        <div>No accepted events found</div>
      )}
    </div>
  );
};

export default AcceptedEvents;
