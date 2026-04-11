import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
/*This page's entire job is to catch what Spring Boot sends back after Google login and decide where to go.*/ 
export default function OAuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const role = params.get("role");
    const email = params.get("email");
    const message = params.get("message");

    if (token && role) {
      login(token);
      if (role === "TEACHER") navigate("/teacher/dashboard");
      else navigate("/student/dashboard");
    } else if (email && message) {
      navigate(`/complete-registration?email=${email}`);
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#f0f4f8" }}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: "#dbe4ee", borderTopColor: "#004DB2" }}>
        </div>
        <p className="text-sm" style={{ color: "#8fa8bc" }}>Signing you in...</p>
      </div>
    </div>
  );
}