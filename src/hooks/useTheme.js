import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
export function useTheme() {
  const [theme, setTheme] = useLocalStorage('tally.theme', 'system')
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const apply = () => document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && mq.matches))
    apply(); mq.addEventListener('change', apply); return () => mq.removeEventListener('change', apply)
  }, [theme])
  return [theme, setTheme]
}
