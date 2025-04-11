import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await axios.get(`/time-entries/user/${userId}`);
        setEntries(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch time entries:", err.message);
      }
    }

    async function fetchClients() {
      try {
        const res = await axios.get(`/clients/user/${userId}`);
      console.log("Fetched clients:", res.data); // <- Debug log
        setClients(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch clients:", err.message);
      }
    }

    if (userId) {
      fetchEntries();
      fetchClients();
    }
  }, [userId]);

  const handleAddEntry = async (e) => {
    console.log("Submitting entry:", {
  description,
  duration,
  date,
  userId,
  clientId: selectedClientId
});
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
      toast.success("✅ Time entry added successfully!");
    } catch (err) {
      console.error("❌ Failed to add time entry:", err.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Your Time Entries</h1>

        <form onSubmit={handleAddEntry} className="space-y-4">
          <h2 className="text-xl font-semibold">Add Time Entry</h2>

          <input
            type="text"
            placeholder="Description"
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            placeholder="Duration (hrs)"
            className="w-full border p-2 rounded"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />

          <input
            type="date"
            className="w-full border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <select
            className="w-full border p-2 rounded"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
          >
            <option value="">Select Client</option>
	    console.log("Clients to render:", clients);
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-4 hover:bg-blue-700">
  Add Entry
</button></form>

        <div className="mt-8">
          {entries.length === 0 ? (
            <p className="text-gray-500">No time entries found.</p>
          ) : (
            <ul className="mt-6 space-y-2">
              {entries.map((entry) => (
                <li key={entry.id} className="border rounded p-3 shadow">
                  <p className="font-medium">{entry.description}</p>
                  <p className="text-sm text-gray-600">
                    Duration: {entry.duration} hrs | Date: {entry.date}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;

