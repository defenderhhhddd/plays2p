import { useState } from "react";
import { Smartphone, Laptop, Tablet, Plus, Trash2, Power, Activity, Clock } from "lucide-react";

interface Device {
  id: string;
  name: string;
  type: "phone" | "tablet" | "other";
  model: string;
  os: string;
  lastActive: Date;
  registeredAt: Date;
  isActive: boolean;
  ipAddress?: string;
}

// Демо-данные
const demoDevices: Device[] = [
  {
    id: "1",
    name: "Samsung A115F",
    type: "phone",
    model: "Samsung Galaxy A12",
    os: "Android 12",
    lastActive: new Date(2026, 5, 6, 14, 30),
    registeredAt: new Date(2026, 5, 20, 18, 32),
    isActive: true,
    ipAddress: "192.168.1.100",
  },
  {
    id: "2",
    name: "Xiaomi Pad 5",
    type: "tablet",
    model: "Xiaomi Pad 5",
    os: "Android 13",
    lastActive: new Date(2026, 5, 5, 22, 15),
    registeredAt: new Date(2026, 5, 25, 10, 0),
    isActive: false,
    ipAddress: "192.168.1.101",
  },
];

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>(demoDevices);
  const [showModal, setShowModal] = useState(false);
  const [newDevice, setNewDevice] = useState({ name: "", model: "", os: "", type: "phone" as const });
  const [error, setError] = useState("");

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.model) {
      setError("Заполните название и модель");
      return;
    }
    
    const newId = (Math.max(0, ...devices.map(d => parseInt(d.id))) + 1).toString();
    const device: Device = {
      id: newId,
      name: newDevice.name,
      type: newDevice.type,
      model: newDevice.model,
      os: newDevice.os || "Неизвестно",
      lastActive: new Date(),
      registeredAt: new Date(),
      isActive: true,
    };
    
    setDevices([...devices, device]);
    setShowModal(false);
    setNewDevice({ name: "", model: "", os: "", type: "phone" });
    setError("");
  };

  const toggleActive = (id: string) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d));
  };

  const deleteDevice = (id: string) => {
    if (confirm("Удалить устройство? Отключить автоподтверждение?")) {
      setDevices(prev => prev.filter(d => d.id !== id));
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

  const getDeviceIcon = (type: string) => {
    switch(type) {
      case "phone": return <Smartphone className="w-5 h-5" />;
      case "tablet": return <Tablet className="w-5 h-5" />;
      default: return <Laptop className="w-5 h-5" />;
    }
  };

  const getActiveStatus = (isActive: boolean, lastActive: Date) => {
    const now = new Date();
    const diff = now.getTime() - lastActive.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (!isActive) return { text: "Отключено", color: "text-red-500", bg: "bg-red-500/20" };
    if (minutes < 5) return { text: "Онлайн", color: "text-green-500", bg: "bg-green-500/20" };
    if (minutes < 60) return { text: "Был недавно", color: "text-yellow-500", bg: "bg-yellow-500/20" };
    return { text: "Давно не подключался", color: "text-gray-500", bg: "bg-gray-500/20" };
  };

  return (
    <div className="space-y-6 p-6">
      {/* Заголовок */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-[#D4AF37]" />
            Устройства
          </h1>
          <p className="text-gray-500 text-sm mt-1">Управление устройствами для автоподтверждения платежей</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-bold hover:bg-[#c4a030] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить устройство
        </button>
      </div>

      {/* Инструкция */}
      <div className="bg-[#0f0f0f] rounded-xl border border-gray-800 p-4">
        <h3 className="text-white font-medium mb-2">📱 Как подключить устройство?</h3>
        <ol className="text-gray-400 text-sm space-y-1 list-decimal list-inside">
          <li>Установите приложение PLAYERS2PAY Terminal на Android-устройство</li>
          <li>Откройте приложение и войдите по токену</li>
          <li>Устройство автоматически появится в этом списке</li>
          <li>Включите доступ к уведомлениям для автоподтверждения</li>
        </ol>
      </div>

      {/* Список устройств */}
      <div className="space-y-4">
        {devices.length === 0 ? (
          <div className="text-center py-12">
            <Smartphone className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">Нет добавленных устройств</p>
            <button onClick={() => setShowModal(true)} className="mt-2 text-[#D4AF37] text-sm">Добавить устройство →</button>
          </div>
        ) : (
          devices.map((device) => {
            const status = getActiveStatus(device.isActive, device.lastActive);
            return (
              <div key={device.id} className="bg-[#0f0f0f] rounded-xl border border-gray-800 p-4 hover:border-[#D4AF37]/30 transition-all">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{device.name}</h3>
                      <p className="text-gray-500 text-xs">{device.model} • {device.os}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 text-[10px] rounded ${status.bg} ${status.color}`}>
                      {status.text}
                    </div>
                    <button
                      onClick={() => toggleActive(device.id)}
                      className={`p-1.5 rounded-lg transition-colors ${device.isActive ? "text-green-500 hover:bg-green-500/20" : "text-gray-500 hover:bg-gray-700"}`}
                      title={device.isActive ? "Отключить" : "Включить"}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteDevice(device.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-black/40 rounded-lg p-2">
                    <p className="text-gray-500">ID устройства</p>
                    <p className="text-white font-mono text-xs break-all">{device.id}</p>
                  </div>
                  <div className="bg-black/40 rounded-lg p-2">
                    <p className="text-gray-500">Зарегистрировано</p>
                    <p className="text-white">{formatDate(device.registeredAt)}</p>
                  </div>
                  <div className="bg-black/40 rounded-lg p-2">
                    <p className="text-gray-500">Последняя активность</p>
                    <p className="text-white">{formatDate(device.lastActive)}</p>
                  </div>
                  {device.ipAddress && (
                    <div className="bg-black/40 rounded-lg p-2">
                      <p className="text-gray-500">IP-адрес</p>
                      <p className="text-white">{device.ipAddress}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Модалка добавления устройства */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#0f0f0f] rounded-2xl p-6 w-full max-w-md border border-[#D4AF37]/20" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">Добавить устройство</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Тип устройства</label>
                <div className="flex gap-2">
                  {[
                    { value: "phone", label: "Телефон", icon: <Smartphone className="w-4 h-4" /> },
                    { value: "tablet", label: "Планшет", icon: <Tablet className="w-4 h-4" /> },
                    { value: "other", label: "Другое", icon: <Laptop className="w-4 h-4" /> },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setNewDevice({ ...newDevice, type: type.value as any })}
                      className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-all ${newDevice.type === type.value ? "bg-[#D4AF37] text-black" : "bg-gray-800 text-gray-400"}`}
                    >
                      {type.icon}
                      <span className="text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Название устройства</label>
                <input
                  type="text"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  placeholder="Samsung A115F"
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Модель</label>
                <input
                  type="text"
                  value={newDevice.model}
                  onChange={(e) => setNewDevice({ ...newDevice, model: e.target.value })}
                  placeholder="Samsung Galaxy A12"
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">ОС (необязательно)</label>
                <input
                  type="text"
                  value={newDevice.os}
                  onChange={(e) => setNewDevice({ ...newDevice, os: e.target.value })}
                  placeholder="Android 12"
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2 bg-gray-800 text-white rounded-lg">Отмена</button>
                <button onClick={handleAddDevice} className="flex-1 py-2 bg-[#D4AF37] text-black rounded-lg font-bold">Добавить</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
