import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";

interface CardSettings {
  cardNumber: string;
  holderName: string;
  bankName: string;
  minAmount: number;
  maxAmount: number;
  totalPaymentsLimit: number;
  paymentsPerMinute: number;
}

export default function MyCards() {
  const [cards, setCards] = useState<CardSettings[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newCard, setNewCard] = useState<CardSettings>({
    cardNumber: "",
    holderName: "",
    bankName: "",
    minAmount: 0,
    maxAmount: 0,
    totalPaymentsLimit: 0,
    paymentsPerMinute: 0,
  });

  const handleAddCard = async () => {
    const traderId = localStorage.getItem("traderId");
    const res = await fetch("/api/traders/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newCard, traderId: Number(traderId) }),
    });
    if (res.ok) {
      setCards([...cards, newCard]);
      setShowForm(false);
      setNewCard({
        cardNumber: "",
        holderName: "",
        bankName: "",
        minAmount: 0,
        maxAmount: 0,
        totalPaymentsLimit: 0,
        paymentsPerMinute: 0,
      });
    }
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white font-mono">Мои карты</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-medium hover:bg-[#c4a030] transition-all"
          >
            + Добавить карту
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
            <div className="bg-[#0f0f0f] border border-[#D4AF37]/20 rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-white mb-4">Подключить карту</h2>
              <div className="space-y-3">
                <input placeholder="Номер карты" className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white" onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })} />
                <input placeholder="Держатель" className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white" onChange={(e) => setNewCard({ ...newCard, holderName: e.target.value })} />
                <input placeholder="Банк" className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white" onChange={(e) => setNewCard({ ...newCard, bankName: e.target.value })} />
                
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Сумма от" className="p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white" onChange={(e) => setNewCard({ ...newCard, minAmount: Number(e.target.value) })} />
                  <input type="number" placeholder="Сумма до" className="p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white" onChange={(e) => setNewCard({ ...newCard, maxAmount: Number(e.target.value) })} />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Всего платежей" className="p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white" onChange={(e) => setNewCard({ ...newCard, totalPaymentsLimit: Number(e.target.value) })} />
                  <input type="number" placeholder="Платежей в минуту" className="p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white" onChange={(e) => setNewCard({ ...newCard, paymentsPerMinute: Number(e.target.value) })} />
                </div>

                <button onClick={handleAddCard} className="w-full mt-4 py-3 bg-[#D4AF37] text-black rounded-lg font-bold">Подключить</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {cards.length === 0 && (
            <div className="text-center py-16 text-gray-500">Нет подключённых карт. Нажмите «Добавить карту»</div>
          )}
          {cards.map((card, idx) => (
            <div key={idx} className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-white font-mono text-lg">**** {card.cardNumber.slice(-4)}</div>
                  <div className="text-gray-400 text-sm">{card.holderName} • {card.bankName}</div>
                  <div className="flex gap-3 mt-3 text-xs text-gray-500">
                    <span>💰 {card.minAmount} – {card.maxAmount} ₽</span>
                    <span>📦 {card.totalPaymentsLimit} платежей</span>
                    <span>⚡ {card.paymentsPerMinute}/мин</span>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
