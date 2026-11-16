export const A4 = { w: 210, h: 297 }
export const DPI = 300
export const PXMM = DPI / 25.4

export type Size = 'A3' | 'A2'
export type Orientation = 'portrait' | 'landscape'

export interface Layout {
  cols: number
  rows: number
  sheetW: number
  sheetH: number
  tileW: number
  tileH: number
  posterW: number
  posterH: number
  landscapeSheets: boolean
}

/** Pan/zoom of the image inside the poster. ox/oy: image top-left in poster mm. */
export interface View {
  zoom: number
  ox: number
  oy: number
}

export interface Dims {
  w: number
  h: number
}

/** Pure layout math, all values in mm. */
export function layout(size: Size, orientation: Orientation, marginMm: number): Layout {
  const portrait = orientation === 'portrait'
  let cols: number, rows: number, landscapeSheets: boolean
  if (size === 'A3') {
    cols = portrait ? 1 : 2
    rows = portrait ? 2 : 1
    landscapeSheets = portrait
  } else {
    cols = 2
    rows = 2
    landscapeSheets = !portrait
  }
  const sheetW = landscapeSheets ? A4.h : A4.w
  const sheetH = landscapeSheets ? A4.w : A4.h
  const tileW = sheetW - 2 * marginMm
  const tileH = sheetH - 2 * marginMm
  return { cols, rows, sheetW, sheetH, tileW, tileH, posterW: cols * tileW, posterH: rows * tileH, landscapeSheets }
}

/** Source rectangle (image px) for tile (col,row). s = mm per image px. */
export function tileSource(L: Layout, col: number, row: number, v: { s: number; ox: number; oy: number }) {
  return {
    sx: (col * L.tileW - v.ox) / v.s,
    sy: (row * L.tileH - v.oy) / v.s,
    sw: L.tileW / v.s,
    sh: L.tileH / v.s,
  }
}

/** mm per image pixel: cover fit, or contain fit when `fit` is set, times zoom. */
export function viewScale(L: Layout, d: Dims, fit: boolean, zoom: number) {
  return (fit ? Math.min : Math.max)(L.posterW / d.w, L.posterH / d.h) * zoom
}

export function clampView(L: Layout, d: Dims, fit: boolean, v: View): View {
  if (fit) return v
  const s = viewScale(L, d, fit, v.zoom)
  return {
    zoom: v.zoom,
    ox: Math.min(0, Math.max(L.posterW - d.w * s, v.ox)),
    oy: Math.min(0, Math.max(L.posterH - d.h * s, v.oy)),
  }
}

export function centerView(L: Layout, d: Dims, fit: boolean): View {
  const s = viewScale(L, d, fit, 1)
  return { zoom: 1, ox: (L.posterW - d.w * s) / 2, oy: (L.posterH - d.h * s) / 2 }
}

/** Zoom keeping the poster point (ax, ay) in mm fixed. */
export function zoomView(L: Layout, d: Dims, fit: boolean, v: View, zoom: number, ax = L.posterW / 2, ay = L.posterH / 2): View {
  const z = Math.min(5, Math.max(1, zoom))
  const s = viewScale(L, d, fit, v.zoom)
  const px = (ax - v.ox) / s
  const py = (ay - v.oy) / s
  const s2 = viewScale(L, d, fit, z)
  return clampView(L, d, fit, { zoom: z, ox: ax - px * s2, oy: ay - py * s2 })
}
