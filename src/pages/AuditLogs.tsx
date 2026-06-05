import { AppLayout } from "@/components/AppLayout";
import { EmptyState } from "@/components/EmptyState";

export default function AuditLogs() {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white font-mono">Логи аудита</h1>
          <p className="text-gray-500 text-sm mt-1">История всех действий в аккаунте</p>
        </div>
        <EmptyState icon="📋" title="Логи пусты" description="Все действия будут записаны здесь" />
      </div>
    </AppLayout>
  );
}
