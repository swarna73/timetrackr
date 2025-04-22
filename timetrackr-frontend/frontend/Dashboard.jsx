import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Home } from "lucide-react";

function Dashboard() {
  const [clients, setClients] = useState([]);
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [clientId, setClientId] = useState("");
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [rules, setRules] = useState({ maxHoursPerDay: 8, allowWeekend: false });


  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get(
        "/clients/user/" + localStorage.getItem("userId")
      );
      setClients(res.data);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

useEffect(() => {
  api.get("/config").then(res => setRules(res.data)).catch(() => {});
}, []);
const hoursToday = hoursOnDate(date);
const formViolates =
  date &&
  ((hoursToday + Number(duration) > rules.maxHoursPerDay) ||
   (!rules.allowWeekend && isWeekend(date)));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div
          className="cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <Home className="w-6 h-6 text-green-700" />
        </div>
        <div className="flex gap-2">
          {clients.length > 0 && (
            <button
	      onClick={() => navigate("/add-entry")}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
            >
              Add Entry
            </button>
          )}
          <button
            onClick={() => navigate("/manage-clients")}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Manage Clients
          </button>
          {userRole === "MANAGER" && (
            <button
              onClick={() => navigate("/manager-register")}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
            >
              Register New User
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Welcome {username} 👋</h2>
    </div>
  );
}

export default Dashboard;

