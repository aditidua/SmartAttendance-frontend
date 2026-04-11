import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
//checks 2 things
//logged in? , is role correct?
export default function ProtectedRoute({ allowedRole }) {
  const { token, user } = useAuth();

  // Not logged in at all → go to login
  if (!token) return <Navigate to="/login" replace />;

  // Logged in but wrong role → go to their own dashboard
  if (user?.role !== allowedRole) {
    if (user?.role === "TEACHER") return <Navigate to="/teacher/dashboard" replace />;
    if (user?.role === "STUDENT") return <Navigate to="/student/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  // Correct role → show the page
  return <Outlet />;
}