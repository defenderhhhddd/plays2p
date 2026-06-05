import { useState, useEffect } from "react";
import { 
  AlertTriangle, Clock, CheckCircle, XCircle, 
  Calendar, Search, Eye, MessageCircle, Volume2, VolumeX, User, CreditCard
} from "lucide-react";

interface Dispute {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  cardNumber: string;
  cardBank: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  reason: string;
  createdAt: Date;
  timeLeft: number;
  status: "pending" | "resolved_trader" | "resolved_client" | "cancelled";
  resolution?: string;
  resolvedBy?: "admin" | "trader";
  amountDeducted?: boolean;
}

// Демо-данные
const demoDisputes: Dispute[] = [
  {
    id: "1",
    orderId: "P2P-ABC123",
    amount: 15000,
    currency: "RUB",
    cardNumber: "****4832",
    cardBank: "Тинькофф",
    customerName: "Алексей Смирнов",
    customerEmail: "alexey@example.com",
    customerPhone: "+7 999 123-45-67",
    reason: "Клиент утверждает, что оплатил, но статус не изменился. Деньги списались, но заказ не подтверждён.",
    createdAt: new Date(2026, 5, 6, 14, 30),
    timeLeft: 1750,
    status: "pending",
    amountDeducted: false,
  },
  {
    id: "2",
    orderId: "P2P-DEF456",
    amount: 8500,
    currency: "RUB",
    cardNumber: "****9012",
    cardBank: "Сбербанк",
    customerName: "Мария Иванова",
    reason: "Деньги списались дважды, но товар не получен",
    createdAt: new Date(2026, 5, 5, 11, 15),
    timeLeft: 0,
    status: "resolved_client",
    resolution: "Автоматически решён в пользу клиента по истечении 30 минут",
    resolvedBy: "admin",
    amountDeducted: true,
  },
];

export default function Disputes() {
  const [disputes, setDisputes] = useState<Dispute[]>(demoDisputes);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [period, setPeriod] = useState<"today" | "yesterday" | "week" | "lastWeek">("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [newDisputeAlert, setNewDisputeAlert] = useState(false);
  const [traderBalance, setTraderBalance] = useState(125075); // баланс трейдера в рублях

  // Функция списания средств с баланса трейдера
  const deductFromBalance = (amount: number, currency: string, disputeId: string) => {
    // В реальном приложении здесь будет API-запрос к серверу
    console.log(`Списание ${amount} ${currency} по спору ${disputeId}`);
    
    if (currency === "RUB") {
      setTraderBalance(prev => prev - amount);
    } else if (currency === "USDT") {
      // Для USDT нужна конвертация или отдельный баланс
      console.log(`Списание ${amount} USDT требует отдельной логики`);
    }
    
    return true;
  };

  // Таймер обратного отсчёта (30 минут)
  useEffect(() => {
    const interval = setInterval(() => {
      setDisputes(prev => prev.map(dispute => {
        if (dispute.status !== "pending") return dispute;
        const newTimeLeft = dispute.timeLeft - 1;
        if (newTimeLeft <= 0) {
          playSound("timeout");
          // Автоматическое списание при просрочке
          deductFromBalance(dispute.amount, dispute.currency, dispute.id);
          return { 
            ...dispute, 
            status: "resolved_client", 
            timeLeft: 0,
            resolution: "Автоматически решён в пользу клиента по истечении 30 минут. Средства списаны с баланса трейдера.",
            resolvedBy: "admin",
            amountDeducted: true
          };
        }
        return { ...dispute, timeLeft: newTimeLeft };
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Проверка новых споров (имитация)
  useEffect(() => {
    const interval = setInterval(() => {
      if (soundEnabled && Math.random() > 0.9) {
        setNewDisputeAlert(true);
        playSound("newDispute");
        setTimeout(() => setNewDisputeAlert(false), 5000);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [soundEnabled]);

  const playSound = (type: "newDispute" | "timeout" | "resolved") => {
    if (!soundEnabled) return;
    const audio = new Audio();
    if (type === "newDispute") {
      audio.src = "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3";
    } else if (type === "timeout") {
      audio.src = "https://www.soundjay.com/misc/sounds/failed-01.mp3";
    } else {
      audio.src = "https://www.soundjay.com/misc/sounds/approved-01.mp3";
    }
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play failed", e));
  };

  // Трейдер закрывает спор в пользу клиента (признаёт ошибку) — деньги списываются
  const resolveForClient = (disputeId: string, amount: number, currency: string) => {
    setResolving(true);
    // Списание средств
    const deducted = deductFromBalance(amount, currency, disputeId);
    
    setTimeout(() => {
      setDisputes(prev => prev.map(d => 
        d.id === disputeId 
          ? { 
              ...d, 
              status: "resolved_client", 
              timeLeft: 0,
              resolution: `Трейдер признал ошибку и закрыл спор в пользу клиента. ${deducted ? 'Средства списаны с баланса.' : 'Ошибка списания.'}`,
              resolvedBy: "trader",
              amountDeducted: deducted
            }
          : d
      ));
      playSound("resolved");
      setResolving(false);
      setShowDetails(false);
      if (deducted) {
        alert(`✅ Спор закрыт в пользу клиента. Сумма ${amount} ${currency} списана с вашего баланса.`);
      } else {
        alert(`⚠️ Спор закрыт, но произошла ошибка списания. Обратитесь в поддержку.`);
      }
    }, 500);
  };

  // Админ решает спор (вызывается из админ-панели)
  // В пользу трейдера — списания НЕТ
  // В пользу клиента — списание ЕСТЬ
  const resolveByAdmin = (disputeId: string, inFavorOf: "trader" | "client", amount: number, currency: string) => {
    setResolving(true);
    
    let deducted = false;
    if (inFavorOf === "client") {
      deducted = deductFromBalance(amount, currency, disputeId);
    }
    
    setTimeout(() => {
      setDisputes(prev => prev.map(d => 
        d.id === disputeId 
          ? { 
              ...d, 
              status: inFavorOf === "trader" ? "resolved_trader" : "resolved_client",
              timeLeft: 0,
              resolution: inFavorOf === "trader" 
                ? "Решён администратором в пользу трейдера. Средства не списаны."
                : `Решён администратором в пользу клиента. ${deducted ? 'Средства списаны с баланса.' : 'Ошибка списания.'}`,
              resolvedBy: "admin",
              amountDeducted: deducted
            }
          : d
      ));
      playSound("resolved");
      setResolving(false);
      setShowDetails(false);
    }, 500);
  };

  const filterByPeriod = (dispute: Dispute) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 7);
    const lastWeekStart = new Date(weekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    switch(period) {
      case "today": return dispute.createdAt >= today;
      case "yesterday": return dispute.createdAt >= yesterday && dispute.createdAt < today;
      case "week": return dispute.createdAt >= weekStart;
      case "lastWeek": return dispute.createdAt >= lastWeekStart && dispute.createdAt < weekStart;
      default: return true;
    }
  };

  const filteredDisputes = disputes
    .filter(dispute => 
      activeTab === "pending" ? dispute.status === "pending" : dispute.status !== "pending"
    )
    .filter(dispute => filterByPeriod(dispute))
    .filter(dispute =>
      dispute.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.cardNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const pendingCount = disputes.filter(d => d.status === "pending").length;

  return (
    <div className="space-y-6 p-6">
      {/* Баланс трейдера (для наглядности) */}
      <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-2xl p-4 border border-[#D4AF37]/20">
        <p className="text-gray-400 text-sm">Ваш баланс</p>
        <p className="text-2xl font-bold text-[#D4AF37]">{traderBalance.toLocaleString()} ₽</p>
        <p className="text-gray-500 text-xs mt-1">При проигрыше спора сумма списывается с баланса</p>
      </div>

      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-[#D4AF37]" />
            Апелляции
            {pendingCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                {pendingCount}
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            На решение апелляции даётся 30 минут. При проигрыше спора сумма списывается с вашего баланса.
          </p>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-lg transition-colors ${soundEnabled ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "bg-gray-800 text-gray-500"}`}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Уведомление о новом споре */}
      {newDisputeAlert && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-white font-medium">Новая апелляция! При проигрыше средства будут списаны с баланса.</span>
          </div>
        </div>
      )}

      {/* Вкладки Активные / История */}
      <div className="flex gap-2 border-b border-gray-800">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === "pending" ? "text-[#D4AF37] border-b-2 border-[#D4AF37]" : "text-gray-500 hover:text-gray-300"}`}
        >
          Активные
          {pendingCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === "history" ? "text-[#D4AF37] border-b-2 border-[#D4AF37]" : "text-gray-500 hover:text-gray-300"}`}
        >
          История
        </button>
      </div>

      {/* Фильтры и поиск */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex gap-2">
          {[
            { value: "today", label: "Сегодня" },
            { value: "yesterday", label: "Вчера" },
            { value: "week", label: "Неделя" },
            { value: "lastWeek", label: "Прошлая неделя" },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value as any)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${period === p.value ? "bg-[#D4AF37] text-black" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ID заказа, плательщик, карта..."
            className="pl-9 pr-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white text-sm w-64 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Список споров */}
      <div className="space-y-3">
        {filteredDisputes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Нет апелляций за выбранный период</p>
          </div>
        ) : (
          filteredDisputes.map((dispute) => (
            <div key={dispute.id} className={`bg-[#0f0f0f] rounded-xl border p-4 transition-all ${
              dispute.status === "pending" 
                ? "border-yellow-500/50 hover:border-[#D4AF37]/30" 
                : dispute.status === "resolved_trader" 
                  ? "border-green-500/30" 
                  : "border-red-500/30"
            }`}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    dispute.status === "pending" ? "bg-yellow-500 animate-pulse" :
                    dispute.status === "resolved_trader" ? "bg-green-500" : "bg-red-500"
                  }`} />
                  <div>
                    <p className="text-white font-mono text-sm">{dispute.orderId}</p>
                    <p className="text-gray-500 text-xs flex items-center gap-2">
                      <User className="w-3 h-3" />
                      {dispute.customerName}
                      <CreditCard className="w-3 h-3 ml-1" />
                      {dispute.cardBank} ••{dispute.cardNumber.slice(-4)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-white font-bold">{dispute.amount.toLocaleString()} {dispute.currency}</p>
                    <p className="text-gray-500 text-xs">{formatDate(dispute.createdAt)}</p>
                  </div>
                  {dispute.status === "pending" && (
                    <div className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {formatTime(dispute.timeLeft)}
                    </div>
                  )}
                  {dispute.status === "resolved_trader" && (
                    <div className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full">
                      Решён в пользу трейдера
                    </div>
                  )}
                  {dispute.status === "resolved_client" && (
                    <div className="bg-red-500/20 text-red-500 text-xs px-2 py-1 rounded-full">
                      Решён в пользу клиента
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setSelectedDispute(dispute);
                      setShowDetails(true);
                    }}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-500 hover:text-[#D4AF37]" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Детальная карточка спора */}
      {showDetails && selectedDispute && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowDetails(false)}>
          <div className="bg-[#0f0f0f] rounded-2xl p-6 w-full max-w-md border border-[#D4AF37]/20" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#D4AF37]" />
              Детали апелляции
            </h2>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="flex justify-between">
                <span className="text-gray-500">ID заказа:</span>
                <span className="text-white font-mono">{selectedDispute.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Сумма:</span>
                <span className="text-white font-bold">{selectedDispute.amount.toLocaleString()} {selectedDispute.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Карта:</span>
                <span className="text-white">{selectedDispute.cardBank} ••{selectedDispute.cardNumber.slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Плательщик:</span>
                <span className="text-white">{selectedDispute.customerName}</span>
              </div>
              {selectedDispute.customerEmail && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="text-white text-sm">{selectedDispute.customerEmail}</span>
                </div>
              )}
              {selectedDispute.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Телефон:</span>
                  <span className="text-white">{selectedDispute.customerPhone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Создана:</span>
                <span className="text-white">{formatDate(selectedDispute.createdAt)}</span>
              </div>
              {selectedDispute.status === "pending" && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Осталось времени:</span>
                  <span className="text-yellow-500 font-mono text-lg">{formatTime(selectedDispute.timeLeft)}</span>
                </div>
              )}
              <div className="border-t border-gray-800 pt-3">
                <p className="text-gray-500 text-sm mb-1">Причина спора:</p>
                <p className="text-white text-sm">{selectedDispute.reason}</p>
              </div>
              {selectedDispute.resolution && (
                <div className="border-t border-gray-800 pt-3">
                  <p className="text-gray-500 text-sm mb-1">Решение:</p>
                  <p className="text-gray-400 text-sm">{selectedDispute.resolution}</p>
                  {selectedDispute.amountDeducted && (
                    <p className="text-red-400 text-xs mt-1">⚠️ Сумма списана с вашего баланса</p>
                  )}
                </div>
              )}
            </div>
            
            {selectedDispute.status === "pending" && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => resolveForClient(selectedDispute.id, selectedDispute.amount, selectedDispute.currency)}
                  disabled={resolving}
                  className="flex-1 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Закрыть в пользу клиента
                </button>
              </div>
            )}
            
            <button
              onClick={() => setShowDetails(false)}
              className="w-full mt-4 py-2 bg-[#D4AF37] text-black rounded-lg font-bold"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
