import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const role = params.get("role");
    const email = params.get("email");
    const message = params.get("message");

    // ✅ Case 1: Existing user (token + role)
    if (token && role) {
      login(token);

      // 🔥 IMPORTANT: use replace to avoid back navigation issues
      if (role === "TEACHER") {
        navigate("/teacher/dashboard", { replace: true });
      } else {
        navigate("/student/dashboard", { replace: true });
      }
    }

    // ✅ Case 2: New user (incomplete profile)
    else if (email && message === "incomplete") {
     navigate(`/complete-registration?email=${email}`, { replace: true });
    }

    // ❌ Case 3: Something went wrong
    else {
      navigate("/login", { replace: true });
    }

  }, [login, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#f0f4f8" }}
    >
      <div className="text-center">
        <div
          className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: "#dbe4ee", borderTopColor: "#004DB2" }}
        ></div>
        <p className="text-sm" style={{ color: "#8fa8bc" }}>
          Signing you in...
        </p>
      </div>
    </div>
  );
}
