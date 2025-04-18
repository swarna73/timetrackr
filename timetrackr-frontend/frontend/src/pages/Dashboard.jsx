import React, { useEffect, useState } from "react";
import RegisterUserForm from "./RegisterUserForm";
import ClientManager from "../components/ClientManager";
import axios from "../api/axios";

function Dashboard() {
  const [clients, setClients] = useState([]);
  const [entries, setEntries] = useState([]);
  const [showClientManager, setShowClientManager] = useState(false);
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [clientId, setClientId] = useState("");
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get("/clients/user/" + localStorage.getItem("userId"));
      setClients(res.data);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    }
  };

  const fetchEntries = async () => {
    try {
      const res = await axios.get("/time-entries/user/" + localStorage.getItem("userId"));
      setEntries(res.data);
    } catch (err) {
      console.error("Failed to fetch entries", err);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchEntries();
  }, []);

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

      setEntries((prev) => [...prev, res.data]);
      setDescription("");
      setDuration("");
      setDate("");
      setClientId("");
    } catch (err) {
      console.error("Failed to add entry", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Register New User */}
      {userRole === "MANAGER" && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Register New User</h2>
          <RegisterUserForm />
        </section>
      )}

      {/* Toggle Client Manager */}
      <section className="mb-8">
        <button
          onClick={() => setShowClientManager(!showClientManager)}
          className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded"
        >
          {showClientManager ? "Hide Client Manager" : "Manage Clients"}
        </button>
        {showClientManager && (
          <ClientManager
            onClientAdded={(newClient) =>
              setClients((prev) =>
                [...prev, newClient].sort((a, b) =>
                  a.name.localeCompare(b.name)
                )
              )
            }
          />
        )}
      </section>

      {/* Add Time Entry */}
      <section className="mb-8">
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

      {/* Display Time Entries */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Entries</h2>
        {entries.length === 0 ? (
          <p className="text-gray-500">No time entries found.</p>
        ) : (
          <ul className="space-y-4">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="border p-4 rounded bg-white shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{entry.description}</p>
                  <p className="text-sm text-gray-500">{entry.date}</p>
                </div>
                <div className="text-right text-lg font-semibold">
                  {entry.duration} hrs
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
