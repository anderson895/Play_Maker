import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const createBookingProcess = async (formData) => {
  try {
    // Step 1: Insert the booking into the bookings table
    const { data: bookingData, error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          organizer_first_name: formData.firstName,
          organizer_last_name: formData.lastName,
          organizer_email: formData.email,
          event_location: formData.location,
          event_type: formData.eventType,
          event_type_name: formData.eventTypeName,
          date_created: new Date(),
        },
      ])
      .select();

    if (bookingError) throw bookingError;

    const bookingId = bookingData[0]?.booking_id;

    // Step 2: Insert the event into the events table
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .insert([
        {
          booking_id: bookingId,
          event_title: formData.title,
          start_date: formData.startDate,
          end_date: formData.endDate,
          start_time: formData.startTime,
          end_time: formData.endTime,
          genre: formData.genre,
          theme: formData.theme,
          description: formData.description,
          event_status: "Pending",
          date_created: new Date(),
        },
      ])
      .select();

    if (eventError) throw eventError;

    const eventId = eventData[0]?.event_id;

    // Step 3: Insert the musician requirements into the musicians_required table
    const { data: musicianData, error: musicianError } = await supabase
      .from("musicians_required")
      .insert([
        {
          event_id: eventId,
          guitarist: formData.guitarist,
          vocalists: formData.vocalist,
          bassist: formData.bassist,
          keyboardist: formData.keyboardist,
          percussionist: formData.percussionist,
        },
      ])
      .select();

    if (musicianError) throw musicianError;

    return { bookingData, eventData, musicianData };
  } catch (error) {
    console.error("Error in booking process:", error);
    throw error;
  }
};

export const updateEventStatus = async (eventId, newStatus) => {
  try {
    const { data, error } = await supabase
      .from("events")
      .update({ event_status: newStatus })
      .eq("event_id", eventId);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error updating event status:", error);
    throw error;
  }
};

export const retrievePendingEvents = async () => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select(
        `
        *,
        bookings (
          organizer_first_name,
          organizer_last_name,
          organizer_email,
          event_location,
          event_type_name
        )
      `
      )
      .eq("event_status", "Pending");

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching pending events:", error);
    throw error;
  }
};

export const retrieveRejectedEvents = async () => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select(
        `
        *,
        bookings (
          organizer_first_name,
          organizer_last_name,
          organizer_email,
          event_location,
          event_type_name
        )
      `
      )
      .eq("event_status", "Rejected");

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching rejected events:", error);
    throw error;
  }
};

export const retrieveAcceptedEvents = async () => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select(
        `
        *,
        bookings (
          organizer_first_name,
          organizer_last_name,
          organizer_email,
          event_location,
          event_type_name
        )
      `
      )
      .eq("event_status", "Accepted");

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching accepted events:", error);
    throw error;
  }
};

export const retrieveOngoingEvents = async () => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select(
        `
        *,
        bookings (
          organizer_first_name,
          organizer_last_name,
          organizer_email,
          event_location,
          event_type_name
        ),
        musicians_required (
          guitarist,
          keyboardist,
          vocalists,
          bassist,
          percussionist
        )
      `
      )
      .eq("event_status", "Ongoing");

    if (error) throw error;

    return data.map((event) => {
      // Get the first musician entry from the array
      const musicianData = event.musicians_required[0] || {};

      const totalMusicians =
        (musicianData.guitarist || 0) +
        (musicianData.keyboardist || 0) +
        (musicianData.vocalists || 0) +
        (musicianData.bassist || 0) +
        (musicianData.percussionist || 0);

      return {
        ...event,
        totalMusicians,
      };
    });
  } catch (error) {
    console.error("Error fetching ongoing events:", error);
    throw error;
  }
};

// new

export const fetchBookingStatus = async (bookingID) => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("event_status")
      .eq("booking_id", bookingID)
      .single();

    if (error) throw error;

    return data?.event_status || "Unknown"; // Return status or "Unknown" if not found
  } catch (error) {
    console.error("Error fetching booking status:", error);
    throw error;
  }
};

export const fetchPastEvents = async () => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select(
        `
        *,
        bookings (
          organizer_first_name,
          organizer_last_name,
          organizer_email,
          event_location,
          event_type,
          event_type_name
        ),
        musicians_required (
          guitarist,
          keyboardist,
          vocalists,
          bassist,
          percussionist
        )
      `
      )
      .lt("end_date", new Date().toISOString()) // Filtering for past events
      .order("end_date", { ascending: false });

    if (error) throw error;

    // Map through events to calculate total musicians required if needed
    return data.map((event) => {
      // handle missing musicians_required data
      const musicianData = event.musicians_required[0] || {};

      // Calculate total musicians needed
      const totalMusicians =
        (musicianData.guitarist || 0) +
        (musicianData.keyboardist || 0) +
        (musicianData.vocalists || 0) +
        (musicianData.bassist || 0) +
        (musicianData.percussionist || 0);

      return {
        ...event,
        totalMusicians,
      };
    });
  } catch (error) {
    console.error("Error fetching past events:", error);
    throw error;
  }
};

// new
export const fetchUserType = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("user_type")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return data?.user_type;
  } catch (error) {
    console.error("Error fetching user type:", error);
    throw error;
  }
};

export const fetchEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events') 
      .select('*') 
      .order('start_date', { ascending: true }); 

    if (error) {
      console.error('Error fetching events:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Unexpected error fetching events:', err);
    return null;
  }
};

export const createMember = async (memberData) => {
  try {
    const { data, error } = await supabase
      .from('members_orgs')
      .insert([memberData]);

    if (error) {
      console.error('Error creating member:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
};

export const fetchMembers = async () => {
  try {
    const { data, error } = await supabase
      .from('members_orgs')
      .select('*');

    if (error) {
      console.error('Error fetching members:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
};

export const fetchMemberById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('members_orgs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching member by ID:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
};

export const updateMember = async (id, updatedData) => {
  try {
    const { data, error } = await supabase
      .from('members_orgs')
      .update(updatedData)
      .eq('id', id);

    if (error) {
      console.error('Error updating member:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
};

export const deleteMember = async (id) => {
  try {
    const { data, error } = await supabase
      .from('members_orgs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting member:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
};
