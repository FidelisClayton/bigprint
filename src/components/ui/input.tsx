import * as React from 'react'
import { cn } from '@/lib/utils'

function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      className={cn(
        'h-9 w-full rounded-[5px] border border-line-strong bg-panel-2 px-3 font-mono text-ui text-ink outline-none transition-colors focus-visible:border-acc focus-visible:outline-[1.5px] focus-visible:outline-offset-0 focus-visible:outline-acc',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
