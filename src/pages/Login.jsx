export default function Login() {
    /* when google button clicked. springboot takes over and opens googles popup*/
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#f0f4f8" }}>
      <div className="bg-white rounded-2xl p-10 w-full max-w-sm" style={{ border: "0.5px solid #dbe4ee" }}>

        {/* Logo - centered */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#004DB2" }}>
            <span className="text-white text-sm font-medium">SA</span>
          </div>
          <span className="text-lg" style={{ fontFamily: "Georgia, serif", color: "#004DB2" }}>
            SmartAttendance
          </span>
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1" style={{ background: "#e6eef9" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#004DB2" }}></span>
            <span className="text-xs" style={{ color: "#004DB2" }}>Attendance made simple</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl text-center mb-2" style={{ fontFamily: "Georgia, serif", color: "#004DB2" }}>
          Welcome back
        </h1>
        <p className="text-sm text-center mb-8 leading-relaxed" style={{ color: "#8fa8bc" }}>
          Sign in with your Google account to continue.
        </p>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white transition-colors text-sm font-medium"
          style={{ border: "0.5px solid #c8d9e6", color: "#004DB2" }}
          onMouseEnter={e => e.currentTarget.style.background = "#f0f7ff"}
          onMouseLeave={e => e.currentTarget.style.background = "white"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-xs text-center mt-6 leading-relaxed" style={{ color: "#b4c8d6" }}>
          By signing in, you agree to our terms. Your Google account info is only used for authentication.
        </p>
      </div>
    </div>
  );
}