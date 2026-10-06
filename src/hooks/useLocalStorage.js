import { useCallback, useState } from 'react'
// Storage adapter: swap loadJSON/saveJSON for an API client later.
export function loadJSON(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? { status: 'missing' } : { status: 'ok', value: JSON.parse(raw) }
  } catch { return { status: 'corrupt' } }
}
export function saveJSON(key, value) { try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage full or blocked */ } }
export function useLocalStorage(key, fallback) {
  const [value, setValue] = useState(() => { const r = loadJSON(key); return r.status === 'ok' ? r.value : fallback })
  const set = useCallback((v) => { setValue(v); saveJSON(key, v) }, [key])
  return [value, set]
}
