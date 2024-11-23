import { useEffect, useState } from "react";
import { FaCheckCircle, FaPen, FaTrash } from "react-icons/fa";

const MemberDetailsModal = ({ member, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableMember, setEditableMember] = useState({ ...member });

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleClickOutside = (event) => {
    if (event.target.id === "modal-overlay") {
      onClose();
    }
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    onUpdate(editableMember); 
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      onDelete(member.id); 
      onClose(); 
    }
  };

  if (!member) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      id="modal-overlay"
      onClick={handleClickOutside}
    >
      <div className="bg-white rounded-lg w-full max-w-2xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#C2396C] to-[#5C1B33] px-5 py-5 rounded-t-lg text-white relative">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-semibold">
              {isEditing ? "Edit Member Details" : "Member since"}
            </h2>
            <button
              className="text-gray-100 absolute top-3 right-3 text-2xl"
              onClick={onClose}
            >
              &times;
            </button>
          </div>
          {!isEditing && (
            <p className="text-sm flex items-center">
              <span className="mr-2">🕒</span>
              {member.join_date}
            </p>
          )}

          <div className="flex items-center mt-6">
            <img
              className="w-20 h-20 rounded-full object-cover"
              src={member.profile_image}
              alt={member.name}
            />
            <div className="ml-4">
              <h3 className="text-2xl font-bold">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editableMember.name}
                    onChange={handleInputChange}
                    className="bg-white text-gray-900 border rounded-md px-2 py-1 w-full"
                  />
                ) : (
                  member.name
                )}
              </h3>
              {!isEditing && (
                <div className="flex flex-wrap space-x-2 mt-2">
                  {member.role.map((role, index) => (
                    <span
                      key={index}
                      className="bg-white text-pink-700 px-2 py-1 rounded-full text-sm"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              )}
              {isEditing && (
                <div className="mt-2">
                  <label className="block text-sm text-white">Roles</label>
                  <input
                    type="text"
                    name="role"
                    value={editableMember.role.join(", ")} 
                    onChange={(e) =>
                      setEditableMember((prev) => ({
                        ...prev,
                        role: e.target.value.split(",").map((r) => r.trim()), 
                      }))
                    }
                    className="bg-white text-gray-900 border rounded-md px-2 py-1 w-full"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Edit & Delete Buttons */}
          <div className="flex items-center gap-2 absolute top-6 right-10">
            {!isEditing && (
              <>
                <button
                  className="bg-[#5C1B33] py-2 px-4 rounded-full hover:bg-[#9c2953]"
                  onClick={handleEditToggle}
                >
                  <FaPen className="text-blue-500" />
                </button>
                <button
                  className="bg-[#5C1B33] py-2 px-4 rounded-full hover:bg-[#9c2953]"
                  onClick={handleDelete}
                >
                  <FaTrash className="text-[#FB4B4E]" />
                </button>
              </>
            )}
          </div>

          {/* Status Indicator */}
          <div className="absolute top-24 right-6 flex items-center space-x-2 text-white rounded-lg">
            {isEditing ? (
              <select
                name="status"
                value={editableMember.status}
                onChange={handleInputChange}
                className="bg-white text-gray-900 border rounded-md px-2 py-1"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="warning">Warning</option>
              </select>
            ) : (
              <>
                {member.status === "active" && (
                  <FaCheckCircle className="text-[#40B267]" />
                )}
                <span
                  className={`${
                    member.status === "active"
                      ? "bg-[#40B267] py-1 px-3"
                      : member.status === "inactive"
                      ? "bg-[#FF9100] py-1 px-3"
                      : member.status === "warning"
                      ? "bg-[#FB4B4E] py-1 px-3"
                      : ""
                  } text-sm`}
                >
                  {member.status}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Body Section */}
        <div className="p-5 bg-gray-50 rounded-b-lg">
          <div className="grid grid-cols-2 gap-4 text-gray-800">
            <div>
              <p className="font-semibold text-sm">
                Total Events Participated:
              </p>
              {isEditing ? (
                <input
                  type="number"
                  name="events"
                  value={editableMember.events}
                  onChange={handleInputChange}
                  className="bg-white text-gray-900 border rounded-md px-2 py-1 w-full"
                />
              ) : (
                <p>{member.events}</p>
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">Genre:</p>
              {isEditing ? (
                <input
                  type="text"
                  name="genre"
                  value={editableMember.genre.join(", ")} // Convert array to string for editing
                  onChange={(e) =>
                    setEditableMember((prev) => ({
                      ...prev,
                      genre: e.target.value.split(",").map((g) => g.trim()), // Split string into array
                    }))
                  }
                  className="bg-white text-gray-900 border rounded-md px-2 py-1 w-full"
                />
              ) : (
                <p>{member.genre.join(", ")}</p>
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">Mobile Number:</p>
              {isEditing ? (
                <input
                  type="text"
                  name="mobile"
                  value={editableMember.mobile}
                  onChange={handleInputChange}
                  className="bg-white text-gray-900 border rounded-md px-2 py-1 w-full"
                />
              ) : (
                <p>{member.mobile}</p>
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">Email Address:</p>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editableMember.email}
                  onChange={handleInputChange}
                  className="bg-white text-gray-900 border rounded-md px-2 py-1 w-full"
                />
              ) : (
                <p className="text-blue-500">{member.email}</p>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-4">
            <p className="font-semibold text-sm text-gray-600">Bio</p>
            {isEditing ? (
              <textarea
                name="bio"
                value={editableMember.bio}
                onChange={handleInputChange}
                className="bg-white text-gray-900 border rounded-md px-2 py-1 w-full"
                rows="4"
              />
            ) : (
              <p className="text-sm text-gray-700">{member.bio || "No bio available."}</p>
            )}
          </div>

          {/* Save & Cancel Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDetailsModal;
