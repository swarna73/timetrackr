import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function WelcomeRegister() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/auth/welcome-register", {
        username,
        email,
        password,
        role: "MANAGER", // ✅ force role as MANAGER for first user
      });
   // assume backend returns {token, id}
localStorage.setItem("token", res.data.token);
localStorage.setItem("userId", res.data.id);
   localStorage.setItem("role", "MANAGER");
	console.log("✅ Registered:", res.data);
	console.log("Navigating to login...");
navigate("/", { replace: true });

window.location.reload(); // force routing reload
    } catch (err) {
      console.error("❌ Axios error:", err.response?.data || err.message);
      setError("❌ Failed to register first manager user");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome to TimeTrackr 👋</h2>
        <p className="text-center mb-4">Let’s set up your first manager account</p>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Create Manager Account
        </button>
      </form>
    </div>
  );
}

export default WelcomeRegister;
