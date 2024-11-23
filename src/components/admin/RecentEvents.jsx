import { useEffect, useState } from 'react';
import { fetchEvents } from '../../api/supabase'; // Adjust the path as needed

export const RecentAddedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEvents = async () => {
      const data = await fetchEvents();
      if (data) {
        setEvents(data);
      }
      setLoading(false);
    };
    getEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recent-events">
      {events.length > 0 ? (
        <ul>
          {events.map((event) => (
            <li key={event.event_id}>
              <h3>{event.event_title}</h3>
              <p>
                {event.start_date} - {event.end_date} ({event.start_time} to{' '}
                {event.end_time})
              </p>
              <p>{event.genre || 'No genre specified'}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No events available</p>
      )}
    </div>
  );
};
