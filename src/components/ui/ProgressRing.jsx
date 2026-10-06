export default function ProgressRing({ value, size = 96, stroke = 9, label }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={label ?? `${value}% complete`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-stone-200 dark:stroke-night-700" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} className="stroke-moss-600 transition-[stroke-dashoffset] duration-500 dark:stroke-moss-500" />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-lg font-semibold">{value}%</span>
    </div>
  )
}
