import { useRef, useState } from 'react'
import { useHabits, validateData } from '../../app/store'
import { useTheme } from '../../hooks/useTheme'
import { useToast } from '../../components/ui/Toast'
import { useHabitActions } from '../habits/hooks/useHabitActions'
import ConfirmationDialog from '../../components/ui/ConfirmationDialog'
import { todayKey } from '../../lib/date'

export default function Settings() {
  const { state, dispatch } = useHabits()
  const [theme, setTheme] = useTheme()
  const toast = useToast()
  const actions = useHabitActions()
  const fileRef = useRef(null)
  const [confirm, setConfirm] = useState(null) // 'clear' | habit
  const archived = state.habits.filter((h) => h.archived)

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ habits: state.habits, completions: state.completions }, null, 2)], { type: 'application/json' })
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `tally-backup-${todayKey()}.json` })
    a.click(); URL.revokeObjectURL(a.href)
  }
  const importData = async (e) => {
    const file = e.target.files?.[0]; e.target.value = ''
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      if (!validateData(data)) throw new Error('shape')
      dispatch({ type: 'REPLACE_DATA', data }); toast('Data imported.')
    } catch { toast('That file isn’t a valid Tally backup, so nothing was changed.', 'error') }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Settings</h1>
      <section className="card">
        <h2 className="mb-3 font-medium">Appearance</h2>
        <div className="inline-flex rounded-lg border border-stone-300 p-0.5 dark:border-night-700" role="radiogroup" aria-label="Theme">
          {['light', 'dark', 'system'].map((t) => <button key={t} role="radio" aria-checked={theme === t} onClick={() => setTheme(t)} className={`rounded-md px-3 py-1.5 text-sm capitalize ${theme === t ? 'bg-moss-600 text-white' : ''}`}>{t}</button>)}
        </div>
      </section>
      <section className="card">
        <h2 className="mb-3 font-medium">Archived habits</h2>
        {!archived.length ? <p className="text-sm text-stone-500">Archived habits show up here. Their history is kept.</p> : (
          <ul className="divide-y divide-stone-200 dark:divide-night-700">{archived.map((h) => (
            <li key={h.id} className="flex items-center justify-between gap-2 py-2"><span className="truncate">{h.icon} {h.name}</span>
              <span className="flex shrink-0 gap-1"><button className="btn btn-outline" onClick={() => actions.restore(h)}>Restore</button><button className="btn btn-ghost text-red-600" onClick={() => setConfirm(h)}>Delete…</button></span></li>))}</ul>)}
      </section>
      <section className="card">
        <h2 className="mb-3 font-medium">Your data</h2>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-outline" onClick={exportData}>Export JSON</button>
          <button className="btn btn-outline" onClick={() => fileRef.current.click()}>Import JSON</button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={importData} aria-label="Import JSON file" />
          <button className="btn btn-ghost text-red-600" onClick={() => setConfirm('clear')}>Clear all data…</button>
        </div>
        <p className="mt-2 text-xs text-stone-500">Importing replaces your current habits and history.</p>
      </section>
      <ConfirmationDialog open={!!confirm} title={confirm === 'clear' ? 'Clear all data?' : `Delete ${confirm?.name}?`}
        message={confirm === 'clear' ? 'This permanently deletes every habit and all completion history. Export a backup first if you want to keep it.' : 'This will permanently delete the habit and its completion history.'}
        confirmLabel={confirm === 'clear' ? 'Clear everything' : 'Delete'} onCancel={() => setConfirm(null)}
        onConfirm={() => { confirm === 'clear' ? (dispatch({ type: 'CLEAR_DATA' }), toast('All data cleared.')) : actions.remove(confirm); setConfirm(null) }} />
    </div>
  )
}
