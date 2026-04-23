import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchClassAttendance, openAttendance, closeAttendance, getAttendanceStatus, postAssignment, fetchAssignments, fetchSubmissions } from "../../api/teacherApi";
import Navbar from "../../components/Navbar";

export default function ClassAttendance() {
  const [searchParams] = useSearchParams();
  const classId = searchParams.get("classId");
  const className = searchParams.get("className");
  const navigate = useNavigate();
  const { token } = useAuth();

  const [activeTab, setActiveTab] = useState("attendance");
  const [attendance, setAttendance] = useState([]);
  const [dates, setDates] = useState([]);
  const [flagged, setFlagged] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionOpen, setSessionOpen] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);

  // Assignment state
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [posting, setPosting] = useState(false);
  const [assignmentError, setAssignmentError] = useState("");
  const [assignmentSuccess, setAssignmentSuccess] = useState("");
  const [submissions, setSubmissions] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [data, status, assignmentData] = await Promise.all([
          fetchClassAttendance(classId, token),
          getAttendanceStatus(classId, token),
          fetchAssignments(classId, token),
        ]);
        setAttendance(data);
        setSessionOpen(status);
        setAssignments(assignmentData);  
        const allDates = [...new Set(data.flatMap((s) => s.presentDates))].sort();
        setDates(allDates);
      } catch (err) {
        setError("Failed to load class data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [classId]);

  const toggleSession = async () => {
    setSessionLoading(true);
    try {
      if (sessionOpen) {
        await closeAttendance(classId, token);
        setSessionOpen(false);
      } else {
        await openAttendance(classId, token);
        setSessionOpen(true);
      }
    } catch (err) {
      console.error("Failed to toggle attendance session", err);
    } finally {
      setSessionLoading(false);
    }
  };

  const toggleFlag = (studentName) => {
    setFlagged((prev) => ({ ...prev, [studentName]: !prev[studentName] }));
  };

  const formatDate = (d) => {
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  };

  const handlePostAssignment = async () => {
    if (!description.trim()) return setAssignmentError("Please enter a description.");
    if (!deadline) return setAssignmentError("Please set a deadline.");
    setPosting(true);
    setAssignmentError("");
    try {
      await postAssignment(classId, description, deadline, token);
      const updated = await fetchAssignments(classId, token);
      setAssignments(updated);
      setDescription("");
      setDeadline("");
      setShowForm(false);
      setAssignmentSuccess("Assignment posted successfully!");
      setTimeout(() => setAssignmentSuccess(""), 3000);
    } catch (err) {
      setAssignmentError("Failed to post assignment.");
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const loadSubmissions = async (assignmentId) => {
    try {
      const data = await fetchSubmissions(assignmentId, token);
      setSubmissions((prev) => ({
        ...prev,
        [assignmentId]: data,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSubmissions = async (assignmentId) => {
  // If already open, just close it
  if (submissions[assignmentId] !== undefined) {
    setSubmissions((prev) => {
      const updated = { ...prev };
      delete updated[assignmentId];
      return updated;
    });
    return;
  }
  // Otherwise fetch fresh data
  await loadSubmissions(assignmentId);
};

  return (
    <div className="min-h-screen" style={{ background: "#f0f4f8" }}>
      <Navbar />
      <div className="p-8">

        {/* Back */}
        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="flex items-center gap-1 text-sm mb-6"
          style={{ color: "#8fa8bc" }}
        >
          ← Back to classes
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl" style={{ fontFamily: "Georgia, serif", color: "#004DB2" }}>
              {className || "Class"}
            </h1>
            <p className="text-sm mt-1" style={{ color: "#8fa8bc" }}>
              {loading ? "Loading..." : `${attendance.length} students · ${dates.length} sessions`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full"
                style={{ background: sessionOpen ? "#22c55e" : "#dbe4ee" }} />
              <span className="text-sm" style={{ color: sessionOpen ? "#22c55e" : "#8fa8bc" }}>
                {sessionOpen ? "Session Live" : "Session Closed"}
              </span>
            </div>
            <button
              onClick={toggleSession}
              disabled={sessionLoading}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: sessionOpen ? "#fff0f0" : "#004DB2",
                color: sessionOpen ? "#e24b4a" : "white",
                border: sessionOpen ? "0.5px solid #e24b4a" : "none",
                opacity: sessionLoading ? 0.6 : 1,
              }}
            >
              {sessionLoading ? "..." : sessionOpen ? "Close Session" : "Open Session"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: "#e6eef9" }}>
          {["attendance", "assignments"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all"
              style={{
                background: activeTab === tab ? "white" : "transparent",
                color: activeTab === tab ? "#004DB2" : "#8fa8bc",
                boxShadow: activeTab === tab ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3"
              style={{ borderColor: "#dbe4ee", borderTopColor: "#004DB2" }} />
            <p className="text-sm" style={{ color: "#8fa8bc" }}>Loading...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="text-sm" style={{ color: "#e24b4a" }}>{error}</p>
          </div>
        )}

        {/* Attendance Tab */}
        {!loading && !error && activeTab === "attendance" && (
          <>
            {attendance.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-sm" style={{ color: "#8fa8bc" }}>No attendance records yet.</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "0.5px solid #dbe4ee" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "0.5px solid #dbe4ee" }}>
                          <th className="text-left px-5 py-3 text-xs font-medium"
                            style={{ color: "#8fa8bc", minWidth: "160px" }}>Student</th>
                          {dates.map((d) => (
                            <th key={d} className="px-4 py-3 text-xs font-medium text-center"
                              style={{ color: "#8fa8bc", minWidth: "80px" }}>
                              {formatDate(d)}
                            </th>
                          ))}
                          <th className="px-4 py-3 text-xs font-medium text-center"
                            style={{ color: "#8fa8bc", minWidth: "80px" }}>Proxy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.map((student, i) => (
                          <tr key={student.studentName} style={{
                            borderBottom: i < attendance.length - 1 ? "0.5px solid #dbe4ee" : "none",
                            background: flagged[student.studentName] ? "#fff8f8" : "white",
                          }}>
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
                            {dates.map((d) => (
                              <td key={d} className="px-4 py-3 text-center">
                                {student.presentDates.includes(d) ? (
                                  <span style={{ color: "#004DB2", fontSize: "16px" }}>✓</span>
                                ) : (
                                  <span style={{ color: "#dbe4ee", fontSize: "16px" }}>—</span>
                                )}
                              </td>
                            ))}
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => toggleFlag(student.studentName)}
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
          </>
        )}

        {/* Assignments Tab */}
        {!loading && !error && activeTab === "assignments" && (
          <div>
            {/* Success message */}
            {assignmentSuccess && (
              <div className="mb-4 px-4 py-3 rounded-xl text-sm"
                style={{ background: "#eaf6ef", color: "#3b9e5e", border: "0.5px solid #3b9e5e" }}>
                {assignmentSuccess}
              </div>
            )}

            {/* Post Assignment Button */}
            {!showForm && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => { setShowForm(true); setAssignmentError(""); }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                  style={{ background: "#004DB2" }}
                >
                  + Post Assignment
                </button>
              </div>
            )}

            {/* Assignment Form */}
            {showForm && (
              <div className="bg-white rounded-2xl p-6 mb-6"
                style={{ border: "0.5px solid #dbe4ee" }}>
                <h2 className="text-sm font-medium mb-4" style={{ color: "#004DB2" }}>
                  New Assignment
                </h2>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: "#8fa8bc" }}>
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the assignment..."
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                      style={{ border: "0.5px solid #dbe4ee", color: "#2c2c2a" }}
                      onFocus={e => e.target.style.borderColor = "#004DB2"}
                      onBlur={e => e.target.style.borderColor = "#dbe4ee"}
                    />
                  </div>

                  <div>
                    <label className="text-xs mb-1 block" style={{ color: "#8fa8bc" }}>
                      Deadline
                    </label>
                    <input
                      type="datetime-local"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ border: "0.5px solid #dbe4ee", color: "#2c2c2a" }}
                      onFocus={e => e.target.style.borderColor = "#004DB2"}
                      onBlur={e => e.target.style.borderColor = "#dbe4ee"}
                    />
                  </div>

                  {assignmentError && (
                    <p className="text-xs" style={{ color: "#e24b4a" }}>{assignmentError}</p>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => { setShowForm(false); setDescription(""); setDeadline(""); setAssignmentError(""); }}
                      className="flex-1 py-3 rounded-xl text-sm"
                      style={{ border: "0.5px solid #dbe4ee", color: "#8fa8bc" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePostAssignment}
                      disabled={posting}
                      className="flex-1 py-3 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                      style={{ background: "#004DB2" }}
                    >
                      {posting ? "Posting..." : "Post"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Assignments List */}
            {assignments.length === 0 && !showForm ? (
              <div className="text-center py-20">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "#e6eef9" }}>
                  <svg width="20" height="20" fill="none" stroke="#004DB2" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                    <rect x="9" y="3" width="6" height="4" rx="1" />
                    <path d="M9 12h6M9 16h4" />
                  </svg>
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: "#004DB2" }}>No assignments yet</p>
                <p className="text-xs" style={{ color: "#8fa8bc" }}>Post your first assignment for this class.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {assignments.map((a, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-5"
                    style={{ border: "0.5px solid #dbe4ee" }}
                  >
                    <p className="text-sm mb-3" style={{ color: "#2c2c2a" }}>
                      {a.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "#8fa8bc" }}>
                        Due: {new Date(a.deadline).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {/* 🔥 BUTTON */}
                      <button
                        onClick={() => toggleSubmissions(a.id)}
                        className="text-xs font-medium"
                        style={{ color: "#004DB2" }}
                      >
                        View Submissions
                      </button>
                    </div>

                    {/* 🔥 SUBMISSIONS DISPLAY */}
                    {submissions[a.id] && (
                      <div className="mt-3 border-t pt-3">
                        {submissions[a.id].length === 0 ? (
                          <p className="text-xs" style={{ color: "#8fa8bc" }}>
                            No submissions yet
                          </p>
                        ) : (
                          submissions[a.id].map((s, idx) => {
                            return (
                              <div
                                key={idx}
                                className="flex justify-between items-center mb-2"
                              >
                                <span className="text-sm" style={{ color: "#2c2c2a" }}>
                                  {s.student.name}
                                </span>

                                <a
                                  href={s.submissionUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs"
                                  style={{ color: "#22c55e" }}
                                >
                                  View File
                                </a>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}