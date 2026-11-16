import { describe, expect, it } from 'vitest'
import { centerView, layout, tileSource, viewScale } from './layout'

const pick = (l: ReturnType<typeof layout>) => [l.cols, l.rows, l.sheetW, l.sheetH, l.landscapeSheets, l.posterW, l.posterH]

describe('layout', () => {
  it('A3 portrait m=0 is 1x2 landscape sheets, 297x420', () => {
    expect(pick(layout('A3', 'portrait', 0))).toEqual([1, 2, 297, 210, true, 297, 420])
  })
  it('A3 landscape m=0 is 2x1 portrait sheets, 420x297', () => {
    expect(pick(layout('A3', 'landscape', 0))).toEqual([2, 1, 210, 297, false, 420, 297])
  })
  it('A2 portrait m=5 is 2x2, 400x574', () => {
    expect(pick(layout('A2', 'portrait', 5))).toEqual([2, 2, 210, 297, false, 400, 574])
  })
  it('A3 portrait m=5 is 287x400', () => {
    const l = layout('A3', 'portrait', 5)
    expect([l.posterW, l.posterH]).toEqual([287, 400])
  })
})

describe('tileSource', () => {
  it('maps tile to image pixels', () => {
    const t = tileSource(layout('A2', 'portrait', 0), 1, 1, { s: 2, ox: -10, oy: 0 })
    expect(t).toEqual({ sx: 110, sy: 148.5, sw: 105, sh: 148.5 })
  })
  it('cover fit of a wide image crops the sides and fills the poster height', () => {
    const L = layout('A2', 'portrait', 0)
    const d = { w: 1000, h: 500 }
    const v = centerView(L, d, false)
    const s = viewScale(L, d, false, 1)
    expect(s).toBeCloseTo(594 / 500)
    const t = tileSource(L, 0, 0, { s, ...v })
    expect(t.sx).toBeCloseTo((1000 - 420 / s) / 2)
    expect(t.sy).toBeCloseTo(0)
    expect(t.sh).toBeCloseTo(500 / 2)
  })
})
