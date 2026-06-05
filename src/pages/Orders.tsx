import { useState } from "react";
import { 
  Search, Filter, ChevronDown, ChevronUp, 
  Clock, CheckCircle, XCircle, AlertCircle,
  Eye, ArrowUpRight, ArrowDownLeft, Calendar as CalendarIcon
} from "lucide-react";

interface Order {
  id: string;
  orderId: string;
  type: "incoming" | "outgoing";
  amount: number;
  currency: string;
  status: "pending" | "confirmed" | "rejected";
  method: string;
  details: string;
  customerName?: string;
  createdAt: Date;
  confirmedAt?: Date;
}

// Демо-данные
const demoOrders: Order[] = [
  { id: "1", orderId: "P2P-ABC123", type: "incoming", amount: 15000, currency: "RUB", status: "confirmed", method: "Тинькофф", details: "****4832", customerName: "Алексей", createdAt: new Date(2026, 5, 6, 14, 30), confirmedAt: new Date(2026, 5, 6, 14, 32) },
  { id: "2", orderId: "P2P-DEF456", type: "incoming", amount: 8500, currency: "RUB", status: "pending", method: "СБП", details: "+7 999 123-45-67", customerName: "Мария", createdAt: new Date(2026, 5, 6, 13, 15) },
  { id: "3", orderId: "P2P-GHI789", type: "outgoing", amount: 5000, currency: "USDT", status: "confirmed", method: "МТС", details: "+7 916 123-45-67", createdAt: new Date(2026, 5, 5, 18, 45), confirmedAt: new Date(2026, 5, 5, 18, 47) },
  { id: "4", orderId: "P2P-JKL012", type: "incoming", amount: 23000, currency: "RUB", status: "rejected", method: "Сбербанк", details: "****9012", customerName: "Дмитрий", createdAt: new Date(2026, 5, 5, 11, 20) },
  { id: "5", orderId: "P2P-MNO345", type: "incoming", amount: 1200, currency: "USDT", status: "pending", method: "Сбор", details: "Сбор #12345", customerName: "Иван", createdAt: new Date(2026, 5, 4, 9, 0) },
];

export default function Orders() {
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">("incoming");
  const [period, setPeriod] = useState<"today" | "yesterday" | "week" | "lastWeek">("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const filterByPeriod = (order: Order) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 7);
    const lastWeekStart = new Date(weekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = weekStart;

    switch(period) {
      case "today":
        return order.createdAt >= today;
      case "yesterday":
        return order.createdAt >= yesterday && order.createdAt < today;
      case "week":
        return order.createdAt >= weekStart;
      case "lastWeek":
        return order.createdAt >= lastWeekStart && order.createdAt < weekStart;
      default:
        return true;
    }
  };

  const filteredOrders = demoOrders
    .filter(order => order.type === activeTab)
    .filter(order => filterByPeriod(order))
    .filter(order => 
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "pending": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "confirmed": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case "pending": return "Ожидание";
      case "confirmed": return "Подтверждён";
      case "rejected": return "Отклонён";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "pending": return "bg-yellow-500/10 text-yellow-500";
      case "confirmed": return "bg-green-500/10 text-green-500";
      case "rejected": return "bg-red-500/10 text-red-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-mono">Ордеры</h1>
        <p className="text-gray-500 text-sm mt-1">Все входящие и исходящие транзакции</p>
      </div>

      <div className="flex gap-2 border-b border-gray-800">
        <button
          onClick={() => setActiveTab("incoming")}
          className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === "incoming" ? "text-[#D4AF37] border-b-2 border-[#D4AF37]" : "text-gray-500 hover:text-gray-300"}`}
        >
          Входящие
        </button>
        <button
          onClick={() => setActiveTab("outgoing")}
          className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === "outgoing" ? "text-[#D4AF37] border-b-2 border-[#D4AF37]" : "text-gray-500 hover:text-gray-300"}`}
        >
          Исходящие
        </button>
      </div>

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
            placeholder="ID заказа, телефон, карта..."
            className="pl-9 pr-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white text-sm w-64 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      <div className="space-y-2">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Нет заказов за выбранный период</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-[#0f0f0f] rounded-xl border border-gray-800 p-4 hover:border-[#D4AF37]/30 transition-all">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  {order.type === "incoming" ? (
                    <ArrowUpRight className="w-5 h-5 text-green-500" />
                  ) : (
                    <ArrowDownLeft className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <p className="text-white font-mono text-sm">{order.orderId}</p>
                    <p className="text-gray-500 text-xs">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-white font-bold">{order.amount.toLocaleString()} {order.currency}</p>
                    <p className="text-gray-500 text-xs">{order.method} • {order.details}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)} flex items-center gap-1`}>
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
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

      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowDetails(false)}>
          <div className="bg-[#0f0f0f] rounded-2xl p-6 w-full max-w-md border border-[#D4AF37]/20" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">Детали заказа</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">ID заказа:</span>
                <span className="text-white font-mono">{selectedOrder.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Тип:</span>
                <span className={selectedOrder.type === "incoming" ? "text-green-500" : "text-red-500"}>
                  {selectedOrder.type === "incoming" ? "Входящий" : "Исходящий"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Сумма:</span>
                <span className="text-white font-bold">{selectedOrder.amount.toLocaleString()} {selectedOrder.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Метод:</span>
                <span className="text-white">{selectedOrder.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Реквизит:</span>
                <span className="text-white">{selectedOrder.details}</span>
              </div>
              {selectedOrder.customerName && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Плательщик:</span>
                  <span className="text-white">{selectedOrder.customerName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Создан:</span>
                <span className="text-white">{formatDate(selectedOrder.createdAt)}</span>
              </div>
              {selectedOrder.confirmedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Подтверждён:</span>
                  <span className="text-white">{formatDate(selectedOrder.confirmedAt)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Статус:</span>
                <span className={`flex items-center gap-1 ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusIcon(selectedOrder.status)}
                  {getStatusText(selectedOrder.status)}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowDetails(false)}
              className="w-full mt-6 py-2 bg-[#D4AF37] text-black rounded-lg font-bold"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
