import { useState } from 'react'
import { COLORS } from '../utils/options'
import { describeFrequency } from '../utils/schedule'

export default function HabitCard({ habit, done, readOnly, onToggle, onEdit, onArchive, onDelete }) {
  const [justDone, setJustDone] = useState(false)
  const hex = COLORS[habit.color] || COLORS.green
  const toggle = () => { if (!done) setJustDone(true); onToggle(habit) }
  return (
    <li className="card flex items-center gap-3 !p-4">
      <button onClick={toggle} disabled={readOnly} role="checkbox" aria-checked={done} aria-label={`${habit.name}: ${done ? 'completed' : 'not completed'}`}
        style={done ? { background: hex, borderColor: hex } : { borderColor: hex }}
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 text-white disabled:opacity-40 ${justDone && done ? 'pop' : ''}`}>
        {done && <span aria-hidden="true">✓</span>}
      </button>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xl" style={{ background: `${hex}22` }} aria-hidden="true">{habit.icon}</span>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-medium ${done ? 'text-stone-500 line-through dark:text-stone-400' : ''}`} title={habit.name}>{habit.name}</p>
        <p className="truncate text-xs text-stone-500 dark:text-stone-400">
          {[habit.goal && `${habit.goal.value} ${habit.goal.unit}`.trim(), describeFrequency(habit.frequency)].filter(Boolean).join(' · ')}
        </p>
      </div>
      <details className="relative">
        <summary className="btn btn-ghost cursor-pointer list-none !px-2" aria-label={`Actions for ${habit.name}`}>⋯</summary>
        <div className="absolute right-0 z-10 mt-1 w-36 rounded-lg border border-stone-200 bg-white p-1 shadow-lg dark:border-night-700 dark:bg-night-800">
          {[['Edit', onEdit], ['Archive', onArchive], ['Delete…', onDelete]].map(([l, fn]) => (
            <button key={l} className="btn btn-ghost w-full !justify-start" onClick={(e) => { e.currentTarget.closest('details').open = false; fn(habit) }}>{l}</button>
          ))}
        </div>
      </details>
    </li>
  )
}
