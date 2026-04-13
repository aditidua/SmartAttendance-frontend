import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRole }) {
  const { token, user, loading } = useAuth();

  // 🔥 Wait until auth is ready
  if (loading) return <div>Loading...</div>;

  if (!token) return <Navigate to="/login" replace />;

  if (user?.role !== allowedRole) {
    if (user?.role === "TEACHER") return <Navigate to="/teacher/dashboard" replace />;
    if (user?.role === "STUDENT") return <Navigate to="/student/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
