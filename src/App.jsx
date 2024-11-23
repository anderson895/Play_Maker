import AdminLogin from "./authentication/admin/AdminLogin";

// admin routes
import AdminNotification from "./screens/admin/protectedRoutes/AdminNotification";
import EventManagement from "./screens/admin/protectedRoutes/EventManagement";
import EventStatistics from "./screens/admin/protectedRoutes/EventStatistics";
import MemberOrganization from "./screens/admin/protectedRoutes/MemberOrganization";
import Dashboard from "./screens/admin/protectedRoutes/Dashboard";
import AdminProfile from "./screens/admin/protectedRoutes/AdminProfile";

// playmakershub routes
import MembersLogin from "./authentication/playmakershub/MembersLogin";
import Homepage from "./screens/playmakershub/routes/Homepage";
import PlaymakersHome from "./screens/playmakershub/protectedRoutes/PlaymakersHome";
import UpcomingEvents from "./components/playmakershub/UpcomingEvents";

import ProtectedRoutes from "./utils/ProtectedRoutes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminProtectedRoutes from "./utils/AdminProtectedRoutes";
import NotFound from "./components/error/NotFound";
import ChatPage from "./components/chat/Chatpage";
import DoneEvents from "./components/playmakershub/DoneEvents";
import Events from "./components/playmakershub/Events";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* playmakershub */}
        <Route element={<Homepage />} path="/" />
        <Route element={<MembersLogin />} path="/member/login" />
        <Route element={<ProtectedRoutes />}>
          <Route element={<PlaymakersHome />} path="/playmakershub" />
          <Route element={<UpcomingEvents />} path="/events/upcoming" />
          <Route element={<Events />} path="/events" />
        </Route>
        <Route element={<DoneEvents />} path="/events/past" />
        {/* playmakers admin */}
        <Route element={<AdminLogin />} path="/adminonly" />
        <Route element={<AdminProtectedRoutes />}>
          <Route element={<Dashboard />} path="/admin/dashboard" />
          <Route
            element={<EventManagement />}
            path="/admin/events-management"
          />
          <Route
            element={<MemberOrganization />}
            path="/admin/member-organization"
          />
          <Route element={<EventStatistics />} path="/admin/event-statistics" />
          <Route element={<AdminNotification />} path="/admin/notification" />
          <Route element={<AdminProfile />} path="/admin/profile" />
          <Route element={<ChatPage />} path="/admin/chat" />
        </Route>
        {/* 404 error route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
