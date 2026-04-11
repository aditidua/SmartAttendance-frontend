import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import { joinClass, getEnrolledClasses } from "../../api/studentApi";

const DUMMY_CLASSES = [
  { classId: 1, className: "Mathematics 101", classCode: "4829", teacherName: "Dr. Sharma" },
  { classId: 2, className: "Physics Advanced", classCode: "7341", teacherName: "Prof. Mehta" },
  { classId: 3, className: "Chemistry Lab", classCode: "1956", teacherName: "Ms. Kaur" },
];

export default function StudentDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [classes, setClasses] = useState(DUMMY_CLASSES);
  useEffect(() => {
  const loadClasses = async () => {
    try {
      const data = await getEnrolledClasses(user.id, token);
      setClasses(data);
    } catch (err) {
      console.error("Failed to load classes", err);
    }
  };
  loadClasses();
}, []);
  const [showPopup, setShowPopup] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleJoin = async () => {
    if (code.length !== 4) return setError("Please enter a valid 4-digit code.");
    setLoading(true);
    setError("");
    try {
      await joinClass(user.id, code, token);
      setSuccess("Class joined successfully!");
      setCode("");
      setTimeout(() => {
        setShowPopup(false);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError("Invalid code or class not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCode(val);
    setError("");
  };

  return (
    <div className="min-h-screen" style={{ background: "#f0f4f8" }}>
      <Navbar />
      <div className="p-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl" style={{ fontFamily: "Georgia, serif", color: "#004DB2" }}>
            My Classes
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8fa8bc" }}>
            {classes.length} {classes.length === 1 ? "class" : "classes"} joined
          </p>
        </div>

        {/* Class Cards */}
        {classes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: "#8fa8bc" }}>
              You haven't joined any classes yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 mb-8"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
            {classes.map((cls) => (
              <div
                key={cls.classId}
                onClick={() => navigate(`/student/class/${cls.classId}?className=${cls.className}`)}
                className="bg-white rounded-2xl p-5 cursor-pointer transition-all"
                style={{ border: "0.5px solid #dbe4ee" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#004DB2"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#dbe4ee"}
              >
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-sm font-medium pr-2" style={{ color: "#004DB2" }}>
                    {cls.className}
                  </h2>
                  <span className="text-xs px-2.5 py-1 rounded-full shrink-0"
                    style={{ background: "#e6eef9", color: "#004DB2" }}>
                    {cls.classCode}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3"
                  style={{ borderTop: "0.5px solid #dbe4ee" }}>
                  <span className="text-xs" style={{ color: "#8fa8bc" }}>
                    {cls.teacherName}
                  </span>
                  <span className="text-xs" style={{ color: "#004DB2" }}>View →</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Join New Class Button */}
        <div className="flex justify-center">
          <button
            onClick={() => { setShowPopup(true); setError(""); setCode(""); }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all"
            style={{ border: "1.5px dashed #c8d9e6", color: "#004DB2", background: "white" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#004DB2"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#c8d9e6"}
          >
            + Join New Class
          </button>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.25)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowPopup(false); }}
        >
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm mx-4"
            style={{ border: "0.5px solid #dbe4ee" }}>

            <h2 className="text-xl mb-1" style={{ fontFamily: "Georgia, serif", color: "#004DB2" }}>
              Join a Class
            </h2>
            <p className="text-sm mb-6" style={{ color: "#8fa8bc" }}>
              Enter the 4-digit code your teacher shared with you.
            </p>

            {/* 4-digit code input */}
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={code}
              onChange={handleCodeChange}
              placeholder="_ _ _ _"
              className="w-full text-center text-3xl tracking-widest py-4 rounded-xl outline-none mb-4"
              style={{
                border: "0.5px solid #dbe4ee",
                color: "#004DB2",
                fontFamily: "Georgia, serif",
                letterSpacing: "0.4em"
              }}
              onFocus={e => e.target.style.borderColor = "#004DB2"}
              onBlur={e => e.target.style.borderColor = "#dbe4ee"}
              autoFocus
            />

            {error && <p className="text-xs mb-3 text-center" style={{ color: "#e24b4a" }}>{error}</p>}
            {success && <p className="text-xs mb-3 text-center" style={{ color: "#3b9e5e" }}>{success}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 py-3 rounded-xl text-sm"
                style={{ border: "0.5px solid #dbe4ee", color: "#8fa8bc" }}
              >
                Cancel
              </button>
              <button
                onClick={handleJoin}
                disabled={loading || code.length !== 4}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                style={{ background: "#004DB2" }}
              >
                {loading ? "Joining..." : "Join Class"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}