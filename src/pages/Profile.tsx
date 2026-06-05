import { AppLayout } from "@/components/AppLayout";
import { User } from "lucide-react";

export default function Profile() {
  const traderName = localStorage.getItem("traderName") || "Трейдер";
  const traderId = localStorage.getItem("traderId") || "—";

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white font-mono">Профиль</h1>
          <p className="text-gray-500 text-sm mt-1">Информация об аккаунте</p>
        </div>
        <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B6914] flex items-center justify-center flex-shrink-0">
            <span className="text-black text-2xl font-bold">{traderName[0]?.toUpperCase()}</span>
          </div>
          <div>
            <p className="text-white font-semibold text-lg">{traderName}</p>
            <p className="text-gray-500 text-sm">ID: {traderId}</p>
          </div>
        </div>
        <div className="mt-4 bg-[#0f0f0f] border border-gray-800 rounded-xl p-6">
          <p className="text-gray-500 text-sm flex items-center gap-2"><User className="w-4 h-4" /> Редактирование профиля — в разработке</p>
        </div>
      </div>
    </AppLayout>
  );
}
