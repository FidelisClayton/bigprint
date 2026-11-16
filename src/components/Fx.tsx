import { useLayoutEffect, useRef, useState } from 'react'
import { EASE_OUT } from '@/lib/motion'

/** Shows a value; when it changes the old one fades out and the new one fades in with a 2px blur. */
export function Fx({ value }: { value: string }) {
  const cur = useRef<HTMLSpanElement>(null)
  const last = useRef(value)
  const [ghost, setGhost] = useState<{ text: string; n: number } | null>(null)
  useLayoutEffect(() => {
    if (last.current === value) return
    const old = last.current
    last.current = value
    setGhost({ text: old, n: Date.now() })
    cur.current?.animate({ opacity: [0, 1], filter: ['blur(2px)', 'blur(0)'] }, { duration: 180, easing: EASE_OUT })
  }, [value])
  return (
    <span className="inline-grid">
      <span ref={cur} style={{ gridArea: '1/1' }}>{value}</span>
      {ghost && (
        <span
          key={ghost.n} aria-hidden style={{ gridArea: '1/1' }}
          ref={(el) => { el?.animate({ opacity: [1, 0], filter: ['blur(0)', 'blur(2px)'] }, { duration: 180, easing: EASE_OUT, fill: 'forwards' }).finished.then(() => setGhost((g) => (g?.n === ghost.n ? null : g)), () => {}) }}
        >{ghost.text}</span>
      )}
    </span>
  )
}
