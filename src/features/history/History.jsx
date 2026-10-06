import { useMemo, useState } from 'react'
import { useHabits } from '../../app/store'
import { formatLong, isFuture, monthKeys, parseKey, todayKey, weekday } from '../../lib/date'
import { isHabitScheduledForDate } from '../habits/utils/schedule'
import { completionIndex, isCompleted } from '../completions/utils/completions'

const HEAD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const STYLE = { all: 'bg-moss-600 text-white', some: 'bg-moss-100 text-moss-700 dark:bg-moss-700/40 dark:text-moss-100', none: 'bg-stone-100 text-stone-600 dark:bg-night-700 dark:text-stone-300', future: 'text-stone-400 dark:text-stone-600', empty: 'text-stone-500' }

export default function History() {
  const { state } = useHabits()
  const now = new Date()
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const [picked, setPicked] = useState(todayKey())
  const index = useMemo(() => completionIndex(state.completions), [state.completions])
  // History shows archived habits too, but only on days they were scheduled and (once archived) completed.
  const dayHabits = (key) => state.habits.filter((h) => isHabitScheduledForDate(h, key) && (!h.archived || isCompleted(index, h.id, key)))
  const keys = monthKeys(cursor.y, cursor.m)
  const pad = (weekday(keys[0]) + 6) % 7
  const status = (key) => {
    if (isFuture(key)) return 'future'
    const hs = dayHabits(key)
    if (!hs.length) return 'empty'
    const n = hs.filter((h) => isCompleted(index, h.id, key)).length
    return n === hs.length ? 'all' : n ? 'some' : 'none'
  }
  const shift = (n) => { const d = new Date(cursor.y, cursor.m + n, 1); setCursor({ y: d.getFullYear(), m: d.getMonth() }) }
  const pickedHabits = dayHabits(picked)
  const pickedDone = pickedHabits.filter((h) => isCompleted(index, h.id, picked)).length

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">History</h1>
      <section className="card">
        <div className="mb-3 flex items-center justify-between">
          <button className="btn btn-ghost" onClick={() => shift(-1)} aria-label="Previous month">‹</button>
          <h2 className="font-medium">{new Date(cursor.y, cursor.m, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2>
          <button className="btn btn-ghost" onClick={() => shift(1)} aria-label="Next month">›</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-stone-500">{HEAD.map((d) => <div key={d}>{d}</div>)}</div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {Array.from({ length: pad }, (_, i) => <div key={`p${i}`} />)}
          {keys.map((k) => {
            const s = status(k)
            return (
              <button key={k} onClick={() => setPicked(k)} aria-pressed={picked === k} aria-label={`${formatLong(k)}: ${s === 'all' ? 'all completed' : s === 'some' ? 'partly completed' : s === 'none' ? 'none completed' : s === 'future' ? 'upcoming' : 'nothing scheduled'}`}
                className={`aspect-square rounded-lg text-sm ${STYLE[s]} ${picked === k ? 'ring-2 ring-ink dark:ring-stone-100' : ''} ${k === todayKey() ? 'font-bold underline underline-offset-4' : ''}`}>
                {parseKey(k).getDate()}{s === 'all' && <span className="sr-only"> ✓</span>}
              </button>
            )
          })}
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
          <li><span className="mr-1 inline-block h-3 w-3 rounded bg-moss-600 align-middle" />All done</li>
          <li><span className="mr-1 inline-block h-3 w-3 rounded bg-moss-100 align-middle dark:bg-moss-700/40" />Some done</li>
          <li><span className="mr-1 inline-block h-3 w-3 rounded bg-stone-200 align-middle dark:bg-night-700" />None done</li>
          <li>Faded: upcoming</li>
        </ul>
      </section>
      <section className="card" aria-live="polite">
        <h2 className="font-display text-xl">{formatLong(picked)}</h2>
        {isFuture(picked) ? <p className="mt-2 text-sm text-stone-500">This day hasn’t happened yet.</p>
          : !pickedHabits.length ? <p className="mt-2 text-sm text-stone-500">No habits were scheduled this day.</p>
          : <>
            <p className="mb-3 text-sm text-stone-500">{pickedDone} / {pickedHabits.length} completed</p>
            <ul className="space-y-1.5">{pickedHabits.map((h) => { const ok = isCompleted(index, h.id, picked); return (
              <li key={h.id} className="flex items-center gap-2 text-sm"><span aria-hidden="true" className={ok ? 'text-moss-600' : 'text-stone-400'}>{ok ? '✓' : '✗'}</span><span className="sr-only">{ok ? 'Completed:' : 'Missed:'}</span>{h.icon} <span className="truncate">{h.name}</span>{h.archived && <span className="text-xs text-stone-500">(archived)</span>}</li>) })}</ul></>}
      </section>
    </div>
  )
}
