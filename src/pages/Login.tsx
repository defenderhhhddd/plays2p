import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  // Шаг 1: проверка логина, пароля и токена
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, token }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ошибка входа");
      }

      if (data.requiresTwoFactor) {
        setUserId(data.userId);
        setStep("2fa");
        setLoading(false);
        return;
      }

      // Если 2FA не требуется — сохраняем сессию и входим
      localStorage.setItem("sessionToken", data.sessionToken);
      localStorage.setItem("userRole", data.user.role);
      setLocation("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Шаг 2: проверка 2FA кода
  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, twoFactorCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Неверный код 2FA");
      }

      localStorage.setItem("sessionToken", data.sessionToken);
      localStorage.setItem("userRole", data.user.role);
      setLocation("/dashboard");
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
          <div className="w-12 h-12 bg-[#D4AF37] rounded-lg mx-auto mb-4 shadow-lg shadow-[#D4AF37]/30" />
          <h1 className="text-2xl font-bold text-white font-mono">PLAYERS2PAY</h1>
        </div>

        {step === "credentials" ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Логин"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#D4AF37]/30 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
              autoFocus
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#D4AF37]/30 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Токен"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#D4AF37]/30 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors font-mono"
              required
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#c4a030] transition-all disabled:opacity-50"
            >
              {loading ? "Проверка..." : "Войти"}
            </button>
          </form>
        ) : (
          <form onSubmit={handle2FASubmit} className="space-y-4">
            <input
              type="text"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              placeholder="Код из Google Authenticator"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#D4AF37]/30 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors text-center text-2xl tracking-widest font-mono"
              maxLength={6}
              required
              autoFocus
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#c4a030] transition-all disabled:opacity-50"
            >
              {loading ? "Проверка..." : "Подтвердить"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
