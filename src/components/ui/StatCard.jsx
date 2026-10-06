export default function StatCard({ label, value, hint }) {
  return (
    <div className="card !p-4">
      <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
      <p className="mt-1 font-display text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{hint}</p>}
    </div>
  )
}
