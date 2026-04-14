import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchStudentDetails } from "../../api/studentApi";
import Navbar from "../../components/Navbar";

export default function ClassDetail() {
  const { classId } = useParams();
  const [searchParams] = useSearchParams();
  const className = searchParams.get("className");
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchStudentDetails(user.id, classId, token);
        setProfile(data);
      } catch (err) {
        setError("Failed to load attendance details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [classId]);

  const attended = profile?.attendance?.length ?? 0;
  const total = profile?.totalClasses ?? 0;
  const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;

  const barColor =
    percentage >= 75 ? "#3b9e5e" : percentage >= 50 ? "#e9a825" : "#e24b4a";

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="min-h-screen" style={{ background: "#f0f4f8" }}>
      <Navbar />
      <div className="p-8 max-w-2xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate("/student/dashboard")}
          className="flex items-center gap-1 text-sm mb-6"
          style={{ color: "#8fa8bc" }}
        >
          ← Back to classes
        </button>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3"
              style={{ borderColor: "#dbe4ee", borderTopColor: "#004DB2" }} />
            <p className="text-sm" style={{ color: "#8fa8bc" }}>Loading your attendance...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="text-sm" style={{ color: "#e24b4a" }}>{error}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && profile && (
          <>
            {/* Class name */}
            <h1 className="text-2xl mb-1"
              style={{ fontFamily: "Georgia, serif", color: "#004DB2" }}>
              {className || "Class"}
            </h1>
            <p className="text-sm mb-8" style={{ color: "#8fa8bc" }}>
              Welcome back, {profile.studentName}
            </p>

            {/* Attendance Card */}
            <div className="bg-white rounded-2xl p-6 mb-4"
              style={{ border: "0.5px solid #dbe4ee" }}>

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium" style={{ color: "#004DB2" }}>
                  Attendance
                </span>
                <span className="text-sm font-medium" style={{ color: barColor }}>
                  {percentage}%
                </span>
              </div>

              {/* Bar */}
              <div className="w-full rounded-full mb-3"
                style={{ background: "#f0f4f8", height: "10px" }}>
                <div
                  className="rounded-full transition-all"
                  style={{ width: `${percentage}%`, height: "10px", background: barColor }}
                />
              </div>

              {/* Numerical + status */}
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "#8fa8bc" }}>
                  {attended} of {total} classes attended
                </span>
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{
                    background: percentage >= 75 ? "#eaf6ef" : percentage >= 50 ? "#fef8ec" : "#fef0f0",
                    color: barColor,
                  }}
                >
                  {percentage >= 75 ? "Good standing" : percentage >= 50 ? "Needs improvement" : "At risk"}
                </span>
              </div>
            </div>

            {/* Mark Attendance Button */}
            <button
              onClick={() => navigate(`/student/mark-attendance?classId=${classId}&className=${className}`)}
              className="w-full py-3 rounded-xl text-sm font-medium text-white mb-8 flex items-center justify-center gap-2"
              style={{ background: "#004DB2" }}
              onMouseEnter={e => e.currentTarget.style.background = "#003d8f"}
              onMouseLeave={e => e.currentTarget.style.background = "#004DB2"}
            >
              <svg width="16" height="16" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Mark Attendance
            </button>

            {/* Present Dates */}
            <div className="bg-white rounded-2xl p-6"
              style={{ border: "0.5px solid #dbe4ee" }}>
              <h2 className="text-sm font-medium mb-4" style={{ color: "#004DB2" }}>
                Days Present
              </h2>
              {profile.attendance.length === 0 ? (
                <p className="text-sm" style={{ color: "#8fa8bc" }}>
                  No attendance recorded yet.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {profile.attendance.map((date, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: "#004DB2" }} />
                      <span className="text-sm" style={{ color: "#5f5e5a" }}>
                        {formatDate(date)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
