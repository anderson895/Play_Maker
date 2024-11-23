import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LinearProgress from "@mui/material/LinearProgress";
import { useState } from "react";
import { supabase, updateEventStatus } from "../../database/supabase";
import sendEmail from "../../database/sendEmail";
import { formatDateTime } from "./Reusable/FormatDate";

const EventCard = ({
  eventId,
  eventTitle,
  organizer,
  email,
  location,
  genre,
  eventStart,
  eventEnd,
  status,
  department,
  organization,
  theme,
  participants,
  maxParticipants,
}) => {
  const [participationFilter, setParticipationFilter] =
    useState("Open to anyone");

  // Determine the event status for specific styling and behavior
  const isRejected = status === "Rejected";
  const isAccepted = status === "Accepted";
  const isPending = status === "Pending";
  const isOngoing = status === "Ongoing";

  // Calculate the percentage of participants
  const participationPercentage = Math.min(
    (participants / maxParticipants) * 100,
    100
  );

  // Dropdown options for participation filter
  const participationOptions = [
    { label: "Open for Anyone", color: "bg-green-500", value: "green" },
    { label: "Inactive Members ", color: "bg-orange-500", value: "orange" },
    { label: "Probationary Members", color: "bg-red-500", value: "red" },
  ];

  // Format event start and end
  const { formattedDate: startDate, formattedTime: startTime } = formatDateTime(
    eventStart.date,
    eventStart.time
  );

  const { formattedDate: endDate, formattedTime: endTime } = formatDateTime(
    eventEnd.date,
    eventEnd.time
  );

  // Function to handle accepting an event
  const handleAcceptEvent = async (eventId, organizerEmail, eventTitle) => {
    try {
      // Update the event status to 'Accepted'
      const { error } = await supabase
        .from("events")
        .update({ event_status: "Accepted" })
        .eq("event_id", eventId);

      if (error) throw error;

      const { error: filterError } = await supabase
        .from("participation")
        .update({
          participant_filter: "green",
          // Storing "green" but UI shows "Open to anyone"
        })
        .eq("event_id", eventId);

      if (filterError) throw filterError;

      // Send email notification to the organizer
      await sendEmail(
        organizerEmail,
        `Your event "${eventTitle}" has been accepted!`,
        `<p>Dear Organizer,</p>
         <p>Your event "<strong>${eventTitle}</strong>" has been accepted by Playmakers Admin.</p>
         <p>For more details, visit your <strong>Previous Booking</strong> located at the top right corner of the booking form.</p>
         <p>Thank you for reaching out to Playmakers - USTP!</p>
         <p>Best Regards, 
         <br/>The Playmakers Family</p>`
      );

      alert("Event accepted successfully and the organizer has been notified!");
    } catch (error) {
      console.error("Error accepting event:", error);
      alert("Failed to accept the event.");
    }
  };

  // Function to handle rejecting an event
  const handleRejectEvent = async (eventId, organizerEmail, eventTitle) => {
    try {
      // Update the event status to 'Rejected'
      const { error } = await supabase
        .from("events")
        .update({ event_status: "Rejected" })
        .eq("event_id", eventId);

      if (error) throw error;

      // Send email notification to the organizer
      await sendEmail(
        organizerEmail,
        `Your event "${eventTitle}" has been rejected`,
        `<p>Dear Organizer,</p><p>Unfortunately, your event "<strong>${eventTitle}</strong>" has been rejected by Playmakers Admin. Please contact us for more details.</p><p>Best regards,<br/>Playmakers Admin</p>`
      );

      alert("Event rejected successfully and the organizer has been notified!");
    } catch (error) {
      console.error("Error rejecting event:", error);
      alert("Failed to reject the event.");
    }
  };

  // Function to notify members based on filter
  const notifyMembersBasedOnFilter = async (eventId, eventTitle, filter) => {
    let statusesToNotify = [];

    // Determine which statuses to notify based on the filter
    if (filter === "green") {
      statusesToNotify = ["Green", "Orange", "Red"]; // Notify all members
    } else if (filter === "orange") {
      statusesToNotify = ["Orange", "Red"]; // Notify Orange and Red members
    } else if (filter === "red") {
      statusesToNotify = ["Red"]; // Notify only Red members
    }

    try {
      // Fetch members based on participation status
      const { data: members, error } = await supabase
        .from("users")
        .select("*")
        .in("participation_status", statusesToNotify);

      if (error) throw error;

      // Notify members via email and Playmakers Hub (web)
      for (const member of members) {
        // Send email notification
        await sendEmail(
          member.email,
          `You are invited to participate in "${eventTitle}"`,
          `<p>Hello ${member.first_name},</p>
         <p>You are invited to participate in the event "<strong>${eventTitle}</strong>"!</p>
         <p>For more details, visit Playmakers Hub.</p>
         <p>Thank you for reaching out to Playmakers - USTP!</p>
         <p>Best regards,<br/>The Playmakers Family</p>`
        );

        // Send in-app (web) notification
        await supabase.from("notifications").insert({
          event_id: eventId,
          user_id: member.id,
          notification_type: "web",
          content: `You are invited to participate in the event "${eventTitle}". Visit Playmakers Hub for more details.`,
        });
      }
    } catch (error) {
      console.error("Error notifying members: ", error);
      alert("Failed to notify members");
    }
  };

  // Function to handle creating the event and notifying based on the filter
  const handleCreateEvent = async () => {
    try {
      // Update event status to "Ongoing"
      await updateEventStatus(eventId, "Ongoing");

      // Notify members based on the participation filter
      await notifyMembersBasedOnFilter(
        eventId,
        eventTitle,
        participationFilter
      );
      console.log(participationFilter);
      console.log("member email", email);
      alert("Event Successfully created and members notified!");
    } catch (error) {
      console.error("Error updating event status:", error);
      alert("Failed to create event");
    }
  };

  return (
    <div
      className={`${
        isRejected ? "bg-gray-100 shadow-sm" : "bg-white shadow-md"
      } rounded-lg mb-6`}
    >
      {/* Card Header */}
      <div
        className={`${
          isRejected
            ? "bg-gradient-to-r from-gray-400 to-gray-500"
            : "bg-gradient-to-r from-[#C2396C] to-[#5C1B33]"
        } p-4 rounded-t-lg border-b-2 ${
          isRejected ? "border-gray-300" : "border-[#FBEBF1]"
        }`}
      >
        {/* Theme Tag */}
        {!genre && genre.length === 0 && theme && (
          <div className="mb-2 text-white text-sm font-semibold">
            Theme:
            <span
              className={`${
                isRejected
                  ? "bg-gray-200 text-gray-700"
                  : "bg-[#FBEBF1] text-[#5C1B33]"
              } px-4 py-1 text-sm font-semibold rounded-full ms-2`}
            >
              {theme}
            </span>
          </div>
        )}

        {/* Event Title and Accepted Icon */}
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg text-white">{eventTitle}</h3>
          {isAccepted && (
            <CheckCircleIcon sx={{ color: "white", width: 30, height: 30 }} />
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <div className="mb-4">
          <p className="font-semibold">{organizer}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm">
            <LocationOnIcon sx={{ color: isRejected ? "gray" : "#5C1B33" }} />
            <span className="p-1 py-1 text-sm font-semibold">{location}</span>
          </p>

          {/* Department or Organization */}
          <div>
            <p className="flex items-center">
              <ApartmentIcon sx={{ color: isRejected ? "gray" : "#5C1B33" }} />
              <span className="p-1 py-1 text-sm font-semibold">
                {department || organization}
              </span>
            </p>
          </div>
          {/* genre */}
          {genre && genre.length > 0 && (
            <div className="flex space-x-2 mt-4 text-black-600 text-sm font-semibold">
              Genre:
              <span
                className={`${
                  isRejected
                    ? "bg-gray-300 text-gray-600"
                    : "bg-pink-500 text-white"
                } px-4 py-1 text-sm font-semibold ms-2`}
              >
                {genre}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between mb-4">
          <div>
            <p className="font-semibold">Event Start</p>
            <p className="text-gray-700">
              {startDate} <br />
              {startTime}
            </p>
          </div>
          <div>
            <p className="font-semibold">Event End</p>
            <p className="text-gray-700">
              {endDate} <br />
              {endTime}
            </p>
          </div>
        </div>

        {/* Dropdown for Participation Filter */}
        {isAccepted && (
          <div className="mb-4">
            <select
              value={participationFilter}
              onChange={(e) => {
                setParticipationFilter(e.target.value);
              }}
              className="block w-full px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md"
            >
              {participationOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Participation Bar */}
        {isOngoing && (
          <div className="mb-4">
            <p className="font-semibold mb-2">
              Participants: {participants}/{maxParticipants}
            </p>
            <LinearProgress
              variant="determinate"
              value={participationPercentage}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor:
                    participationPercentage === 100 ? "#5C1B33" : "#A7A7A7",
                },
              }}
            />
          </div>
        )}

        {/* Pending Status Actions (Accept or Reject) */}
        <div className="flex justify-between items-center gap-3">
          {isPending ? (
            <div className="w-full flex gap-2">
              <button
                className="flex items-center justify-center text-white bg-green-600 px-4 py-2 rounded-lg w-full"
                onClick={() => {
                  handleAcceptEvent(eventId, email, eventTitle);
                }}
              >
                <FaCheckCircle className="mr-2" /> Accept
              </button>
              <button
                className="flex items-center justify-center text-white bg-red-600 px-4 py-2 rounded-lg w-full"
                onClick={() => {
                  handleRejectEvent(eventId, email, eventTitle);
                }}
              >
                <FaTimesCircle className="mr-2" /> Reject
              </button>
            </div>
          ) : (
            <div className="w-full">
              <button
                className={`${
                  isRejected || participants < maxParticipants
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[#5C1B33] text-white"
                } px-4 py-2 rounded-lg w-full`}
                disabled={isRejected || participants < maxParticipants}
                onClick={isAccepted ? handleCreateEvent : undefined}
              >
                {isRejected
                  ? "Rejected"
                  : isOngoing
                  ? "Publish Event"
                  : "Create Event"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
