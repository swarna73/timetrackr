import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import WelcomeRegister from "./pages/WelcomeRegister";

function App() {
  const [bootstrapNeeded, setBootstrapNeeded] = useState(null); // initially unknown
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    // 👇 Only fetch bootstrapNeeded once
    const fetchBootstrapStatus = async () => {
      try {
        const res = await fetch("/api/auth/bootstrap-needed");
        const data = await res.json();
        setBootstrapNeeded(data); // true or false
      } catch (err) {
        console.error("Error checking bootstrap-needed:", err);
        setBootstrapNeeded(false); // fallback
      }
    };

    fetchBootstrapStatus();
  }, []);

  // ✅ Track token from localStorage changes
  useEffect(() => {
    const interval = setInterval(() => {
      const storedToken = localStorage.getItem("token");
      if (storedToken !== token) {
        setToken(storedToken);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [token]);

  // 🕐 Show loading while bootstrap status is being checked
  if (bootstrapNeeded === null) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* 👋 Show welcome-register if first-time setup */}
        {bootstrapNeeded ? (
          <>
            <Route path="/welcome-register" element={<WelcomeRegister />} />
            <Route path="*" element={<Navigate to="/welcome-register" />} />
          </>
        ) : (
          <>
            <Route path="/" element={!token ? <LoginPage /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/welcome-register" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
