import { Link, useLocation, useNavigate } from "react-router-dom";
import { playmakersLogo } from "../../assets";
import WidgetsIcon from "@mui/icons-material/Widgets";
import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";
import AssessmentIcon from "@mui/icons-material/Assessment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import LogoutIcon from "@mui/icons-material/Logout";
import ChatIcon from "@mui/icons-material/Chat";
import { supabase } from "../../database/supabase";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeStyle = "bg-[#5C1B33] text-white rounded-lg";
  const inactiveStyle = "text-gray-500";

  const handleLogout = () => {
    supabase.auth.signOut();
    localStorage.removeItem("adminAuthToken");
    sessionStorage.removeItem("adminAuthToken");
    navigate("/adminonly");
  };

  return (
    <div className="w-full md:w-72 bg-white shadow-lg">
      <div className="p-4 flex items-center">
        <img
          src={playmakersLogo}
          width={70}
          height={70}
          alt="Playmakers Logo"
        />
        <h1 className="text-xl font-bold text-[#5C1B33] ml-4">Playmakers</h1>
      </div>
      <ul className="space-y-4 p-4">
        <li>
          <Link
            to="/admin/dashboard"
            className={`flex items-center py-3 px-4 text-md font-medium ${
              location.pathname === "/admin/dashboard"
                ? activeStyle
                : inactiveStyle
            }`}
          >
            <WidgetsIcon
              className={`mr-2 ${
                location.pathname === "/admin/dashboard"
                  ? "text-white"
                  : "text-gray-500"
              }`}
            />
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/admin/events-management"
            className={`flex items-center py-3 px-4 text-md font-medium ${
              location.pathname === "/admin/events-management"
                ? activeStyle
                : inactiveStyle
            }`}
          >
            <EventIcon
              className={`mr-2 ${
                location.pathname === "/admin/events-management"
                  ? "text-white"
                  : "text-gray-500"
              }`}
            />
            Events Management
          </Link>
        </li>
        <li>
          <Link
            to="/admin/member-organization"
            className={`flex items-center py-3 px-4 text-md font-medium ${
              location.pathname === "/admin/member-organization"
                ? activeStyle
                : inactiveStyle
            }`}
          >
            <GroupIcon
              className={`mr-2 ${
                location.pathname === "/admin/member-organization"
                  ? "text-white"
                  : "text-gray-500"
              }`}
            />
            Member Organization
          </Link>
        </li>
        <li>
          <Link
            to="/admin/event-statistics"
            className={`flex items-center py-3 px-4 text-md font-medium ${
              location.pathname === "/admin/event-statistics"
                ? activeStyle
                : inactiveStyle
            }`}
          >
            <AssessmentIcon
              className={`mr-2 ${
                location.pathname === "/admin/event-statistics"
                  ? "text-white"
                  : "text-gray-500"
              }`}
            />{" "}
            Event Statistics
          </Link>
        </li>
        <li>
          <Link
            to="/admin/notification"
            className={`flex items-center py-3 px-4 text-md font-medium ${
              location.pathname === "/admin/notification"
                ? activeStyle
                : inactiveStyle
            }`}
          >
            <NotificationsIcon
              className={`mr-2 ${
                location.pathname === "/admin/notification"
                  ? "text-white"
                  : "text-gray-500"
              }`}
            />
            Notification
          </Link>
        </li>
        <li>
          <Link
            to="/admin/chat"
            className={`flex items-center py-3 px-4 text-md font-medium ${
              location.pathname === "/admin/chat" ? activeStyle : inactiveStyle
            }`}
          >
            <ChatIcon
              className={`mr-2 ${
                location.pathname === "/admin/chat"
                  ? "text-white"
                  : "text-gray-500"
              }`}
            />
            Chat
          </Link>
        </li>
        <li>
          <Link
            to="/admin/profile"
            className={`flex items-center py-3 px-4 text-md font-medium ${
              location.pathname === "/admin/profile"
                ? activeStyle
                : inactiveStyle
            }`}
          >
            <PersonPinIcon
              className={`mr-2 ${
                location.pathname === "/admin/profile"
                  ? "text-white"
                  : "text-gray-500"
              }`}
            />
            Profile
          </Link>
        </li>
        <li>
          <Link
            to="/adminonly"
            className={`flex items-center py-3 px-4 text-md font-medium ${
              location.pathname === "/adminonly" ? activeStyle : inactiveStyle
            }`}
            onClick={handleLogout}
          >
            <LogoutIcon
              className={`mr-2 ${
                location.pathname === "/adminonly"
                  ? "text-white"
                  : "text-gray-500"
              }`}
            />
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
