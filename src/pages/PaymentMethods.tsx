import { useState } from "react";
import { Copy, Check, Coins, QrCode, User, TrendingUp } from "lucide-react";

// Курс USDT к RUB (можно будет обновлять через API позже)
const USDT_TO_RUB_RATE = 90;

export default function PaymentMethods() {
  const [amountUSDT, setAmountUSDT] = useState("");
  const [method, setMethod] = useState<"usdt" | "bybit_uid" | "bybit_qr">("usdt");
  const [bybitUid, setBybitUid] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [copied, setCopied] = useState(false);

  // Демо-кошелёк USDT TRC20 (потом заменишь на свой)
  const usdtWallet = "TX5RqLHJbXkLrsrG6YoXkzPRLgfMsVcQKh";
  
  // Демо-Bybit UID (потом заменишь на свой)
  const demoBybitUid = "123456789";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(amountUSDT);
    if (isNaN(amount) || amount < 10) {
      alert("Минимальная сумма пополнения 10 USDT");
      return;
    }
    
    if (method === "bybit_uid" && !bybitUid) {
      alert("Введите ваш Bybit UID");
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      setShowWallet(true);
      setLoading(false);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rubAmount = parseFloat(amountUSDT) * USDT_TO_RUB_RATE;
  const formattedRubAmount = isNaN(rubAmount) ? 0 : rubAmount.toLocaleString();

  const getMethodIcon = () => {
    switch(method) {
      case "usdt": return <Coins className="w-6 h-6 text-[#D4AF37]" />;
      case "bybit_uid": return <User className="w-6 h-6 text-[#D4AF37]" />;
      case "bybit_qr": return <QrCode className="w-6 h-6 text-[#D4AF37]" />;
      default: return <Wallet className="w-6 h-6 text-[#D4AF37]" />;
    }
  };

  const getMethodTitle = () => {
    switch(method) {
      case "usdt": return "USDT (TRC-20)";
      case "bybit_uid": return "Bybit UID";
      case "bybit_qr": return "Bybit QR-код";
      default: return "Пополнение";
    }
  };

  const getMethodDescription = () => {
    switch(method) {
      case "usdt": return "Пополнение через USDT в сети TRC-20";
      case "bybit_uid": return "Перевод по Bybit UID (внутренний перевод)";
      case "bybit_qr": return "Сканируйте QR-код в приложении Bybit";
      default: return "";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight font-mono text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-[#D4AF37]" />
          Пополнение баланса
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Выберите удобный способ пополнения. Средства зачисляются в рублях по курсу 1 USDT = {USDT_TO_RUB_RATE} ₽
        </p>
      </div>

      <div className="glass-premium rounded-xl p-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => setMethod("usdt")}
            className={`p-3 rounded-xl text-center transition-all ${method === "usdt" ? "bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37]" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
          >
            <Coins className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs">USDT TRC-20</span>
          </button>
          <button
            onClick={() => setMethod("bybit_uid")}
            className={`p-3 rounded-xl text-center transition-all ${method === "bybit_uid" ? "bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37]" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
          >
            <User className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs">Bybit UID</span>
          </button>
          <button
            onClick={() => setMethod("bybit_qr")}
            className={`p-3 rounded-xl text-center transition-all ${method === "bybit_qr" ? "bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37]" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
          >
            <QrCode className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs">Bybit QR-код</span>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[#D4AF37]/10">
            {getMethodIcon()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{getMethodTitle()}</h2>
            <p className="text-xs text-gray-400">{getMethodDescription()}</p>
          </div>
        </div>

        {!showWallet ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {method === "bybit_uid" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ваш Bybit UID
                </label>
                <input
                  type="text"
                  value={bybitUid}
                  onChange={(e) => setBybitUid(e.target.value)}
                  placeholder="123456789"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Укажите ваш UID из приложения Bybit (Профиль → UID)
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Сумма пополнения (USDT)
              </label>
              <input
                type="number"
                value={amountUSDT}
                onChange={(e) => setAmountUSDT(e.target.value)}
                placeholder="Минимум 10 USDT"
                min={10}
                step={1}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                required
              />
              {amountUSDT && parseFloat(amountUSDT) >= 10 && (
                <div className="mt-2 p-2 bg-[#D4AF37]/10 rounded-lg">
                  <p className="text-sm text-gray-300">
                    Вы получите: <span className="text-[#D4AF37] font-bold">{formattedRubAmount} ₽</span>
                  </p>
                  <p className="text-xs text-gray-500">Курс: 1 USDT = {USDT_TO_RUB_RATE} ₽</p>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Минимальная сумма: 10 USDT | Максимальная: 10 000 USDT
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#FFD700] transition-colors disabled:opacity-50"
            >
              {loading ? "Обработка..." : "Продолжить"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg">
              <p className="text-green-400 text-sm text-center">
                ✅ Заявка на пополнение создана!
              </p>
              <p className="text-gray-400 text-xs text-center mt-1">
                Сумма к зачислению: <span className="text-[#D4AF37] font-bold">{formattedRubAmount} ₽</span>
              </p>
            </div>

            {method === "usdt" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Кошелёк для перевода (USDT TRC-20)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={usdtWallet}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(usdtWallet)}
                    className="p-3 rounded-lg bg-gray-800 text-[#D4AF37] hover:bg-gray-700 transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Отправьте <span className="text-[#D4AF37] font-bold">{amountUSDT} USDT</span> на указанный кошелёк. 
                  После получения баланс пополнится автоматически.
                </p>
              </div>
            )}

            {method === "bybit_uid" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Получатель (Bybit UID)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={demoBybitUid}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(demoBybitUid)}
                    className="p-3 rounded-lg bg-gray-800 text-[#D4AF37] hover:bg-gray-700 transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  В приложении Bybit: Активы → P2P → Перевод по UID → 
                  Укажите сумму <span className="text-[#D4AF37] font-bold">{amountUSDT} USDT</span> и наш UID.
                </p>
              </div>
            )}

            {method === "bybit_qr" && (
              <div className="text-center">
                <div className="bg-white p-4 rounded-xl inline-block mx-auto mb-3">
                  <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                    [QR-код для оплаты]
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Отсканируйте QR-код в приложении Bybit и оплатите <span className="text-[#D4AF37] font-bold">{amountUSDT} USDT</span>
                </p>
              </div>
            )}

            <div className="p-3 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
              <p className="text-yellow-400 text-xs">
                ⚠️ Отправляйте ТОЛЬКО USDT (TRC-20) на указанный кошелёк. 
                Переводы в других сетях или других монет приведут к потере средств.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="glass-premium rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-2">📈 Курс конвертации</h3>
        <p className="text-xs text-gray-400">
          Курс USDT к RUB обновляется автоматически и может отличаться от биржевого.
          Актуальный курс: <span className="text-[#D4AF37]">1 USDT = {USDT_TO_RUB_RATE} ₽</span>
        </p>
      </div>
    </div>
  );
}
