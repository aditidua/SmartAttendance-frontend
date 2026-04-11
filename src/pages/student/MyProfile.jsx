import Navbar from "../../components/Navbar";

export default function MyProfile() {
  return (
    <div className="min-h-screen" style={{ background: "#f0f4f8" }}>
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl" style={{ fontFamily: "Georgia, serif", color: "#004DB2" }}>
          My Profile
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8fa8bc" }}>Coming soon...</p>
      </div>
    </div>
  );
}