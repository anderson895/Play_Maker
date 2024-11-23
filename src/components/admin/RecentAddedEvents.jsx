export const RecentAddedEvents = () => {
  const events = [
    {
      name: "Annual Music Fest",
      date: "June 25, 2024, 6 PM",
      organizer: "Jane Doe",
      location: "Auditorium",
      status: "Approved",
    },
    {
      name: "Jazz Night",
      date: "July 1, 2024, 7 PM",
      organizer: "John Smith",
      location: "USTL flag pole",
      status: "Pending Approval",
    },
  ];

  return (
    <table className="min-w-full bg-white rounded-lg animate__animated animate__fadeIn">
      <thead className="bg-[#EFFBEF]">
        <tr>
          <th className="py-2 text-[#5C1B33] text-sm">Event Name</th>
          <th className="py-2 text-[#5C1B33] text-sm">Date and Time</th>
          <th className="py-2 text-[#5C1B33] text-sm">Organizer</th>
          <th className="py-2 text-[#5C1B33] text-sm">Location</th>
          <th className="py-2 text-[#5C1B33] text-sm">Status</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event, index) => (
          <tr key={index} className="text-center">
            <td className="py-2 text-[#4B4B4C]">{event.name}</td>
            <td className="py-2 text-[#4B4B4C]">{event.date}</td>
            <td className="py-2 text-[#4B4B4C]">{event.organizer}</td>
            <td className="py-2 text-[#4B4B4C]">{event.location}</td>
            <td
              className={`py-2 ${
                event.status !== "Approved"
                  ? "text-[#4B4B4C]/60 font-semibold"
                  : "text-[#40B267] font-semibold"
              }`}
            >
              {event.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
