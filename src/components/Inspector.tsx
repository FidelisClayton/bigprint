import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { RectangleHorizontal, RectangleVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Segmented } from '@/components/ui/segmented'
import { Slider } from '@/components/ui/slider'
import { EASE_OUT, reduced } from '@/lib/motion'
import type { Layout, Orientation, Size } from '@/lib/layout'
import { cn } from '@/lib/utils'
import { Fx } from './Fx'

export interface Settings { size: Size; orient: Orientation; margin: number; fit: boolean }

const mm = (n: number) => String(+n.toFixed(1))
const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="border-b border-line px-5 py-5">
    <h3 className="mb-4 text-heading leading-tight font-semibold tracking-[-0.01em]">{title}</h3>
    <div className="flex flex-col gap-4">{children}</div>
  </section>
)
const Field = ({ id, name, children }: { id?: string; name: string; children: ReactNode }) => (
  <div className="flex flex-col gap-2">
    <span id={id} className="text-ui text-mute">{name}</span>
    {children}
  </div>
)

function SettingsPanel({ s, zoom, hasImage, onSettings, onZoomTo, onPick }: {
  s: Settings; zoom: number; hasImage: boolean
  onSettings: (n: Partial<Settings>) => void; onZoomTo: (z: number) => void; onPick: () => void
}) {
  const [text, setText] = useState(String(s.margin))
  const [seen, setSeen] = useState(s.margin)
  if (seen !== s.margin) { setSeen(s.margin); if (Number(text) !== s.margin) setText(String(s.margin)) }
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  // One morph per edit: apply 250ms after typing stops, or at once on Enter or blur.
  const commit = (raw: string) => {
    clearTimeout(timer.current)
    const n = Number(raw)
    if (raw !== '' && Number.isFinite(n)) onSettings({ margin: Math.min(20, Math.max(0, n)) })
  }
  const tile = (value: Orientation, Icon: typeof RectangleVertical, name: string) => (
    <button
      type="button" aria-pressed={s.orient === value} onClick={() => onSettings({ orient: value })}
      className={cn(
        'flex h-[68px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[6px] border text-ui outline-none focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-acc',
        s.orient === value ? 'border-sel-line bg-sel text-sel-fg' : 'border-line bg-panel-2 text-mute hover:text-ink',
      )}
    >
      <Icon aria-hidden className="size-6" strokeWidth={1.5} />
      {name}
    </button>
  )
  return (
    <>
      <Section title="Poster">
        <Field name="Size">
          <Segmented label="Size" value={s.size} onValueChange={(v) => onSettings({ size: v })} className="w-full" items={[{ value: 'A3', label: 'A3 · 2 sheets' }, { value: 'A2', label: 'A2 · 4 sheets' }]} />
        </Field>
        <Field name="Orientation">
          <div role="group" aria-label="Orientation" className="grid grid-cols-2 gap-2">
            {tile('portrait', RectangleVertical, 'Portrait')}
            {tile('landscape', RectangleHorizontal, 'Landscape')}
          </div>
        </Field>
      </Section>
      <Section title="Paper">
        <Field name="Printer margin">
          <label className="relative block">
            <Input
              type="number" inputMode="numeric" min={0} max={20} step={1} value={text} aria-label="Printer margin in mm" className="pr-10"
              onChange={(e) => {
                setText(e.target.value)
                clearTimeout(timer.current)
                const v = e.target.value
                timer.current = setTimeout(() => commit(v), 250)
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') commit(text) }}
              onBlur={() => { commit(text); setText(String(Math.min(20, Math.max(0, Number(text) || 0)))) }}
            />
            <span aria-hidden className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-ui text-mute">mm</span>
          </label>
        </Field>
      </Section>
      <Section title="Image">
        <Segmented label="Image fit" value={s.fit ? 'fit' : 'fill'} onValueChange={(v) => onSettings({ fit: v === 'fit' })} className="w-full" items={[{ value: 'fill', label: 'Fill' }, { value: 'fit', label: 'Fit' }]} />
        <Field id="zoom-l" name="Zoom">
          <div className="flex items-center gap-3">
            <Slider aria-labelledby="zoom-l" disabled={!hasImage} min={1} max={5} step={0.01} value={[zoom]} onValueChange={([z]) => onZoomTo(z)} />
            <span className="w-12 text-right font-mono text-ui">{Math.round(zoom * 100)}%</span>
          </div>
        </Field>
        <Button variant="text" className="self-start" onClick={onPick}>{hasImage ? 'Replace image' : 'Choose image'}</Button>
      </Section>
    </>
  )
}

function Assembly({ L, busy, onDownload, onBack }: { L: Layout; busy: 'print' | 'save' | null; onDownload: () => void; onBack: () => void }) {
  const steps = [
    <>Print at 100%. <span className="text-mute">Actual size, margins None.</span></>,
    'Trim the white margin on inner edges.',
    'Tape the sheets together from behind.',
    <>Measure: it should be <span className="font-mono">{mm(L.posterW)} × {mm(L.posterH)} mm</span>.</>,
  ]
  return (
    <Section title="Assembly">
      <ol className="m-0 flex list-none flex-col gap-3 p-0">
        {steps.map((t, i) => (
          <li key={i} className="flex gap-3 text-ui leading-snug">
            <span className="grid size-5 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-label text-mute">{i + 1}</span>
            <span>{t}</span>
          </li>
        ))}
      </ol>
      <div className="mt-1 flex flex-col gap-2">
        <Button variant="secondary" disabled={busy !== null} onClick={onDownload}>{busy === 'save' ? 'Saving…' : 'Download PNGs'}</Button>
        <Button variant="text" className="self-start" onClick={onBack}>Back to framing</Button>
      </div>
    </Section>
  )
}

/** Swaps the settings and assembly panels: the outgoing one fades out, the incoming one rises in with a slight blur. */
function Swap({ mode, children }: { mode: 'settings' | 'assembly'; children: (m: 'settings' | 'assembly') => ReactNode }) {
  const [shown, setShown] = useState(mode)
  const box = useRef<HTMLDivElement>(null)
  const first = useRef(true)
  useEffect(() => {
    if (shown === mode) return
    const out = reduced() ? null : box.current!.animate({ opacity: [1, 0] }, { duration: 120, fill: 'forwards' })
    if (!out) return setShown(mode)
    out.finished.then(() => setShown(mode), () => {})
  }, [mode, shown])
  useLayoutEffect(() => {
    if (first.current) { first.current = false; return }
    box.current!.getAnimations().forEach((a) => a.cancel())
    box.current!.animate(
      reduced() ? { opacity: [0, 1] } : { opacity: [0, 1], transform: ['translateY(4px)', 'none'], filter: ['blur(2px)', 'blur(0)'] },
      { duration: reduced() ? 120 : 220, easing: EASE_OUT },
    )
  }, [shown])
  return <div ref={box}>{children(shown)}</div>
}

export function Inspector(p: {
  s: Settings; L: Layout; zoom: number; hasImage: boolean; mode: 'settings' | 'assembly'; busy: 'print' | 'save' | null
  onSettings: (n: Partial<Settings>) => void; onZoomTo: (z: number) => void; onPick: () => void
  onDownload: () => void; onBack: () => void
}) {
  const { L } = p
  return (
    <aside aria-label="Inspector" className="flex shrink-0 flex-col border-t border-line bg-panel min-[900px]:w-[300px] min-[900px]:border-t-0 min-[900px]:border-l">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Swap mode={p.mode}>
          {(m) => m === 'settings'
            ? <SettingsPanel s={p.s} zoom={p.zoom} hasImage={p.hasImage} onSettings={p.onSettings} onZoomTo={p.onZoomTo} onPick={p.onPick} />
            : <Assembly L={L} busy={p.busy} onDownload={p.onDownload} onBack={p.onBack} />}
        </Swap>
      </div>
      <div className="shrink-0 border-t border-line px-5 py-5 max-[899px]:pb-24">
        <div className="text-ui text-mute">Final image</div>
        <div className="mt-1 font-mono text-figure leading-tight tracking-[-0.02em] whitespace-nowrap">
          <Fx value={mm(L.posterW)} /> × <Fx value={mm(L.posterH)} /> <span className="text-mute">mm</span>
        </div>
        <div className="mt-1.5 text-ui text-mute">{L.cols * L.rows} sheets of A4 · {p.s.margin} mm margin</div>
      </div>
    </aside>
  )
}
