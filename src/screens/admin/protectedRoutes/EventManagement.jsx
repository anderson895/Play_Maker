import { useState, useEffect } from "react";

// components and routes
import PendingEvents from "../../../components/admin/PendingEvents";
import AcceptedEvents from "../../../components/admin/AcceptedEvents";
import PublishedEvents from "../../../components/admin/PublishedEvents";
import PastEvents from "../../../components/admin/PastEvents";
import RejectedEvents from "../../../components/admin/RejectedEvents";
import OngoingEvents from "../../../components/admin/OngoingEvents";
import Header from "../../../components/admin/Header";
import Sidebar from "../../../components/admin/Sidebar";
import { addEvent } from "../../../assets";

const EventManagement = () => {
  const [activeTab, setActiveTab] = useState("recentlyAdded");
  const [isScrolled, setIsScrolled] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setIsScrolled(scrollTop > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-[#FBEBF1]">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header Component */}
        <Header title="Event Management" />
        {/* Event Management Content */}
        <div className="p-4 flex-1 overflow-hidden">
          {/* Tab Navigation */}
          <div
            className={`sticky top-0 z-10 flex bg-white rounded-lg p-2 stroke-[#A7A9C0] transition-all duration-300 ${
              isScrolled ? "bg-gray-100 shadow-md" : "bg-white"
            }`}
          >
            <button
              className={`${
                activeTab === "AcceptedEvents"
                  ? "absolute top-3 right-10"
                  : "hidden"
              }`}
            >
              <img src={addEvent} width={50} height={50} alt="add event icon" />
            </button>
            <button
              className={`p-2 text-[#4B4B4C] font-bold px-5 text-sm ${
                activeTab === "PendingEvents"
                  ? "border-b-2 border-[#5C1B33]"
                  : ""
              }`}
              onClick={() => handleTabChange("PendingEvents")}
            >
              Pending Events
            </button>
            <button
              className={`p-2 text-[#4B4B4C] font-bold px-5 text-sm ${
                activeTab === "RejectedEvents"
                  ? "border-b-2 border-[#5C1B33]"
                  : ""
              }`}
              onClick={() => handleTabChange("RejectedEvents")}
            >
              Rejected Events
            </button>
            <button
              className={`p-2 text-[#4B4B4C] font-bold px-5 text-sm ${
                activeTab === "AcceptedEvents"
                  ? "border-b-2 border-[#5C1B33]"
                  : ""
              }`}
              onClick={() => handleTabChange("AcceptedEvents")}
            >
              Accepted Events
            </button>
            <button
              className={`p-2 text-[#4B4B4C] font-bold px-5 text-sm ${
                activeTab === "OngoingEvents"
                  ? "border-b-2 border-[#5C1B33]"
                  : ""
              }`}
              onClick={() => handleTabChange("OngoingEvents")}
            >
              Ongoing Events
            </button>

            <button
              className={`p-2 text-[#4B4B4C] font-bold px-5 text-sm ${
                activeTab === "PublishedEvents"
                  ? "border-b-2 border-[#5C1B33]"
                  : ""
              }`}
              onClick={() => handleTabChange("PublishedEvents")}
            >
              Published Events
            </button>
            <button
              className={`p-2 text-[#4B4B4C] font-bold px-5 text-sm ${
                activeTab === "PastEvents" ? "border-b-2 border-[#5C1B33]" : ""
              }`}
              onClick={() => handleTabChange("PastEvents")}
            >
              Past Events
            </button>
          </div>

          {/* Content Based on Active Tab */}
          <div className="mt-4 max-h-[calc(100vh-180px)] overflow-y-auto">
            {activeTab === "PendingEvents" && <PendingEvents />}
            {activeTab === "AcceptedEvents" && <AcceptedEvents />}
            {activeTab === "PastEvents" && <PastEvents />}
            {activeTab === "PublishedEvents" && <PublishedEvents />}
            {activeTab === "RejectedEvents" && <RejectedEvents />}
            {activeTab === "OngoingEvents" && <OngoingEvents />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManagement;
