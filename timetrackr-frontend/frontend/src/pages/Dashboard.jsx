import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClientManager from "../components/ClientManager";

function Dashboard() {
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [entries, setEntries] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const userId = localStorage.getItem("userId");
  const [showClientManager, setShowClientManager] = useState(false);


  // Fetch entries
  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await axios.get(`/time-entries/user/${userId}`);
	   const sorted = res.data.sort((a, b) =>
      a.date > b.date ? -1 : 1 // latest first, or reverse if needed
       );
         setEntries(sorted);
  }        catch (err) {
             console.error("❌ Failed to fetch time entries:", err.message);
  }     
}

    if (userId) fetchEntries();
  }, [userId]);

  // Fetch clients
  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await axios.get(`/clients/user/${userId}`);
     // Sort alphabetically by name before setting state
      const sortedClients = res.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setClients(sortedClients);
    } catch (err) {
      console.error("❌ Failed to fetch clients:", err.message);
    }
  }


    if (userId) fetchClients();
  }, [userId]);

  // Add entry
  const handleAddEntry = async (e) => {
    e.preventDefault();
    console.log("Submitting entry:", {
      description,
      duration,
      date,
      userId,
      clientId: selectedClientId,
    });

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
      toast.error("❌ Could not add entry.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Time Entries</h2>
  <button
  onClick={() => setShowClientManager((prev) => !prev)}
  className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
   >
  {showClientManager ? "Hide Client Manager" : "Manage Clients"}
   </button>
      {showClientManager && <ClientManager />}

        <form onSubmit={handleAddEntry} className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="number"
            step="0.1"
            placeholder="Duration (hrs)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="w-full border p-2 rounded"
            required
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
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Entry
          </button>
        </form>

        {entries.length === 0 ? (
          <p className="text-gray-500">No time entries found.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="border p-2 rounded mb-2">
              <strong>{entry.description}</strong> – {entry.duration} hrs on{" "}
              {entry.date}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Dashboard;
