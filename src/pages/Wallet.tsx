import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownLeft, Send, History, Clock } from "lucide-react";

interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "transfer_sent" | "transfer_received";
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed";
  recipient?: string;
  sender?: string;
  createdAt: string;
}

export default function Wallet() {
  const [balance, setBalance] = useState(1250.75);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "1", type: "deposit", amount: 500, currency: "USDT", status: "completed", createdAt: new Date().toISOString() },
    { id: "2", type: "withdraw", amount: 100, currency: "USDT", status: "completed", createdAt: new Date().toISOString() },
  ]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transferEmail, setTransferEmail] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Проверка времени для вывода (с 10:00 до 00:00)
  const canWithdraw = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 10 && hours < 24;
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!canWithdraw()) {
      setError("Вывод средств доступен только с 10:00 до 00:00");
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Введите корректную сумму");
      return;
    }

    if (amount > balance) {
      setError("Недостаточно средств");
      return;
    }

    // Имитация запроса на вывод
    setBalance(prev => prev - amount);
    setTransactions(prev => [{
      id: Date.now().toString(),
      type: "withdraw",
      amount,
      currency: "USDT",
      status: "pending",
      createdAt: new Date().toISOString()
    }, ...prev]);

    setSuccess(`Заявка на вывод ${amount} USDT создана`);
    setWithdrawAmount("");
    setShowWithdrawModal(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Введите корректную сумму");
      return;
    }

    if (amount > balance) {
      setError("Недостаточно средств");
      return;
    }

    if (!transferEmail) {
      setError("Введите email получателя");
      return;
    }

    // Имитация перевода
    setBalance(prev => prev - amount);
    setTransactions(prev => [{
      id: Date.now().toString(),
      type: "transfer_sent",
      amount,
      currency: "USDT",
      status: "completed",
      recipient: transferEmail,
      createdAt: new Date().toISOString()
    }, ...prev]);

    setSuccess(`Перевод ${amount} USDT пользователю ${transferEmail} выполнен`);
    setTransferAmount("");
    setTransferEmail("");
    setShowTransferModal(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit": return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case "withdraw": return <ArrowDownLeft className="w-4 h-4 text-red-500" />;
      case "transfer_sent": return <Send className="w-4 h-4 text-orange-500" />;
      case "transfer_received": return <ArrowUpRight className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTransactionName = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit": return "Пополнение";
      case "withdraw": return "Вывод";
      case "transfer_sent": return "Перевод отправлен";
      case "transfer_received": return "Перевод получен";
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Уведомления */}
      {success && (
        <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 text-green-400 text-sm">
          {success}
        </div>
      )}

      {/* Баланс */}
      <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-2xl p-6 border border-[#D4AF37]/20">
        <p className="text-gray-400 text-sm mb-1">Текущий баланс</p>
        <p className="text-4xl font-bold text-[#D4AF37]">{balance.toFixed(2)} USDT</p>
        <p className="text-gray-500 text-xs mt-2">≈ {Math.round(balance * 90)} RUB</p>
      </div>

      {/* Кнопки действий */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="flex items-center justify-center gap-2 p-3 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white hover:border-[#D4AF37] transition-colors"
        >
          <ArrowDownLeft className="w-4 h-4" />
          Вывести
        </button>
        <button
          onClick={() => setShowTransferModal(true)}
          className="flex items-center justify-center gap-2 p-3 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white hover:border-[#D4AF37] transition-colors"
        >
          <Send className="w-4 h-4" />
          Перевести
        </button>
      </div>

      {/* Информация о выводе */}
      {!canWithdraw() && (
        <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
          <Clock className="w-4 h-4 text-yellow-500" />
          <p className="text-yellow-500 text-xs">Вывод средств доступен с 10:00 до 00:00</p>
        </div>
      )}

      {/* История транзакций */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <History className="w-4 h-4 text-[#D4AF37]" />
          История транзакций
        </h2>
        <div className="space-y-2">
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">Нет транзакций</p>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg border border-gray-800">
                <div className="flex items-center gap-3">
                  {getTransactionIcon(tx.type)}
                  <div>
                    <p className="text-white text-sm">{getTransactionName(tx.type)}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(tx.createdAt).toLocaleString()}
                      {tx.recipient && ` • Получатель: ${tx.recipient}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    tx.type === "deposit" || tx.type === "transfer_received" 
                      ? "text-green-500" 
                      : "text-red-500"
                  }`}>
                    {tx.type === "deposit" || tx.type === "transfer_received" ? "+" : "-"}{tx.amount} {tx.currency}
                  </p>
                  <p className={`text-xs ${tx.status === "completed" ? "text-green-500" : tx.status === "pending" ? "text-yellow-500" : "text-red-500"}`}>
                    {tx.status === "completed" ? "Выполнено" : tx.status === "pending" ? "В обработке" : "Ошибка"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Модалка вывода */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowWithdrawModal(false)}>
          <div className="bg-[#0f0f0f] rounded-2xl p-6 w-full max-w-md border border-[#D4AF37]/20" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">Вывод средств</h2>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Сумма в USDT"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowWithdrawModal(false)} className="flex-1 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">Отмена</button>
                <button type="submit" className="flex-1 py-2 bg-[#D4AF37] text-black rounded-lg font-bold hover:bg-[#c4a030]">Вывести</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модалка перевода */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowTransferModal(false)}>
          <div className="bg-[#0f0f0f] rounded-2xl p-6 w-full max-w-md border border-[#D4AF37]/20" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">Перевод средств</h2>
            <form onSubmit={handleTransfer} className="space-y-4">
              <input
                type="email"
                value={transferEmail}
                onChange={(e) => setTransferEmail(e.target.value)}
                placeholder="Email получателя"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                required
              />
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Сумма в USDT"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowTransferModal(false)} className="flex-1 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">Отмена</button>
                <button type="submit" className="flex-1 py-2 bg-[#D4AF37] text-black rounded-lg font-bold hover:bg-[#c4a030]">Перевести</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
