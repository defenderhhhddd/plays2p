import { AppLayout } from "@/components/AppLayout";
import { EmptyState } from "@/components/EmptyState";

export default function History() {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white font-mono">История платежей</h1>
          <p className="text-gray-500 text-sm mt-1">Все завершённые транзакции</p>
        </div>
        <EmptyState icon="📋" title="История пуста" description="Здесь появятся завершённые транзакции" />
      </div>
    </AppLayout>
  );
}
