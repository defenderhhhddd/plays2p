import { useEffect, useState } from "react";

interface Order {
  id: number;
  orderId: string;
  amount: number;
  cardLast4: string;
  cardBank: string;
  customerName: string | null;
  profit: number;
  profitPercent: number;
  status: "pending" | "confirmed" | "rejected";
}

export function ActiveOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const traderId = localStorage.getItem("traderId");
      const res = await fetch(`/api/traders/${traderId}/active-orders`);
      const data = await res.json();
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-800/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700">
        <div className="text-5xl mb-4">💤</div>
        <p className="text-gray-400">Нет активных платежей</p>
        <p className="text-gray-600 text-sm mt-1">Включите трафик, чтобы начать принимать заказы</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800 text-left text-gray-400 text-sm">
            <th className="pb-3">Сумма</th>
            <th className="pb-3">Карта</th>
            <th className="pb-3">ФИО</th>
            <th className="pb-3">Прибыль</th>
            <th className="pb-3">%</th>
            <th className="pb-3">Статус</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
              <td className="py-4 font-mono text-white">${order.amount.toFixed(2)}</td>
              <td className="py-4">
                <span className="text-sm">{order.cardBank}</span>
                <span className="text-gray-500 text-xs ml-2">**** {order.cardLast4}</span>
              </td>
              <td className="py-4 text-gray-300">{order.customerName || "—"}</td>
              <td className="py-4 text-green-500">${order.profit.toFixed(2)}</td>
              <td className="py-4 text-gray-400">{order.profitPercent}%</td>
              <td className="py-4">
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                  order.status === "pending" ? "bg-yellow-500/20 text-yellow-500" : "bg-green-500/20 text-green-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    order.status === "pending" ? "bg-yellow-500 animate-pulse" : "bg-green-500"
                  }`} />
                  {order.status === "pending" ? "Ожидание" : "Подтверждён"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
