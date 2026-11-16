import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Segmented } from '@/components/ui/segmented'
import type { Theme } from '@/lib/theme'
import { ThemeToggle } from './ThemeToggle'

export interface Action { label: string; onClick: () => void; disabled?: boolean }
type Step = 1 | 2 | 3
const NAMES = ['Upload', 'Frame', 'Print']

export function TopBar({ step, hasImage, go, theme, onToggle, action }: {
  step: Step; hasImage: boolean; go: (s: Step) => void; theme: Theme; onToggle: (el: HTMLElement) => void; action: Action | null
}) {
  const items = NAMES.map((name, i) => ({
    value: String(i + 1),
    disabled: i > 0 && !hasImage,
    label: (
      <>
        <span aria-hidden className="hidden w-4 justify-center font-mono text-label sm:inline-flex">
          {i + 1 < step ? <Check className="size-3.5" strokeWidth={2.25} /> : i + 1}
        </span>
        {name}
      </>
    ),
  }))
  return (
    <header className="grid h-14 min-[900px]:h-16 shrink-0 grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-line bg-panel px-3 min-[900px]:grid-cols-[1fr_auto_1fr] min-[900px]:px-5">
      <span className="text-[22px] leading-none font-semibold tracking-[-0.035em] min-[900px]:text-wordmark">Bigprint</span>
      <div className="flex justify-center">
        <Segmented accent label="Steps" value={String(step)} onValueChange={(v) => go(Number(v) as Step)} items={items} />
      </div>
      <div className="flex items-center justify-end gap-2">
        <ThemeToggle theme={theme} onToggle={onToggle} />
        {action && <Button className="hidden min-[900px]:inline-flex" disabled={action.disabled} onClick={action.onClick}>{action.label}</Button>}
      </div>
    </header>
  )
}
