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
        console.error("Failed to fetch time entries", err);
      }
    }

    fetchEntries();
  }, [userId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Time Entries</h1>
      {entries.length === 0 ? (
        <p>No time entries found.</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id} className="bg-white p-4 rounded shadow">
              <p><strong>{entry.description}</strong></p>
              <p>Duration: {entry.duration} hrs</p>
              <p>Date: {entry.date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
