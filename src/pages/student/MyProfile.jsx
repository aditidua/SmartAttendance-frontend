import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

export default function MyProfile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#f0f4f8" }}>
      <Navbar />

      <div className="p-8 max-w-xl mx-auto">
        <h1
          className="text-2xl mb-6"
          style={{ fontFamily: "Georgia, serif", color: "#004DB2" }}
        >
          My Profile
        </h1>

        <div
          className="bg-white rounded-2xl p-6"
          style={{ border: "0.5px solid #dbe4ee" }}
        >
          <p className="mb-2">
            <strong>Email:</strong> {user.email}
          </p>

          <p className="mb-2">
            <strong>Role:</strong> {user.role}
          </p>

          {/* Optional (if present in token) */}
          {user.id && (
            <p className="mb-2">
              <strong>User ID:</strong> {user.id}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
