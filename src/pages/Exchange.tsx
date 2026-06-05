import { AppLayout } from "@/components/AppLayout";
import { EmptyState } from "@/components/EmptyState";

export default function Exchange() {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white font-mono">Обмен</h1>
          <p className="text-gray-500 text-sm mt-1">Конвертация валют</p>
        </div>
        <EmptyState icon="🌐" title="Обмен в разработке" description="Функция обмена валют скоро будет доступна" />
      </div>
    </AppLayout>
  );
}
