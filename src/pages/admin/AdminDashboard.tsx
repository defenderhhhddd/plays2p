import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Users, TrendingUp, CreditCard, Activity, Plus, LogOut, ToggleLeft, ToggleRight, Copy, Check } from "lucide-react";

interface Trader {
  id: number;
  name: string;
  token: string;
  is_active: boolean;
  profit_percent: number;
  balance: number;
  created_at: string;
  order_count: number;
  today_volume: number;
}

interface PlatformStats {
  total_traders: number;
  active_traders: number;
  today_volume: number;
  today_orders: number;
}

interface Order {
  id: number;
  order_id: string;
  trader_name: string;
  amount: number;
  customer_name: string | null;
  card_bank: string;
  card_last4: string;
  status: string;
  created_at: string;
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-5">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className="text-white font-mono font-bold text-xl">{value}</p>
    </div>
  );
}

function CopyToken({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
      <span className="font-mono text-xs">{token.slice(0, 18)}…</span>
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const adminToken = localStorage.getItem("adminToken") || "";
  const adminName = localStorage.getItem("adminName") || "Admin";

  const [traders, setTraders] = useState<Trader[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<"traders" | "orders">("traders");
  const [showCreate, setShowCreate] = useState(false);
  const [newTrader, setNewTrader] = useState({ name: "", profit_percent: "5" });
  const [creating, setCreating] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);

  const headers = { "Content-Type": "application/json", "x-admin-token": adminToken };

  const fetchAll = async () => {
    const [tRes, sRes, oRes] = await Promise.all([
      fetch("/api/admin/traders", { headers }),
      fetch("/api/admin/stats", { headers }),
      fetch("/api/admin/orders", { headers }),
    ]);
    if (tRes.ok) setTraders(await tRes.json());
    if (sRes.ok) setStats(await sRes.json());
    if (oRes.ok) setOrders(await oRes.json());
  };

  useEffect(() => {
    if (!adminToken) { setLocation("/admin"); return; }
    fetchAll();
    const iv = setInterval(fetchAll, 15000);
    return () => clearInterval(iv);
  }, []);

  const toggleTrader = async (id: number, current: boolean) => {
    await fetch(`/api/admin/traders/${id}/toggle`, {
      method: "POST",
      headers,
      body: JSON.stringify({ is_active: !current }),
    });
    fetchAll();
  };

  const createTrader = async () => {
    if (!newTrader.name.trim()) return;
    setCreating(true);
    const res = await fetch("/api/admin/traders", {
      method: "POST",
      headers,
      body: JSON.stringify({ name: newTrader.name, profit_percent: parseFloat(newTrader.profit_percent) }),
    });
    if (res.ok) {
      const data = await res.json();
      setCreatedToken(data.token);
      setNewTrader({ name: "", profit_percent: "5" });
      fetchAll();
    }
    setCreating(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    setLocation("/admin");
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Top nav */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <span className="text-white font-bold tracking-wider font-mono text-sm">
            PLAYERS<span className="text-red-500">2</span>PAY <span className="text-gray-500 font-normal">/ Admin</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm hidden md:inline">{adminName}</span>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all text-sm">
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Всего трейдеров" value={String(stats.total_traders)} color="bg-blue-600" />
            <StatCard icon={Activity} label="Активных" value={String(stats.active_traders)} color="bg-green-600" />
            <StatCard icon={TrendingUp} label="Оборот сегодня" value={`$${Number(stats.today_volume).toFixed(2)}`} color="bg-[#D4AF37]" />
            <StatCard icon={CreditCard} label="Заказов сегодня" value={String(stats.today_orders)} color="bg-purple-600" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-800">
          {(["traders", "orders"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === t ? "text-white border-b-2 border-[#D4AF37]" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {t === "traders" ? `Трейдеры (${traders.length})` : `Активные заказы (${orders.length})`}
            </button>
          ))}
        </div>

        {/* Traders tab */}
        {tab === "traders" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => { setShowCreate(true); setCreatedToken(null); }}
                className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-medium hover:bg-[#c4a030] transition-all text-sm"
              >
                <Plus className="w-4 h-4" /> Создать трейдера
              </button>
            </div>

            {/* Create modal */}
            {showCreate && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
                <div className="bg-[#0f0f0f] border border-gray-800 rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                  <h2 className="text-lg font-bold text-white mb-4">Новый трейдер</h2>

                  {createdToken ? (
                    <div className="space-y-4">
                      <p className="text-green-400 text-sm">Трейдер создан! Сохраните токен:</p>
                      <div className="bg-[#1a1a1a] border border-[#D4AF37]/30 rounded-lg p-3 font-mono text-[#D4AF37] text-sm break-all">{createdToken}</div>
                      <button
                        onClick={() => { navigator.clipboard.writeText(createdToken); }}
                        className="w-full py-2 border border-gray-700 rounded-lg text-gray-400 hover:text-white text-sm transition-colors"
                      >
                        Копировать токен
                      </button>
                      <button onClick={() => setShowCreate(false)} className="w-full py-2 bg-[#D4AF37] text-black rounded-lg font-medium text-sm">Закрыть</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        placeholder="Имя трейдера"
                        value={newTrader.name}
                        onChange={(e) => setNewTrader({ ...newTrader, name: e.target.value })}
                        className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          placeholder="% прибыли"
                          value={newTrader.profit_percent}
                          onChange={(e) => setNewTrader({ ...newTrader, profit_percent: e.target.value })}
                          className="flex-1 p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                        />
                        <span className="text-gray-500 text-sm">% комиссия</span>
                      </div>
                      <button
                        onClick={createTrader}
                        disabled={creating}
                        className="w-full py-3 bg-[#D4AF37] text-black rounded-lg font-bold disabled:opacity-50"
                      >
                        {creating ? "Создание..." : "Создать"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Traders table */}
            <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 text-left text-gray-400 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3">Трейдер</th>
                    <th className="px-4 py-3">Токен</th>
                    <th className="px-4 py-3">Комиссия</th>
                    <th className="px-4 py-3">Оборот (сегодня)</th>
                    <th className="px-4 py-3">Заказов</th>
                    <th className="px-4 py-3">Баланс</th>
                    <th className="px-4 py-3">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {traders.map((trader) => (
                    <tr key={trader.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B6914] flex items-center justify-center text-black text-xs font-bold">
                            {trader.name[0]?.toUpperCase()}
                          </div>
                          <span className="text-white text-sm font-medium">{trader.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4"><CopyToken token={trader.token} /></td>
                      <td className="px-4 py-4 text-gray-300 text-sm">{trader.profit_percent}%</td>
                      <td className="px-4 py-4 text-white font-mono text-sm">${Number(trader.today_volume || 0).toFixed(2)}</td>
                      <td className="px-4 py-4 text-gray-300 text-sm">{trader.order_count || 0}</td>
                      <td className="px-4 py-4 text-[#D4AF37] font-mono text-sm">${Number(trader.balance).toFixed(2)}</td>
                      <td className="px-4 py-4">
                        <button onClick={() => toggleTrader(trader.id, trader.is_active)} className="transition-colors">
                          {trader.is_active
                            ? <ToggleRight className="w-7 h-7 text-green-500" />
                            : <ToggleLeft className="w-7 h-7 text-gray-600" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {traders.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500 text-sm">Нет трейдеров</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders tab */}
        {tab === "orders" && (
          <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3">ID заказа</th>
                  <th className="px-4 py-3">Трейдер</th>
                  <th className="px-4 py-3">Сумма</th>
                  <th className="px-4 py-3">Карта</th>
                  <th className="px-4 py-3">Клиент</th>
                  <th className="px-4 py-3">Статус</th>
                  <th className="px-4 py-3">Время</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                    <td className="px-4 py-4 font-mono text-xs text-gray-400">{order.order_id.slice(0, 12)}…</td>
                    <td className="px-4 py-4 text-white text-sm">{order.trader_name}</td>
                    <td className="px-4 py-4 text-white font-mono text-sm">${Number(order.amount).toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-300">{order.card_bank}</span>
                      <span className="text-gray-500 text-xs ml-1">*{order.card_last4}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-300 text-sm">{order.customer_name || "—"}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                        Ожидание
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-xs">
                      {new Date(order.created_at).toLocaleTimeString("ru-RU")}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500 text-sm">Нет активных заказов</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
