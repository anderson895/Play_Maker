import { useState } from "react";
import { supabase } from "../../../database/supabase";
import { toast, ToastContainer } from "react-toastify";

const MemberForm = ({
  newMember,
  setNewMember,
  roles,
  setRoles,
  genres,
  setGenres,
  handleSubmit,
}) => {
  const [newRole, setNewRole] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleAddRole = () => {
    if (newRole) {
      setRoles([...roles, newRole]);
      setNewRole("");
    }
  };

  const handleAddGenre = () => {
    if (newGenre) {
      setGenres([...genres, newGenre]);
      setNewGenre("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember((prevMember) => ({ ...prevMember, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result); // Set preview image source
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!newMember.name) validationErrors.name = "Name is required.";
    if (!newMember.email) {
      validationErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(newMember.email)) {
      validationErrors.email = "Invalid email address.";
    }
    if (!newMember.mobile) {
      validationErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10,12}$/.test(newMember.mobile)) {
      validationErrors.mobile = "Invalid mobile number.";
    }
    if (!profilePicture)
      validationErrors.profilePicture = "Profile picture is required.";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleUpload = async () => {
    if (!profilePicture) return;
    try {
      setUploading(true);

      const fileName = `${Date.now()}_${profilePicture.name}`;

      const { data: uploadData, error } = await supabase.storage
        .from("profiles")
        .upload(fileName, profilePicture);

      if (error) {
        console.error("Error uploading file:", error.message);
        alert("Failed to upload profile picture.");
        return;
      }

      const manualPublicURL = `${import.meta.env.VITE_IMG_URL}/${
        uploadData.path
      }`;
      console.log("Public URL:", manualPublicURL);
      toast.success("Profile picture uploaded successfully!");
      setNewMember((prev) => ({
        ...prev,
        profile_image: manualPublicURL,
      }));
   
    } catch (error) {
      console.error("Error uploading profile picture:", error.message);
      toast.error("An error occurred during the upload.");
    } finally{
      setUploading(false)
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="p-6 bg-white rounded-lg">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={newMember.name}
          onChange={handleInputChange}
          className={`mt-1 block w-full border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm py-2 px-3`}
          placeholder="Enter name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={newMember.email}
          onChange={handleInputChange}
          className={`mt-1 block w-full border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm py-2 px-3`}
          placeholder="Enter email"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Role(s)
        </label>
        <div className="flex space-x-2 justify-between">
          <input
            type="text"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="mt-1 block border border-gray-300 rounded-md shadow-sm py-2 px-3 flex-1"
            placeholder="Enter role"
          />
          <button
            type="button"
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            onClick={handleAddRole}
          >
            Add Role
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {roles.map((role, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {role}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Genre(s)
        </label>
        <div className="flex space-x-2 justify-between">
          <input
            type="text"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            className="mt-1 block border border-gray-300 rounded-md shadow-sm py-2 px-3 flex-1"
            placeholder="Enter genre"
          />
          <button
            type="button"
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            onClick={handleAddGenre}
          >
            Add Genre
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {genres.map((genre, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Mobile Number
        </label>
        <input
          type="text"
          name="mobile"
          value={newMember.mobile}
          onChange={handleInputChange}
          className={`mt-1 block w-full border ${
            errors.mobile ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm py-2 px-3`}
          placeholder="Enter mobile number"
        />
        {errors.mobile && (
          <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Profile Picture
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-full border border-gray-300 rounded-md"
        />
        {previewImage && (
          <div className="mt-4">
            <img
              src={previewImage}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md"
            />
          </div>
        )}
        {errors.profilePicture && (
          <p className="text-red-500 text-sm mt-1">{errors.profilePicture}</p>
        )}
        <button
          type="button"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Picture"}
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Submit
      </button>
      <ToastContainer position="top-right" autoClose={3000} />
    </form>
  );
};

export default MemberForm;
