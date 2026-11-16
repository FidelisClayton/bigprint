import { useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { EASE_OUT, reduced } from './motion'

export type Theme = 'light' | 'dark'
const KEY = 'bigprint-theme'
const read = (): Theme | null => {
  try { const v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : null } catch { return null }
}
const dark = () => matchMedia('(prefers-color-scheme: dark)')

export function useTheme() {
  const [stored, setStored] = useState(read)
  const [sys, setSys] = useState(() => dark().matches)
  useEffect(() => {
    const mq = dark(), on = () => setSys(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const theme: Theme = stored ?? (sys ? 'dark' : 'light')
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])

  const toggle = useCallback((from?: HTMLElement) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    try { localStorage.setItem(KEY, next) } catch { /* private mode */ }
    const apply = () => { document.documentElement.dataset.theme = next; flushSync(() => setStored(next)) }
    if (!document.startViewTransition || reduced()) return apply()
    const b = from?.getBoundingClientRect()
    const x = b ? b.left + b.width / 2 : innerWidth, y = b ? b.top + b.height / 2 : 0
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    document.startViewTransition(apply).ready.then(() =>
      document.documentElement.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 450, easing: EASE_OUT, pseudoElement: '::view-transition-new(root)' },
      ),
    ).catch(() => {})
  }, [theme])
  return { theme, toggle }
}
