export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink-200 py-14 text-center dark:border-ink-700">
      {Icon && (
        <div className="mb-3 rounded-full bg-ink-100 p-3 text-ink-400 dark:bg-ink-800">
          <Icon size={22} />
        </div>
      )}
      <p className="font-display text-base font-semibold text-ink-900 dark:text-ink-50">
        {title}
      </p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-400">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
