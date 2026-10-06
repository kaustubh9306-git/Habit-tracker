import { createContext, useCallback, useContext, useState } from 'react'
const Ctx = createContext(() => {})
export const useToast = () => useContext(Ctx)
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const push = useCallback((message, tone = 'ok') => {
    const id = Math.random()
    setToasts((t) => [...t, { id, message, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])
  return (
    <Ctx.Provider value={push}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 md:bottom-6">
        {toasts.map((t) => (
          <div key={t.id} className={`pointer-events-auto rounded-lg px-4 py-2 text-sm shadow-lg ${t.tone === 'error' ? 'bg-red-600 text-white' : 'bg-ink text-white dark:bg-stone-100 dark:text-ink'}`}>{t.message}</div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
