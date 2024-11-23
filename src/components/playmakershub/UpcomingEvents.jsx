import { useEffect, useState } from "react";
import { retrieveOngoingEvents } from "../../database/supabase";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const ongoingEvents = await retrieveOngoingEvents();
      setEvents(ongoingEvents);
    };

    fetchEvents();
  }, []);

  return (
    <div className="Content p-4 md:flex md:flex-col md:justify-between md:px-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Upcoming Events</h2>
    </div>
  );
};

export default UpcomingEvents;
