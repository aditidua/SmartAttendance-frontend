import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchStudentDetails } from "../../api/studentApi";
import Navbar from "../../components/Navbar";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ClassDetail() {
  const { classId } = useParams();
  const [searchParams] = useSearchParams();
  const className = searchParams.get("className");
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [activeTab, setActiveTab] = useState("attendance");
  const [profile, setProfile] = useState(null);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Assignments state ---
  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [data, status] = await Promise.all([
          fetchStudentDetails(user.id, classId, token),
          axios.get(`${BASE_URL}/teacher/attendanceStatus`, {
            params: { classId },
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProfile(data);
        setSessionOpen(status.data);
      } catch (err) {
        setError("Failed to load class details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [classId]);

  // Fetch assignments only when tab is opened
  useEffect(() => {
    if (activeTab !== "assignments") return;
    const fetchAssignments = async () => {
      setAssignmentsLoading(true);
      setAssignmentsError("");
      try {
        const res = await axios.get(`${BASE_URL}/student/getAssignments`, {
          params: { classId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(res.data);
      } catch (err) {
        setAssignmentsError("Failed to load assignments.");
        console.error(err);
      } finally {
        setAssignmentsLoading(false);
      }
    };
    fetchAssignments();
  }, [activeTab, classId]);

  const attended = profile?.attendance?.length ?? 0;
  const total = profile?.totalClasses ?? 0;
  const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;

  const barColor =
    percentage >= 75 ? "#3b9e5e" : percentage >= 50 ? "#e9a825" : "#e24b4a";
  const barBg =
    percentage >= 75 ? "#eaf6ef" : percentage >= 50 ? "#fef8ec" : "#fef0f0";
  const statusLabel =
    percentage >= 75 ? "Good standing" : percentage >= 50 ? "Needs improvement" : "At risk";

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
            <p className="text-sm" style={{ color: "#8fa8bc" }}>Loading...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="text-sm" style={{ color: "#e24b4a" }}>{error}</p>
          </div>
        )}

        {!loading && !error && profile && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-2xl mb-1"
                  style={{ fontFamily: "Georgia, serif", color: "#004DB2" }}>
                  {className || "Class"}
                </h1>
                <p className="text-sm" style={{ color: "#8fa8bc" }}>
                  Welcome back, {profile.studentName}
                </p>
              </div>
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: sessionOpen ? "#eaf6ef" : "#f0f4f8",
                  border: `0.5px solid ${sessionOpen ? "#3b9e5e" : "#dbe4ee"}`,
                }}
              >
                <div className="w-2 h-2 rounded-full"
                  style={{ background: sessionOpen ? "#3b9e5e" : "#dbe4ee" }} />
                <span className="text-xs font-medium"
                  style={{ color: sessionOpen ? "#3b9e5e" : "#8fa8bc" }}>
                  {sessionOpen ? "Session Live" : "Session Closed"}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit"
              style={{ background: "#e6eef9" }}>
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

            {/* Attendance Tab */}
            {activeTab === "attendance" && (
              <div className="flex flex-col gap-4">

                {/* Mark Attendance */}
                {sessionOpen ? (
                  <button
                    onClick={() => navigate(`/student/mark-attendance?classId=${classId}&className=${className}`)}
                    className="w-full py-4 rounded-2xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-all"
                    style={{ background: "#004DB2" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#003d8f"}
                    onMouseLeave={e => e.currentTarget.style.background = "#004DB2"}
                  >
                    <svg width="16" height="16" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
                    </svg>
                    Mark Attendance
                  </button>
                ) : (
                  <div className="w-full py-4 rounded-2xl text-sm text-center"
                    style={{ background: "#f0f4f8", border: "0.5px solid #dbe4ee", color: "#8fa8bc" }}>
                    Attendance is not open yet
                  </div>
                )}

                {/* Stats Row */}
                <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                  <div className="bg-white rounded-2xl p-4 text-center"
                    style={{ border: "0.5px solid #dbe4ee" }}>
                    <p className="text-2xl font-semibold mb-1" style={{ color: "#004DB2" }}>
                      {attended}
                    </p>
                    <p className="text-xs" style={{ color: "#8fa8bc" }}>Present</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center"
                    style={{ border: "0.5px solid #dbe4ee" }}>
                    <p className="text-2xl font-semibold mb-1" style={{ color: "#004DB2" }}>
                      {total}
                    </p>
                    <p className="text-xs" style={{ color: "#8fa8bc" }}>Total</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center"
                    style={{ border: "0.5px solid #dbe4ee" }}>
                    <p className="text-2xl font-semibold mb-1" style={{ color: barColor }}>
                      {total - attended}
                    </p>
                    <p className="text-xs" style={{ color: "#8fa8bc" }}>Absent</p>
                  </div>
                </div>

                {/* Attendance % Card */}
                <div className="bg-white rounded-2xl p-6"
                  style={{ border: "0.5px solid #dbe4ee" }}>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium" style={{ color: "#2c2c2a" }}>
                      Attendance Rate
                    </span>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: barBg, color: barColor }}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-4xl font-semibold" style={{ color: barColor }}>
                      {percentage}
                    </span>
                    <span className="text-lg mb-1" style={{ color: "#8fa8bc" }}>%</span>
                  </div>

                  <div className="w-full rounded-full" style={{ background: "#f0f4f8", height: "8px" }}>
                    <div
                      className="rounded-full transition-all"
                      style={{ width: `${percentage}%`, height: "8px", background: barColor }}
                    />
                  </div>

                  <div className="flex justify-between mt-2">
                    <span className="text-xs" style={{ color: "#dbe4ee" }}>0%</span>
                    <span className="text-xs" style={{ color: percentage >= 75 ? "#3b9e5e" : "#dbe4ee" }}>
                      75% required
                    </span>
                    <span className="text-xs" style={{ color: "#dbe4ee" }}>100%</span>
                  </div>
                </div>

              </div>
            )}

            {/* Assignments Tab */}
            {activeTab === "assignments" && (
              <div className="flex flex-col gap-3">

                {assignmentsLoading && (
                  <div className="text-center py-16">
                    <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3"
                      style={{ borderColor: "#dbe4ee", borderTopColor: "#004DB2" }} />
                    <p className="text-sm" style={{ color: "#8fa8bc" }}>Loading assignments…</p>
                  </div>
                )}

                {assignmentsError && (
                  <div className="text-center py-16">
                    <p className="text-sm" style={{ color: "#e24b4a" }}>{assignmentsError}</p>
                  </div>
                )}

                {!assignmentsLoading && !assignmentsError && assignments.length === 0 && (
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
                    <p className="text-xs" style={{ color: "#8fa8bc" }}>Your teacher hasn't posted anything yet.</p>
                  </div>
                )}

                {!assignmentsLoading && !assignmentsError && assignments.map((a) => (
                  <AssignmentCard
                    key={a.id}
                    assignment={a}
                    studentId={user.id}
                    token={token}
                  />
                ))}

              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AssignmentCard({ assignment, studentId, token }) {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async () => {
    if (!file) return setSubmitError("Please select a file.");
    setSubmitting(true);
    setSubmitError("");
    try {
      const formData = new FormData();
      formData.append("assignmentId", assignment.id);
      formData.append("studentId", studentId);
      formData.append("solution", file);

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/student/submitAssignment`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        // do NOT set Content-Type — axios sets multipart boundary automatically
      });

      setSubmitted(true);
      setFile(null);
    } catch (err) {
      setSubmitError("Submission failed. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const due = assignment.dueDate ? new Date(assignment.dueDate) : null;
  const diff = due ? Math.ceil((due - new Date()) / 86400000) : null;
  const dueColor = diff === null ? "#8fa8bc" : diff < 0 ? "#e24b4a" : diff <= 2 ? "#e9a825" : "#004DB2";
  const dueBg   = diff === null ? "#f0f4f8"  : diff < 0 ? "#fdecea"  : diff <= 2 ? "#fef8ec"  : "#e6eef9";
  const dueLabel = diff === null ? "" : diff < 0 ? `Overdue · ${assignment.dueDate}` : diff <= 2 ? `Due soon · ${assignment.dueDate}` : `Due ${assignment.dueDate}`;

  return (
    <div className="bg-white rounded-2xl p-5" style={{ border: "0.5px solid #dbe4ee" }}>
      <p className="text-sm font-medium mb-1" style={{ color: "#1a2e44" }}>{assignment.title}</p>

      {assignment.description && (
        <p className="text-xs mb-3" style={{ color: "#5a7a96", lineHeight: 1.6 }}>
          {assignment.description}
        </p>
      )}

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {assignment.postedAt && (
          <span className="text-xs" style={{ color: "#8fa8bc" }}>Posted {assignment.postedAt}</span>
        )}
        {dueLabel && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: dueBg, color: dueColor }}>
            {dueLabel}
          </span>
        )}
      </div>

      {submitted ? (
        <p className="text-xs font-medium" style={{ color: "#3b9e5e" }}>✓ Submitted successfully</p>
      ) : (
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="file"
            onChange={(e) => { setFile(e.target.files[0]); setSubmitError(""); }}
            className="text-xs"
            style={{ color: "#1a2e44" }}
          />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-1.5 rounded-lg text-xs font-medium text-white"
            style={{
              background: submitting ? "#8fa8bc" : "#004DB2",
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Submitting…" : "Submit"}
          </button>
          {submitError && <span className="text-xs" style={{ color: "#e24b4a" }}>{submitError}</span>}
        </div>
      )}
    </div>
  );
}
