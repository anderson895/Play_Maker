import { Outlet, Navigate } from "react-router-dom";

const AdminProtectedRoutes = () => {
  const user = localStorage.getItem("adminAuthToken");
  const userSession = sessionStorage.getItem("adminAuthToken");
  return user || userSession ? <Outlet /> : <Navigate to="/adminonly" />;
};

export default AdminProtectedRoutes;
