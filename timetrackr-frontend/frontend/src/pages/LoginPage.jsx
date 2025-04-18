import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoginError("");

  try {
    const res = await axios.post("/auth/login", { email, password });

    const token = res.data.token;
    const decoded = jwtDecode(token);

    localStorage.setItem("token", token);
    localStorage.setItem("userId", res.data.userId);
    localStorage.setItem("role", decoded.role);

    console.log("Login successful");
    console.log("Token:", token);
    console.log("Decoded:", decoded);
    console.log("LocalStorage token:", localStorage.getItem("token"));

    // ✅ THIS must happen after setting token
    navigate("/dashboard");
window.location.reload(); // ✅ force full reload to re-evaluate token
  } catch (err) {
    console.error("Login error:", err);
    setLoginError("LoginPage Invalid email or password");
  }
};
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">TimeTrackr Login</h2>

        {loginError && (
          <p className="text-red-500 mb-4 text-center">{loginError}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
