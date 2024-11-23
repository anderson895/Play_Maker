import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useState } from "react";
import { supabase } from "../../database/supabase";

const BookingForm = ({
  formData,
  handleChange,
  handleSubmit,
  handleEditSubmit,
  handleCaptchaVerify,
  handleBookingIDSubmit,
  enteredBookingID,
  setEnteredBookingID,
  modalRef,
  today,
  isEditMode,
  isViewMode,
  onClose,
  captchaVerified,
  status,
}) => {
  const [bookingIDPopupVisible, setBookingIDPopupVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isBookingPending, setIsBookingPending] = useState(false);

  const isDisabled = isViewMode;
  const toggleBookingIDPopup = () => {
    setBookingIDPopupVisible(!bookingIDPopupVisible);
  };

  const getTitle = () => {
    if (isEditMode) return "Edit Booking";
    if (isViewMode) return "View Booking Details";
    return "Book Event";
  };

  const buttonStyle =
    isEditMode && !captchaVerified
      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
      : "bg-[#b70039] text-white cursor-pointer";

  // Define styles for each status type
  const statusStyles = {
    pending: "bg-yellow-400 text-yellow-900",
    accepted: "bg-green-500 text-white",
    rejected: "bg-red-500 text-white",
    ongoing: "bg-blue-500 text-white",
    published: "bg-purple-500 text-white",
    done: "bg-gray-500 text-white",
  };

  const checkBookingStatus = async (bookingID) => {
    const { data, error } = await supabase
      .from("events")
      .select("event_status")
      .eq("booking_id", bookingID)
      .single();

    if (!error) {
      setIsBookingPending(data.event_status === "Pending");
    }
  };

  const fetchChatMessages = async () => {
    const bookingID = enteredBookingID;
    if (bookingID && isBookingPending) {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("booking_id", bookingID)
        .order("timestamp", { ascending: true });
      if (!error) setChatMessages(data);
    }
  };

  const handleSendMessage = async () => {
    const bookingID = enteredBookingID;
    if (newMessage.trim() && bookingID && isBookingPending) {
      const { error } = await supabase.from("chats").insert([
        {
          booking_id: bookingID,
          sender_role: "organizer",
          sender_email: formData.email,
          message: newMessage,
          timestamp: new Date().toISOString(),
        },
      ]);
      if (!error) setNewMessage("");
    }
  };

  useEffect(() => {
    const bookingID = enteredBookingID;
    if (isEditMode && bookingID) {
      checkBookingStatus(bookingID).then(() => {
        if (isBookingPending) fetchChatMessages();

        // Setup Supabase Realtime Channel for this booking ID
        const channel = supabase
          .channel(`chats:booking_id=${bookingID}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "chats",
              filter: `booking_id=eq.${bookingID}`,
            },
            (payload) => {
              setChatMessages((prev) => [...prev, payload.new]);
            }
          )
          .subscribe();

        // Cleanup on component unmount
        return () => {
          supabase.removeChannel(channel);
        };
      });
    }
  }, [isEditMode, enteredBookingID, isBookingPending]);
  return (
    <div
      className="bg-[#36303C] p-8 rounded-lg shadow-lg w-2/4 h-4/5 overflow-y-scroll"
      ref={modalRef}
    >
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl text-white mb-4">{getTitle()}</p>
        {/* Hide "Previous Booking" button in view mode */}
        {!isEditMode && !isViewMode && (
          <button
            onClick={toggleBookingIDPopup}
            className="bg-[#b70039] text-white py-1 px-2 rounded-md"
          >
            Previous Booking
          </button>
        )}
        {/* Show status badge only in edit or view mode */}
        {(isEditMode || isViewMode) && (
          <div className="flex justify-between items-center mb-4">
            <p className="text-white text-sm font-semibold mr-2">Status:</p>
            {/* Display status badge */}
            <span
              className={`py-1 px-3 rounded-full text-sm font-bold ${
                statusStyles[status.toLowerCase()] ||
                "bg-gray-300 text-gray-700"
              }`}
            >
              {status}
            </span>
          </div>
        )}
      </div>

      {bookingIDPopupVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#36303C] p-8 rounded-lg shadow-lg w-1/3 relative">
            <h2 className="text-xl text-white mb-4">Enter Your Booking ID</h2>
            <input
              type="text"
              value={enteredBookingID}
              onChange={(e) => setEnteredBookingID(e.target.value)}
              className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1 mb-4 placeholder-gray-500"
              placeholder="Booking ID"
            />
            <button
              onClick={() => {
                handleBookingIDSubmit();
                toggleBookingIDPopup();
              }}
              className="w-full bg-[#b70039] text-white py-2 rounded-lg cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Chat Section */}
      {isEditMode && isBookingPending && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold mb-2 text-[#A83C70]">
            Chat with Playmakers Admin
          </h3>
          <div className="max-h-64 h-52 overflow-y-auto bg-[#FBEBF1] p-2 rounded-lg mb-2">
            {chatMessages.map((msg, index) => {
              // Check if date separator is needed
              const showDateSeparator =
                index === 0 ||
                new Date(chatMessages[index - 1].timestamp).toDateString() !==
                  new Date(msg.timestamp).toDateString();

              return (
                <div key={msg.chat_id}>
                  {/* Date Separator */}
                  {showDateSeparator && (
                    <div className="text-center text-gray-500 text-xs mb-2">
                      {new Date(msg.timestamp).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`flex flex-col ${
                      msg.sender_role === "admin" ? "items-end" : "items-start"
                    } my-2`}
                  >
                    <div
                      title={new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                      className={`max-w-xs p-2 px-4 rounded-[18px] text-start text-sm ${
                        msg.sender_role === "admin"
                          ? " bg-white text-black border border-gray-300"
                          : "bg-black text-white "
                      }`}
                    >
                      <span>{msg.message}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message"
              className="flex-1 p-2 rounded-lg border border-gray-300"
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 px-4 py-2 bg-[#B70039] text-white rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Display message if chat is disabled */}
      {isEditMode && !isBookingPending && (
        <p className="text-yellow-500 text-center mb-4">
          Chat is disabled as the booking is not pending.
        </p>
      )}
      {/* Form Section */}
      <form
        // onSubmit={isEditMode ? handleEditSubmit : handleSubmit}
        onSubmit={
          isViewMode ? onClose : isEditMode ? handleEditSubmit : handleSubmit
        }
      >
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm text-gray-400">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1 placeholder-gray-500"
            placeholder="Event Title"
            required
            disabled={isDisabled}
          />
        </div>

        {/* Event Type, Dates, First Name, Last Name, etc. */}
        {/* Event Type */}
        <div className="flex justify-between mb-4">
          <div className="w-[35%]">
            <label className="block text-sm text-gray-400">Event Type</label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1"
              required
              disabled={isDisabled}
            >
              <option value="Department">Department</option>
              <option value="Organization">Organization</option>
            </select>
          </div>
          <div className="w-[60%]">
            <label className="block text-sm text-gray-400">
              Department/Organization Name
            </label>
            <input
              type="text"
              name="eventTypeName"
              value={formData.eventTypeName}
              onChange={handleChange}
              className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1 placeholder-gray-500"
              placeholder="Department/Organization Name"
              required
              disabled={isDisabled}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="flex justify-between mb-4">
          <div className="w-[48%]">
            <label htmlFor="startDate" className="block text-sm text-gray-400">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              min={today}
              value={formData.startDate}
              onChange={handleChange}
              className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1"
              required
              disabled={isDisabled}
            />
          </div>
          <div className="w-[48%]">
            <label htmlFor="endDate" className="block text-sm text-gray-400">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              min={formData.startDate || today}
              value={formData.endDate}
              onChange={handleChange}
              className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1"
              required
              disabled={isDisabled}
            />
          </div>
        </div>

        {/* Time */}
        <div className="flex justify-between mb-4">
          <div className="w-[48%]">
            <label htmlFor="startTime" className="block text-sm text-gray-400">
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1"
              required
              disabled={isDisabled}
            />
          </div>
          <div className="w-[48%]">
            <label htmlFor="endTime" className="block text-sm text-gray-400">
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1"
              required
              disabled={isDisabled}
            />
          </div>
        </div>

        {/* First Name and Last Name */}
        <div className="flex justify-between mb-4">
          <div className="w-[48%]">
            <label htmlFor="firstName" className="block text-sm text-gray-400">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1 placeholder-gray-500"
              placeholder="First Name"
              required
              disabled={isDisabled}
            />
          </div>
          <div className="w-[48%]">
            <label htmlFor="lastName" className="block text-sm text-gray-400">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1 placeholder-gray-500"
              placeholder="Last Name"
              required
              disabled={isDisabled}
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm text-gray-400">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1 placeholder-gray-500"
            placeholder="Email"
            required
            disabled={isDisabled}
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm text-gray-400">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1 placeholder-gray-500"
            placeholder="Event Location"
            required
            disabled={isDisabled}
          />
        </div>

        {/* Genre/Theme */}
        <p className="text-sm text-gray-400 mb-4">
          Genre: e.g Rock, Pop Music, Classical Music.
          <br />
          Theme: e.g Unveil the Secrets, Throwback Friday.
        </p>
        <div className="flex justify-between mb-4">
          <div className="w-[35%]">
            <label className="block text-sm text-gray-400">Genre/Theme</label>
            <select
              name="genreThemeHolder"
              value={formData.genreThemeHolder}
              onChange={handleChange}
              className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1"
              required
              disabled={isDisabled}
            >
              <option value="Genre">Genre</option>
              <option value="Theme">Theme</option>
            </select>
          </div>
          <div className="w-[60%]">
            <label className="block text-sm text-gray-400">
              {formData.genreThemeHolder === "Genre" ? "Genre" : "Theme"}{" "}
              Description
            </label>
            <input
              type="text"
              name={formData.genreThemeHolder === "Genre" ? "genre" : "theme"}
              value={
                formData.genreThemeHolder === "Genre"
                  ? formData.genre
                  : formData.theme
              }
              onChange={handleChange}
              className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1 placeholder-gray-500"
              placeholder={
                formData.genreThemeHolder === "Genre"
                  ? "Enter genre (e.g., Rock, Pop)"
                  : "Enter theme (e.g., Unveil the Secrets)"
              }
              required
              disabled={isDisabled}
            />
          </div>
        </div>

        {/* Musicians */}
        <div className="flex flex-wrap justify-between mb-4">
          <div className="w-[30%]">
            <label className="block text-sm text-gray-400">
              No. of Guitarists
            </label>
            <input
              type="number"
              name="guitarist"
              value={formData.guitarist}
              onChange={handleChange}
              className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1"
              required
              disabled={isDisabled}
            />
          </div>
          <div className="w-[30%]">
            <label className="block text-sm text-gray-400">
              No. of Vocalists
            </label>
            <input
              type="number"
              name="vocalist"
              value={formData.vocalist}
              onChange={handleChange}
              className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1"
              required
              disabled={isDisabled}
            />
          </div>
          <div className="w-[30%]">
            <label className="block text-sm text-gray-400">
              No. of Bassists
            </label>
            <input
              type="number"
              name="bassist"
              value={formData.bassist}
              onChange={handleChange}
              className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1"
              required
              disabled={isDisabled}
            />
          </div>

          <div className="w-[30%]">
            <label className="block text-sm text-gray-400">
              No. of Keyboardist
            </label>
            <input
              type="number"
              name="keyboardist"
              value={formData.keyboardist}
              onChange={handleChange}
              className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1"
              required
              disabled={isDisabled}
            />
          </div>

          <div className="w-[30%]">
            <label className="block text-sm text-gray-400">
              No. of Percussionist
            </label>
            <input
              type="number"
              name="percussionist"
              value={formData.percussionist}
              onChange={handleChange}
              className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1"
              required
              disabled={isDisabled}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-[#C1C2D3] text-black p-2 rounded-lg mt-1 placeholder-gray-500"
            rows="4"
            placeholder="Event description"
            disabled={isDisabled}
            // required
          />
        </div>

        {/* Notice */}
        <div className="flex items-center bg-[#fff7e5] border-l-4 border-yellow-500 p-4 mb-4 rounded-lg shadow-lg">
          <div className="mr-4">
            <svg
              className="h-6 w-6 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l5.52 9.823c.75 1.334-.213 3.008-1.742 3.008H4.479c-1.529 0-2.492-1.674-1.742-3.008l5.52-9.823zM11 13a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm-1-4a1 1 0 0 0-.993.883L9 10v2a1 1 0 0 0 1.993.117L11 12v-2a1 1 0 0 0-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="text-gray-700 text-sm">
              <strong>Important Notice!</strong> Non-pending Booking Status
              cannot be edited. For more details, email us at
              playmakers.ustp@gmail.com for your concerns.
            </p>
          </div>
        </div>

        {/* CAPTCHA */}
        {!isViewMode && (
          <div className="mb-6">
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={handleCaptchaVerify}
            />
          </div>
        )}

        <div>
          <button
            type="submit"
            // className="w-full bg-[#b70039] text-white py-2 rounded-lg cursor-pointer"
            className={`w-full py-2 rounded-lg ${buttonStyle}`}
            disabled={
              (isEditMode && !captchaVerified) || (isDisabled && !isViewMode)
            }
          >
            {isViewMode ? "Close" : isEditMode ? "Save Changes" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
