import { useState } from "react";
import { Smartphone, Plus, Trash2, Edit2, CheckCircle, XCircle, Clock, QrCode, Download } from "lucide-react";

interface Terminal {
  id: string;
  name: string;
  deviceId: string;
  lastActive: Date;
  registeredAt: Date;
  version: string;
  os: string;
  isActive: boolean;
  totalOrders: number;
  completedOrders: number;
  disputes: number;
  notifications: number;
}

// Демо-данные
const demoTerminals: Terminal[] = [
  {
    id: "1",
    name: "Samsung A115F",
    deviceId: "526b15c4-7bd1-46a8-b322-d3eed1b3b1b3",
    lastActive: new Date(2026, 5, 6, 14, 30),
    registeredAt: new Date(2026, 5, 20, 18, 32),
    version: "1.1.2",
    os: "Android 12",
    isActive: true,
    totalOrders: 113,
    completedOrders: 79,
    disputes: 6,
    notifications: 294,
  },
];

export default function Terminals() {
  const [terminals, setTerminals] = useState<Terminal[]>(demoTerminals);
  const [showModal, setShowModal] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [newTerminal, setNewTerminal] = useState({ name: "", deviceId: "" });
  const [error, setError] = useState("");

  const handleAddTerminal = () => {
    if (!newTerminal.name || !newTerminal.deviceId) {
      setError("Заполните имя и ID устройства");
      return;
    }
    
    const newId = (Math.max(0, ...terminals.map(t => parseInt(t.id))) + 1).toString();
    const terminal: Terminal = {
      id: newId,
      name: newTerminal.name,
      deviceId: newTerminal.deviceId,
      lastActive: new Date(),
      registeredAt: new Date(),
      version: "1.1.2",
      os: "Android 12",
      isActive: true,
      totalOrders: 0,
      completedOrders: 0,
      disputes: 0,
      notifications: 0,
    };
    
    setTerminals([...terminals, terminal]);
    setShowModal(false);
    setNewTerminal({ name: "", deviceId: "" });
    setError("");
  };

  const toggleActive = (id: string) => {
    setTerminals(prev => prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  };

  const deleteTerminal = (id: string) => {
    if (confirm("Удалить терминал?")) {
      setTerminals(prev => prev.filter(t => t.id !== id));
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
      {/* Заголовок */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-[#D4AF37]" />
            Терминалы
          </h1>
          <p className="text-gray-500 text-sm mt-1">Управление Android-устройствами для автоподтверждения платежей</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowQR(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <QrCode className="w-4 h-4" />
            Скачать APK
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-bold hover:bg-[#c4a030] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Добавить терминал
          </button>
        </div>
      </div>

      {/* Информация о приложении */}
      <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-xl p-4 border border-[#D4AF37]/20">
        <p className="text-gray-400 text-sm mb-2">📱 Мобильное приложение</p>
        <p className="text-white text-sm">
          Установите приложение PLAYERS2PAY Terminal на свой Android-смартфон. 
          Оно автоматически отслеживает входящие платежи и подтверждает их.
        </p>
        <button className="mt-3 text-[#D4AF37] text-sm hover:underline">Скачать последнюю версию APK →</button>
      </div>

      {/* Список терминалов */}
      <div className="space-y-4">
        {terminals.length === 0 ? (
          <div className="text-center py-12">
            <Smartphone className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">Нет добавленных терминалов</p>
            <button onClick={() => setShowModal(true)} className="mt-2 text-[#D4AF37] text-sm">Добавить терминал →</button>
          </div>
        ) : (
          terminals.map((terminal) => (
            <div key={terminal.id} className="bg-[#0f0f0f] rounded-xl border border-gray-800 p-4 hover:border-[#D4AF37]/30 transition-all">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-8 h-8 text-[#D4AF37]" />
                  <div>
                    <h3 className="text-white font-medium">{terminal.name}</h3>
                    <p className="text-gray-500 text-xs font-mono">{terminal.deviceId.slice(0, 20)}...</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(terminal.id)}
                    className={`px-2 py-1 text-[10px] rounded ${terminal.isActive ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}
                  >
                    {terminal.isActive ? "Активен" : "Неактивен"}
                  </button>
                  <button
                    onClick={() => deleteTerminal(terminal.id)}
                    className="p-1 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                <div className="bg-black/40 rounded-lg p-2">
                  <p className="text-gray-500">Версия</p>
                  <p className="text-white">{terminal.version}</p>
                </div>
                <div className="bg-black/40 rounded-lg p-2">
                  <p className="text-gray-500">ОС</p>
                  <p className="text-white">{terminal.os}</p>
                </div>
                <div className="bg-black/40 rounded-lg p-2">
                  <p className="text-gray-500">Зарегистрирован</p>
                  <p className="text-white text-xs">{formatDate(terminal.registeredAt)}</p>
                </div>
                <div className="bg-black/40 rounded-lg p-2">
                  <p className="text-gray-500">Последняя активность</p>
                  <p className="text-white text-xs">{formatDate(terminal.lastActive)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-black/40 rounded-lg p-2">
                  <p className="text-gray-500">Всего ордеров</p>
                  <p className="text-white font-bold">{terminal.totalOrders}</p>
                </div>
                <div className="bg-black/40 rounded-lg p-2">
                  <p className="text-gray-500">Завершено</p>
                  <p className="text-green-500">{terminal.completedOrders} ({Math.round(terminal.completedOrders / (terminal.totalOrders || 1) * 100)}%)</p>
                </div>
                <div className="bg-black/40 rounded-lg p-2">
                  <p className="text-gray-500">Апелляции</p>
                  <p className="text-red-500">{terminal.disputes}</p>
                </div>
                <div className="bg-black/40 rounded-lg p-2">
                  <p className="text-gray-500">Уведомлений</p>
                  <p className="text-white">{terminal.notifications}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Модалка добавления терминала */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#0f0f0f] rounded-2xl p-6 w-full max-w-md border border-[#D4AF37]/20" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">Добавить терминал</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Имя терминала</label>
                <input
                  type="text"
                  value={newTerminal.name}
                  onChange={(e) => setNewTerminal({ ...newTerminal, name: e.target.value })}
                  placeholder="Samsung A115F"
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">ID устройства</label>
                <input
                  type="text"
                  value={newTerminal.deviceId}
                  onChange={(e) => setNewTerminal({ ...newTerminal, deviceId: e.target.value })}
                  placeholder="526b15c4-7bd1-46a8..."
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white font-mono text-sm"
                />
                <p className="text-gray-500 text-xs mt-1">ID можно найти в приложении PLAYERS2PAY Terminal</p>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2 bg-gray-800 text-white rounded-lg">Отмена</button>
                <button onClick={handleAddTerminal} className="flex-1 py-2 bg-[#D4AF37] text-black rounded-lg font-bold">Добавить</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR-код для скачивания APK */}
      {showQR && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowQR(false)}>
          <div className="bg-[#0f0f0f] rounded-2xl p-6 w-full max-w-sm border border-[#D4AF37]/20 text-center" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">Скачать APK</h2>
            <div className="bg-white p-4 rounded-xl inline-block mx-auto mb-4">
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                [QR-код]
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">Отсканируйте QR-код или скачайте по ссылке</p>
            <a href="#" className="text-[#D4AF37] text-sm underline break-all">https://download.players2pay.com/terminal-latest.apk</a>
            <button
              onClick={() => setShowQR(false)}
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
