import { useState } from "react";
import { X } from "lucide-react";

interface CardForm {
  cardNumber: string;
  holderName: string;
  bankName: string;
  minAmount: number;
  maxAmount: number;
  totalPaymentsLimit: number;
  paymentsPerMinute: number;
}

interface AddCardModalProps {
  onClose: () => void;
  onSave: (card: CardForm) => Promise<void>;
}

const empty: CardForm = {
  cardNumber: "",
  holderName: "",
  bankName: "",
  minAmount: 0,
  maxAmount: 100000,
  totalPaymentsLimit: 100,
  paymentsPerMinute: 5,
};

export function AddCardModal({ onClose, onSave }: AddCardModalProps) {
  const [form, setForm] = useState<CardForm>(empty);
  const [loading, setLoading] = useState(false);

  const set = (field: keyof CardForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.type === "number" ? Number(e.target.value) : e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#0f0f0f] border border-[#D4AF37]/20 rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">Подключить карту</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input required placeholder="Номер карты" value={form.cardNumber} onChange={set("cardNumber")}
            className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors" />
          <input required placeholder="Держатель карты" value={form.holderName} onChange={set("holderName")}
            className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors" />
          <input required placeholder="Банк" value={form.bankName} onChange={set("bankName")}
            className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors" />

          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Сумма от ($)" value={form.minAmount} onChange={set("minAmount")}
              className="p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition-colors" />
            <input type="number" placeholder="Сумма до ($)" value={form.maxAmount} onChange={set("maxAmount")}
              className="p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Всего платежей" value={form.totalPaymentsLimit} onChange={set("totalPaymentsLimit")}
              className="p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition-colors" />
            <input type="number" placeholder="В минуту" value={form.paymentsPerMinute} onChange={set("paymentsPerMinute")}
              className="p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition-colors" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full mt-2 py-3 bg-[#D4AF37] text-black rounded-lg font-bold hover:bg-[#c4a030] transition-all disabled:opacity-50">
            {loading ? "Сохранение..." : "Подключить"}
          </button>
        </form>
      </div>
    </div>
  );
}
