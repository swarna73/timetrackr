import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import WelcomeRegister from "./pages/WelcomeRegister";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import RegisterUserForm from "./pages/RegisterUserForm";
import AddEntryPage from "./pages/AddEntryPage";
import ClientManager from "./components/ClientManager";

function App() {
  const [bootstrapNeeded, setBootstrapNeeded] = useState(null);

  useEffect(() => {
    const checkBootstrapNeeded = async () => {
      try {
	const response = await fetch("http://localhost:8080/api/auth/bootstrap-needed");
        const data = await response.json();
        setBootstrapNeeded(data);
      } catch (error) {
        console.error("Error checking bootstrap state:", error);
        setBootstrapNeeded(false); // fallback to login
      }
    };
    checkBootstrapNeeded();
  }, []);

  if (bootstrapNeeded === null) {
    return <div>Loading...</div>;
  }

  return (
      <Routes>
        {bootstrapNeeded ? (
          <>
            <Route path="/welcome-register" element={<WelcomeRegister />} />
            <Route path="*" element={<Navigate to="/welcome-register" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/manager-register" element={<RegisterUserForm />} />
            <Route path="/add-entry" element={<AddEntryPage />} />
            <Route path="/manage-clients" element={<ClientManager />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
  );
}

export default App;
