import { useState } from "react";
import { Bell, CheckCircle, AlertCircle, Info, XCircle, Volume2, VolumeX, Trash2, Eye } from "lucide-react";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  link?: string;
}

// Демо-данные
const demoNotifications: Notification[] = [
  { id: "1", type: "success", title: "Платёж получен", message: "Поступил платёж 15 000 ₽ на карту Тинькофф ****4832", createdAt: new Date(2026, 5, 6, 14, 35), read: false },
  { id: "2", type: "warning", title: "Новая апелляция", message: "Клиент Алексей Смирнов открыл спор по заказу P2P-ABC123", createdAt: new Date(2026, 5, 6, 14, 30), read: false },
  { id: "3", type: "info", title: "Карта добавлена", message: "Карта Сбербанк ****9012 успешно добавлена", createdAt: new Date(2026, 5, 5, 12, 0), read: true },
  { id: "4", type: "error", title: "Спор проигран", message: "Спор по заказу P2P-DEF456 решён в пользу клиента. Сумма 8 500 ₽ списана с баланса.", createdAt: new Date(2026, 5, 5, 10, 15), read: true },
  { id: "5", type: "success", title: "Вывод средств", message: "Заявка на вывод 10 000 ₽ создана", createdAt: new Date(2026, 5, 4, 18, 30), read: true },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [period, setPeriod] = useState<"today" | "yesterday" | "week" | "lastWeek">("today");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const filterByPeriod = (notification: Notification) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 7);
    const lastWeekStart = new Date(weekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    switch(period) {
      case "today": return notification.createdAt >= today;
      case "yesterday": return notification.createdAt >= yesterday && notification.createdAt < today;
      case "week": return notification.createdAt >= weekStart;
      case "lastWeek": return notification.createdAt >= lastWeekStart && notification.createdAt < weekStart;
      default: return true;
    }
  };

  const filteredNotifications = notifications
    .filter(n => filter === "all" ? true : filter === "unread" ? !n.read : n.read)
    .filter(n => filterByPeriod(n));

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "success": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning": return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "error": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeBg = (type: string) => {
    switch(type) {
      case "success": return "bg-green-500/10 border-green-500/30";
      case "warning": return "bg-yellow-500/10 border-yellow-500/30";
      case "error": return "bg-red-500/10 border-red-500/30";
      default: return "bg-blue-500/10 border-blue-500/30";
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Только что";
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    return `${days} д назад`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 p-6">
      {/* Заголовок */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#D4AF37]" />
            Уведомления и СМС
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount} новых
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-1">История уведомлений и системных сообщений</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition-colors ${soundEnabled ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "bg-gray-800 text-gray-500"}`}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg text-sm hover:bg-[#D4AF37]/30 transition-colors"
            >
              Прочитать всё
            </button>
          )}
        </div>
      </div>

      {/* Фильтры */}
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
        <div className="flex gap-2">
          {[
            { value: "all", label: "Все" },
            { value: "unread", label: "Непрочитанные" },
            { value: "read", label: "Прочитанные" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as any)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${filter === f.value ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Список уведомлений */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">Нет уведомлений за выбранный период</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-xl border transition-all ${getTypeBg(notification.type)} ${!notification.read ? "border-l-4 border-l-[#D4AF37]" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {getTypeIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-medium ${!notification.read ? "text-white" : "text-gray-300"}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                      title="Отметить как прочитанное"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Информация о СМС-уведомлениях */}
      <div className="bg-[#0f0f0f] rounded-xl border border-gray-800 p-4">
        <h3 className="text-white font-medium mb-2">📱 СМС-уведомления</h3>
        <p className="text-gray-400 text-sm">
          Вы можете настроить получение СМС-уведомлений о новых платежах, апелляциях и изменениях баланса.
          Для этого укажите номер телефона в разделе <span className="text-[#D4AF37]">Профиль → Уведомления</span>.
        </p>
      </div>
    </div>
  );
}
