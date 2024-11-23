export const RecentUpdates = () => {
  const updates = [
    {
      updateType: "Updated event policy",
      updateBy: "Jayvee Continedo",
      date: "June 6, 2024 10:30",
    },
    {
      updateType: "Added new events",
      updateBy: "Jayvee Continedo",
      date: "June 6, 2024 11:30",
    },
  ];

  return (
    <table className="min-w-full bg-white animate__animated animate__fadeIn">
      <thead>
        <tr className="bg-[#EFFBEF]">
          <th className="py-2  text-[#5C1B33] text-sm">Update Type</th>
          <th className="py-2  text-[#5C1B33] text-sm">Updated By</th>
          <th className="py-2  text-[#5C1B33] text-sm">Date and Time</th>
        </tr>
      </thead>
      <tbody>
        {updates.map((update, index) => (
          <tr key={index} className="text-center">
            <td className="py-2">{update.updateType}</td>
            <td className="py-2">{update.date}</td>
            <td className="py-2">{update.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
