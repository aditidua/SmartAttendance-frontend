import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const teacherLinks = [
    { label: "Dashboard", path: "/teacher/dashboard" },
    { label: "Create Class", path: "/teacher/create-class" },
    { label: "Attendance", path: "/teacher/attendance" },
  ];

  const studentLinks = [
    { label: "Dashboard", path: "/student/dashboard" },
    { label: "Join Class", path: "/student/join-class" },
    { label: "Mark Attendance", path: "/student/mark-attendance" },
    { label: "My Profile", path: "/student/profile" },
  ];

  const links = user?.role === "TEACHER" ? teacherLinks : studentLinks;

  return (
    <nav className="w-full bg-white px-8 py-4 flex items-center justify-between"
      style={{ borderBottom: "0.5px solid #dbe4ee" }}>

      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate(user?.role === "TEACHER" ? "/teacher/dashboard" : "/student/dashboard")}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "#004DB2" }}>
          <span className="text-white text-xs font-medium">SA</span>
        </div>
        <span className="text-sm font-medium" style={{ color: "#004DB2", fontFamily: "Georgia, serif" }}>
          SmartAttendance
        </span>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="px-4 py-2 rounded-lg text-sm transition-colors"
              style={{
                background: isActive ? "#e6eef9" : "transparent",
                color: isActive ? "#004DB2" : "#8fa8bc",
                fontWeight: isActive ? "500" : "400",
              }}
            >
              {link.label}
            </button>
          );
        })}
      </div>

      {/* Right side — user info + logout */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs font-medium" style={{ color: "#004DB2" }}>
            {user?.sub}
          </p>
          <p className="text-xs" style={{ color: "#8fa8bc" }}>
            {user?.role === "TEACHER" ? "Teacher" : "Student"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg text-sm transition-colors"
          style={{ border: "0.5px solid #dbe4ee", color: "#8fa8bc" }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#004DB2";
            e.currentTarget.style.color = "#004DB2";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "#dbe4ee";
            e.currentTarget.style.color = "#8fa8bc";
          }}
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}