import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import OAuthCallback from "./pages/OAuthCallback";
import CompleteRegistration from "./pages/CompleteRegistration";
import ProtectedRoute from "./components/ProtectedRoute";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import CreateClass from "./pages/teacher/CreateClass";
import ClassAttendance from "./pages/teacher/ClassAttendance";

import StudentDashboard from "./pages/student/StudentDashboard";
import ClassDetail from "./pages/student/ClassDetail";
import JoinClass from "./pages/student/JoinClass";
import MarkAttendance from "./pages/student/MarkAttendance";
import MyProfile from "./pages/student/MyProfile";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return null; // ✅ wait for auth before rendering any routes

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path="/complete-registration" element={<CompleteRegistration />} />

      <Route element={<ProtectedRoute allowedRole="TEACHER" />}>
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/create-class" element={<CreateClass />} />
        <Route path="/teacher/attendance" element={<ClassAttendance />} />
      </Route>

      <Route element={<ProtectedRoute allowedRole="STUDENT" />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/class/:classId" element={<ClassDetail />} />
        <Route path="/student/mark-attendance" element={<MarkAttendance />} />
        <Route path="/student/profile" element={<MyProfile />} />
      </Route>

      <Route
        path="*"
        element={
          user?.role === "TEACHER" ? (
            <Navigate to="/teacher/dashboard" />
          ) : user?.role === "STUDENT" ? (
            <Navigate to="/student/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}
