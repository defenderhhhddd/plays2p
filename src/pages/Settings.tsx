import { AppLayout } from "@/components/AppLayout";

export default function Settings() {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white font-mono">Настройки</h1>
          <p className="text-gray-500 text-sm mt-1">Управление аккаунтом</p>
        </div>
        <div className="bg-[#0f0f0f] rounded-xl border border-gray-800 p-6">
          <p className="text-gray-500 text-sm">Настройки в разработке</p>
        </div>
      </div>
    </AppLayout>
  );
}
