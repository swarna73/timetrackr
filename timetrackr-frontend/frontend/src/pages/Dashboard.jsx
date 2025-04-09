import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await axios.get(`/time-entries/user/${userId}`);
        setEntries(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch time entries:", err.message);
      }
    }

    if (userId) {
      fetchEntries();
    }
  }, [userId]);

const handleAddEntry = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("/time-entries", {
      description,
      duration,
      date,
      user: { id: userId },
      client: { id: clientId || 1 } // default client for now
    });
    setEntries([...entries, res.data]);

    // Clear form
    setDescription("");
    setDuration("");
    setDate("");
  } catch (err) {
    console.error("❌ Failed to add time entry:", err.message);
  }
};

const [description, setDescription] = useState("");
const [duration, setDuration] = useState("");
const [date, setDate] = useState("");
const [clientId, setClientId] = useState(""); // placeholder for now

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Time Entries</h1>
      <form onSubmit={handleAddEntry} className="mb-6 bg-white p-4 rounded shadow space-y-4">
  <h2 className="text-lg font-semibold">Add Time Entry</h2>

  <input
    type="text"
    placeholder="Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="w-full p-2 border rounded"
    required
  />
  <input
    type="number"
    placeholder="Duration (hrs)"
    value={duration}
    onChange={(e) => setDuration(e.target.value)}
    className="w-full p-2 border rounded"
    required
  />
  <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    className="w-full p-2 border rounded"
    required
  />

  <button
    type="submit"
    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
  >
    Add Entry
  </button>
</form>
      {entries.length === 0 ? (
        <p className="text-gray-500">No time entries found.</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id} className="bg-white p-4 rounded shadow">
              <div className="font-semibold">{entry.description}</div>
              <div className="text-sm text-gray-600">
                Duration: {entry.duration} hrs | Date: {entry.date}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
