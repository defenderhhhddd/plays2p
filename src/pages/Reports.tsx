import { AppLayout } from "@/components/AppLayout";
import { EmptyState } from "@/components/EmptyState";

export default function Reports() {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white font-mono">Отчёты</h1>
          <p className="text-gray-500 text-sm mt-1">Финансовые отчёты и аналитика</p>
        </div>
        <EmptyState icon="📊" title="Отчёты в разработке" description="Здесь появятся детальные финансовые отчёты" />
      </div>
    </AppLayout>
  );
}
