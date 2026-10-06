import { weekday } from '../../../lib/date'
export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
// Single place that knows how frequencies work; add new frequency types here.
export function isHabitScheduledForDate(habit, key) {
  if (key < habit.createdAt) return false
  const { type, days } = habit.frequency
  if (type === 'daily') return true
  if (type === 'weekly') return (days || []).includes(weekday(key))
  return false
}
export const getHabitsForDate = (habits, key) => habits.filter((h) => !h.archived && isHabitScheduledForDate(h, key))
export const describeFrequency = (f) => f.type === 'daily' || f.days?.length === 7 ? 'Every day' : (f.days || []).slice().sort().map((d) => WEEKDAYS[d]).join(' · ')
