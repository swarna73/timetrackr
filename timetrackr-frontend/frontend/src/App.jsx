import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import WelcomeRegister from "./pages/WelcomeRegister";
import { useEffect, useState } from "react";
import axios from "./api/axios";

function App() {
  const [bootstrapNeeded, setBootstrapNeeded] = useState(false);
  const [checkedBootstrap, setCheckedBootstrap] = useState(false);

  useEffect(() => {
    axios.get("/auth/bootstrap-needed")
      .then((res) => {
        setBootstrapNeeded(res.data);
        setCheckedBootstrap(true);
      })
      .catch((err) => {
        console.error("Failed to check bootstrap status", err);
        setCheckedBootstrap(true); // fallback
      });
  }, []);

  const token = localStorage.getItem("token");

  if (!checkedBootstrap) return null; // wait until status is checked

  return (
    <Router>
      <Routes>
        {/* 🟡 First time setup */}
        {bootstrapNeeded ? (
          <>
            <Route path="*" element={<WelcomeRegister />} />
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
