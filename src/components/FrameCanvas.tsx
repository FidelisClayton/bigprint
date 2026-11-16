import { useEffect, useRef } from 'react'

interface Props {
  ppm: number
  left: number
  top: number
  width: number
  height: number
  onPan: (dxMm: number, dyMm: number) => void
  onTap: (xMm: number, yMm: number) => void
  onZoom: (factor: number, axMm?: number, ayMm?: number) => void
}

/** Transparent input layer over the poster: drag, wheel, keyboard and touch gestures move and zoom the image. */
export function FrameCanvas({ ppm, left, top, width, height, onPan, onTap, onZoom }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; y: number } | null>(null)
  const ptrs = useRef(new Map<number, { x: number; y: number }>())
  const mid = () => { const [a, b] = [...ptrs.current.values()]; return b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : a }
  const dist = () => { const [a, b] = [...ptrs.current.values()]; return Math.hypot(a.x - b.x, a.y - b.y) }
  const tap = useRef<{ x: number; y: number; ok: boolean }>({ x: 0, y: 0, ok: false })
  const live = useRef({ ppm, onZoom })

  useEffect(() => { live.current = { ppm, onZoom } })

  useEffect(() => {
    const el = ref.current!
    const wheel = (e: WheelEvent) => {
      e.preventDefault()
      const b = el.getBoundingClientRect(), p = live.current.ppm
      live.current.onZoom(Math.exp(-e.deltaY * 0.002), (e.clientX - b.left) / p, (e.clientY - b.top) / p)
    }
    el.addEventListener('wheel', wheel, { passive: false })
    return () => el.removeEventListener('wheel', wheel)
  }, [])

  const key = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 20 : 5 // mm
    const pan: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }
    if (pan[e.key]) { e.preventDefault(); onPan(...pan[e.key]) }
    else if (e.key === '+' || e.key === '=') { e.preventDefault(); onZoom(1.1) }
    else if (e.key === '-' || e.key === '_') { e.preventDefault(); onZoom(1 / 1.1) }
  }

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="group"
      aria-label="Image position. Arrow keys move the image, plus and minus zoom."
      onKeyDown={key}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
        tap.current = ptrs.current.size === 1 ? { x: e.clientX, y: e.clientY, ok: true } : { ...tap.current, ok: false }
        drag.current = e.pointerType !== 'touch' ? { x: e.clientX, y: e.clientY } : null
      }}
      onPointerMove={(e) => {
        const m = ptrs.current
        if (!m.has(e.pointerId)) return
        if (Math.hypot(e.clientX - tap.current.x, e.clientY - tap.current.y) > 5) tap.current.ok = false
        if (e.pointerType === 'touch') {
          // one finger scrolls the page by hand (touch-action is none so two fingers can own the gesture); two fingers move and zoom the image
          const old = mid()
          const before = m.size === 2 ? dist() : 0
          m.set(e.pointerId, { x: e.clientX, y: e.clientY })
          if (m.size !== 2) { window.scrollBy(0, old.y - e.clientY); return }
          const now = mid(), r = e.currentTarget.getBoundingClientRect()
          onPan((now.x - old.x) / ppm, (now.y - old.y) / ppm)
          if (before > 0) onZoom(dist() / before, (now.x - r.left) / ppm, (now.y - r.top) / ppm)
          return
        }
        m.set(e.pointerId, { x: e.clientX, y: e.clientY })
        if (!drag.current) return
        onPan((e.clientX - drag.current.x) / ppm, (e.clientY - drag.current.y) / ppm)
        drag.current = { x: e.clientX, y: e.clientY }
      }}
      onPointerUp={(e) => {
        ptrs.current.delete(e.pointerId); drag.current = null
        if (tap.current.ok) { const b = e.currentTarget.getBoundingClientRect(); onTap((e.clientX - b.left) / ppm, (e.clientY - b.top) / ppm) }
        tap.current.ok = false
      }}
      onPointerCancel={(e) => { ptrs.current.delete(e.pointerId); drag.current = null }}
      style={{ left, top, width, height }}
      className="absolute z-20 cursor-grab touch-none outline-offset-[6px] active:cursor-grabbing"
    />
  )
}
