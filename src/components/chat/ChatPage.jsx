import { useEffect, useState } from "react";
import { supabase } from "../../database/supabase";
import Sidebar from "../admin/Sidebar";
import Header from "../admin/Header";
import dayjs from "dayjs";
const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingStatus, setBookingStatus] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, events(event_title)")
      .order("date_created", { ascending: true });

    if (error) {
      console.error("Error fetching bookings:", error);
    } else {
      setBookings(data);
    }
  };

  const fetchMessages = async () => {
    if (selectedBooking) {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("booking_id", selectedBooking.booking_id)
        .order("timestamp", { ascending: true });
      if (!error) setMessages(data);
    }
  };

  const fetchBookingStatus = async (bookingID) => {
    const { data, error } = await supabase
      .from("events")
      .select("event_status")
      .eq("booking_id", bookingID)
      .single();

    if (!error && data) {
      setBookingStatus(data.event_status);
    } else {
      console.error("Error fetching booking status:", error);
      setBookingStatus("Unknown");
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedBooking) {
      const { error } = await supabase.from("chats").insert([
        {
          booking_id: selectedBooking.booking_id,
          sender_role: "admin",
          sender_email: adminEmail,
          message: newMessage,
          timestamp: new Date().toISOString(),
        },
      ]);

      if (!error) {
        setNewMessage("");
      }
    }
  };

  useEffect(() => {
    const getUserEmail = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching authenticated user:", error);
      } else {
        setAdminEmail(data.user.email);
      }
    };

    getUserEmail();
    fetchBookings();
  }, []);

  useEffect(() => {
    if (selectedBooking) {
      fetchMessages();
      fetchBookingStatus(selectedBooking.booking_id);

      // Set up real-time subscription
      const channel = supabase
        .channel(`chats:booking_id=${selectedBooking.booking_id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chats",
            filter: `booking_id=eq.${selectedBooking.booking_id}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedBooking]);

  return (
    <div className="min-h-screen flex bg-[#FBEBF1]">
      <Sidebar />
      <div className="flex-1">
        <Header title="Chat" />
        <div className="p-8">
          <div className="flex space-x-4">
            {/* Sidebar for Booking List */}
            <div className="w-1/4 bg-white rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                Select Booking
              </h3>
              {bookings.map((booking) => (
                <button
                  key={booking.booking_id}
                  onClick={() => setSelectedBooking(booking)}
                  className={`w-full text-left py-2 px-4 rounded-lg mb-2 ${
                    selectedBooking?.booking_id === booking.booking_id
                      ? "bg-[#5C1B33] text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {booking.events && booking.events[0]
                    ? booking.events[0].event_title
                    : "No Title"}
                </button>
              ))}
            </div>

            {/* Chat Section */}
            <div className="w-3/4 bg-white rounded-lg p-6 flex flex-col shadow-lg">
              {selectedBooking && (
                <>
                  <div className="text-gray-600 mb-4">
                    <span>Booking Status:</span>{" "}
                    <span
                      className={`px-3 py-1 rounded-full text-white font-semibold text-sm ${
                        bookingStatus === "Pending"
                          ? "bg-yellow-500 text-yellow-900"
                          : bookingStatus === "Accepted"
                          ? "bg-green-500 text-green-900"
                          : bookingStatus === "Rejected"
                          ? "bg-red-500 text-red-900"
                          : bookingStatus === "Ongoing"
                          ? "bg-blue-500 text-blue-900"
                          : bookingStatus === "Published"
                          ? "bg-purple-500 text-purple-900"
                          : bookingStatus === "Past"
                          ? "bg-gray-500 text-gray-900"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {bookingStatus}
                    </span>
                  </div>

                  {/* Scrollable Chat Container */}
                  <div className="flex-1 overflow-y-auto  max-h-96 space-y-4 mb-4 p-2">
                    {messages.map((msg, index) => {
                      const showDateSeparator =
                        index === 0 ||
                        dayjs(msg.timestamp).format("YYYY-MM-DD") !==
                          dayjs(messages[index - 1].timestamp).format(
                            "YYYY-MM-DD"
                          );

                      return (
                        <div key={msg.chat_id}>
                          {/* Date Separator */}
                          {showDateSeparator && (
                            <div className="text-center text-gray-500 text-xs mb-2">
                              {dayjs(msg.timestamp).format("dddd, MMM D, YYYY")}
                            </div>
                          )}
                          <div
                            className={`flex flex-col ${
                              msg.sender_role === "admin"
                                ? "items-start"
                                : "items-end"
                            }`}
                          >
                            {msg.sender_role === "organizer" && (
                              <p className="text-xs text-gray-500 mb-1">
                                {selectedBooking.organizer_first_name}{" "}
                                {selectedBooking.organizer_last_name}
                              </p>
                            )}
                            <div
                              title={dayjs(msg.timestamp).format("h:mm A")}
                              className={`${
                                msg.sender_role === "admin"
                                  ? "bg-black text-white"
                                  : "bg-white text-black border border-gray-300"
                              } p-2 px-4 rounded-[18px] max-w-xs text-sm relative`}
                            >
                              <span>{msg.message}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-grow bg-gray-200 text-gray-800 p-3 rounded-full outline-none mr-2"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-[#973659] hover:bg-[#64233b] text-white rounded-full px-4 py-2"
                    >
                      Send
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
