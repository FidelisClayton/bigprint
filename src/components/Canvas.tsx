import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { EASE_OUT, fadeRise, reduced, useFlip, type Move } from '@/lib/motion'
import type { Layout } from '@/lib/layout'
import { drawSheetTile, type Source } from '@/lib/render'
import { labelBelow, scene, sheetMm, RL } from '@/lib/scene'
import { sheetName } from '@/lib/sheets'
import { cn } from '@/lib/utils'
import { FrameCanvas } from './FrameCanvas'
import { Mat } from './Mat'

interface Common { L: Layout; m: number; ppm: number; ox: number; oy: number; exploded: boolean; move: Move | null; active: number | null; hot: number | null; src: Source | null; arrive: number; onSelect: (i: number) => void }
const ring = (on: boolean, hot: boolean) => `1.5px solid ${on ? 'var(--acc)' : hot ? 'var(--ink)' : 'transparent'}`

const px = (v: number) => Math.round(v * 100) / 100

function Sheet({ i, L, m, ppm, ox, oy, exploded, move, active, hot, src, arrive, over, step, onSelect }: Common & { i: number; over: boolean; step: number }) {
  const mm = sheetMm(L, m, i, exploded)
  const asm = sheetMm(L, m, i, false)
  const box = useRef<HTMLDivElement>(null)
  const tile = useRef<HTMLDivElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)
  const c = i % L.cols, r = Math.floor(i / L.cols)
  const rect = { x: px(ox + mm.x * ppm), y: px(oy + mm.y * ppm), w: px(mm.w * ppm), h: px(mm.h * ppm) }
  const pos = useFlip(box, rect, move, i)
  const on = active === i, warm = hot === i && !on
  const tw = L.tileW * ppm, th = L.tileH * ppm
  const ins = asm.inset
  const dur = move ? `${move.dur}ms` : '0ms'

  useEffect(() => { if (src) drawSheetTile(cv.current!, src, L, c, r, ppm) }, [src, L, c, r, ppm])

  // Photo arrival: each row wipes in top to bottom, one after the other.
  const where = useRef({ rows: L.rows, r })
  useEffect(() => { where.current = { rows: L.rows, r } })
  useLayoutEffect(() => {
    if (!arrive || !tile.current) return
    const seg = 600 / where.current.rows
    tile.current.animate(
      reduced() ? { opacity: [0, 1] } : { clipPath: ['inset(0 0 100% 0)', 'inset(0)'] },
      { duration: reduced() ? 150 : seg, delay: reduced() ? 0 : where.current.r * seg, easing: EASE_OUT, fill: 'backwards' },
    )
  }, [arrive])

  const marks = exploded && m >= 4
  return (
    <div
      ref={box}
      className="sheet-enter"
      style={{ ...pos, width: rect.w, height: rect.h, zIndex: on ? 2 : 1, cursor: exploded ? 'pointer' : undefined }}
      onClick={exploded ? () => onSelect(i) : undefined}
    >
      <div aria-hidden className="absolute inset-0 transition-opacity duration-200" style={{ boxShadow: 'var(--lift)', opacity: exploded ? 1 : 0 }} />
      <div
        className="absolute inset-0"
        style={{
          background: src ? 'var(--paper)' : 'var(--paper-empty)',
          clipPath: `inset(${ins.t * ppm * (exploded ? 0 : 1)}px ${ins.r * ppm * (exploded ? 0 : 1)}px ${ins.b * ppm * (exploded ? 0 : 1)}px ${ins.l * ppm * (exploded ? 0 : 1)}px)`,
          transition: `clip-path ${dur} var(--ease-in-out) ${move ? i * move.stagger : 0}ms`,
        }}
      >
        {src && (
          <div ref={tile} className="absolute" style={{ left: m * ppm, top: m * ppm, width: tw, height: th }}>
            <canvas ref={cv} className="block" style={{ width: tw, height: th }} />
          </div>
        )}
        {marks && <CropMarks m={m * ppm} tw={tw} th={th} />}
      </div>
      {/* assembled outline: dashed when empty, cut lines on inner edges, selection ring */}
      <div
        className="pointer-events-none absolute transition-[outline-color,opacity] duration-120 ease-linear"
        style={{
          left: ins.l * ppm, top: ins.t * ppm, right: ins.r * ppm, bottom: ins.b * ppm,
          opacity: exploded ? 0 : 1,
          outline: ring(on, warm),
          ...(src ? {
            borderRight: c < L.cols - 1 ? '1px solid var(--cut-light)' : 'none',
            borderBottom: r < L.rows - 1 ? '1px solid var(--cut-light)' : 'none',
            boxShadow: `${c < L.cols - 1 ? '1px' : '0'} ${r < L.rows - 1 ? '1px' : '0'} 0 var(--cut-dark)`,
          } : { border: `1px dashed ${on ? 'var(--acc)' : 'var(--line-strong)'}` }),
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 transition-[outline-color,opacity] duration-120 ease-linear"
        style={{ opacity: exploded ? 1 : 0, outline: ring(on, warm) }}
      />
      {/* drag-over: magenta dashed outline */}
      {step === 1 && (
        <div
          className="pointer-events-none absolute rounded-[1px] border-[1.5px] border-dashed border-acc"
          style={{
            left: ins.l * ppm, top: ins.t * ppm, right: ins.r * ppm, bottom: ins.b * ppm,
            opacity: over ? 1 : 0, transform: over ? 'none' : 'scale(0.98)',
            transition: over ? 'opacity 160ms var(--ease-out), transform 160ms var(--ease-out)' : 'opacity 100ms ease, transform 100ms ease',
          }}
        />
      )}
    </div>
  )
}

function Ghost({ i, common, step }: { i: number; common: Common; step: number }) {
  const [off, setOff] = useState(false)
  useEffect(() => { const r = requestAnimationFrame(() => setOff(true)); return () => cancelAnimationFrame(r) }, [])
  return (
    <div className="pointer-events-none absolute inset-0" style={{ opacity: off ? 0 : 1, transition: 'opacity 160ms ease' }}>
      <Sheet i={i} {...common} move={null} arrive={0} over={false} step={step} />
    </div>
  )
}

/** One shadow under the assembled sheets, so inner cut lines carry no shadow. */
function Backing({ L, m, ppm, ox, oy, move, show }: { L: Layout; m: number; ppm: number; ox: number; oy: number; move: Move | null; show: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const rect = { x: px(ox - m * ppm), y: px(oy - m * ppm), w: px((L.posterW + 2 * m) * ppm), h: px((L.posterH + 2 * m) * ppm) }
  const pos = useFlip(ref, rect, move, 0)
  return <div ref={ref} aria-hidden className="transition-opacity duration-200" style={{ ...pos, width: rect.w, height: rect.h, boxShadow: 'var(--lift)', opacity: show ? 1 : 0 }} />
}

function CropMarks({ m, tw, th }: { m: number; tw: number; th: number }) {
  const len = Math.min(m - 1, 12)
  const corners: [number, number, number, number][] = [[m, m, -1, -1], [m + tw, m, 1, -1], [m, m + th, -1, 1], [m + tw, m + th, 1, 1]]
  return (
    <svg aria-hidden className="absolute inset-0 size-full overflow-visible" stroke="#000" strokeWidth={0.75}>
      {corners.map(([x, y, dx, dy], k) => <path key={k} d={`M${x + dx * len} ${y}H${x}M${x} ${y + dy * len}V${y}`} fill="none" />)}
    </svg>
  )
}

function SheetLabel({ i, L, m, ppm, ox, oy, exploded, move, active, hot, arrive, onSelect }: Common & { i: number }) {
  const mm = sheetMm(L, m, i, exploded)
  const chip = useRef<HTMLButtonElement>(null)
  const below = labelBelow(L, i, exploded)
  const x = px(ox + (mm.x + mm.inset.l) * ppm)
  const y = px(oy + (below ? mm.y + mm.h - mm.inset.b : mm.y + mm.inset.t) * ppm + (below ? 5 : -23))
  useLayoutEffect(() => { if (arrive) fadeRise(chip.current, 300 + i * 40) }, [arrive, i])
  // Labels sit still and hide while the sheets move, so they never cross the image; they fade back in at the new spot.
  const handled = useRef(move?.id ?? 0)
  useLayoutEffect(() => {
    if (!move || move.id === handled.current) return
    handled.current = move.id
    if (reduced()) return
    const T = move.dur + 90 + 200
    chip.current?.animate(
      [{ opacity: 1, offset: 0 }, { opacity: 0, offset: 80 / T }, { opacity: 0, offset: (T - 120) / T }, { opacity: 1, offset: 1 }],
      { duration: T, easing: 'linear' },
    )
  }, [move])
  const on = active === i
  return (
    <div className="absolute top-0 left-0 w-max" style={{ transform: `translate(${x}px, ${y}px)`, zIndex: 5 }}>
      <button
        ref={chip} type="button" aria-pressed={on} onClick={() => onSelect(i)}
        className={cn('block cursor-pointer rounded-[3px] px-1.5 py-px text-label whitespace-nowrap transition-colors duration-120 ease-linear', on ? 'text-acc' : hot === i ? 'text-ink' : 'text-mute hover:text-ink')}
      >
        {sheetName(i)}
      </button>
    </div>
  )
}

export function Canvas(p: {
  step: 1 | 2 | 3; L: Layout; margin: number; src: Source | null; arrive: number; theme: string; active: number | null; hot: number | null
  onSelect: (i: number) => void
  over: boolean; error: string | null; onPick: () => void
  onPan: (dx: number, dy: number) => void; onZoom: (f: number, ax?: number, ay?: number) => void; className?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 900, h: 700 })
  useLayoutEffect(() => {
    const el = root.current!
    const read = () => setBox({ w: el.clientWidth, h: el.clientHeight })
    read()
    const ro = new ResizeObserver(read)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { L, margin: m, step } = p
  const exploded = step === 3
  const { ppm, ox, oy } = scene(L, m, box.w, box.h)

  // A new move starts when the layout or the assembled/pulled-apart state changes, never on a plain resize.
  const key = `${p.L.cols}${p.L.landscapeSheets}${m}${exploded}`
  const [seen, setSeen] = useState({ key, exploded })
  const [move, setMove] = useState<Move | null>(null)
  if (seen.key !== key) {
    setSeen({ key, exploded })
    const flip = seen.exploded !== exploded
    setMove({ id: (move?.id ?? 0) + 1, dur: flip ? (exploded ? 420 : 260) : 260, stagger: flip && exploded ? 30 : 0 })
  }

  const n = L.cols * L.rows
  const common = { L, m, ppm, ox, oy, exploded, move, active: p.active, hot: p.hot, src: p.src, arrive: p.arrive, onSelect: p.onSelect }

  // Sheets that disappear (A2 to A3) fade out in place instead of vanishing.
  const [ghost, setGhost] = useState<{ from: number; to: number; common: Common } | null>(null)
  const sig = `${n}|${L.cols}|${L.landscapeSheets}|${m}|${ppm}|${ox}|${oy}|${exploded}`
  const [snap, setSnap] = useState({ sig, n, common })
  if (snap.sig !== sig) {
    setSnap({ sig, n, common })
    if (n < snap.n) setGhost({ from: n, to: snap.n, common: snap.common })
  }
  useEffect(() => {
    if (!ghost) return
    const t = setTimeout(() => setGhost(null), 240)
    return () => clearTimeout(t)
  }, [ghost])
  return (
    <section aria-label="Canvas" ref={root} className={cn('relative overflow-hidden bg-mat', p.className)}>
      <Mat cw={box.w} ch={box.h} ppm={ppm} ox={ox} oy={oy} pw={L.posterW} ph={L.posterH} theme={p.theme} move={move} rulers={!exploded} />
      <Backing L={L} m={m} ppm={ppm} ox={ox} oy={oy} move={move} show={!exploded && !!p.src} />
      {ghost && Array.from({ length: ghost.to - ghost.from }, (_, k) => <Ghost key={`g${ghost.from + k}`} i={ghost.from + k} common={ghost.common} step={step} />)}
      {Array.from({ length: n }, (_, i) => <Sheet key={i} i={i} {...common} over={p.over} step={step} />)}
      {Array.from({ length: n }, (_, i) => <SheetLabel key={`l${i}`} i={i} {...common} />)}
      {step === 2 && p.src && (
        <FrameCanvas onTap={(x, y) => p.onSelect(Math.min(L.rows - 1, Math.max(0, Math.floor(y / L.tileH))) * L.cols + Math.min(L.cols - 1, Math.max(0, Math.floor(x / L.tileW))))} ppm={ppm} left={ox} top={oy} width={L.posterW * ppm} height={L.posterH * ppm} onPan={p.onPan} onZoom={p.onZoom} />
      )}
      {step === 1 && (
        <div
          className="absolute z-20 flex w-[min(280px,calc(100%-72px))] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 rounded-[8px] border border-line bg-panel/92 px-5 py-5 text-center"
          style={{ left: ox + (L.posterW / 2) * ppm, top: oy + (L.posterH / 2) * ppm, opacity: p.over ? 0.35 : 1, transition: 'opacity 150ms ease' }}
        >
          <p className="m-0 text-body font-medium text-balance">Drop a photo on the mat</p>
          <Button onClick={p.onPick}>Choose image</Button>
          <p className="m-0 text-ui text-mute">Your photo stays on this device.</p>
          {p.error && <p role="alert" className="m-0 text-ui font-medium text-acc">{p.error}</p>}
        </div>
      )}
      {step === 1 && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 rounded-[8px] bg-acc-fill px-4 py-2 text-body font-medium text-white"
          style={{
            left: ox + (L.posterW / 2) * ppm, top: oy + (L.posterH / 2) * ppm,
            opacity: p.over ? 1 : 0, scale: p.over ? '1' : '0.98',
            transition: p.over ? 'opacity 160ms var(--ease-out), scale 160ms var(--ease-out)' : 'opacity 100ms ease, scale 100ms ease',
          }}
        >Release to place the photo</div>
      )}
      {step === 2 && p.error && <p role="alert" className="absolute right-4 bottom-4 z-30 m-0 rounded-[5px] border border-line bg-panel px-3 py-2 text-ui font-medium text-acc" style={{ left: RL + 16 }}>{p.error}</p>}
    </section>
  )
}
