interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

export function EmptyState({ icon = "📭", title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700">
      <div className="text-5xl mb-4">{icon}</div>
      <p className="text-white font-medium">{title}</p>
      {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
    </div>
  );
}
