import { addDays, todayKey } from '../lib/date'
const DAYS_BACK = 24
export function createSeedData() {
  const start = addDays(todayKey(), -DAYS_BACK)
  const mk = (id, name, description, icon, color, frequency, goal, skipEvery) => ({ id, name, description, icon, color, frequency, goal, createdAt: start, archived: false, skipEvery })
  const defs = [
    mk('h1', 'Exercise', '30 minutes of exercise', '🏃', 'blue', { type: 'weekly', days: [1, 3, 5, 6] }, { value: 30, unit: 'minutes' }, 9),
    mk('h2', 'Reading', 'Read before bed', '📖', 'amber', { type: 'daily' }, { value: 20, unit: 'pages' }, 6),
    mk('h3', 'Meditation', '', '🧘', 'violet', { type: 'daily' }, { value: 10, unit: 'minutes' }, 5),
    mk('h4', 'Drink Water', '', '💧', 'teal', { type: 'daily' }, { value: 8, unit: 'glasses' }, 11),
  ]
  const habits = defs.map(({ skipEvery, ...h }) => h)
  const completions = []
  defs.forEach((h, hi) => { for (let n = 0; n < DAYS_BACK; n++) { const date = addDays(start, n); if ((n * 7 + hi * 3) % h.skipEvery !== 0) completions.push({ id: `${h.id}-${date}`, habitId: h.id, date, completed: true }) } })
  return { habits, completions }
}
