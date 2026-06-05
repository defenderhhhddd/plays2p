import { useEffect, useState } from "react";
import { ActiveOrdersTable } from "@/components/ActiveOrdersTable";
import { TopNav } from "@/components/TopNav";

interface Stats {
  today_volume: number;
  today_profit: number;
  today_count: number;
  balance: number;
  is_active: boolean;
}

export default function Dashboard() {
  const traderId = localStorage.getItem("traderId");
  const traderName = localStorage.getItem("traderName") || "Трейдер";
  const [stats, setStats] = useState<Stats>({
    today_volume: 0,
    today_profit: 0,
    today_count: 0,
    balance: 0,
    is_active: false,
  });

  useEffect(() => {
    if (!traderId) return;
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/traders/${traderId}/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {}
    };
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, [traderId]);

  return (
    <div className="min-h-screen bg-black">
      <TopNav
        traderId={Number(traderId)}
        traderName={traderName}
        todayVolume={Number(stats.today_volume)}
        traderActive={stats.is_active}
      />

      <div className="p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-xs mb-1">Оборот сегодня</p>
            <p className="text-white font-mono font-bold text-lg">${Number(stats.today_volume).toFixed(2)}</p>
          </div>
          <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-xs mb-1">Прибыль сегодня</p>
            <p className="text-green-400 font-mono font-bold text-lg">${Number(stats.today_profit).toFixed(2)}</p>
          </div>
          <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-xs mb-1">Заказов сегодня</p>
            <p className="text-white font-mono font-bold text-lg">{stats.today_count}</p>
          </div>
          <div className="bg-[#0f0f0f] border border-[#D4AF37]/20 rounded-xl p-4">
            <p className="text-gray-500 text-xs mb-1">Баланс</p>
            <p className="text-[#D4AF37] font-mono font-bold text-lg">${Number(stats.balance).toFixed(2)}</p>
          </div>
        </div>

        {/* Active orders */}
        <div>
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-white font-mono">Активные платежи</h1>
            <p className="text-gray-500 text-sm mt-1">Заказы, ожидающие подтверждения</p>
          </div>
          <ActiveOrdersTable />
        </div>
      </div>
    </div>
  );
}
