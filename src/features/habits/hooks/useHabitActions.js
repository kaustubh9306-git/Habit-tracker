import { useHabits, uid } from '../../../app/store'
import { useToast } from '../../../components/ui/Toast'
import { todayKey } from '../../../lib/date'

export function useHabitActions() {
  const { dispatch } = useHabits()
  const toast = useToast()
  return {
    create: (data) => { dispatch({ type: 'ADD_HABIT', habit: { ...data, id: uid(), createdAt: todayKey(), archived: false } }); toast('Habit created successfully.') },
    update: (id, data) => { dispatch({ type: 'UPDATE_HABIT', id, changes: data }); toast('Changes saved.') },
    archive: (h) => { dispatch({ type: 'ARCHIVE_HABIT', id: h.id }); toast(`${h.name} archived.`) },
    restore: (h) => { dispatch({ type: 'ARCHIVE_HABIT', id: h.id, archived: false }); toast(`${h.name} restored.`) },
    remove: (h) => { dispatch({ type: 'DELETE_HABIT', id: h.id }); toast(`${h.name} deleted.`) },
    toggle: (h, date, done) => { dispatch({ type: 'TOGGLE_COMPLETION', habitId: h.id, date }); if (!done) toast(`${h.name} completed! 🔥`) },
  }
}
