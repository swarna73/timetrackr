import React, { useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";

function RegisterUserForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", {
        username,
        email,
        password,
        role
      });
      toast.success("✅ User registered successfully!");
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("USER");
    } catch (err) {
      toast.error("❌ Registration failed");
    }
  };

  return (
    <div className="border p-4 rounded bg-white shadow-sm mt-6">
      <h2 className="text-lg font-semibold mb-4">Register New User</h2>
      <form onSubmit={handleRegister} className="space-y-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border p-2 rounded"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="USER">USER</option>
          <option value="MANAGER">MANAGER</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Register User
        </button>
      </form>
    </div>
  );
}

export default RegisterUserForm;
