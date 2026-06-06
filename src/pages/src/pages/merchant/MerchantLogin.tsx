import { useState } from "react";
import { useLocation } from "wouter";
import { Store, Key, Mail, Lock } from "lucide-react";

export default function MerchantLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/merchants/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ошибка входа");
      }

      localStorage.setItem("merchantToken", data.token);
      localStorage.setItem("merchantId", data.merchantId);
      localStorage.setItem("merchantName", data.merchantName);
      setLocation("/merchant/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-[#0f0f0f] p-8 rounded-2xl border border-[#D4AF37]/20 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#D4AF37] rounded-lg mx-auto mb-4 shadow-lg shadow-[#D4AF37]/30 flex items-center justify-center">
            <Store className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white font-mono">PLAYERS2PAY</h1>
          <p className="text-gray-500 text-sm mt-2">Вход для мерчантов</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-9 pr-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full pl-9 pr-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#c4a030] transition-all disabled:opacity-50"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          Доступ только для зарегистрированных мерчантов
        </p>
      </div>
    </div>
  );
}
