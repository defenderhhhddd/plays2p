import { TrafficToggle } from "./TrafficToggle";
import { Bell, TrendingUp, HelpCircle } from "lucide-react";

interface TopNavProps {
  traderId: number;
  traderName: string;
  todayVolume: number;
  traderActive: boolean;
}

export function TopNav({ traderId, traderName, todayVolume, traderActive }: TopNavProps) {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#D4AF37] rounded-md shadow-md shadow-[#D4AF37]/30" />
        <span className="text-white font-bold tracking-wider font-mono">PLAYERS<span className="text-[#D4AF37]">2</span>PAY</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 px-4 py-1.5 bg-gray-900 rounded-full">
          <span className="text-sm text-gray-400">Трафик</span>
          <TrafficToggle traderId={traderId} />
          <span className={`text-xs ${traderActive ? "text-green-500" : "text-red-500"}`}>
            {traderActive ? "Активен" : "Остановлен"}
          </span>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">Оборот сегодня</div>
          <div className="text-white font-mono font-bold">${todayVolume.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors relative">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
          <HelpCircle className="w-5 h-5 text-gray-400" />
        </button>
        <div className="w-px h-6 bg-gray-800 mx-1" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B6914] flex items-center justify-center">
            <span className="text-black text-sm font-bold">{traderName[0]?.toUpperCase()}</span>
          </div>
          <span className="text-white text-sm hidden md:inline">{traderName}</span>
        </div>
      </div>
    </div>
  );
}
