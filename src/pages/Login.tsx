import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/trader-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("traderToken", token);
      localStorage.setItem("traderId", data.traderId);
      localStorage.setItem("traderName", data.traderName);
      setLocation("/dashboard");
    } else {
      setError("Неверный токен или доступ заблокирован");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-[#0f0f0f] p-8 rounded-2xl border border-[#D4AF37]/20 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#D4AF37] rounded-lg mx-auto mb-4 shadow-lg shadow-[#D4AF37]/30" />
          <h1 className="text-2xl font-bold text-white font-mono">PLAYERS2PAY</h1>
          <p className="text-gray-500 text-sm mt-2">Введите токен доступа</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="tr_xxxxxxxxxxxxxx"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#D4AF37]/30 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#c4a030] transition-all"
          >
            Войти
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          Токен выдаётся администратором
        </p>
      </div>
    </div>
  );
}
