import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { completeRegistration } from "../api/authApi";
/*only for new users. reads email.choose role. if student then pic required.*/
export default function CompleteRegistration() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!role) return setError("Please select a role.");
    if (role === "STUDENT" && !image) return setError("Please upload a photo.");
    setLoading(true);
    setError("");
    try {
      const token = await completeRegistration(email, role, image);
      login(token);
      if (role === "TEACHER") navigate("/teacher/dashboard");
      else navigate("/student/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#f0f4f8" }}>
      <div className="bg-white rounded-2xl p-10 w-full max-w-sm" style={{ border: "0.5px solid #dbe4ee" }}>

        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#004DB2" }}>
            <span className="text-white text-sm font-medium">SA</span>
          </div>
          <span className="text-lg" style={{ fontFamily: "Georgia, serif", color: "#004DB2" }}>
            SmartAttendance
          </span>
        </div>

        <h1 className="text-2xl text-center mb-2" style={{ fontFamily: "Georgia, serif", color: "#004DB2" }}>
          One last step
        </h1>
        <p className="text-sm text-center mb-8 leading-relaxed" style={{ color: "#8fa8bc" }}>
          Tell us who you are. Signed in as{" "}
          <span style={{ color: "#004DB2" }}>{email}</span>
        </p>

        {/* Role selection */}
        <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: "#8fa8bc" }}>
          I am a...
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {["STUDENT", "TEACHER"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className="py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                border: role === r ? "1.5px solid #004DB2" : "0.5px solid #dbe4ee",
                background: role === r ? "#004DB2" : "white",
                color: role === r ? "white" : "#8fa8bc",
              }}
            >
              {r === "STUDENT" ? "Student" : "Teacher"}
            </button>
          ))}
        </div>

        {/* Photo upload - students only */}
        {role === "STUDENT" && (
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: "#8fa8bc" }}>
              Upload your photo
            </p>
            <label className="flex flex-col items-center justify-center rounded-xl p-6 cursor-pointer transition-colors"
              style={{ border: "1px dashed #c8d9e6" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#004DB2"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#c8d9e6"}
            >
              {preview ? (
                <img src={preview} alt="preview" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: "#e6eef9" }}>
                    <svg width="18" height="18" fill="none" stroke="#004DB2" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M12 16v-8m-4 4l4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="3" y="3" width="18" height="18" rx="4"/>
                    </svg>
                  </div>
                  <span className="text-xs" style={{ color: "#8fa8bc" }}>Click to upload photo</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
            <p className="text-xs text-center mt-2" style={{ color: "#b4c8d6" }}>
              Used for face recognition attendance
            </p>
          </div>
        )}

        {error && (
          <p className="text-xs mb-4" style={{ color: "#e24b4a" }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50"
          style={{ background: "#004DB2" }}
          onMouseEnter={e => e.currentTarget.style.background = "#003d8f"}
          onMouseLeave={e => e.currentTarget.style.background = "#004DB2"}
        >
          {loading ? "Setting up..." : "Complete setup"}
        </button>
      </div>
    </div>
  );
}