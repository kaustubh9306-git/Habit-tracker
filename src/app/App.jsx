import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HabitProvider } from './store'
import { ToastProvider } from '../components/ui/Toast'
import AppLayout from '../components/layout/AppLayout'
import Dashboard from '../features/dashboard/Dashboard'
import History from '../features/history/History'
const Statistics = lazy(() => import('../features/statistics/Statistics'))
import Settings from '../features/settings/Settings'

export default function App() {
  return (
    <HabitProvider><ToastProvider><BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/statistics" element={<Suspense fallback={<p role="status" className="text-sm text-stone-500">Loading statistics…</p>}><Statistics /></Suspense>} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter></ToastProvider></HabitProvider>
  )
}
