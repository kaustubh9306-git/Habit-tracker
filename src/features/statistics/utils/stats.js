import { addDays, daysBetween, monthKeys, todayKey } from '../../../lib/date'
import { isHabitScheduledForDate } from '../../habits/utils/schedule'
import { isCompleted } from '../../completions/utils/completions'

export const getScheduledDates = (habit, to = todayKey()) => daysBetween(habit.createdAt, to).filter((k) => isHabitScheduledForDate(habit, k))

// Streaks only look at scheduled days, so unscheduled days never break them.
export function calculateCurrentStreak(habit, index, today = todayKey()) {
  const dates = getScheduledDates(habit, today)
  let i = dates.length - 1
  if (i >= 0 && dates[i] === today && !isCompleted(index, habit.id, today)) i-- // today is still open
  let streak = 0
  for (; i >= 0 && isCompleted(index, habit.id, dates[i]); i--) streak++
  return streak
}
export function calculateLongestStreak(habit, index, today = todayKey()) {
  let best = 0, run = 0
  for (const d of getScheduledDates(habit, today)) {
    run = isCompleted(index, habit.id, d) ? run + 1 : 0
    best = Math.max(best, run)
  }
  return best
}
// Overall streak: consecutive days where every scheduled habit was done (days with nothing scheduled are skipped).
function overallDays(habits, index, today) {
  if (!habits.length) return []
  const start = habits.reduce((m, h) => (h.createdAt < m ? h.createdAt : m), today)
  return daysBetween(start, today).map((date) => {
    const due = habits.filter((h) => isHabitScheduledForDate(h, date))
    return { date, due: due.length, done: due.filter((h) => isCompleted(index, h.id, date)).length }
  }).filter((d) => d.due > 0)
}
export function calculateOverallStreaks(habits, index, today = todayKey()) {
  const days = overallDays(habits, index, today)
  let i = days.length - 1
  if (i >= 0 && days[i].date === today && days[i].done < days[i].due) i--
  let current = 0
  for (; i >= 0 && days[i].done === days[i].due; i--) current++
  let longest = 0, run = 0
  for (const d of days) { run = d.done === d.due ? run + 1 : 0; longest = Math.max(longest, run) }
  return { current, longest }
}
export function calculateCompletionRate(habits, index, dates) {
  let due = 0, done = 0
  for (const date of dates) for (const h of habits) if (isHabitScheduledForDate(h, date)) { due++; if (isCompleted(index, h.id, date)) done++ }
  return due ? Math.round((done / due) * 100) : null
}
export const getDayStats = (habits, index, dates) => dates.map((date) => ({ date, rate: calculateCompletionRate(habits, index, [date]) }))
export const getWeeklyStats = (habits, index, today = todayKey()) => getDayStats(habits, index, daysBetween(addDays(today, -6), today))
export const getMonthlyStats = (habits, index, year, month) => getDayStats(habits, index, monthKeys(year, month))
export const getHabitPerformance = (habits, index, days = 30, today = todayKey()) =>
  habits.map((h) => ({ id: h.id, name: h.name, rate: calculateCompletionRate([h], index, daysBetween(addDays(today, -(days - 1)), today)) ?? 0 }))
    .sort((a, b) => b.rate - a.rate)
