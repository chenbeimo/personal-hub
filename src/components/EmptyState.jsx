export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      {Icon && (
        <div className="mb-4 animate-breathe hover:animate-none hover:rotate-12 transition-transform duration-300 cursor-pointer">
          <Icon size={48} className="opacity-50" />
        </div>
      )}
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-center">{description}</p>
      )}
    </div>
  );
}
