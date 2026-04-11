import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { markAttendance } from "../../api/studentApi";
import Navbar from "../../components/Navbar";

export default function MarkAttendance() {
  const [searchParams] = useSearchParams();
  const classId = searchParams.get("classId");
  const className = searchParams.get("className");
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [step, setStep] = useState("camera"); // camera | preview | submitting | success | error
  const [photo, setPhoto] = useState(null);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [stream, setStream] = useState(null);

  // Start camera + get location on mount
  useEffect(() => {
    startCamera();
    getLocation();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch {
      setErrorMsg("Camera access denied. Please allow camera access and try again.");
      setStep("error");
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported on this device.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationError("Location access denied. Attendance may be rejected.")
    );
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setPhoto(dataUrl);

    // Convert to blob for API
    canvas.toBlob((blob) => setPhotoBlob(blob), "image/jpeg");
    stopCamera();
    setStep("preview");
  };

  const retake = () => {
    setPhoto(null);
    setPhotoBlob(null);
    setStep("camera");
    startCamera();
  };

  const submitAttendance = async () => {
    if (!location) {
      setErrorMsg("Location is required to mark attendance.");
      setStep("error");
      return;
    }
    setStep("submitting");
    try {
      const imageFile = new File([photoBlob], "attendance.jpg", { type: "image/jpeg" });
      await markAttendance(user.id, classId, imageFile, token);
      setStep("success");
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Attendance could not be verified. Please try again.");
      setStep("error");
    }
  };

  const now = new Date();
  const timeString = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const dateString = now.toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long" });

  return (
    <div className="min-h-screen" style={{ background: "#f0f4f8" }}>
      <Navbar />
      <div className="p-8 max-w-md mx-auto">

        <button
          onClick={() => { stopCamera(); navigate(-1); }}
          className="flex items-center gap-1 text-sm mb-6"
          style={{ color: "#8fa8bc" }}
        >
          ← Back
        </button>

        <h1 className="text-2xl mb-1" style={{ fontFamily: "Georgia, serif", color: "#004DB2" }}>
          Mark Attendance
        </h1>
        <p className="text-sm mb-6" style={{ color: "#8fa8bc" }}>{className}</p>

        {/* Time + Location Info */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-white rounded-xl p-3" style={{ border: "0.5px solid #dbe4ee" }}>
            <p className="text-xs mb-1" style={{ color: "#8fa8bc" }}>Time</p>
            <p className="text-sm font-medium" style={{ color: "#004DB2" }}>{timeString}</p>
            <p className="text-xs" style={{ color: "#8fa8bc" }}>{dateString}</p>
          </div>
          <div className="flex-1 bg-white rounded-xl p-3" style={{ border: "0.5px solid #dbe4ee" }}>
            <p className="text-xs mb-1" style={{ color: "#8fa8bc" }}>Location</p>
            {location ? (
              <>
                <p className="text-sm font-medium" style={{ color: "#3b9e5e" }}>Detected ✓</p>
                <p className="text-xs" style={{ color: "#8fa8bc" }}>
                  {location.lat.toFixed(3)}, {location.lng.toFixed(3)}
                </p>
              </>
            ) : (
              <p className="text-sm" style={{ color: "#e9a825" }}>
                {locationError || "Detecting..."}
              </p>
            )}
          </div>
        </div>

        {/* Camera Step */}
        {step === "camera" && (
          <div>
            <div className="rounded-2xl overflow-hidden mb-4" style={{ border: "0.5px solid #dbe4ee" }}>
              <video ref={videoRef} autoPlay playsInline className="w-full" style={{ display: "block" }} />
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <button
              onClick={capturePhoto}
              className="w-full py-3 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2"
              style={{ background: "#004DB2" }}
            >
              <svg width="16" height="16" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
              </svg>
              Take Photo
            </button>
          </div>
        )}

        {/* Preview Step */}
        {step === "preview" && (
          <div>
            <div className="rounded-2xl overflow-hidden mb-4" style={{ border: "0.5px solid #dbe4ee" }}>
              <img src={photo} alt="captured" className="w-full" style={{ display: "block" }} />
            </div>
            <div className="flex gap-3">
              <button
                onClick={retake}
                className="flex-1 py-3 rounded-xl text-sm"
                style={{ border: "0.5px solid #dbe4ee", color: "#8fa8bc" }}
              >
                Retake
              </button>
              <button
                onClick={submitAttendance}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-white"
                style={{ background: "#004DB2" }}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Submitting */}
        {step === "submitting" && (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-2 rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: "#dbe4ee", borderTopColor: "#004DB2" }} />
            <p className="text-sm" style={{ color: "#8fa8bc" }}>Verifying your attendance...</p>
          </div>
        )}

        {/* Success */}
        {step === "success" && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "#eaf6ef" }}>
              <span style={{ fontSize: "28px", color: "#3b9e5e" }}>✓</span>
            </div>
            <h2 className="text-lg font-medium mb-2" style={{ color: "#3b9e5e" }}>Attendance Marked!</h2>
            <p className="text-sm mb-6" style={{ color: "#8fa8bc" }}>
              Your attendance has been recorded successfully.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl text-sm font-medium text-white"
              style={{ background: "#004DB2" }}
            >
              Back to Class
            </button>
          </div>
        )}

        {/* Error */}
        {step === "error" && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "#fef0f0" }}>
              <span style={{ fontSize: "28px", color: "#e24b4a" }}>✕</span>
            </div>
            <h2 className="text-lg font-medium mb-2" style={{ color: "#e24b4a" }}>Verification Failed</h2>
            <p className="text-sm mb-6" style={{ color: "#8fa8bc" }}>{errorMsg}</p>
            <button
              onClick={retake}
              className="px-6 py-3 rounded-xl text-sm font-medium text-white"
              style={{ background: "#004DB2" }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}