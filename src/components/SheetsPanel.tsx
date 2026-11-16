import { useEffect, useLayoutEffect, useRef } from 'react'
import { fadeRise } from '@/lib/motion'
import type { Layout } from '@/lib/layout'
import { drawSheetTile, type Source } from '@/lib/render'
import { position, sheetName } from '@/lib/sheets'
import { cn } from '@/lib/utils'

function Thumb({ src, L, i, arrive }: { src: Source | null; L: Layout; i: number; arrive: number }) {
  const cv = useRef<HTMLCanvasElement>(null)
  const c = i % L.cols, r = Math.floor(i / L.cols)
  const ppm = Math.min(32 / L.tileW, 46 / L.tileH)
  useEffect(() => { if (src) drawSheetTile(cv.current!, src, L, c, r, ppm) }, [src, L, c, r, ppm])
  useLayoutEffect(() => { if (arrive) fadeRise(cv.current, 160 + i * 40, 0) }, [arrive, i])
  return (
    <span className="grid h-[52px] w-9 shrink-0 place-items-center">
      {src
        ? <canvas ref={cv} className="rounded-[2px] outline outline-1 outline-line-strong" style={{ width: L.tileW * ppm, height: L.tileH * ppm }} />
        : <span className="rounded-[2px] border border-dashed border-line-strong" style={{ width: L.tileW * ppm, height: L.tileH * ppm }} />}
    </span>
  )
}

function PositionMap({ L, i, selected }: { L: Layout; i: number; selected: boolean }) {
  return (
    <span aria-hidden className="grid shrink-0 gap-[2px]" style={{ gridTemplateColumns: `repeat(${L.cols}, 12px)` }}>
      {Array.from({ length: L.cols * L.rows }, (_, k) => (
        <span key={k} className={cn('h-[14px] rounded-[2px] transition-colors duration-120', k === i ? (selected ? 'bg-acc-fill' : 'bg-mute') : 'bg-line-strong')} />
      ))}
    </span>
  )
}

export function SheetsPanel({ L, src, hover, selected, onSelect, onHover, arrive }: {
  L: Layout; src: Source | null; hover: number | null; selected: number | null
  onSelect: (i: number) => void; onHover: (i: number | null) => void; arrive: number
}) {
  const list = useRef<HTMLUListElement>(null)
  useLayoutEffect(() => {
    if (arrive) list.current!.querySelectorAll('li').forEach((li, i) => fadeRise(li, i * 40))
  }, [arrive])
  return (
    <aside aria-label="Sheets" className="hidden w-[280px] shrink-0 flex-col border-r border-line bg-panel min-[1100px]:flex">
      <h2 className="px-5 pt-5 pb-3 text-heading leading-tight font-semibold tracking-[-0.01em]">Sheets</h2>
      <ul ref={list} className="m-0 flex list-none flex-col gap-1 overflow-y-auto px-2 pb-4">
        {Array.from({ length: L.cols * L.rows }, (_, i) => (
          <li key={i}>
            <button
              type="button"
              aria-pressed={selected === i}
              onClick={() => onSelect(i)}
              onMouseEnter={() => onHover(i)} onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(i)} onBlur={() => onHover(null)}
              className={cn(
                'flex w-full cursor-pointer items-center gap-3 rounded-[6px] px-3 py-2 text-left',
                selected === i ? 'bg-acc-soft' : hover === i ? 'bg-panel-2' : 'hover:bg-panel-2',
              )}
            >
              <Thumb src={src} L={L} i={i} arrive={arrive} />
              <span className="min-w-0 flex-1">
                <span className={cn('block text-ui font-medium', selected === i && 'text-acc')}>{sheetName(i)}</span>
                <span className="block text-ui text-mute">{position(L, i)}</span>
              </span>
              <PositionMap L={L} i={i} selected={selected === i} />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
