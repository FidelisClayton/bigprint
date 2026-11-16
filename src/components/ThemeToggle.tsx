import { Moon, Sun } from 'lucide-react'
import type { Theme } from '@/lib/theme'

const icon = 'absolute size-4 transition-[transform,opacity] duration-200 ease-(--ease-out)'

export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: (el: HTMLElement) => void }) {
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={(e) => onToggle(e.currentTarget)}
      className="relative grid size-9 cursor-pointer place-items-center rounded-[5px] text-mute hover:bg-panel-2 hover:text-ink"
    >
      <Sun aria-hidden className={`${icon} ${dark ? 'scale-100 rotate-0 opacity-100' : 'scale-[0.8] -rotate-90 opacity-0'}`} />
      <Moon aria-hidden className={`${icon} ${dark ? 'scale-[0.8] rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`} />
    </button>
  )
}
