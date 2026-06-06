import { useState } from "react";
import { 
  Users, Plus, Trash2, Edit2, UserCheck, UserX,
  Search, Shield, AlertCircle, Save, X
} from "lucide-react";

interface Counterparty {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalAmount: number;
  lastOrderAt?: Date;
  isActive: boolean;
}

// Демо-данные
const demoCounterparties: Counterparty[] = [
  { id: "1", name: "Алексей Смирнов", email: "alexey@example.com", phone: "+7 999 123-45-67", totalOrders: 12, totalAmount: 125000, lastOrderAt: new Date(2026, 5, 5, 14, 30), isActive: true },
  { id: "2", name: "Мария Иванова", email: "maria@example.com", phone: "+7 999 234-56-78", totalOrders: 8, totalAmount: 67000, lastOrderAt: new Date(2026, 5, 4, 11, 15), isActive: true },
  { id: "3", name: "Дмитрий Петров", email: "dmitry@example.com", phone: "+7 999 345-67-89", totalOrders: 3, totalAmount: 23000, lastOrderAt: new Date(2026, 5, 2, 18, 0), isActive: false },
];

export default function Counterparties() {
  const [counterparties, setCounterparties] = useState<Counterparty[]>(demoCounterparties);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCounterparty, setEditingCounterparty] = useState<Counterparty | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const [dailyLimit, setDailyLimit] = useState(10);
  const [globalLimit, setGlobalLimit] = useState(50);

  const filteredCounterparties = counterparties.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleAdd = () => {
    setEditingCounterparty(null);
    setFormData({ name: "", email: "", phone: "" });
    setError("");
    setShowModal(true);
  };

  const handleEdit = (counterparty: Counterparty) => {
    setEditingCounterparty(counterparty);
    setFormData({
      name: counterparty.name,
      email: counterparty.email,
      phone: counterparty.phone
    });
    setError("");
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Удалить плательщика из белого списка?")) {
      setCounterparties(prev => prev.filter(c => c.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setCounterparties(prev => prev.map(c =>
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const saveCounterparty = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Заполните все поля");
      return;
    }

    if (editingCounterparty) {
      setCounterparties(prev => prev.map(c =>
        c.id === editingCounterparty.id
          ? { ...c, name: formData.name, email: formData.email, phone: formData.phone }
          : c
      ));
    } else {
      const newId = (Math.max(0, ...counterparties.map(c => parseInt(c.id))) + 1).toString();
      const newCounterparty: Counterparty = {
        id: newId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        totalOrders: 0,
        totalAmount: 0,
        isActive: true
      };
      setCounterparties(prev => [...prev, newCounterparty]);
    }

    setShowModal(false);
  };

  const formatDate = (date?: Date) => {
    if (!date) return "—";
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
            <Shield className="w-6 h-6 text-[#D4AF37]" />
            Контрагенты
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Белый список плательщиков. Только эти клиенты могут оплачивать заказы.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-bold hover:bg-[#c4a030] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить плательщика
        </button>
      </div>

      {/* Лимиты */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#0f0f0f] rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Дневной лимит контрагентов</p>
              <p className="text-2xl font-bold text-white">{dailyLimit}</p>
            </div>
            <button
              onClick={() => setDailyLimit(prompt("Новый дневной лимит:", dailyLimit.toString()) || dailyLimit)}
              className="p-2 rounded-lg bg-gray-800 text-[#D4AF37] hover:bg-gray-700"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="bg-[#0f0f0f] rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Глобальный лимит контрагентов</p>
              <p className="text-2xl font-bold text-white">{globalLimit}</p>
            </div>
            <button
              onClick={() => setGlobalLimit(prompt("Новый глобальный лимит:", globalLimit.toString()) || globalLimit)}
              className="p-2 rounded-lg bg-gray-800 text-[#D4AF37] hover:bg-gray-700"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по имени, email, телефону..."
          className="w-full pl-9 pr-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37]"
        />
      </div>

      {/* Список контрагентов */}
      <div className="space-y-3">
        {filteredCounterparties.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">Нет добавленных плательщиков</p>
            <button onClick={handleAdd} className="mt-2 text-[#D4AF37] text-sm">Добавить плательщика →</button>
          </div>
        ) : (
          filteredCounterparties.map((counterparty) => (
            <div key={counterparty.id} className="bg-[#0f0f0f] rounded-xl border border-gray-800 p-4 hover:border-[#D4AF37]/30 transition-all">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{counterparty.name}</h3>
                    <p className="text-gray-500 text-xs">{counterparty.email} • {counterparty.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(counterparty.id)}
                    className={`px-2 py-1 text-[10px] rounded ${counterparty.isActive ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}
                  >
                    {counterparty.isActive ? "Активен" : "Заблокирован"}
                  </button>
                  <button
                    onClick={() => handleEdit(counterparty)}
                    className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500 hover:text-[#D4AF37]" />
                  </button>
                  <button
                    onClick={() => handleDelete(counterparty.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs mt-3">
                <div className="bg-black/40 rounded-lg p-2">
                  <p className="text-gray-500">Всего заказов</p>
                  <p className="text-white font-mono">{counterparty.totalOrders}</p>
                </div>
                <div className="bg-black/40 rounded-lg p-2">
                  <p className="text-gray-500">Общая сумма</p>
                  <p className="text-white font-mono">{counterparty.totalAmount.toLocaleString()} ₽</p>
                </div>
                <div className="bg-black/40 rounded-lg p-2">
                  <p className="text-gray-500">Последний заказ</p>
                  <p className="text-white text-xs">{formatDate(counterparty.lastOrderAt)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Информация */}
      <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/50 rounded-xl">
        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-500 font-medium text-sm">Как это работает?</p>
          <p className="text-gray-400 text-sm">
            Платежи от клиентов, которых нет в белом списке, будут автоматически отклоняться. 
            Это помогает защититься от фрода и нежелательных транзакций.
          </p>
        </div>
      </div>

      {/* Модалка добавления/редактирования */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#0f0f0f] rounded-2xl p-6 w-full max-w-md border border-[#D4AF37]/20" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">
              {editingCounterparty ? "Редактировать плательщика" : "Добавить плательщика"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Имя / Название</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Иванов Иван"
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="client@example.com"
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Телефон</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+7 999 123-45-67"
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2 bg-gray-800 text-white rounded-lg">Отмена</button>
                <button onClick={saveCounterparty} className="flex-1 py-2 bg-[#D4AF37] text-black rounded-lg font-bold">Сохранить</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
