import { AppLayout } from "@/components/AppLayout";
import { EmptyState } from "@/components/EmptyState";

export default function Wallet() {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white font-mono">Кошелёк</h1>
          <p className="text-gray-500 text-sm mt-1">Управление балансом и выводом средств</p>
        </div>
        <EmptyState icon="💰" title="Кошелёк в разработке" description="Вывод средств и управление балансом скоро будут доступны" />
      </div>
    </AppLayout>
  );
}
