import { useState } from "react";
import { useLocation } from "wouter";
import { Shield } from "lucide-react";

export default function AdminLogin() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminName", data.adminName);
      setLocation("/admin/dashboard");
    } else {
      setError("Неверный токен администратора");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-[#0f0f0f] p-8 rounded-2xl border border-red-500/20 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-red-600 rounded-lg mx-auto mb-4 shadow-lg shadow-red-600/30 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white font-mono">ADMIN PANEL</h1>
          <p className="text-gray-500 text-sm mt-2">PLAYERS2PAY</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="admin_xxxxxxxxxxxxxxxx"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-red-500/30 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500 transition-colors"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all"
          >
            Войти
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          Доступ только для администраторов
        </p>
      </div>
    </div>
  );
}
