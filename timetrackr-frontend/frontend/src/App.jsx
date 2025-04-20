import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import WelcomeRegister from "./pages/WelcomeRegister";
import LoginPage from "./pages/LoginPage";
import RegisterUserForm from "./pages/RegisterUserForm";
import AddEntryPage from "./pages/AddEntryPage";
import ClientManager from "./components/ClientManager";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<WelcomeRegister />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manager-register" element={<RegisterUserForm />} />
        <Route path="/add-entry" element={<AddEntryPage />} />
        <Route path="/manage-clients" element={<ClientManager />} />
      </Routes>
  );
}

export default App;

