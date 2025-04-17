import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import WelcomeRegister from "./pages/WelcomeRegister";
import axios from "./api/axios";

function App() {
  const [bootstrapNeeded, setBootstrapNeeded] = useState(null); // null = loading
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("/auth/bootstrap-needed")
      .then((res) => {
        setBootstrapNeeded(res.data);
      })
      .catch((err) => {
        console.error("Failed to check bootstrap state", err);
        setBootstrapNeeded(false); // fallback to normal flow
      });
  }, []);

  if (bootstrapNeeded === null) {
    // Optional: a loading state while we check
    return <div className="text-center p-4">🔄 Checking setup...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* 👋 Welcome setup flow */}
        {bootstrapNeeded && (
          <Route path="*" element={<WelcomeRegister />} />
        )}

        {/* 🔒 Authenticated flow */}
        {!bootstrapNeeded && (
          <>
            <Route
              path="/"
              element={!token ? <LoginPage /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/dashboard"
              element={token ? <Dashboard /> : <Navigate to="/" />}
            />
            <Route path="/welcome-register" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
