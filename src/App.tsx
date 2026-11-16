import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Canvas } from '@/components/Canvas'
import { Inspector, type Settings } from '@/components/Inspector'
import { SheetsPanel } from '@/components/SheetsPanel'
import { TopBar, type Action } from '@/components/TopBar'
import { downloadSheets, printSheets } from '@/lib/render'
import { useTheme } from '@/lib/theme'
import { centerView, clampView, layout, zoomView, type View } from '@/lib/layout'

interface Picture { img: HTMLImageElement; name: string }

const NOT_IMAGE = "That file isn't an image we can open. Try a JPG or PNG."

function decode(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image(), url = URL.createObjectURL(file)
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode')) }
    img.src = url
  })
}

export default function App() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [pic, setPic] = useState<Picture | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [s, setS] = useState<Settings>({ size: 'A2', orient: 'portrait', margin: 5, fit: false })
  const [view, setView] = useState<View>({ zoom: 1, ox: 0, oy: 0 })
  const picker = useRef<HTMLInputElement>(null)
  const { theme, toggle } = useTheme()
  const [arrive, setArrive] = useState(0)
  const [sel, setSel] = useState<number | null>(0)
  const [hover, setHover] = useState<number | null>(null)
  const [busy, setBusy] = useState<'print' | 'save' | null>(null)
  const [over, setOver] = useState(false)
  const onFileRef = useRef<(f: File | undefined) => void>(() => {})

  const L = useMemo(() => layout(s.size, s.orient, s.margin), [s.size, s.orient, s.margin])
  const d = useMemo(() => (pic ? { w: pic.img.naturalWidth, h: pic.img.naturalHeight } : null), [pic])

  const settings = (next: Partial<Settings>, img = pic?.img) => {
    const n = { ...s, ...next }
    setS(n)
    if (img) setView(centerView(layout(n.size, n.orient, n.margin), { w: img.naturalWidth, h: img.naturalHeight }, n.fit))
  }

  const onFile = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return setError(NOT_IMAGE)
    try {
      const img = await decode(file)
      setPic({ img, name: file.name })
      setError(null)
      settings({ fit: false }, img)
      setArrive((n) => n + 1)
      setStep(2)
    } catch {
      setError(NOT_IMAGE)
    }
  }

  useEffect(() => { onFileRef.current = onFile })
  // Whole page is a drop target; a missed drop must never navigate to the file.
  useEffect(() => {
    let depth = 0
    const stop = (e: DragEvent) => e.preventDefault()
    const enter = (e: DragEvent) => { e.preventDefault(); depth++; setOver(true) }
    const leave = () => { depth = Math.max(0, depth - 1); if (!depth) setOver(false) }
    const drop = (e: DragEvent) => { e.preventDefault(); depth = 0; setOver(false); onFileRef.current(e.dataTransfer?.files[0]) }
    window.addEventListener('dragover', stop)
    window.addEventListener('dragenter', enter)
    window.addEventListener('dragleave', leave)
    window.addEventListener('drop', drop)
    return () => {
      window.removeEventListener('dragover', stop); window.removeEventListener('dragenter', enter)
      window.removeEventListener('dragleave', leave); window.removeEventListener('drop', drop)
    }
  }, [])

  const pan = useCallback((dx: number, dy: number) => {
    if (d) setView((v) => clampView(L, d, s.fit, { ...v, ox: v.ox + dx, oy: v.oy + dy }))
  }, [L, d, s.fit])
  const zoomAt = useCallback((factor: number, ax?: number, ay?: number) => {
    if (d) setView((v) => zoomView(L, d, s.fit, v, v.zoom * factor, ax, ay))
  }, [L, d, s.fit])

  const go = (n: 1 | 2 | 3) => { setError(null); setStep(n) }
  const src = pic && step > 1 ? { img: pic.img, fit: s.fit, view } : null
  const n = L.cols * L.rows
  const selC = sel !== null && sel < n ? sel : 0

  const run = (kind: 'print' | 'save') => async () => {
    if (!src) return
    setBusy(kind)
    setError(null)
    try {
      await (kind === 'print' ? printSheets : downloadSheets)(src, L, s.margin)
    } catch {
      setError("We couldn't prepare the sheets. Try a smaller image.")
    } finally {
      setBusy(null)
    }
  }

  const action: Action | null = step === 2
    ? { label: 'Continue to print', onClick: () => go(3) }
    : step === 3 ? { label: busy === 'print' ? 'Preparing…' : `Print ${n} sheets`, onClick: run('print'), disabled: busy !== null } : null
  const mobile: Action = action ?? { label: 'Choose image', onClick: () => picker.current!.click() }

  return (
    <div className="flex min-h-dvh flex-col min-[900px]:h-dvh min-[900px]:overflow-hidden">
      <TopBar step={step} hasImage={!!pic} go={go} theme={theme} onToggle={toggle} action={action} />
      <div className="flex min-h-0 flex-1 flex-col min-[900px]:flex-row">
        <SheetsPanel L={L} src={src} hover={hover} selected={step === 1 ? null : selC} onSelect={setSel} onHover={setHover} arrive={arrive} />
        <Canvas
          className="h-[58dvh] min-h-[340px] shrink-0 min-[900px]:h-auto min-[900px]:min-h-0 min-[900px]:min-w-0 min-[900px]:flex-1"
          step={step} L={L} margin={s.margin} src={src} arrive={arrive} theme={theme} active={step === 1 ? null : selC} hot={hover} onSelect={setSel}
          over={over} error={error} onPick={() => picker.current!.click()} onPan={pan} onZoom={zoomAt}
        />
        <Inspector
          s={s} L={L} zoom={view.zoom} hasImage={!!pic} mode={step === 3 ? 'assembly' : 'settings'} busy={busy}
          onSettings={(next) => settings(next)} onZoomTo={(z) => d && setView((v) => zoomView(L, d, s.fit, v, z))}
          onPick={() => picker.current!.click()} onDownload={run('save')} onBack={() => go(2)}
        />
      </div>
      <input ref={picker} type="file" accept="image/*" hidden onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = '' }} />
      <div className="action-bar fixed inset-x-0 bottom-0 z-40 border-t border-line bg-panel p-3 min-[900px]:hidden">
        <Button className="w-full" disabled={mobile.disabled} onClick={mobile.onClick}>{mobile.label}</Button>
      </div>
    </div>
  )
}
