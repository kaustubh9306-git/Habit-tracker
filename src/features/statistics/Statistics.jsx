import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useHabits } from '../../app/store'
import { monthKeys, parseKey, todayKey } from '../../lib/date'
import { getHabitsForDate } from '../habits/utils/schedule'
import { completionIndex, getCompletedCount } from '../completions/utils/completions'
import { calculateCompletionRate, calculateCurrentStreak, calculateLongestStreak, calculateOverallStreaks, getHabitPerformance, getMonthlyStats, getWeeklyStats } from './utils/stats'
import StatCard from '../../components/ui/StatCard'
import EmptyState from '../../components/ui/EmptyState'

const AXIS = { fontSize: 12, fill: '#78716c' }
const Chart = ({ title, children }) => <section className="card"><h2 className="mb-3 font-medium">{title}</h2><div className="h-56">{children}</div></section>

export default function Statistics() {
  const { state } = useHabits()
  const index = useMemo(() => completionIndex(state.completions), [state.completions])
  const active = useMemo(() => state.habits.filter((h) => !h.archived), [state.habits])
  const s = useMemo(() => {
    const today = todayKey(), now = new Date()
    const dueToday = getHabitsForDate(active, today)
    const best = active.reduce((m, h) => Math.max(m, calculateLongestStreak(h, index)), 0)
    const label = (k) => parseKey(k).toLocaleDateString(undefined, { weekday: 'short' })
    return {
      dueToday, doneToday: getCompletedCount(dueToday, index, today),
      overall: calculateOverallStreaks(active, index), best,
      rate: calculateCompletionRate(active, index, monthKeys(now.getFullYear(), now.getMonth()).filter((k) => k <= today)),
      weekly: getWeeklyStats(active, index).map((d) => ({ name: label(d.date), rate: d.rate ?? 0 })),
      monthly: getMonthlyStats(active, index, now.getFullYear(), now.getMonth()).filter((d) => d.date <= today).map((d) => ({ name: String(parseKey(d.date).getDate()), rate: d.rate ?? 0 })),
      perf: getHabitPerformance(active, index),
      streaks: active.map((h) => ({ h, cur: calculateCurrentStreak(h, index), best: calculateLongestStreak(h, index) })),
    }
  }, [active, index])

  if (!active.length) return <div className="space-y-6"><h1 className="font-display text-3xl">Statistics</h1><EmptyState title="No data yet" text="Create a habit and complete it a few times to see your stats." /></div>
  const tip = { formatter: (v) => `${v}%`, contentStyle: { borderRadius: 8, fontSize: 12 } }
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Statistics</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Active habits" value={active.length} />
        <StatCard label="Done today" value={`${s.doneToday}/${s.dueToday.length}`} />
        <StatCard label="Current streak" value={`${s.overall.current}d`} hint="Days with every habit done" />
        <StatCard label="Longest streak" value={`${Math.max(s.overall.longest, 0)}d`} hint={`Best single habit: ${s.best}d`} />
        <StatCard label="This month" value={s.rate == null ? '–' : `${s.rate}%`} hint="Scheduled habits completed" />
      </div>
      <Chart title="Last 7 days">
        <ResponsiveContainer><BarChart data={s.weekly}><CartesianGrid vertical={false} strokeOpacity={0.2} /><XAxis dataKey="name" tick={AXIS} /><YAxis domain={[0, 100]} tick={AXIS} unit="%" width={44} /><Tooltip {...tip} /><Bar dataKey="rate" fill="#2f6f5a" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
      </Chart>
      <Chart title="This month">
        <ResponsiveContainer><LineChart data={s.monthly}><CartesianGrid vertical={false} strokeOpacity={0.2} /><XAxis dataKey="name" tick={AXIS} /><YAxis domain={[0, 100]} tick={AXIS} unit="%" width={44} /><Tooltip {...tip} /><Line dataKey="rate" stroke="#2f6f5a" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer>
      </Chart>
      <section className="card">
        <h2 className="mb-3 font-medium">Habit performance <span className="text-sm font-normal text-stone-500">(last 30 days)</span></h2>
        <ul className="space-y-3">{s.perf.map((p) => (
          <li key={p.id}><div className="mb-1 flex justify-between text-sm"><span className="truncate">{p.name}</span><span>{p.rate}%</span></div>
            <div className="h-2 rounded-full bg-stone-200 dark:bg-night-700" role="progressbar" aria-valuenow={p.rate} aria-valuemin={0} aria-valuemax={100} aria-label={p.name}><div className="h-2 rounded-full bg-moss-600" style={{ width: `${p.rate}%` }} /></div></li>))}</ul>
      </section>
      <section className="card">
        <h2 className="mb-3 font-medium">Streaks by habit</h2>
        <ul className="divide-y divide-stone-200 text-sm dark:divide-night-700">{s.streaks.map(({ h, cur, best }) => (
          <li key={h.id} className="flex justify-between py-2"><span className="truncate">{h.icon} {h.name}</span><span className="text-stone-500">Current {cur} · Best {best}</span></li>))}</ul>
      </section>
    </div>
  )
}
