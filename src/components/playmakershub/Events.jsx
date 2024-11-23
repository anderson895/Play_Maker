import { useState } from "react";
import AuthenticatedHeader from "./AuthenticatedHeader";
import DoneEvents from "./DoneEvents";
import UpcomingEvents from "./UpcomingEvents";

const Events = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <div className="bg-Radial bg-[#000000] h-screen">
      <AuthenticatedHeader />
      <main className="text-[#ffffff]">
        <div className="flex bg-green-500 p-5 gap-3">
          {/* Tab Buttons */}
          <button
            onClick={() => setActiveTab("past")}
            className={`${
              activeTab === "past" ? "text-red-500 font-bold" : "text-white"
            }`}
          >
            Past Events
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`${
              activeTab === "upcoming" ? "text-red-500 font-bold" : "text-white"
            }`}
          >
            Upcoming Events
          </button>
        </div>

        {/* Conditional Rendering of Content */}
        <div className="p-6">
          {activeTab === "past" ? <DoneEvents /> : <UpcomingEvents />}
        </div>
      </main>
    </div>
  );
};

export default Events;
