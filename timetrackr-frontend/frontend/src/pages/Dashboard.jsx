import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Home } from "lucide-react";
import { format, eachDayOfInterval, subDays, isWeekend as isWE, parseISO } from "date-fns";
import classNames from "classnames";

function Dashboard() {
  // ───────────────────────────── state ──────────────────────────────
  const [clients, setClients] = useState([]);
  const [entries, setEntries] = useState([]);
  const [rules, setRules] = useState({ maxHoursPerDay: 8, allowWeekend: false });
  const userRole = localStorage.getItem("role");
  const username = localStorage.getItem("username") || "User";

  const navigate = useNavigate();

  // ─────────────────────────── helpers ──────────────────────────────
  const isWeekend = (dateStr) => isWE(parseISO(dateStr));

  const hoursOnDate = (dateStr) =>
    entries
      .filter((e) => e.date === dateStr)
      .reduce((sum, e) => sum + Number(e.duration), 0);

  // pre‑compute total hours per day for grid
  const last30 = useMemo(() => {
    const today = new Date();
    return eachDayOfInterval({ start: subDays(today, 29), end: today }).map((d) => {
      const key = format(d, "yyyy-MM-dd");
      return { date: key, hours: hoursOnDate(key) };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  // colour bucket
  const boxColour = (hrs) => {
    if (hrs === 0) return "bg-gray-200";
    if (hrs <= 2) return "bg-green-200";
    if (hrs <= 4) return "bg-green-400";
    if (hrs <= 6) return "bg-green-600";
    return "bg-green-800";
  };

  // ─────────────────────────── api calls ────────────────────────────
  const fetchClients = async () => {
    try {
      const res = await axios.get(`/clients/user/${localStorage.getItem("userId")}`);
      setClients(res.data);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    }
  };

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`/time-entries/user/${localStorage.getItem("userId")}`);
      setEntries(res.data);
    } catch (err) {
      console.error("Failed to fetch entries", err);
    }
  };

  const fetchRules = async () => {
    try {
      const res = await axios.get("/config");
      setRules(res.data);
    } catch (err){
 	const message =
      err.response?.data ||           // message from the backend
      err.message ||                  // network or CORS message
      "Unable to load configuration"; // ultimate fallback
    toast.error(message);
}

  };

  useEffect(() => {
    fetchClients();
    fetchEntries();
    fetchRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─────────────────────────── UI ───────────────────────────────────
  const TopBar = () => (
    <div className="flex justify-between items-center mb-6">
      <div className="flex gap-2">
        {clients.length > 0 && (
          <button onClick={() => navigate("/add-entry")}
                  className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
            Add Entry
          </button>) }
        <button onClick={() => navigate("/manage-clients")}
                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
          Manage Clients
        </button>
        {userRole === "MANAGER" && (
          <button onClick={() => navigate("/manager-register")}
                  className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
            Register New User
          </button>)}
        <button onClick={() => { localStorage.clear(); navigate("/"); }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </div>
  );

  const ContributionGrid = () => (
    <div className="mt-8">
      <h3 className="font-semibold mb-2">Last 30 days</h3>
      <div className="grid grid-cols-10 gap-1">
        {last30.map(({ date, hours }) => (
          <div key={date}
               title={`${date}: ${hours} h`}
               className={classNames("h-6 w-6 rounded", boxColour(hours))} />
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">Box colour indicates hours logged per day (max {rules.maxHoursPerDay} h).</p>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <TopBar />
      <h2 className="text-2xl font-bold mb-4">Welcome {username} 👋</h2>
      <ContributionGrid />
    </div>
  );
}

export default Dashboard;

