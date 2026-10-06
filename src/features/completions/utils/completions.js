// Completion records are indexed as a Set of "habitId|date" keys for fast, duplicate-safe lookups.
export const completionIndex = (completions) => new Set(completions.filter((c) => c.completed).map((c) => `${c.habitId}|${c.date}`))
export const isCompleted = (index, habitId, date) => index.has(`${habitId}|${date}`)
export const getCompletedCount = (habits, index, date) => habits.filter((h) => isCompleted(index, h.id, date)).length
