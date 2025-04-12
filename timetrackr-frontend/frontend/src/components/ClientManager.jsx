import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ClientManager() {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`/clients/user/${userId}`);
        setClients(res.data);
      } catch (err) {
        toast.error("❌ Failed to load clients");
      }
    };

    if (userId) fetchClients();
  }, [userId]);

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/clients", {
        name,
        email,
        company,
        user: { id: userId },
      });
      setClients([...clients, res.data]);
      setName("");
      setEmail("");
      setCompany("");
      toast.success("✅ Client added successfully");
    } catch (err) {
      toast.error("❌ Failed to add client");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <ToastContainer />
      <h2 className="text-xl font-semibold mb-4">Client Management</h2>

      <form onSubmit={handleAddClient} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Client Name"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Company"
          className="w-full p-2 border rounded"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Client
        </button>
      </form>

      <h3 className="text-lg font-medium mb-2">Your Clients</h3>
      <ul className="space-y-2">
            {clients
    .slice() // create a shallow copy to avoid mutating state
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((client) => (
      <li key={client.id} className="border p-3 rounded">
     <strong>{client.name}</strong>
            <div className="text-sm text-gray-600">{client.email || "No email"}</div>
            <div className="text-sm text-gray-600">{client.company || "No company"}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClientManager;

