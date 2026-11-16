import type { Layout } from './layout'

/** Where sheet i (0-based) sits in the poster, in words. */
export function position(L: Layout, i: number) {
  const c = i % L.cols, r = Math.floor(i / L.cols)
  const v = L.rows > 1 ? (r === 0 ? 'top' : 'bottom') : ''
  const h = L.cols > 1 ? (c === 0 ? 'left' : 'right') : ''
  return [v, h].filter(Boolean).join(' ')
}

export const sheetName = (i: number) => `Sheet ${i + 1} · A4`
