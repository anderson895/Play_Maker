import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../../components/admin/Sidebar";
import Header from "../../../components/admin/Header";
import { supabase } from "../../../database/supabase";

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [joinStatus, setJoinStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        setError(authError.message);
        toast.error(authError.message);
        return;
      }

      if (!user) {
        setError("No authenticated user found.");
        toast.error("No authenticated user found.");
        return;
      }

      const { data, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userError) {
        setError(userError.message);
        toast.error(userError.message);
      } else {
        setAdminData(data);
      }

      // Fetch join table data
      const { data: joinData, error: joinError } = await supabase
        .from("join")
        .select("*")
        .eq("id", 1)
        .single();
      console.log(joinData)
      if (joinError) {
        toast.error("Error fetching join status: " + joinError.message);
      } else {
        setJoinStatus(joinData.isOpen);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinStatusToggle = async () => {
    try {
      const updatedStatus = !joinStatus;

      const { error } = await supabase
        .from("join")
        .update({ isOpen: updatedStatus, updatedBy: adminData.id })
        .eq("id", 1); // Assuming row ID is 1

      if (error) {
        toast.error("Error updating join status: " + error.message);
      } else {
        setJoinStatus(updatedStatus);
        toast.success(
          `Join status successfully updated to ${updatedStatus ? "Open" : "Closed"}`
        );
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const { error } = await supabase
        .from("users")
        .update(adminData)
        .eq("id", adminData.id);

      if (error) {
        toast.error("Error updating profile: " + error.message);
      } else {
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex bg-[#FBEBF1]">
      <Sidebar />
      <div className="flex-1">
        <Header title="Profile" />
        <div className="p-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Admin Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={adminData.first_name || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={adminData.last_name || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={adminData.email || ""}
                  onChange={handleInputChange}
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobile_number"
                  value={adminData.mobile_number || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Musical Roles
                </label>
                <input
                  type="text"
                  name="musical_roles"
                  value={adminData.musical_roles || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md"
                >
                  Edit Profile
                </button>
              )}
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-bold">Join Status</h3>
              <p className="mb-4">
                Current Status:{" "}
                <span className="font-semibold">
                  {joinStatus ? "Open" : "Closed"}
                </span>
              </p>
              <button
                onClick={handleJoinStatusToggle}
                className={`px-4 py-2 ${
                  joinStatus
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                } rounded-md`}
              >
                {joinStatus ? "Close Join" : "Open Join"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminProfile;
