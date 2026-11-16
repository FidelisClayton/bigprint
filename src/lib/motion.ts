import { useLayoutEffect, useRef, type RefObject } from 'react'
import type { Rect } from './scene'

export const EASE_OUT = 'cubic-bezier(0.23,1,0.32,1)'
export const EASE_IO = 'cubic-bezier(0.77,0,0.175,1)'
export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/** One authored change of the canvas: how long the move takes and how much each sheet lags the previous one. */
export interface Move { id: number; dur: number; stagger: number }

/** Cubic-bezier easing as a function of progress, for the animations drawn on canvas. */
export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const at = (t: number, a: number, b: number) => 3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t * t + t ** 3
  return (x: number) => {
    let lo = 0, hi = 1, t = x
    for (let i = 0; i < 24; i++) { t = (lo + hi) / 2; if (at(t, x1, x2) < x) lo = t; else hi = t }
    return at(t, y1, y2)
  }
}
export const easeIO = bezier(0.77, 0, 0.175, 1)

/** Fade in, rising a few px; opacity only under reduced motion. */
export function fadeRise(el: Element | null, delay = 0, rise = 6) {
  if (!el) return
  const r = reduced()
  el.animate(
    r ? { opacity: [0, 1] } : { opacity: [0, 1], transform: [`translateY(${rise}px)`, 'none'] },
    { duration: r ? 120 : 260, delay: r ? 0 : delay, easing: EASE_OUT, fill: 'backwards' },
  )
}

/**
 * Places the element at rect with a transform. When `move` changes, the element glides from where it
 * visibly was (read from the running animation if one is in flight, so it can be interrupted) to the new rect.
 */
export function useFlip(ref: RefObject<HTMLElement | null>, rect: Rect, move: Move | null, index = 0, scale = true) {
  const prev = useRef<Rect | null>(null)
  const handled = useRef(move?.id ?? 0)
  const { x, y, w, h } = rect
  useLayoutEffect(() => {
    const el = ref.current!
    const to = { x, y, w, h }
    let from = prev.current
    const running = el.getAnimations()
    if (running.length) {
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform)
      from = { x: m.e, y: m.f, w: w * m.a, h: h * m.d }
      running.forEach((a) => a.cancel())
    }
    const fresh = move && move.id !== handled.current
    if (move) handled.current = move.id
    if (fresh && from && !reduced() && (from.x !== x || from.y !== y || from.w !== w || from.h !== h)) {
      const s = scale ? ` scale(${from.w / w}, ${from.h / h})` : ''
      el.animate(
        [{ transform: `translate(${from.x}px, ${from.y}px)${s}` }, { transform: `translate(${x}px, ${y}px) scale(1, 1)` }],
        { duration: move.dur, delay: index * move.stagger, easing: EASE_IO, fill: 'backwards' },
      )
    }
    prev.current = to
  }, [ref, x, y, w, h, move, index, scale])
  return { position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${x}px, ${y}px)` } as const
}
