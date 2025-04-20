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

  const navigate = useNavigate();

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

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!clientId) {
      alert("Please select a client");
      return;
    }

    try {
      const res = await axios.post("/time-entries", {
        description,
        duration,
        date,
        userId: localStorage.getItem("userId"),
        clientId,
      });

      setDescription("");
      setDuration("");
      setDate("");
      setClientId("");
    } catch (err) {
      console.error("Failed to add entry", err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

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
              onClick={() => document.getElementById("add-entry-form").scrollIntoView({ behavior: "smooth" })}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
            >
              Add Entry
            </button>
          )}
          <button
            onClick={() => navigate("/dashboard/clients")}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Manage Clients
          </button>
          {userRole === "MANAGER" && (
            <button
              onClick={() => navigate("/register")}
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

      <h2 className="text-2xl font-bold mb-4">
        Welcome {localStorage.getItem("username")}
      </h2>

      {clients.length > 0 && (
        <section id="add-entry-form" className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Add Time Entry</h2>
          <form onSubmit={handleAddEntry} className="space-y-4">
            <select
              required
              className="w-full p-2 border rounded"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Task Description"
              className="w-full p-2 border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              type="number"
              step="0.1"
              placeholder="Hours"
              className="w-full p-2 border rounded"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Add Entry
            </button>
          </form>
        </section>
      )}
    </div>
  );
}

export default Dashboard;

