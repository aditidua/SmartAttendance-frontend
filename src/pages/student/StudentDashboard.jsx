import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { joinClass, getEnrolledClasses } from "../../api/studentApi";
import Navbar from "../../components/Navbar";

export default function StudentDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const data = await getEnrolledClasses(user.id, token);
      setClasses(data);
    } catch (err) {
      console.error("Failed to load classes", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (code.length < 4) return setError("Please enter the class code.");
    setJoining(true);
    setError("");
    try {
      await joinClass(user.id, code, token);
      setSuccess("Class joined successfully!");
      setCode("");
      await loadClasses(); // refresh class list
      setTimeout(() => {
        setShowPopup(false);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError("Invalid code or class not found.");
    } finally {
      setJoining(false);
    }
  };

  const handleCodeChange = (e) => {
    const val = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6);
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
            {loading ? "Loading..." : `${classes.length} ${classes.length === 1 ? "class" : "classes"} joined`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3"
              style={{ borderColor: "#dbe4ee", borderTopColor: "#004DB2" }} />
            <p className="text-sm" style={{ color: "#8fa8bc" }}>Loading your classes...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && classes.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: "#8fa8bc" }}>
              You haven't joined any classes yet.
            </p>
          </div>
        )}

        {/* Class Cards */}
        {!loading && classes.length > 0 && (
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
                    style={{ background: "#e6eef9", color: "#004DB2", letterSpacing: "0.06em" }}>
                    {cls.classCode}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3"
                  style={{ borderTop: "0.5px solid #dbe4ee" }}>
                  <span className="text-xs" style={{ color: "#8fa8bc" }}>
                    Teacher ID: {cls.teacher_id}
                  </span>
                  <span className="text-xs" style={{ color: "#004DB2" }}>View →</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Join New Class Button */}
        <div className="flex justify-center mt-4">
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
              Enter the 6-character code your teacher shared with you.
            </p>

            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={handleCodeChange}
              placeholder="e.g. AB12CD"
              className="w-full text-center text-2xl tracking-widest py-4 rounded-xl outline-none mb-4"
              style={{
                border: "0.5px solid #dbe4ee",
                color: "#004DB2",
                fontFamily: "Georgia, serif",
                letterSpacing: "0.3em"
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
                disabled={joining || code.length < 4}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                style={{ background: "#004DB2" }}
              >
                {joining ? "Joining..." : "Join Class"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
