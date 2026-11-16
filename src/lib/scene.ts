import type { Layout } from './layout'

export const GAP = 30 // mm between pulled-apart sheets
export const RL = 36 // left ruler width, px
export const RT = 26 // top ruler height, px
export const LABEL = 24 // room above the artboards for labels, px

export interface Rect { x: number; y: number; w: number; h: number }
export interface Inset { t: number; r: number; b: number; l: number }

/** Sheet i in poster mm. Assembled: only outer margins show (inner ones are trimmed), exploded: the full page. */
export function sheetMm(L: Layout, m: number, i: number, exploded: boolean): Rect & { inset: Inset } {
  const c = i % L.cols, r = Math.floor(i / L.cols)
  if (exploded) {
    const x0 = L.posterW / 2 - explodedSize(L).w / 2, y0 = L.posterH / 2 - explodedSize(L).h / 2
    return { x: x0 + c * (L.sheetW + GAP), y: y0 + r * (L.sheetH + GAP), w: L.sheetW, h: L.sheetH, inset: { t: 0, r: 0, b: 0, l: 0 } }
  }
  return {
    x: c * L.tileW - m, y: r * L.tileH - m, w: L.sheetW, h: L.sheetH,
    inset: { l: c > 0 ? m : 0, r: c < L.cols - 1 ? m : 0, t: r > 0 ? m : 0, b: r < L.rows - 1 ? m : 0 },
  }
}

const explodedSize = (L: Layout) => ({ w: L.cols * L.sheetW + (L.cols - 1) * GAP, h: L.rows * L.sheetH + (L.rows - 1) * GAP })

/** Pixel geometry of the canvas: one scale for every step so only positions animate. */
export function scene(L: Layout, m: number, cw: number, ch: number) {
  const ex = explodedSize(L)
  const minX = Math.min(-m, L.posterW / 2 - ex.w / 2), maxX = Math.max(L.posterW + m, L.posterW / 2 + ex.w / 2)
  const minY = Math.min(-m, L.posterH / 2 - ex.h / 2), maxY = Math.max(L.posterH + m, L.posterH / 2 + ex.h / 2)
  const pad = cw < 600 ? 14 : 28
  const aw = Math.max(1, cw - RL - 2 * pad), ah = Math.max(1, ch - RT - 2 * pad - 2 * LABEL)
  const ppm = Math.min(3, aw / (maxX - minX), ah / (maxY - minY))
  const ox = RL + pad + (aw - (maxX - minX) * ppm) / 2 - minX * ppm
  const oy = RT + pad + LABEL + (ah - (maxY - minY) * ppm) / 2 - minY * ppm
  return { ppm, ox, oy }
}

/** Assembled bottom-row labels sit below the poster so no label ever covers the image. */
export const labelBelow = (L: Layout, i: number, exploded: boolean) => !exploded && L.rows > 1 && Math.floor(i / L.cols) === L.rows - 1
