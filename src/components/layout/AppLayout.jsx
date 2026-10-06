import { NavLink, Outlet } from 'react-router-dom'
import { useHabits } from '../../app/store'
import { useTheme } from '../../hooks/useTheme'

const NAV = [['/dashboard', 'Today', '◐'], ['/history', 'History', '▦'], ['/statistics', 'Statistics', '▤'], ['/settings', 'Settings', '⚙']]
const linkCls = ({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-moss-100 text-moss-700 dark:bg-night-700 dark:text-moss-100' : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-night-800'}`

export default function AppLayout() {
  useTheme() // applies the saved theme on load
  const { state } = useHabits()
  return (
    <div className="min-h-screen md:flex">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-1 border-r border-stone-200 p-4 dark:border-night-700 md:flex">
        <div className="mb-6 px-3 font-display text-2xl">Tally</div>
        <nav aria-label="Main" className="flex flex-col gap-1">
          {NAV.map(([to, label, icon]) => <NavLink key={to} to={to} className={linkCls}><span aria-hidden="true">{icon}</span>{label}</NavLink>)}
        </nav>
      </aside>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-28 pt-6 md:px-8 md:pb-10 md:pt-10">
        {state.loadError && <div role="alert" className="mb-4 rounded-lg bg-amber-100 p-3 text-sm text-amber-900">Your saved data couldn’t be read, so Tally started fresh. You can restore a backup in Settings.</div>}
        <Outlet />
      </main>
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-night-700 dark:bg-night-800/95 md:hidden">
        {NAV.map(([to, label, icon]) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex flex-col items-center gap-0.5 py-2 text-xs ${isActive ? 'font-semibold text-moss-600 dark:text-moss-500' : 'text-stone-500'}`}><span aria-hidden="true" className="text-lg">{icon}</span>{label}</NavLink>
        ))}
      </nav>
    </div>
  )
}
