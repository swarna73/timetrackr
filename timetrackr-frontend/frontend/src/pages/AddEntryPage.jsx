import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";

const AddEntryPage = () => {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`/clients/user/${userId}`);
        setClients(res.data);
      } catch (err) {
        console.error("Failed to fetch clients", err);
      }
    };

    fetchClients();
  }, [userId]);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/time-entries", {
        clientId,
        description,
        duration,
        date,
        userId,
      });
      toast.success("Entry added successfully!");
      setClientId("");
      setDescription("");
      setDuration("");
      setDate("");
    } catch (err) {
      if (err.response?.status === 403) {
      toast.error(
        err.response.data);
     }
      else {
      console.err("Failed to add entry", err);
toast.err("Failed to add entry. Please try again.");
    }
}

  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Time Entry</h2>
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
    </div>
  );
};

export default AddEntryPage;
