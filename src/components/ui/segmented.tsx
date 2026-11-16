import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { ToggleGroup } from 'radix-ui'
import { cn } from '@/lib/utils'

export interface SegItem<T extends string> { value: T; label: ReactNode; disabled?: boolean }

const item = 'relative flex h-full min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[4px] px-3 text-ui whitespace-nowrap'

/**
 * Segmented control whose selected pill slides: a duplicate list in the pill colour is clipped to the
 * selected item, so the text colour changes exactly with the pill.
 */
export function Segmented<T extends string>({ value, onValueChange, items, label, className, accent }: {
  value: T
  onValueChange: (v: T) => void
  items: SegItem<T>[]
  label: string
  className?: string
  accent?: boolean
}) {
  const root = useRef<HTMLDivElement>(null)
  const [clip, setClip] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    const el = root.current!
    const measure = () => {
      const on = el.querySelector<HTMLElement>('[data-state=on]')
      if (!on) return setClip(null)
      const { clientWidth: w, clientHeight: h } = el
      setClip(`inset(${on.offsetTop}px ${w - on.offsetLeft - on.offsetWidth}px ${h - on.offsetTop - on.offsetHeight}px ${on.offsetLeft}px round 4px)`)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    const t = requestAnimationFrame(() => setReady(true))
    return () => { ro.disconnect(); cancelAnimationFrame(t) }
  }, [value, items])

  return (
    <div ref={root} className={cn('relative inline-flex h-9 rounded-[6px] border border-line bg-panel-2 p-[3px]', className)}>
      <ToggleGroup.Root type="single" aria-label={label} value={value} onValueChange={(v) => v && onValueChange(v as T)} className="flex w-full">
        {items.map((it) => (
          <ToggleGroup.Item key={it.value} value={it.value} disabled={it.disabled} className={cn(item, 'cursor-pointer text-mute outline-none hover:text-ink focus-visible:outline-[1.5px] focus-visible:outline-acc disabled:cursor-default disabled:opacity-45 disabled:hover:text-mute')}>
            {it.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
      <div
        aria-hidden
        className={cn('pointer-events-none absolute inset-0 flex p-[3px]', accent ? 'bg-acc-fill text-white' : 'bg-sel text-sel-fg')}
        style={{ clipPath: clip ?? 'inset(0 100% 0 0)', transition: ready ? 'clip-path 220ms var(--ease-in-out)' : 'none' }}
      >
        {items.map((it) => <span key={it.value} className={item}>{it.label}</span>)}
      </div>
    </div>
  )
}
