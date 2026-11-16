import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { easeIO, reduced, type Move } from '@/lib/motion'
import { RL, RT } from '@/lib/scene'

interface Geo { ppm: number; ox: number; oy: number; pw: number; ph: number }

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()
const mono = '"Geist Mono Variable", ui-monospace, monospace'

/** Interpolates the grid geometry on a new move; retargets from the current interpolated state if interrupted. */
function useTween(target: Geo, move: Move | null) {
  const [geo, setGeo] = useState<Geo & { from: Geo; t: number }>({ ...target, from: target, t: 1 })
  const cur = useRef(geo)
  const handled = useRef(move?.id ?? 0)
  const raf = useRef(0)
  const { ppm, ox, oy, pw, ph } = target
  useLayoutEffect(() => {
    cancelAnimationFrame(raf.current)
    const to = { ppm, ox, oy, pw, ph }
    const fresh = move && move.id !== handled.current
    if (move) handled.current = move.id
    const set = (g: typeof geo) => { cur.current = g; setGeo(g) }
    if (!fresh || reduced()) return set({ ...to, from: to, t: 1 })
    const c = cur.current
    const from = { ppm: c.ppm, ox: c.ox, oy: c.oy, pw: c.pw, ph: c.ph }
    const labelFrom = c.t < 1 ? c.from : { ...from, pw: c.pw, ph: c.ph }
    const t0 = performance.now(), dur = Math.min(move.dur, 260)
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur), e = easeIO(p), l = (a: number, b: number) => a + (b - a) * e
      set({ ppm: l(from.ppm, to.ppm), ox: l(from.ox, to.ox), oy: l(from.oy, to.oy), pw: l(from.pw, to.pw), ph: l(from.ph, to.ph), from: labelFrom, t: e })
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [ppm, ox, oy, pw, ph, move])
  return { geo, to: { pw, ph } }
}

function size(cv: HTMLCanvasElement, w: number, h: number) {
  const dpr = window.devicePixelRatio || 1
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr)
  const g = cv.getContext('2d')!
  g.setTransform(dpr, 0, 0, dpr, 0, 0)
  return g
}

export function Mat({ cw, ch, ppm, ox, oy, pw, ph, theme, move, rulers }: {
  cw: number; ch: number; ppm: number; ox: number; oy: number; pw: number; ph: number; theme: string; move: Move | null; rulers: boolean
}) {
  const grid = useRef<HTMLCanvasElement>(null)
  const ruler = useRef<HTMLCanvasElement>(null)
  const tw = useTween({ ppm, ox, oy, pw, ph }, move)
  // At rest, draw the live target so a resize never shows a stale frame.
  const geo = useMemo(() => {
    const rest = { ppm, ox, oy, pw, ph }
    return tw.geo.t >= 1 ? { ...rest, from: rest, t: 1 } : tw.geo
  }, [tw.geo, ppm, ox, oy, pw, ph])
  const to = tw.to
  const [fontsReady, setFontsReady] = useState(0)
  useEffect(() => { document.fonts.load(`500 10px ${mono}`).then(() => setFontsReady(1), () => {}) }, [])

  useLayoutEffect(() => {
    const g = size(grid.current!, cw, ch)
    const step = 10 * geo.ppm
    const [minor, major] = [new Path2D(), new Path2D()]
    const line = (path: Path2D, i: number, x: boolean) => {
      const v = Math.round((x ? geo.ox : geo.oy) + i * step) + 0.5
      if (x) { path.moveTo(v, 0); path.lineTo(v, ch) } else { path.moveTo(0, v); path.lineTo(cw, v) }
    }
    for (const x of [true, false]) {
      const o = x ? geo.ox : geo.oy, len = x ? cw : ch
      for (let i = Math.floor(-o / step); i <= Math.ceil((len - o) / step); i++) line(i % 5 === 0 ? major : minor, i, x)
    }
    g.lineWidth = 1
    g.strokeStyle = css('--grid'); g.stroke(minor)
    g.strokeStyle = css('--grid-major'); g.stroke(major)
  }, [cw, ch, geo, theme])

  useLayoutEffect(() => {
    const g = size(ruler.current!, cw, ch)
    const bg = css('--ruler-bg'), line = css('--ruler-line'), ink = css('--ruler-ink')
    g.fillStyle = bg
    g.fillRect(0, 0, cw, RT); g.fillRect(0, 0, RL, ch)
    g.fillStyle = line
    g.fillRect(RL, RT - 1, cw - RL, 1); g.fillRect(RL - 1, RT, 1, ch - RT)
    g.font = `500 10px ${mono}`
    g.fillStyle = ink; g.strokeStyle = ink; g.lineWidth = 1
    g.textBaseline = 'middle'
    g.textAlign = 'center'; g.fillText('mm', RL / 2, RT / 2)
    const axis = (x: boolean) => {
      const o = x ? geo.ox : geo.oy, ext = x ? geo.pw : geo.ph, k = geo.ppm
      const pos = (mmv: number) => Math.round(o + mmv * k) + 0.5
      const tick = (v: number, len: number) => {
        g.beginPath()
        if (x) { g.moveTo(v, RT - 1); g.lineTo(v, RT - 1 - len) } else { g.moveTo(RL - 1, v); g.lineTo(RL - 1 - len, v) }
        g.stroke()
      }
      const text = (s: string, v: number, a: number) => {
        g.globalAlpha = a
        g.textAlign = x ? 'center' : 'right'
        g.fillText(s, x ? v : RL - 9, x ? RT / 2 : v)
        g.globalAlpha = 1
      }
      g.globalAlpha = 0.5
      for (let t = 0; t <= ext + 0.01; t += 10) tick(pos(t), t % 50 === 0 ? 7 : 4)
      g.globalAlpha = 1
      tick(pos(ext), 9)
      const endX = pos(ext)
      for (let t = 0; t <= ext; t += 50) if (ext - t > 26 / k || t === 0) text(String(t), pos(t), 1)
      const fromTxt = String(Math.round(x ? geo.from.pw : geo.from.ph)), toTxt = String(Math.round(x ? to.pw : to.ph))
      if (fromTxt !== toTxt && geo.t < 1) { text(fromTxt, endX, 1 - geo.t); text(toTxt, endX, geo.t) } else text(toTxt, endX, 1)
    }
    axis(true); axis(false)
  }, [cw, ch, geo, to, theme, fontsReady])

  return (
    <>
      <canvas ref={grid} aria-hidden className="absolute inset-0" style={{ width: cw, height: ch }} />
      <canvas ref={ruler} aria-hidden className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-200" style={{ width: cw, height: ch, opacity: rulers ? 1 : 0 }} />
    </>
  )
}
