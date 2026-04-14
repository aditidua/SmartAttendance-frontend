import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchClassAttendance } from "../../api/teacherApi";
import Navbar from "../../components/Navbar";

export default function ClassAttendance() {
  const [searchParams] = useSearchParams();
  const classId = searchParams.get("classId");
  const className = searchParams.get("className");
  const navigate = useNavigate();
  const { token } = useAuth();

  const [attendance, setAttendance] = useState([]);
  const [dates, setDates] = useState([]);
  const [flagged, setFlagged] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const data = await fetchClassAttendance(classId, token);
        setAttendance(data);

        // Extract all unique dates across all students
        const allDates = [
          ...new Set(data.flatMap((s) => s.presentDates))
        ].sort();
        setDates(allDates);
      } catch (err) {
        setError("Failed to load attendance.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAttendance();
  }, [classId]);

  const toggleFlag = (studentName) => {
    setFlagged((prev) => ({ ...prev, [studentName]: !prev[studentName] }));
  };

  const formatDate = (d) => {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div className="min-h-screen" style={{ background: "#f0f4f8" }}>
      <Navbar />
      <div className="p-8">

        {/* Header */}
        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="flex items-center gap-1 text-sm mb-6"
          style={{ color: "#8fa8bc" }}
        >
          ← Back to classes
        </button>

        <div className="mb-6">
          <h1 className="text-2xl" style={{ fontFamily: "Georgia, serif", color: "#004DB2" }}>
            {className || "Class Attendance"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8fa8bc" }}>
            {loading ? "Loading..." : `${attendance.length} students · ${dates.length} sessions`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3"
              style={{ borderColor: "#dbe4ee", borderTopColor: "#004DB2" }} />
            <p className="text-sm" style={{ color: "#8fa8bc" }}>Loading attendance...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="text-sm" style={{ color: "#e24b4a" }}>{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && attendance.length === 0 && (
          <div className="text-center py-20">
            <p className="text-sm" style={{ color: "#8fa8bc" }}>
              No attendance records yet for this class.
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && attendance.length > 0 && (
          <>
            <div className="bg-white rounded-2xl overflow-hidden"
              style={{ border: "0.5px solid #dbe4ee" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "0.5px solid #dbe4ee" }}>
                      <th className="text-left px-5 py-3 text-xs font-medium"
                        style={{ color: "#8fa8bc", minWidth: "160px" }}>
                        Student
                      </th>
                      {dates.map((d) => (
                        <th key={d} className="px-4 py-3 text-xs font-medium text-center"
                          style={{ color: "#8fa8bc", minWidth: "80px" }}>
                          {formatDate(d)}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-xs font-medium text-center"
                        style={{ color: "#8fa8bc", minWidth: "80px" }}>
                        Proxy
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((student, i) => (
                      <tr
                        key={student.studentName}
                        style={{
                          borderBottom: i < attendance.length - 1 ? "0.5px solid #dbe4ee" : "none",
                          background: flagged[student.studentName] ? "#fff8f8" : "white",
                        }}
                      >
                        {/* Student name */}
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                              style={{ background: "#e6eef9", color: "#004DB2" }}>
                              {student.studentName.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <span className="text-sm" style={{ color: "#2c2c2a" }}>
                              {student.studentName}
                            </span>
                          </div>
                        </td>

                        {/* Attendance cells */}
                        {dates.map((d) => (
                          <td key={d} className="px-4 py-3 text-center">
                            {student.presentDates.includes(d) ? (
                              <span style={{ color: "#004DB2", fontSize: "16px" }}>✓</span>
                            ) : (
                              <span style={{ color: "#dbe4ee", fontSize: "16px" }}>—</span>
                            )}
                          </td>
                        ))}

                        {/* Proxy flag */}
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleFlag(student.studentName)}
                            title={flagged[student.studentName] ? "Marked suspicious" : "Mark as suspicious"}
                            className="w-6 h-6 rounded-full border transition-all mx-auto flex items-center justify-center"
                            style={{
                              background: flagged[student.studentName] ? "#e24b4a" : "white",
                              borderColor: flagged[student.studentName] ? "#e24b4a" : "#dbe4ee",
                            }}
                          >
                            {flagged[student.studentName] && (
                              <span style={{ color: "white", fontSize: "10px" }}>!</span>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <span style={{ color: "#004DB2" }}>✓</span>
                <span className="text-xs" style={{ color: "#8fa8bc" }}>Present</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: "#dbe4ee" }}>—</span>
                <span className="text-xs" style={{ color: "#8fa8bc" }}>Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ background: "#e24b4a" }} />
                <span className="text-xs" style={{ color: "#8fa8bc" }}>Proxy flagged</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
