import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchClassAttendance } from "../../api/teacherApi";
import Navbar from "../../components/Navbar";

// Dummy data — replace with real API
const DUMMY_DATA = [
  { studentName: "Aditi Sharma", presentDates: ["2025-04-01", "2025-04-02", "2025-04-04"] },
  { studentName: "Rahul Kumar", presentDates: ["2025-04-01", "2025-04-03", "2025-04-04"] },
  { studentName: "Priya Singh", presentDates: ["2025-04-02", "2025-04-03"] },
  { studentName: "Amit Mehta", presentDates: ["2025-04-01", "2025-04-02", "2025-04-03", "2025-04-04"] },
];

const ALL_DATES = ["2025-04-01", "2025-04-02", "2025-04-03", "2025-04-04"];

export default function ClassAttendance() {
  const [searchParams] = useSearchParams();
  const classId = searchParams.get("classId");
  const className = searchParams.get("className");
  const { token } = useAuth();

  const [attendance, setAttendance] = useState(DUMMY_DATA);
  const [dates, setDates] = useState(ALL_DATES);
  const [flagged, setFlagged] = useState({});

  const toggleFlag = (studentName) => {
    setFlagged(prev => ({ ...prev, [studentName]: !prev[studentName] }));
  };

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  };

  return (
    <div className="min-h-screen" style={{ background: "#f0f4f8" }}>
      <Navbar />
      <div className="p-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl" style={{ fontFamily: "Georgia, serif", color: "#004DB2" }}>
            {className || "Class Attendance"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8fa8bc" }}>
            {attendance.length} students · {dates.length} sessions
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "0.5px solid #dbe4ee" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "0.5px solid #dbe4ee" }}>
                  <th className="text-left px-5 py-3 text-xs font-medium"
                    style={{ color: "#8fa8bc", minWidth: "160px" }}>
                    Student
                  </th>
                  {dates.map(d => (
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
                    style={{ borderBottom: i < attendance.length - 1 ? "0.5px solid #dbe4ee" : "none",
                      background: flagged[student.studentName] ? "#fff5f5" : "white" }}
                  >
                    {/* Student name */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                          style={{ background: "#e6eef9", color: "#004DB2" }}>
                          {student.studentName.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-sm" style={{ color: "#2c2c2a" }}>
                          {student.studentName}
                        </span>
                      </div>
                    </td>

                    {/* Attendance cells */}
                    {dates.map(d => (
                      <td key={d} className="px-4 py-3 text-center">
                        {student.presentDates.includes(d) ? (
                          <span className="text-base" style={{ color: "#004DB2" }}>✓</span>
                        ) : (
                          <span className="text-base" style={{ color: "#dbe4ee" }}>—</span>
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
            <div className="w-4 h-4 rounded-full" style={{ background: "#e24b4a" }}></div>
            <span className="text-xs" style={{ color: "#8fa8bc" }}>Proxy flagged</span>
          </div>
        </div>
      </div>
    </div>
  );
}