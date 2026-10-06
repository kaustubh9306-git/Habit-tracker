// Calendar dates are always 'YYYY-MM-DD' strings, built from local parts (never via UTC parsing).
const pad = (n) => String(n).padStart(2, '0')
export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const parseKey = (key) => { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d) }
export const todayKey = () => toKey(new Date())
export const addDays = (key, n) => { const d = parseKey(key); d.setDate(d.getDate() + n); return toKey(d) }
export const weekday = (key) => parseKey(key).getDay() // 0 = Sunday
export const isFuture = (key) => key > todayKey()
export const isValidKey = (k) => typeof k === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(k) && toKey(parseKey(k)) === k
export const daysBetween = (from, to) => { const out = []; for (let k = from; k <= to; k = addDays(k, 1)) out.push(k); return out }
export const monthKeys = (year, month) => daysBetween(toKey(new Date(year, month, 1)), toKey(new Date(year, month + 1, 0)))
export const formatLong = (key) => parseKey(key).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
export const formatShort = (key) => parseKey(key).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
export const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening' }
