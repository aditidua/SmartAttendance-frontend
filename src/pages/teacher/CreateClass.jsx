import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createClass } from "../../api/teacherApi";
import Navbar from "../../components/Navbar";

export default function CreateClass() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!className.trim()) return setError("Please enter a class name.");
    setLoading(true);
    setError("");
    try {
      await createClass(user.id, className, token);
      navigate("/teacher/dashboard");
    } catch (err) {
      setError("Failed to create class. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#f0f4f8" }}>
      <Navbar />
      <div className="p-8 flex justify-center">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md" style={{ border: "0.5px solid #dbe4ee" }}>

          <h1 className="text-2xl mb-2" style={{ fontFamily: "Georgia, serif", color: "#004DB2" }}>
            Create a Class
          </h1>
          <p className="text-sm mb-8" style={{ color: "#8fa8bc" }}>
            A unique 4-digit code will be generated automatically for students to join.
          </p>

          <label className="text-xs font-medium uppercase tracking-wide block mb-2"
            style={{ color: "#8fa8bc" }}>
            Class Name
          </label>
          <input
            type="text"
            placeholder="e.g. Mathematics 101"
            value={className}
            onChange={e => setClassName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleCreate()}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-6"
            style={{ border: "0.5px solid #dbe4ee", color: "#2c2c2a" }}
            onFocus={e => e.target.style.borderColor = "#004DB2"}
            onBlur={e => e.target.style.borderColor = "#dbe4ee"}
          />

          {error && <p className="text-xs mb-4" style={{ color: "#e24b4a" }}>{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/teacher/dashboard")}
              className="flex-1 py-3 rounded-xl text-sm"
              style={{ border: "0.5px solid #dbe4ee", color: "#8fa8bc" }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-medium text-white disabled:opacity-50"
              style={{ background: "#004DB2" }}
            >
              {loading ? "Creating..." : "Create Class"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}