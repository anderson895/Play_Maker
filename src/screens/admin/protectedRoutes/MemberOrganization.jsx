import { useState, useEffect } from "react";
import MemberCard from "../../../components/admin/MemberCard";
import Modal from "../../../components/admin/Reusable/Modal";
import MemberForm from "../../../components/admin/Reusable/MemberForm";
import MemberDetailsModal from "../../../components/admin/MemberDetailsModal";
import Sidebar from "../../../components/admin/Sidebar";
import Header from "../../../components/admin/Header"; // Adjust the path as needed
import { createMember, deleteMember, fetchMembers, updateMember } from "../../../database/supabase";

const MemberOrganization = () => {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    email: "",
    role: [],
    genre: [],
    mobile: "",
    events: 0,
    join_date: "",
    status: "active",
    profile_image: "",
    name: "",
  });
  const [roles, setRoles] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [filter, setFilter] = useState("all");

  const loadMembers = async () => {
    const data = await fetchMembers();
    const list = data?.map((v) => ({
      ...v,
      genre: JSON.parse(v.genre),
      role: JSON.parse(v.role),
    }));
    if (list) {
      setMembers(list);
    }
  };

  // Fetch members from Supabase on component mount
  useEffect(() => {
    loadMembers();
  }, []);

  /**
   * Filtered members based on status
   */
  const filteredMembers = members.filter((member) => {
    if (filter === "all") return true; // Show all members
    return member.status === filter; // Filter by member's status
  });

  const handleCreateAccount = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedMember(null);
  };

  // Add a new member
  const handleSubmit = async () => {
    const memberData = {
      ...newMember,
      role: roles,
      genre: genres,
      join_date: new Date().toISOString().split("T")[0],
      events: 0,
    };
    const data = await createMember(memberData);
    if (data) {
      loadMembers(); // Reload members after adding
    }
    setIsModalOpen(false);
    setNewMember({
      email: "",
      role: [],
      genre: [],
      mobile: "",
      status: "active",
      profile_image: "",
      name: "",
    });
    setRoles([]);
    setGenres([]);
  };

  const handleViewDetails = (member) => {
    setSelectedMember(member);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateMember = async (id, updatedData) => {
    const data = await updateMember(id, updatedData);
    if (data) {
      setMembers(
        members.map((member) => (member.id === id ? { ...member, ...updatedData } : member))
      );
    }
    setIsDetailsModalOpen(false);
  };

  const handleDeleteMember = async (id) => {
    const data = await deleteMember(id);
    if (data) {
      setMembers(members.filter((member) => member.id !== id));
    }
    setIsDetailsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-[#FBEBF1]">
      <Sidebar />
      <div className="flex-1">
        <Header title="Member Organization" />

        <div className="px-8 py-4 flex items-center justify-between">
          {/* Filter Buttons */}
          <div className="flex space-x-4">
            {["all", "active", "inactive", "warning"].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 ${
                  filter === status ? "bg-gray-700 text-white" : "bg-gray-200"
                } rounded-lg`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} Members
              </button>
            ))}
          </div>
          <button
            className="bg-[#5C1B33] text-white px-6 py-2 rounded-lg"
            onClick={handleCreateAccount}
          >
            Create Member
          </button>
        </div>

        <div className="px-4 py-10 flex flex-wrap">
          {filteredMembers.map((member, idx) => (
            <div
              key={idx}
              className="cursor-pointer"
              onClick={() => handleViewDetails(member)}
            >
              <MemberCard {...member} />
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Adding Member */}
      <Modal isOpen={isModalOpen} title="Add Member" onClose={closeModal}>
        <MemberForm
          newMember={newMember}
          setNewMember={setNewMember}
          roles={roles}
          setRoles={setRoles}
          genres={genres}
          setGenres={setGenres}
          handleSubmit={handleSubmit}
        />
      </Modal>

      {/* Modal for Viewing Member Details */}
      {selectedMember && (
        <MemberDetailsModal
          member={selectedMember}
          isOpen={isDetailsModalOpen}
          onClose={closeModal}
          onUpdate={(updatedData) => handleUpdateMember(selectedMember.id, updatedData)}
          onDelete={() => handleDeleteMember(selectedMember.id)}
        />
      )}
    </div>
  );
};

export default MemberOrganization;

