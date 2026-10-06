import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { isValidKey, todayKey } from '../lib/date'
import { createSeedData } from './seed'
import { loadJSON, saveJSON } from '../hooks/useLocalStorage'

const KEY = 'tally.data'
export const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`)

export function validateData(d) {
  return Boolean(d && typeof d === 'object' && Array.isArray(d.habits) && Array.isArray(d.completions) &&
    d.habits.every((h) => h && typeof h.id === 'string' && typeof h.name === 'string' && h.frequency && ['daily', 'weekly'].includes(h.frequency.type) && isValidKey(h.createdAt)) &&
    d.completions.every((c) => c && typeof c.habitId === 'string' && isValidKey(c.date)))
}
const dedupe = (cs) => { const m = new Map(); cs.forEach((c) => m.set(`${c.habitId}|${c.date}`, { id: c.id || uid(), habitId: c.habitId, date: c.date, completed: c.completed !== false })); return [...m.values()] }

export function reducer(state, a) {
  switch (a.type) {
    case 'ADD_HABIT': return { ...state, habits: [...state.habits, a.habit] }
    case 'UPDATE_HABIT': return { ...state, habits: state.habits.map((h) => (h.id === a.id ? { ...h, ...a.changes } : h)) }
    case 'ARCHIVE_HABIT': return { ...state, habits: state.habits.map((h) => (h.id === a.id ? { ...h, archived: a.archived ?? true } : h)) }
    case 'DELETE_HABIT': return { ...state, habits: state.habits.filter((h) => h.id !== a.id), completions: state.completions.filter((c) => c.habitId !== a.id) }
    case 'TOGGLE_COMPLETION': {
      const exists = state.completions.some((c) => c.habitId === a.habitId && c.date === a.date && c.completed)
      const rest = state.completions.filter((c) => !(c.habitId === a.habitId && c.date === a.date))
      return { ...state, completions: exists ? rest : [...rest, { id: uid(), habitId: a.habitId, date: a.date, completed: true }] }
    }
    case 'SET_SELECTED_DATE': return { ...state, selectedDate: a.date }
    case 'REPLACE_DATA': return { ...state, habits: a.data.habits, completions: dedupe(a.data.completions) }
    case 'CLEAR_DATA': return { ...state, habits: [], completions: [] }
    default: return state
  }
}

function init() {
  const saved = loadJSON(KEY)
  if (saved.status === 'ok' && validateData(saved.value)) return { habits: saved.value.habits, completions: dedupe(saved.value.completions), selectedDate: todayKey(), loadError: false }
  if (saved.status === 'missing') return { ...createSeedData(), selectedDate: todayKey(), loadError: false }
  return { habits: [], completions: [], selectedDate: todayKey(), loadError: true } // corrupted: fall back to a safe empty state
}

const Ctx = createContext(null)
export function HabitProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, init)
  useEffect(() => { saveJSON(KEY, { habits: state.habits, completions: state.completions }) }, [state.habits, state.completions])
  const value = useMemo(() => ({ state, dispatch }), [state])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useHabits = () => useContext(Ctx)
