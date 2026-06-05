import { AppLayout } from "@/components/AppLayout";
import { Key, Copy } from "lucide-react";

export default function ApiKeys() {
  const token = localStorage.getItem("traderToken") || "";

  const handleCopy = () => navigator.clipboard.writeText(token);

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white font-mono">API ключи</h1>
          <p className="text-gray-500 text-sm mt-1">Ваши ключи доступа к системе</p>
        </div>
        <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Токен трейдера</p>
          <div className="flex items-center gap-3 bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-lg px-4 py-3">
            <Key className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
            <span className="font-mono text-sm text-gray-300 flex-1 truncate">{token || "—"}</span>
            <button onClick={handleCopy} className="text-gray-500 hover:text-white transition-colors flex-shrink-0">
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-600 text-xs mt-3">Храните токен в безопасном месте. Никому не передавайте.</p>
        </div>
      </div>
    </AppLayout>
  );
}
