import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const user = localStorage.getItem("authToken");
  return user ? <Outlet /> : <Navigate to="/member/login" />;
};

export default ProtectedRoutes;
