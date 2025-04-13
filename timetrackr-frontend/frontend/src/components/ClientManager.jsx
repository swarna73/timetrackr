import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ClientManager({ onClientAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [clients, setClients] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchClients();
    }
  }, [userId]);

  const fetchClients = async () => {
    try {
      const res = await axios.get(`/clients/user/${userId}`);
      const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
      setClients(sorted);
    } catch (err) {
      toast.error("❌ Failed to load clients");
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/clients", {
        name,
        email,
        company,
        user: { id: userId },
      });
      toast.success("✅ Client added successfully!");
      autoClose: 3000; // closes after 3 seconds
      hideProgressBar: true;

      setClients((prev) =>
        [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name))
      );
      setName("");
      setEmail("");
      setCompany("");
      onClientAdded?.(res.data);
    } catch (err) {
      toast.error("❌ Failed to add client");
    }
  };

  const isClientFormValid =
    name.trim() !== "" && email.trim() !== "" && company.trim() !== "";

  return (
    <div className="p-6 max-w-xl mx-auto">
      <ToastContainer />
      <h2 className="text-xl font-semibold mb-4">Client Management</h2>
      <form onSubmit={handleAddClient} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Client Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          disabled={!isClientFormValid}
          className={`bg-blue-600 text-white px-4 py-2 rounded ${
            !isClientFormValid ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          Add Client
        </button>
      </form>

      <h3 className="text-lg font-medium mb-2">Your Clients</h3>
      <ul className="space-y-2">
        {clients.map((client) => (
          <li key={client.id} className="border p-3 rounded">
            <strong>{client.name}</strong>
            <div className="text-sm text-gray-600">{client.email || "No email"}</div>
            <div className="text-sm text-gray-600">
              {client.company || "No company"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClientManager;
