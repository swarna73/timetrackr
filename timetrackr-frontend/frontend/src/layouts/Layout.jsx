import { Outlet, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export default function Layout() {
  const navigate = useNavigate();

  // quick smoke‑test: should print in console on every page load
  console.log("👉 Layout mounted");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* top bar */}
      <header className="flex items-center mb-6">
        <button
          title="Home"
          onClick={() => navigate("/dashboard")}
          className="hover:text-green-800"
        >
          <Home className="w-6 h-6 text-green-700" />
        </button>
      </header>

      {/* child page */}
      <Outlet />
    </div>
  );
}
