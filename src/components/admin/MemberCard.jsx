const MemberCard = ({
  name,
  email,
  role,
  genre,
  mobile,
  events,
  join_date,
  profile_image,
  status,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md  w-80 mx-3 relative">
      {/* Glowing pulsing circle */}
      <div
        className={`absolute top-4 right-4 w-4 h-4 rounded-full animate-pulse ${
          status === "active"
            ? "bg-[#40B267] "
            : status === "inactive"
            ? "bg-[#FF9100] "
            : status === "warning"
            ? "bg-[#FB4B4E] "
            : ""
        }`}
      ></div>
      {/* Header Section with Image and Name */}
      <div className="pb-4 border-b border-[#FBEBF1] p-6">
        <img src={profile_image} alt={name} className="w-14 h-14 rounded-full" />
        <div>
          <h3 className="mt-2 text-lg font-bold " title={name}>
            {name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Genre Section */}
        <div>
          <p className="font-semibold">Genre:</p>
          <div className="flex space-x-2 mt-2">
            {genre?.map((g, index) => (
              <span
                key={index}
                className="bg-pink-200 text-pink-700 px-2 py-1  text-xs font-semibold"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Role Section */}
        <div className="mt-4">
          <p className="font-semibold">Role:</p>
          <div className="flex space-x-2 mt-2">
            {role.map((r, index) => (
              <span
                key={index}
                className="bg-blue-200 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold"
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="mt-4 space-y-2 text-gray-600 text-sm">
          <div className="flex justify-between">
            <span>Number</span>
            <span className="font-semibold text-gray-800">{mobile}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Events Participated</span>
            <span className="font-semibold text-gray-800">{events}</span>
          </div>
          <div className="flex justify-between">
            <span>Email</span>
            <span
              title={email}
              className="truncate text-gray-600"
              style={{ maxWidth: "150px", wordBreak: "break-word" }}
            >
              {email}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Joined Date</span>
            <span className="font-semibold text-gray-800">{join_date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
