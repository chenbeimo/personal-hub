export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      {Icon && <Icon size={48} className="mb-4 opacity-50" />}
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-center">{description}</p>
      )}
    </div>
  );
}
