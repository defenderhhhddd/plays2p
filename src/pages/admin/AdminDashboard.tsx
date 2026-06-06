import { useState } from "react";
import { 
  Users, CreditCard, TrendingUp, AlertTriangle, 
  Eye, Lock, Unlock, Edit2, Trash2, Search,
  Download, Calendar, CheckCircle, XCircle, Clock,
  DollarSign, BarChart3, PieChart, Settings, Shield,
  Mail, Server, Ban, Activity, Database, Paintbrush, 
  FileUp, Percent, Timer, Key, MessageSquare, 
  Bookmark, Flask, History, Zap
} from "lucide-react";

// Демо-данные
const demoUsers = [
  { id: 1, name: "Трейдер #1", email: "trader1@example.com", token: "tr_abc123", balance: 125000, commission: 5, isActive: true, totalOrders: 45, totalVolume: 1250000, disputes: 2, notes: "Надёжный трейдер", blockedUntil: null },
  { id: 2, name: "Трейдер #2", email: "trader2@example.com", token: "tr_def456", balance: 87000, commission: 5, isActive: true, totalOrders: 28, totalVolume: 870000, disputes: 1, notes: "", blockedUntil: null },
  { id: 3, name: "Трейдер #3", email: "trader3@example.com", token: "tr_ghi789", balance: 0, commission: 5, isActive: false, totalOrders: 0, totalVolume: 0, disputes: 0, notes: "Нарушал правила", blockedUntil: null },
];

const demoDisputes = [
  { id: 1, orderId: "P2P-ABC123", amount: 15000, traderName: "Трейдер #1", customerName: "Алексей", status: "pending", createdAt: new Date(2026, 5, 6, 14, 30), timeLeft: 1200 },
  { id: 2, orderId: "P2P-DEF456", amount: 8500, traderName: "Трейдер #2", customerName: "Мария", status: "pending", createdAt: new Date(2026, 5, 6, 13, 15), timeLeft: 900 },
];

const demoIpBlacklist = ["192.168.1.100", "10.0.0.50"];
const demoAdminActions = [
  { id: 1, admin: "admin@players2pay.com", action: "Заблокировал трейдера #2", createdAt: new Date(2026, 5, 6, 14, 0) },
  { id: 2, admin: "admin@players2pay.com", action: "Изменил комиссию трейдера #1 на 5%", createdAt: new Date(2026, 5, 5, 12, 30) },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"traders" | "disputes" | "analytics" | "settings" | "logs">("traders");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrader, setSelectedTrader] = useState<any>(null);
  const [showTraderModal, setShowTraderModal] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [theme, setTheme] = useState("#D4AF37");
  const [ipBlacklist, setIpBlacklist] = useState(demoIpBlacklist);
  const [newIp, setNewIp] = useState("");
  const [massMessage, setMassMessage] = useState("");
  const [quickActionMessage, setQuickActionMessage] = useState("");
  const [tempBlockHours, setTempBlockHours] = useState(24);

  const filteredTraders = demoUsers.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.token.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTraderStatus = (id: number) => alert(`Статус трейдера ${id} изменён`);
  const resolveDispute = (id: number, inFavorOf: "trader" | "client") => alert(`Спор ${id} решён в пользу ${inFavorOf}`);
  const exportToCSV = () => alert("Экспорт в CSV выполнен");
  const backupDatabase = () => alert("Бэкап базы данных скачан");
  const importTradersCSV = () => alert("Импорт трейдеров из CSV (выберите файл)");
  const sendMassMessage = () => alert(`Сообщение отправлено всем трейдерам: ${massMessage}`);
  const sendQuickAction = () => alert(`Быстрое действие: ${quickActionMessage}`);
  const addIpToBlacklist = () => { if (newIp) setIpBlacklist([...ipBlacklist, newIp]); setNewIp(""); };
  const removeIpFromBlacklist = (ip: string) => setIpBlacklist(ipBlacklist.filter(i => i !== ip));

  const stats = {
    totalTraders: demoUsers.length,
    activeTraders: demoUsers.filter(u => u.isActive).length,
    totalVolume: demoUsers.reduce((sum, u) => sum + u.totalVolume, 0),
    totalDisputes: demoDisputes.length,
    pendingDisputes: demoDisputes.filter(d => d.status === "pending").length,
    totalCommission: demoUsers.reduce((sum, u) => sum + (u.totalVolume * (u.commission / 100)), 0),
  };

  return (
    <div className="space-y-6 p-6">
      {/* Заголовок с быстрыми действиями */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#D4AF37]" />
            Админ-панель
          </h1>
          <p className="text-gray-500 text-sm mt-1">Управление платформой, трейдерами и спорами</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTestMode(!testMode)} className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${testMode ? "bg-yellow-500/20 text-yellow-500" : "bg-gray-800 text-gray-400"}`}>
            <Flask className="w-4 h-4" />
            {testMode ? "Тестовый режим" : "Режим"}
          </button>
          <button onClick={backupDatabase} className="px-3 py-2 bg-gray-800 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-700">
            <Database className="w-4 h-4" />
            Бэкап
          </button>
          <button onClick={exportToCSV} className="px-3 py-2 bg-[#D4AF37] text-black rounded-lg text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Экспорт
          </button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <StatCard title="Трейдеров" value={stats.totalTraders} sub={`Актив: ${stats.activeTraders}`} icon={<Users className="w-5 h-5" />} />
        <StatCard title="Оборот" value={`${(stats.totalVolume / 1000).toFixed(0)}K ₽`} sub={`≈ ${(stats.totalVolume / 90).toFixed(0)} USDT`} icon={<TrendingUp className="w-5 h-5" />} />
        <StatCard title="Комиссия" value={`${(stats.totalCommission / 1000).toFixed(0)}K ₽`} sub="Всего" icon={<DollarSign className="w-5 h-5" />} />
        <StatCard title="Споры" value={stats.totalDisputes} sub={`Актив: ${stats.pendingDisputes}`} icon={<AlertTriangle className="w-5 h-5" />} />
        <StatCard title="Загрузка CPU" value="23%" sub="Сервер" icon={<Server className="w-5 h-5" />} />
        <StatCard title="RAM" value="1.2/4 GB" sub="Сервер" icon={<Activity className="w-5 h-5" />} />
        <StatCard title="Топ страна" value="Россия" sub="73% платежей" icon={<PieChart className="w-5 h-5" />} />
        <StatCard title="Сегодня" value={`+12`} sub="новых трейдеров" icon={<Calendar className="w-5 h-5" />} />
      </div>

      {/* Вкладки */}
      <div className="flex gap-2 border-b border-gray-800 flex-wrap">
        {["traders", "disputes", "analytics", "settings", "logs"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 text-sm font-medium transition-all capitalize ${activeTab === tab ? "text-[#D4AF37] border-b-2 border-[#D4AF37]" : "text-gray-500 hover:text-gray-300"}`}>
            {tab === "traders" && "Трейдеры"}
            {tab === "disputes" && "Споры"}
            {tab === "analytics" && "Аналитика"}
            {tab === "settings" && "Настройки"}
            {tab === "logs" && "Логи"}
          </button>
        ))}
      </div>

      {/* Вкладка: Трейдеры */}
      {activeTab === "traders" && (
        <div>
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск..." className="w-full pl-9 pr-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white" />
            </div>
            <div className="flex gap-2">
              <button onClick={importTradersCSV} className="px-3 py-2 bg-gray-800 rounded-lg text-sm flex items-center gap-2"><FileUp className="w-4 h-4" /> Импорт CSV</button>
            </div>
          </div>
          <div className="space-y-3">
            {filteredTraders.map(trader => (
              <div key={trader.id} className="bg-[#0f0f0f] rounded-xl border border-gray-800 p-4">
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div><h3 className="text-white font-medium">{trader.name}</h3><p className="text-gray-500 text-xs">{trader.email} • {trader.token}</p></div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleTraderStatus(trader.id)} className={`px-2 py-1 text-[10px] rounded ${trader.isActive ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>{trader.isActive ? "Активен" : "Заблокирован"}</button>
                    <button onClick={() => { setSelectedTrader(trader); setShowTraderModal(true); }} className="p-1.5 rounded-lg hover:bg-gray-700"><Eye className="w-4 h-4 text-gray-500" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 mt-3 text-xs">
                  <div className="bg-black/40 p-2 rounded"><p className="text-gray-500">Баланс</p><p className="text-white">{trader.balance.toLocaleString()} ₽</p></div>
                  <div className="bg-black/40 p-2 rounded"><p className="text-gray-500">Комиссия</p><p className="text-white">{trader.commission}%</p></div>
                  <div className="bg-black/40 p-2 rounded"><p className="text-gray-500">Оборот</p><p className="text-white">{trader.totalVolume.toLocaleString()} ₽</p></div>
                  <div className="bg-black/40 p-2 rounded"><p className="text-gray-500">Споры</p><p className="text-white">{trader.disputes}</p></div>
                </div>
                {trader.notes && <p className="text-xs text-gray-500 mt-2">📝 {trader.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Вкладка: Споры */}
      {activeTab === "disputes" && (
        <div className="space-y-3">
          {demoDisputes.map(dispute => (
            <div key={dispute.id} className="bg-[#0f0f0f] rounded-xl border border-gray-800 p-4">
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div><p className="text-white font-mono">{dispute.orderId}</p><p className="text-gray-500 text-xs">{dispute.traderName} • {dispute.customerName} • {dispute.amount.toLocaleString()} ₽</p></div>
                <div className="flex gap-2">
                  <button onClick={() => resolveDispute(dispute.id, "client")} className="px-3 py-1 text-xs bg-red-500/20 text-red-500 rounded">В пользу клиента</button>
                  <button onClick={() => resolveDispute(dispute.id, "trader")} className="px-3 py-1 text-xs bg-green-500/20 text-green-500 rounded">В пользу трейдера</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Вкладка: Аналитика */}
      {activeTab === "analytics" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800"><h3 className="text-white font-medium mb-2">📊 Оборот по дням</h3><div className="h-32 flex items-center justify-center text-gray-500 text-sm">[График]</div></div>
          <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800"><h3 className="text-white font-medium mb-2">🥧 Страны плательщиков</h3><div className="h-32 flex items-center justify-center text-gray-500 text-sm">Россия 73% • Таджикистан 12% • Узбекистан 8% • Другие 7%</div></div>
          <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800"><h3 className="text-white font-medium mb-2">📈 Сравнение периодов</h3><div className="h-32 flex items-center justify-center text-gray-500 text-sm">[График сравнения]</div></div>
          <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800"><h3 className="text-white font-medium mb-2">🏆 Топ трейдеров по обороту</h3><ol className="text-sm text-gray-300 space-y-1"><li>1. Трейдер #1 — 1 250 000 ₽</li><li>2. Трейдер #2 — 870 000 ₽</li></ol></div>
        </div>
      )}

      {/* Вкладка: Настройки */}
      {activeTab === "settings" && (
        <div className="space-y-4">
          <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800"><h3 className="text-white font-medium mb-2">🎨 White Label</h3><div className="flex items-center gap-3"><input type="color" value={theme} onChange={(e) => setTheme(e.target.value)} className="w-10 h-10 rounded border border-gray-700" /><span className="text-white">Основной цвет: {theme}</span><button onClick={() => alert("Логотип загружен")} className="px-3 py-1 bg-gray-800 rounded text-sm">Загрузить логотип</button></div></div>
          <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800"><h3 className="text-white font-medium mb-2">🚫 Чёрный список IP</h3><div className="flex gap-2 mb-2"><input type="text" value={newIp} onChange={(e) => setNewIp(e.target.value)} placeholder="IP адрес" className="flex-1 px-3 py-1 bg-gray-900 border border-gray-700 rounded" /><button onClick={addIpToBlacklist} className="px-3 py-1 bg-[#D4AF37] text-black rounded">Добавить</button></div><div className="space-y-1">{ipBlacklist.map(ip => <div key={ip} className="flex justify-between items-center"><span className="text-gray-300">{ip}</span><button onClick={() => removeIpFromBlacklist(ip)} className="text-red-500 text-xs">Удалить</button></div>)}</div></div>
          <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800"><h3 className="text-white font-medium mb-2">📧 Массовая рассылка</h3><textarea value={massMessage} onChange={(e) => setMassMessage(e.target.value)} placeholder="Сообщение для всех трейдеров..." className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white text-sm" rows={2} /><button onClick={sendMassMessage} className="mt-2 px-4 py-1 bg-[#D4AF37] text-black rounded text-sm">Отправить</button></div>
          <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800"><h3 className="text-white font-medium mb-2">⚡ Quick Actions</h3><div className="flex gap-2 flex-wrap"><button onClick={() => sendQuickAction()} className="px-3 py-1 bg-red-500/20 text-red-500 rounded text-sm">Отключить трафик всем</button><button onClick={() => sendQuickAction()} className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded text-sm">Разослать предупреждение</button><button onClick={() => alert("Установлены комиссии по уровням")} className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded text-sm">Комиссия по уровням</button></div></div>
          <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800"><h3 className="text-white font-medium mb-2">🔐 2FA Админа</h3><button onClick={() => alert("Настройка 2FA")} className="px-4 py-2 bg-[#D4AF37] text-black rounded text-sm">Подключить Google Authenticator</button></div>
          <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800"><h3 className="text-white font-medium mb-2">🤖 Telegram-бот</h3><button onClick={() => alert("Настройка Telegram бота")} className="px-4 py-2 bg-[#D4AF37] text-black rounded text-sm">Подключить бота</button></div>
        </div>
      )}

      {/* Вкладка: Логи */}
      {activeTab === "logs" && (
        <div className="space-y-2">
          {demoAdminActions.map(log => (
            <div key={log.id} className="bg-[#0f0f0f] rounded-lg p-3 border border-gray-800 flex justify-between items-center flex-wrap gap-2">
              <div><p className="text-white text-sm">{log.action}</p><p className="text-gray-500 text-xs">{log.admin}</p></div>
              <p className="text-gray-500 text-xs">{log.createdAt.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Модалка трейдера */}
      {showTraderModal && selectedTrader && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowTraderModal(false)}>
          <div className="bg-[#0f0f0f] rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">{selectedTrader.name}</h2>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-500">Email:</span><span className="text-white">{selectedTrader.email}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Баланс:</span><span className="text-white">{selectedTrader.balance.toLocaleString()} ₽</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Комиссия:</span><span className="text-white">{selectedTrader.commission}%</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Оборот:</span><span className="text-white">{selectedTrader.totalVolume.toLocaleString()} ₽</span></div>
              <div className="flex gap-2 mt-4"><button onClick={() => alert(`Изменить комиссию`)} className="flex-1 py-2 bg-gray-800 rounded text-white">Изменить комиссию</button><button onClick={() => alert(`Временная блокировка`)} className="flex-1 py-2 bg-red-500/20 text-red-500 rounded">Блокировка</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, sub, icon }: any) {
  return (
    <div className="bg-[#0f0f0f] rounded-xl p-3 border border-gray-800">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-xs">{title}</p>
        <div className="text-[#D4AF37]">{icon}</div>
      </div>
      <p className="text-xl font-bold text-white mt-1">{value}</p>
      <p className="text-gray-500 text-[10px] mt-0.5">{sub}</p>
    </div>
  );
}
