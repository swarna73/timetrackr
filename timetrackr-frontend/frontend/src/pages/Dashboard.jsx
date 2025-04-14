import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClientManager from "../components/ClientManager";
import RegisterUserForm from "../components/RegisterUserForm";
import jwt_decode from "jwt-decode";


function Dashboard() {
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [entries, setEntries] = useState([]);
  const [clients, setClients] = useState([]);
  const [showClientManager, setShowClientManager] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    fetchEntries();
    fetchClients();
  }, [userId]);

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`/time-entries/user/${userId}`);
      const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEntries(sorted);
    } catch (err) {
      console.error("❌ Failed to fetch time entries:", err.message);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get(`/clients/user/${userId}`);
      const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
      setClients(sorted);
    } catch (err) {
      console.error("❌ Failed to fetch clients:", err.message);
    }
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/time-entries", {
        description,
        duration,
        date,
        userId,
        clientId: selectedClientId,
      });
      setEntries([...entries, res.data]);
      setDescription("");
      setDuration("");
      setDate("");
      setSelectedClientId("");
      toast.success("✅ Time entry added successfully!", {
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (err) {
      toast.error("❌ Failed to add time entry");
      console.error("❌ Failed to add time entry:", err.message);
    }
  };

  const isFormValid =
    description.trim() !== "" &&
    duration > 0 &&
    date !== "" &&
    selectedClientId !== "";

  const hoursByClient = entries.reduce((acc, entry) => {
    const clientName = entry.client?.name || "Unknown";
    acc[clientName] = (acc[clientName] || 0) + entry.duration;
    return acc;
  }, {});

  const maxHours = Math.max(...Object.values(hoursByClient), 1);
const token = localStorage.getItem("token");
let userRole = null;

if (token) {
try {
  const decoded = jwt_decode(token);
  userRole = decoded.role;
}
catch (e) {
    console.error("❌ Failed to decode JWT", e);
  }
}


  return (
    <div className="p-6 max-w-2xl mx-auto">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Your Time Entries</h1>
 {userRole === "MANAGER" && (
  <div className="mt-6">
    <h2 className="text-xl font-semibold mb-2">Register New User</h2>
    <RegisterUserForm />
  </div>
)}
      <button
        className="bg-gray-200 px-4 py-2 rounded mb-6"
        onClick={() => setShowClientManager(!showClientManager)}
      >
        {showClientManager ? "Hide Client Manager" : "Manage Clients"}
      </button>
      {userRole === "MANAGER" && <RegisterUserForm />}
      {showClientManager ? (
        <ClientManager
          onClientAdded={(newClient) =>
            setClients((prev) =>
              [...prev, newClient].sort((a, b) => a.name.localeCompare(b.name))
            )
          }
        />
      ) : (
        <>
          {clients.length > 0 ? (
            <form onSubmit={handleAddEntry} className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Duration (hrs)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`bg-blue-600 text-white px-4 py-2 rounded ${
                  !isFormValid ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
              >
                Add Entry
              </button>
            </form>
          ) : (
            <p className="text-gray-500">
              You must add a client before logging time entries.
            </p>
          )}

          {Object.entries(hoursByClient).length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-2">Summary</h3>
              <div className="space-y-2">
                {Object.entries(hoursByClient).map(([clientName, total]) => {
                  const percent = (total / maxHours) * 100;
                  return (
                    <div key={clientName} className="flex items-center space-x-4">
                      <span className="w-32">{clientName}</span>
                      <div className="flex-1 bg-gray-200 rounded">
                        <div
                          className="bg-blue-600 h-4 rounded"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="w-16 text-right text-gray-700">{total} hrs</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;

