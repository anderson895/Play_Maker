import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { retrieveRejectedEvents } from "../../database/supabase"; // You need to create this function

const RejectedEvents = () => {
  const [rejectedEvents, setRejectedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRejectedEvents = async () => {
      try {
        const data = await retrieveRejectedEvents(); // Fetch rejected events from Supabase
        setRejectedEvents(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching rejected events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRejectedEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {rejectedEvents.length > 0 ? (
        rejectedEvents.map((event, index) => (
          <EventCard
            key={index}
            eventId={event.event_id} // Event ID
            eventTitle={event.event_title} // Event Title
            organizer={`${event.bookings.organizer_first_name} ${event.bookings.organizer_last_name}`} // Organizer Name
            email={event.bookings.organizer_email} // Organizer Email
            location={event.bookings.event_location} // Event Location
            genre={event.genre} // Event Genre
            eventStart={{
              date: event.start_date,
              time: event.start_time,
            }}
            eventEnd={{
              date: event.end_date,
              time: event.end_time,
            }}
            status={event.event_status} // Event Status (Rejected)
            department={event.bookings.event_type_name} // Department/Organization
            participants={event.participants} // Participants
            maxParticipants={event.maxParticipants} // Max Participants
          />
        ))
      ) : (
        <div>No rejected events found</div>
      )}
    </div>
  );
};

export default RejectedEvents;
