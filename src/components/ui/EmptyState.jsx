export default function EmptyState({ title, text, action }) {
  return (
    <div className="card flex flex-col items-center gap-2 py-12 text-center">
      <div className="text-4xl" aria-hidden="true">🌱</div>
      <h3 className="font-display text-lg">{title}</h3>
      <p className="max-w-xs text-sm text-stone-500 dark:text-stone-400">{text}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
