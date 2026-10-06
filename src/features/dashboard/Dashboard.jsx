import { useMemo, useState } from 'react'
import { useHabits } from '../../app/store'
import { addDays, formatLong, greeting, isFuture, todayKey } from '../../lib/date'
import { getHabitsForDate } from '../habits/utils/schedule'
import { completionIndex, getCompletedCount, isCompleted } from '../completions/utils/completions'
import { useHabitActions } from '../habits/hooks/useHabitActions'
import HabitList from '../habits/components/HabitList'
import HabitForm from '../habits/components/HabitForm'
import Modal from '../../components/ui/Modal'
import ConfirmationDialog from '../../components/ui/ConfirmationDialog'
import ProgressRing from '../../components/ui/ProgressRing'
import EmptyState from '../../components/ui/EmptyState'

export default function Dashboard() {
  const { state, dispatch } = useHabits()
  const actions = useHabitActions()
  const [editing, setEditing] = useState(null) // null | 'new' | habit
  const [deleting, setDeleting] = useState(null)
  const { selectedDate: date, habits, completions } = state
  const index = useMemo(() => completionIndex(completions), [completions])
  const due = useMemo(() => getHabitsForDate(habits, date), [habits, date])
  const done = getCompletedCount(due, index, date)
  const pct = due.length ? Math.round((done / due.length) * 100) : 0
  const go = (d) => dispatch({ type: 'SET_SELECTED_DATE', date: d })
  const future = isFuture(date)
  const hasActive = habits.some((h) => !h.archived)

  const save = (data) => { editing === 'new' ? actions.create(data) : actions.update(editing.id, data); setEditing(null) }
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">{greeting()} 👋</h1>
          <p className="text-stone-500 dark:text-stone-400">{formatLong(todayKey())}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing('new')}>+ Add habit</button>
      </header>

      <div className="flex items-center justify-between rounded-xl border border-stone-200 p-1 dark:border-night-700">
        <button className="btn btn-ghost" onClick={() => go(addDays(date, -1))} aria-label="Previous day">‹</button>
        <div className="flex items-center gap-2 text-sm font-medium" aria-live="polite">
          {formatLong(date)}
          {date !== todayKey() && <button className="btn btn-outline !px-2 !py-1 text-xs" onClick={() => go(todayKey())}>Today</button>}
        </div>
        <button className="btn btn-ghost" onClick={() => go(addDays(date, 1))} aria-label="Next day">›</button>
      </div>

      {hasActive && (
        <section className="card flex items-center gap-5" aria-label="Progress">
          <ProgressRing value={pct} label={`${pct}% of habits completed`} />
          <div>
            <p className="font-display text-2xl">{done} / {due.length} completed</p>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {future ? 'This day hasn’t happened yet.' : !due.length ? 'Nothing scheduled for this day.' : done === due.length ? 'All done. Nicely played.' : 'One habit at a time.'}
            </p>
          </div>
        </section>
      )}

      {!hasActive ? (
        <EmptyState title="You haven’t created any habits yet." text="Create your first habit to get started." action={<button className="btn btn-primary" onClick={() => setEditing('new')}>Create habit</button>} />
      ) : due.length === 0 ? (
        <EmptyState title="Nothing scheduled" text="None of your habits are scheduled for this day." />
      ) : (
        <HabitList habits={due} isDone={(h) => isCompleted(index, h.id, date)} readOnly={future}
          onToggle={(h) => actions.toggle(h, date, isCompleted(index, h.id, date))} onEdit={setEditing} onArchive={actions.archive} onDelete={setDeleting} />
      )}

      <Modal open={!!editing} title={editing === 'new' ? 'New habit' : 'Edit habit'} onClose={() => setEditing(null)}>
        {editing && <HabitForm habit={editing === 'new' ? null : editing} onSubmit={save} onCancel={() => setEditing(null)} />}
      </Modal>
      <ConfirmationDialog open={!!deleting} title={`Delete ${deleting?.name}?`} message="This will permanently delete the habit and its completion history." onCancel={() => setDeleting(null)} onConfirm={() => { actions.remove(deleting); setDeleting(null) }} />
    </div>
  )
}
