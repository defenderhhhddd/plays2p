import { useState } from "react";
import { 
  CreditCard, Smartphone, QrCode, Target, 
  Plus, Trash2, Edit2, Copy, CheckCircle, 
  XCircle, AlertCircle, Search, Wallet,
  Building, Phone, Globe, Zap, Clock, Timer,
  DollarSign, Calendar, Settings, ChevronDown, ChevronRight
} from "lucide-react";

interface Rekvizit {
  id: number;
  type: "card" | "sbp" | "mobile" | "collection";
  name: string;
  details: string;
  currency: "RUB" | "USDT" | "UZS" | "TJS";
  bank?: string;
  // Лимиты
  minAmount: number;
  maxAmount: number;
  dailyLimit: number;      // дневной лимит суммы
  usedDaily: number;       // использовано за день
  minuteLimit: number;     // платежей в минуту
  intervalMin: number;     // мин интервал между ордерами (сек)
  intervalMax: number;     // макс интервал между ордерами (сек)
  scheduleEnabled: boolean;
  scheduleStart: string;
  scheduleEnd: string;
  isActive: boolean;
  icon: string;
  // Доп. поля для разных типов
  cardNumber?: string;
  holderName?: string;
  phone?: string;
  collectionId?: string;
  operator?: string;
}

// Типы методов с иконками (единые для групп)
const methodTypes = [
  { value: "card", label: "Карты РФ", icon: "💳", color: "bg-blue-500/10", borderColor: "border-blue-500/30" },
  { value: "card_tj", label: "Карты Таджикистан", icon: "🇹🇯", color: "bg-red-500/10", borderColor: "border-red-500/30" },
  { value: "card_uz", label: "Карты Узбекистан", icon: "🇺🇿", color: "bg-green-500/10", borderColor: "border-green-500/30" },
  { value: "sbp", label: "СБП", icon: "🔵", color: "bg-blue-500/10", borderColor: "border-blue-500/30" },
  { value: "mobile", label: "Мобильная коммерция", icon: "📱", color: "bg-purple-500/10", borderColor: "border-purple-500/30" },
  { value: "collection", label: "Сбор", icon: "🎯", color: "bg-yellow-500/10", borderColor: "border-yellow-500/30" },
];

// Банки РФ
const russianBanks = [
  "Сбербанк", "Тинькофф", "Альфа-Банк", "ВТБ", "Газпромбанк",
  "Райффайзенбанк", "Россельхозбанк", "Открытие", "МКБ", "Совкомбанк",
  "Промсвязьбанк", "Почта Банк", "Юникредит", "Росбанк", "Хоум Кредит",
  "Банк Санкт-Петербург", "Абсолют Банк", "Азиатско-Тихоокеанский Банк",
  "Новикомбанк", "СДМ-Банк", "Уралсиб", "Зенит", "Транскапиталбанк",
  "МТС-Банк", "Ситибанк", "Кредит Европа", "Экспобанк", "Локо-Банк",
  "ДОМ.РФ", "РНКБ"
];

const tajikBanks = ["Амона", "Тоджик-Банк", "Эсхата", "Ориёнбанк", "Таджиксодиротбанк"];
const uzbekBanks = ["Humo", "Uzcard", "Kapitalbank", "Hamkorbank", "Ipak Yuli"];

const mobileOperators = [
  "МТС", "Билайн", "МегаФон", "Теле2", "Yota",
  "Билайн Таджикистан", "МегаФон Таджикистан", "Ucell (Узбекистан)"
];

export default function MyCards() {
  const [rekvizits, setRekvizits] = useState<Rekvizit[]>([
    { 
      id: 1, type: "card", name: "Тинькофф", details: "****4832", currency: "RUB", bank: "Тинькофф",
      minAmount: 100, maxAmount: 150000, dailyLimit: 1000000, usedDaily: 125000,
      minuteLimit: 5, intervalMin: 30, intervalMax: 60, scheduleEnabled: false,
      scheduleStart: "00:00", scheduleEnd: "23:59", isActive: true, icon: "💳",
      cardNumber: "4832", holderName: "IVAN IVANOV"
    },
    { 
      id: 2, type: "sbp", name: "СБП", details: "+7 999 123-45-67", currency: "RUB",
      minAmount: 10, maxAmount: 100000, dailyLimit: 500000, usedDaily: 50000,
      minuteLimit: 10, intervalMin: 15, intervalMax: 30, scheduleEnabled: false,
      scheduleStart: "00:00", scheduleEnd: "23:59", isActive: true, icon: "🔵",
      phone: "+7 999 123-45-67"
    },
    { 
      id: 3, type: "collection", name: "Сбор", details: "Сбор #12345", currency: "RUB",
      minAmount: 100, maxAmount: 50000, dailyLimit: 200000, usedDaily: 25000,
      minuteLimit: 20, intervalMin: 10, intervalMax: 20, scheduleEnabled: true,
      scheduleStart: "10:00", scheduleEnd: "20:00", isActive: true, icon: "🎯",
      collectionId: "12345"
    },
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: тип метода, 2: реквизиты, 3: лимиты и расписание

  // Новая форма
  const [newRekvizit, setNewRekvizit] = useState({
    type: "card",
    currency: "RUB",
    bank: "",
    phone: "",
    operator: "",
    cardNumber: "",
    holderName: "",
    collectionId: "",
    minAmount: 100,
    maxAmount: 100000,
    dailyLimit: 100000,
    minuteLimit: 5,
    intervalMin: 30,
    intervalMax: 60,
    scheduleEnabled: false,
    scheduleStart: "00:00",
    scheduleEnd: "23:59"
  });

  const handleAdd = () => {
    setShowModal(true);
    setStep(1);
    setError("");
  };

  const nextStep = () => {
    if (step === 1 && !selectedType) {
      setError("Выберите тип метода");
      return;
    }
    if (step === 2) {
      if (selectedType === "card" && (!newRekvizit.bank || !newRekvizit.cardNumber || !newRekvizit.holderName)) {
        setError("Заполните все поля карты");
        return;
      }
      if (selectedType === "sbp" && !newRekvizit.phone) {
        setError("Введите номер телефона");
        return;
      }
      if (selectedType === "mobile" && (!newRekvizit.operator || !newRekvizit.phone)) {
        setError("Выберите оператора и введите номер");
        return;
      }
      if (selectedType === "collection" && !newRekvizit.collectionId) {
        setError("Введите номер сбора");
        return;
      }
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
    setError("");
  };

  const saveRekvizit = () => {
    const newId = Math.max(0, ...rekvizits.map(r => r.id)) + 1;
    
    let details = "";
    let name = "";
    let icon = "";

    if (selectedType === "card") {
      name = newRekvizit.bank;
      details = `****${newRekvizit.cardNumber.slice(-4)}`;
      icon = "💳";
    } else if (selectedType === "sbp") {
      name = "СБП";
      details = newRekvizit.phone;
      icon = "🔵";
    } else if (selectedType === "collection") {
      name = "Сбор";
      details = `Сбор #${newRekvizit.collectionId}`;
      icon = "🎯";
    } else if (selectedType === "mobile") {
      name = newRekvizit.operator;
      details = newRekvizit.phone;
      icon = "📱";
    }

    const newItem: Rekvizit = {
      id: newId,
      type: selectedType as any,
      name,
      details,
      currency: newRekvizit.currency as any,
      minAmount: newRekvizit.minAmount,
      maxAmount: newRekvizit.maxAmount,
      dailyLimit: newRekvizit.dailyLimit,
      usedDaily: 0,
      minuteLimit: newRekvizit.minuteLimit,
      intervalMin: newRekvizit.intervalMin,
      intervalMax: newRekvizit.intervalMax,
      scheduleEnabled: newRekvizit.scheduleEnabled,
      scheduleStart: newRekvizit.scheduleStart,
      scheduleEnd: newRekvizit.scheduleEnd,
      isActive: true,
      icon,
      cardNumber: newRekvizit.cardNumber,
      holderName: newRekvizit.holderName,
      phone: newRekvizit.phone,
      collectionId: newRekvizit.collectionId,
      operator: newRekvizit.operator,
      bank: newRekvizit.bank
    };

    setRekvizits([...rekvizits, newItem]);
    setShowModal(false);
    setStep(1);
    setNewRekvizit({
      type: "card",
      currency: "RUB",
      bank: "",
      phone: "",
      operator: "",
      cardNumber: "",
      holderName: "",
      collectionId: "",
      minAmount: 100,
      maxAmount: 100000,
      dailyLimit: 100000,
      minuteLimit: 5,
      intervalMin: 30,
      intervalMax: 60,
      scheduleEnabled: false,
      scheduleStart: "00:00",
      scheduleEnd: "23:59"
    });
  };

  const toggleActive = (id: number) => {
    setRekvizits(rekvizits.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ));
  };

  const deleteRekvizit = (id: number) => {
    if (confirm("Удалить этот реквизит?")) {
      setRekvizits(rekvizits.filter(r => r.id !== id));
    }
  };

  const getUsagePercent = (used: number, total: number) => {
    return Math.min(100, (used / total) * 100);
  };

  const getTypeName = (type: string) => {
    const t = methodTypes.find(m => m.value === type);
    return t ? t.label : type;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono">Реквизиты</h1>
          <p className="text-gray-500 text-sm mt-1">Управление методами приёма платежей</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-bold hover:bg-[#c4a030] transition-colors">
          <Plus className="w-4 h-4" />
          Добавить реквизит
        </button>
      </div>

      <div className="space-y-3">
        {rekvizits.map((item) => (
          <div key={item.id} className={`bg-[#0f0f0f] rounded-xl border ${item.isActive ? 'border-[#D4AF37]/30' : 'border-gray-800'} p-4 transition-all hover:border-[#D4AF37]/50`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-white font-medium">{item.name}</h3>
                  <p className="text-gray-500 text-xs">{getTypeName(item.type)} • {item.details}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(item.id)} className={`px-2 py-1 text-[10px] rounded ${item.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {item.isActive ? "Активен" : "Неактивен"}
                </button>
                <button onClick={() => deleteRekvizit(item.id)} className="p-1 hover:bg-red-500/20 rounded transition-colors">
                  <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-3">
              <div className="bg-black/40 rounded-lg p-2">
                <p className="text-gray-500">Лимит суммы</p>
                <p className="text-white font-mono">{item.minAmount.toLocaleString()}₽ - {item.maxAmount.toLocaleString()}₽</p>
              </div>
              <div className="bg-black/40 rounded-lg p-2">
                <p className="text-gray-500">Дневной лимит</p>
                <p className="text-white font-mono">{item.dailyLimit.toLocaleString()}₽</p>
              </div>
              <div className="bg-black/40 rounded-lg p-2">
                <p className="text-gray-500">Платежей/мин</p>
                <p className="text-white font-mono">{item.minuteLimit}</p>
              </div>
              <div className="bg-black/40 rounded-lg p-2">
                <p className="text-gray-500">Интервал</p>
                <p className="text-white font-mono">{item.intervalMin}-{item.intervalMax} сек</p>
              </div>
            </div>

            {item.scheduleEnabled && (
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span>⏰ {item.scheduleStart} – {item.scheduleEnd}</span>
              </div>
            )}

            <div className="space-y-1">
              <div className="progress-bar h-2">
                <div className="progress-bar-fill h-full bg-[#D4AF37]" style={{ width: `${getUsagePercent(item.usedDaily, item.dailyLimit)}%` }} />
              </div>
              <p className="text-right text-[10px] text-gray-500">{getUsagePercent(item.usedDaily, item.dailyLimit).toFixed(0)}% дневного лимита использовано</p>
            </div>
          </div>
        ))}
      </div>

      {/* Модалка добавления (3 шага) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#0f0f0f] rounded-2xl p-6 w-full max-w-lg border border-[#D4AF37]/20 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Добавить реквизит</h2>
              <div className="flex gap-1">
                <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-[#D4AF37]' : 'bg-gray-600'}`} />
                <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-[#D4AF37]' : 'bg-gray-600'}`} />
                <div className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-[#D4AF37]' : 'bg-gray-600'}`} />
              </div>
            </div>

            {/* Шаг 1: Выбор типа метода */}
            {step === 1 && (
              <div>
                <p className="text-gray-400 text-sm mb-4">Выберите тип метода для приёма платежей</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {methodTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`p-4 rounded-xl text-center transition-all border ${selectedType === type.value ? `${type.color} border-[#D4AF37]` : 'bg-gray-800 border-gray-700'}`}
                    >
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <p className="text-white text-sm font-medium">{type.label}</p>
                    </button>
                  ))}
                </div>
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                <button onClick={nextStep} className="w-full py-3 bg-[#D4AF37] text-black rounded-lg font-bold">Далее →</button>
              </div>
            )}

            {/* Шаг 2: Реквизиты */}
            {step === 2 && (
              <div>
                <p className="text-gray-400 text-sm mb-4">Введите реквизиты для приёма платежей</p>
                
                {selectedType === "card" && (
                  <>
                    <div className="mb-3">
                      <label className="block text-sm text-gray-300 mb-1">Банк</label>
                      <select
                        value={newRekvizit.bank}
                        onChange={(e) => setNewRekvizit({ ...newRekvizit, bank: e.target.value })}
                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                      >
                        <option value="">Выберите банк</option>
                        {russianBanks.map(bank => <option key={bank}>{bank}</option>)}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm text-gray-300 mb-1">Номер карты</label>
                      <input
                        type="text"
                        value={newRekvizit.cardNumber}
                        onChange={(e) => setNewRekvizit({ ...newRekvizit, cardNumber: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white font-mono"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm text-gray-300 mb-1">Держатель</label>
                      <input
                        type="text"
                        value={newRekvizit.holderName}
                        onChange={(e) => setNewRekvizit({ ...newRekvizit, holderName: e.target.value })}
                        placeholder="IVAN IVANOV"
                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white uppercase"
                      />
                    </div>
                  </>
                )}

                {selectedType === "sbp" && (
                  <div className="mb-3">
                    <label className="block text-sm text-gray-300 mb-1">Номер телефона</label>
                    <input
                      type="tel"
                      value={newRekvizit.phone}
                      onChange={(e) => setNewRekvizit({ ...newRekvizit, phone: e.target.value })}
                      placeholder="+7 999 123-45-67"
                      className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                )}

                {selectedType === "mobile" && (
                  <>
                    <div className="mb-3">
                      <label className="block text-sm text-gray-300 mb-1">Оператор</label>
                      <select
                        value={newRekvizit.operator}
                        onChange={(e) => setNewRekvizit({ ...newRekvizit, operator: e.target.value })}
                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                      >
                        <option value="">Выберите оператора</option>
                        {mobileOperators.map(op => <option key={op}>{op}</option>)}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm text-gray-300 mb-1">Номер телефона</label>
                      <input
                        type="tel"
                        value={newRekvizit.phone}
                        onChange={(e) => setNewRekvizit({ ...newRekvizit, phone: e.target.value })}
                        placeholder="+7 999 123-45-67"
                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                      />
                    </div>
                  </>
                )}

                {selectedType === "collection" && (
                  <div className="mb-3">
                    <label className="block text-sm text-gray-300 mb-1">Номер сбора</label>
                    <input
                      type="text"
                      value={newRekvizit.collectionId}
                      onChange={(e) => setNewRekvizit({ ...newRekvizit, collectionId: e.target.value })}
                      placeholder="12345"
                      className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                    />
                    <p className="text-gray-500 text-xs mt-1">Мерчант переводит по номеру сбора, а не по карте</p>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm text-gray-300 mb-1">Валюта</label>
                  <select
                    value={newRekvizit.currency}
                    onChange={(e) => setNewRekvizit({ ...newRekvizit, currency: e.target.value })}
                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                  >
                    <option value="RUB">Рубли (RUB)</option>
                    <option value="USDT">USDT</option>
                    <option value="UZS">Узбекский сум (UZS)</option>
                    <option value="TJS">Таджикский сомони (TJS)</option>
                  </select>
                </div>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                <div className="flex gap-3">
                  <button onClick={prevStep} className="flex-1 py-2 bg-gray-800 text-white rounded-lg">Назад</button>
                  <button onClick={nextStep} className="flex-1 py-2 bg-[#D4AF37] text-black rounded-lg font-bold">Далее →</button>
                </div>
              </div>
            )}

            {/* Шаг 3: Лимиты и расписание */}
            {step === 3 && (
              <div>
                <p className="text-gray-400 text-sm mb-4">Настройте лимиты и расписание приёма</p>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Мин. сумма (₽)</label>
                    <input
                      type="number"
                      value={newRekvizit.minAmount}
                      onChange={(e) => setNewRekvizit({ ...newRekvizit, minAmount: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Макс. сумма (₽)</label>
                    <input
                      type="number"
                      value={newRekvizit.maxAmount}
                      onChange={(e) => setNewRekvizit({ ...newRekvizit, maxAmount: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Дневной лимит (₽)</label>
                    <input
                      type="number"
                      value={newRekvizit.dailyLimit}
                      onChange={(e) => setNewRekvizit({ ...newRekvizit, dailyLimit: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Платежей/мин</label>
                    <input
                      type="number"
                      value={newRekvizit.minuteLimit}
                      onChange={(e) => setNewRekvizit({ ...newRekvizit, minuteLimit: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Интервал (мин, сек)</label>
                    <input
                      type="number"
                      value={newRekvizit.intervalMin}
                      onChange={(e) => setNewRekvizit({ ...newRekvizit, intervalMin: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                      placeholder="мин"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Интервал (макс, сек)</label>
                    <input
                      type="number"
                      value={newRekvizit.intervalMax}
                      onChange={(e) => setNewRekvizit({ ...newRekvizit, intervalMax: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                      placeholder="макс"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3 p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-white text-sm">Использовать расписание</span>
                  <button
                    onClick={() => setNewRekvizit({ ...newRekvizit, scheduleEnabled: !newRekvizit.scheduleEnabled })}
                    className={`px-3 py-1 rounded text-sm ${newRekvizit.scheduleEnabled ? 'bg-[#D4AF37] text-black' : 'bg-gray-700 text-gray-400'}`}
                  >
                    {newRekvizit.scheduleEnabled ? "Вкл" : "Выкл"}
                  </button>
                </div>

                {newRekvizit.scheduleEnabled && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Время начала</label>
                      <input
                        type="time"
                        value={newRekvizit.scheduleStart}
                        onChange={(e) => setNewRekvizit({ ...newRekvizit, scheduleStart: e.target.value })}
                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Время окончания</label>
                      <input
                        type="time"
                        value={newRekvizit.scheduleEnd}
                        onChange={(e) => setNewRekvizit({ ...newRekvizit, scheduleEnd: e.target.value })}
                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                )}

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                <div className="flex gap-3">
                  <button onClick={prevStep} className="flex-1 py-2 bg-gray-800 text-white rounded-lg">Назад</button>
                  <button onClick={saveRekvizit} className="flex-1 py-2 bg-[#D4AF37] text-black rounded-lg font-bold">Сохранить</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
