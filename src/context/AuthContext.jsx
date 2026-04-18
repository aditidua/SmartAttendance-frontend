import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");

    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setToken(storedToken);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token");
        sessionStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  const login = useCallback((newToken) => {
    try {
      const decoded = jwtDecode(newToken);
      sessionStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(decoded);
    } catch (err) {
      console.error("Token decode failed");
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
