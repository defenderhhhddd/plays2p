import { AppLayout } from "@/components/AppLayout";
import { Shield, CheckCircle } from "lucide-react";

export default function Security() {
  return (
    <AppLayout>
      <div className="p-6 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white font-mono">Безопасность</h1>
          <p className="text-gray-500 text-sm mt-1">Защита вашего аккаунта</p>
        </div>
        <div className="space-y-4">
          {["Двухфакторная аутентификация", "Уведомления о входе", "Список доверенных устройств"].map((item) => (
            <div key={item} className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="text-white text-sm">{item}</span>
              </div>
              <span className="text-gray-600 text-xs">В разработке</span>
            </div>
          ))}
          <div className="bg-[#0f0f0f] border border-green-500/20 rounded-xl p-5 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-400 text-sm">Токен-аутентификация активна</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
