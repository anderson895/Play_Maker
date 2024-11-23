import { useState } from "react";

const PreviousBookingModal = ({ onClose, onSubmit }) => {
  const [bookingId, setBookingId] = useState("");

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg p-4 shadow-lg w-80">
        <h3 className="text-lg font-semibold mb-4">Enter Your Booking ID</h3>
        <input
          type="text"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          placeholder="Booking ID"
          className="w-full border p-2 rounded mb-4"
        />
        <div className="flex justify-end">
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            OK
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviousBookingModal;
