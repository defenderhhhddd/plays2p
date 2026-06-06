import { useState, useEffect } from "react";
import { 
  Store, CreditCard, History, Key, Copy, Check,
  TrendingUp, Calendar, Search, Eye, Download,
  Plus, Trash2, RefreshCw
} from "lucide-react";

interface Order {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
}

// Демо-данные
const demoOrders: Order[] = [
  { id: "1", orderId: "P2P-ABC123", amount: 15000, currency: "RUB", status: "completed", createdAt: new Date(2026, 5, 6, 14, 30) },
  { id: "2", orderId: "P2P-DEF456", amount: 8500, currency: "RUB", status: "pending", createdAt: new Date(2026, 5, 6, 13, 15) },
  { id: "3", orderId: "P2P-GHI789", amount: 5000, currency: "USDT", status: "completed", createdAt: new Date(2026, 5, 5, 18, 45) },
];

const demoApiKeys: ApiKey[] = [
  { id: "1", name: "Магазин №1", key: "mer_1234567890abcdef", createdAt: new Date(2026, 5, 1, 10, 0), lastUsed: new Date(2026, 5, 6, 12, 0) },
  { id: "2", name: "Тестовый ключ", key: "mer_test_9876543210", createdAt: new Date(2026, 5, 2, 15, 30) },
];

export default function MerchantDashboard() {
  const [merchantName, setMerchantName] = useState("");
  const [balance, setBalance] = useState(125000);
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(demoApiKeys);
  const [activeTab, setActiveTab] = useState<"orders" | "api-keys">("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [orderAmount, setOrderAmount] = useState("");
  const [orderCurrency, setOrderCurrency] = useState("RUB");
  const [createOrderLoading, setCreateOrderLoading] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("merchantName") || "Мерчант";
    setMerchantName(name);
  }, []);

  const filteredOrders = orders.filter(o =>
    o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.amount.toString().includes(searchQuery)
  );

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const createApiKey = () => {
    if (!newKeyName) return;
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `mer_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date(),
    };
    setApiKeys([newKey, ...apiKeys]);
    setNewKeyName("");
    setShowCreateKeyModal(false);
  };

  const deleteApiKey = (id: string) => {
    if (confirm("Удалить API-ключ?")) {
      setApiKeys(apiKeys.filter(k => k.id !== id));
    }
  };

  const createOrder = async () => {
    if (!orderAmount || parseFloat(orderAmount) <= 0) {
      alert("Введите сумму");
      return;
    }
    setCreateOrderLoading(true);
    setTimeout(() => {
      const newOrder: Order = {
        id: Date.now().toString(),
        orderId: `P2P-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        amount: parseFloat(orderAmount),
        currency: orderCurrency,
        status: "pending",
        createdAt: new Date(),
      };
      setOrders([newOrder, ...orders]);
      setOrderAmount("");
      setCreateOrderLoading(false);
      alert("Заказ создан!");
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-green-500/20 text-green-500";
      case "pending": return "bg-yellow-500/20 text-yellow-500";
      case "failed": return "bg-red-500/20 text-red-500";
      default: return "bg-gray-500/20 text-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case "completed": return "Выполнен";
      case "pending": return "Ожидание";
      case "failed": return "Ошибка";
      default: return status;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Заголовок */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Store className="w-6 h-6 text-[#D4AF37]" />
            Кабинет мерчанта
          </h1>
          <p className="text-gray-500 text-sm mt-1">Добро пожаловать, {merchantName}</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("merchantToken");
            window.location.href = "/merchant/login";
          }}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Выйти
        </button>
      </div>

      {/* Статистика */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-2xl p-6 border border-[#D4AF37]/20">
          <p className="text-gray-400 text-sm">Баланс</p>
          <p className="text-3xl font-bold text-[#D4AF37]">{balance.toLocaleString()} ₽</p>
        </div>
        <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">Всего заказов</p>
          <p className="text-3xl font-bold text-white">{orders.length}</p>
          <p className="text-green-500 text-sm">Выполнено: {orders.filter(o => o.status === "completed").length}</p>
        </div>
      </div>

      {/* Вкладки */}
      <div className="flex gap-2 border-b border-gray-800">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === "orders" ? "text-[#D4AF37] border-b-2 border-[#D4AF37]" : "text-gray-500 hover:text-gray-300"}`}
        >
          Заказы
        </button>
        <button
          onClick={() => setActiveTab("api-keys")}
          className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === "api-keys" ? "text-[#D4AF37] border-b-2 border-[#D4AF37]" : "text-gray-500 hover:text-gray-300"}`}
        >
          API-ключи
        </button>
      </div>

      {/* Вкладка: Заказы */}
      {activeTab === "orders" && (
        <div>
          {/* Форма создания заказа */}
          <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800 mb-6">
            <h3 className="text-white font-medium mb-3">Создать заказ</h3>
            <div className="flex flex-wrap gap-3">
              <input
                type="number"
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
                placeholder="Сумма"
                className="px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white w-32"
              />
              <select
                value={orderCurrency}
                onChange={(e) => setOrderCurrency(e.target.value)}
                className="px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
              >
                <option value="RUB">RUB</option>
                <option value="USDT">USDT</option>
              </select>
              <button
                onClick={createOrder}
                disabled={createOrderLoading}
                className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-bold hover:bg-[#c4a030]"
              >
                {createOrderLoading ? "Создание..." : "Создать"}
              </button>
            </div>
          </div>

          {/* Поиск */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по ID или сумме..."
              className="w-full pl-9 pr-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white text-sm"
            />
          </div>

          {/* Список заказов */}
          <div className="space-y-2">
            {filteredOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Нет заказов</p>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className="bg-[#0f0f0f] rounded-xl border border-gray-800 p-4">
                  <div className="flex justify-between items-center flex-wrap gap-3">
                    <div>
                      <p className="text-white font-mono text-sm">{order.orderId}</p>
                      <p className="text-gray-500 text-xs">{order.createdAt.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{order.amount.toLocaleString()} {order.currency}</p>
                      <p className={`text-xs px-2 py-0.5 rounded-full inline-block ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Вкладка: API-ключи */}
      {activeTab === "api-keys" && (
        <div>
          <button
            onClick={() => setShowCreateKeyModal(true)}
            className="mb-4 flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-bold hover:bg-[#c4a030]"
          >
            <Plus className="w-4 h-4" />
            Создать API-ключ
          </button>

          <div className="space-y-3">
            {apiKeys.map(key => (
              <div key={key.id} className="bg-[#0f0f0f] rounded-xl border border-gray-800 p-4">
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div>
                    <h3 className="text-white font-medium">{key.name}</h3>
                    <p className="text-gray-500 text-xs font-mono">{key.key}</p>
                    <p className="text-gray-500 text-xs mt-1">Создан: {key.createdAt.toLocaleString()}</p>
                    {key.lastUsed && <p className="text-gray-500 text-xs">Последнее использование: {key.lastUsed.toLocaleString()}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => copyToClipboard(key.key, key.id)} className="p-2 rounded-lg hover:bg-gray-700">
                      {copiedKey === key.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                    </button>
                    <button onClick={() => deleteApiKey(key.id)} className="p-2 rounded-lg hover:bg-red-500/20">
                      <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-blue-500/10 border border-blue-500/50 rounded-xl p-4">
            <p className="text-blue-400 text-sm">📘 Как использовать API-ключ?</p>
            <p className="text-gray-400 text-xs mt-1">Передавайте ключ в заголовке <code className="bg-gray-800 px-1 rounded">X-API-Key</code> при запросе к <code className="bg-gray-800 px-1 rounded">/api/orders/create</code></p>
          </div>
        </div>
      )}

      {/* Модалка создания API-ключа */}
      {showCreateKeyModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateKeyModal(false)}>
          <div className="bg-[#0f0f0f] rounded-2xl p-6 w-full max-w-md border border-[#D4AF37]/20" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">Создать API-ключ</h2>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Название ключа (например, Магазин №1)"
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={() => setShowCreateKeyModal(false)} className="flex-1 py-2 bg-gray-800 text-white rounded-lg">Отмена</button>
              <button onClick={createApiKey} className="flex-1 py-2 bg-[#D4AF37] text-black rounded-lg font-bold">Создать</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
