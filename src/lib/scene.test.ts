import { describe, expect, it } from 'vitest'
import { layout } from './layout'
import { labelBelow, scene, sheetMm } from './scene'

describe('scene', () => {
  const L = layout('A2', 'portrait', 5)
  it('fits the pulled-apart sheets inside the canvas', () => {
    const { ppm, ox, oy } = scene(L, 5, 1000, 800)
    const last = sheetMm(L, 5, 3, true)
    expect(ox + (last.x + last.w) * ppm).toBeLessThanOrEqual(1000)
    expect(oy + (last.y + last.h) * ppm).toBeLessThanOrEqual(800)
  })
  it('puts bottom-row labels below, top-row above', () => {
    expect([0, 1, 2, 3].map((i) => labelBelow(L, i, false))).toEqual([false, false, true, true])
    expect(labelBelow(L, 3, true)).toBe(false)
    expect(labelBelow(layout('A3', 'landscape', 5), 1, false)).toBe(false)
  })
  it('keeps assembled sheets edge to edge once inner margins are trimmed', () => {
    const a = sheetMm(L, 5, 0, false), b = sheetMm(L, 5, 1, false)
    expect(a.x + a.w - a.inset.r).toBe(b.x + b.inset.l)
  })
})
