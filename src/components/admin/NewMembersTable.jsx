export const NewMembersTable = () => {
  const members = [
    {
      name: "John Doe",
      joinDate: "June 10, 2024",
      role: "Vocalist",
      status: "active",
    },
    {
      name: "Jane Smith",
      joinDate: "July 5, 2024",
      role: "Vocalist",
      status: "active",
    },
    {
      name: "Jane Smith",
      joinDate: "July 5, 2024",
      role: "Vocalist",
      status: "active",
    },
    {
      name: "Jane Smith",
      joinDate: "July 5, 2024",
      role: "Vocalist",
      status: "active",
    },
  ];

  return (
    <table className="min-w-full bg-white rounded-lg animate__animated animate__fadeIn">
      <thead className="bg-[#EFFBEF]">
        <tr>
          <th className="py-2 text-[#5C1B33] text-sm">Member Name</th>
          <th className="py-2 text-[#5C1B33] text-sm">Join Date</th>
          <th className="py-2 text-[#5C1B33] text-sm">Role</th>
          <th className="py-2 text-[#5C1B33] text-sm">Status</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member, index) => (
          <tr key={index} className="text-center">
            <td className="py-2 text-[#4B4B4C]">{member.name}</td>
            <td className="py-2 text-[#4B4B4C]">{member.joinDate}</td>
            <td className="py-2 text-[#4B4B4C]">{member.role}</td>
            <td
              className={`py-2  ${
                member.status !== "active"
                  ? "text-[#4B4B4C]/60 font-semibold"
                  : "text-[#40B267] font-semibold"
              }`}
            >
              {member.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
