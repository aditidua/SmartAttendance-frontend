import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

// Dummy data — replace with real API once backend is ready
const DUMMY_CLASSES = [
  { classId: 1, className: "Mathematics 101", classCode: "4829", studentCount: 24 },
  { classId: 2, className: "Physics Advanced", classCode: "7341", studentCount: 18 },
  { classId: 3, className: "Chemistry Lab", classCode: "1956", studentCount: 0 },
];

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState(DUMMY_CLASSES);

  return (
    <div className="min-h-screen" style={{ background: "#f0f4f8" }}>
      <Navbar />
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl" style={{ fontFamily: "Georgia, serif", color: "#004DB2" }}>
              My Classes
            </h1>
            <p className="text-sm mt-1" style={{ color: "#8fa8bc" }}>
              {classes.length} {classes.length === 1 ? "class" : "classes"} created
            </p>
          </div>
          <button
            onClick={() => navigate("/teacher/create-class")}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white"
            style={{ background: "#004DB2" }}
          >
            + Create New Class
          </button>
        </div>

        {/* Class Cards */}
        {classes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm" style={{ color: "#8fa8bc" }}>
              No classes yet. Create your first class!
            </p>
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
            {classes.map((cls) => (
              <div
                key={cls.classId}
                onClick={() => navigate(`/teacher/attendance?classId=${cls.classId}&className=${cls.className}`)}
                className="bg-white rounded-2xl p-5 cursor-pointer transition-all"
                style={{ border: "0.5px solid #dbe4ee" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#004DB2"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#dbe4ee"}
              >
                {/* Class name + code */}
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-sm font-medium pr-2" style={{ color: "#004DB2" }}>
                    {cls.className}
                  </h2>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
                    style={{ background: "#e6eef9", color: "#004DB2", letterSpacing: "0.08em" }}
                  >
                    {cls.classCode}
                  </span>
                </div>

                {/* Student count */}
                <div className="flex items-center justify-between pt-3"
                  style={{ borderTop: "0.5px solid #dbe4ee" }}>
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" fill="none" stroke="#8fa8bc" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span className="text-xs" style={{ color: "#8fa8bc" }}>
                      {cls.studentCount} {cls.studentCount === 1 ? "student" : "students"}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: "#004DB2" }}>View →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}