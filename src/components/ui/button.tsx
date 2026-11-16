import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-[5px] text-ui font-medium whitespace-nowrap outline-none focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-acc disabled:pointer-events-none disabled:opacity-45',
  {
    variants: {
      variant: {
        primary: 'h-9 bg-acc-fill px-4 text-white hover:bg-acc-deep',
        secondary: 'h-9 border border-line-strong px-4 text-ink hover:bg-panel-2',
        text: 'h-7 px-1 text-mute underline decoration-line-strong underline-offset-4 hover:text-ink',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
)

function Button({ className, variant, ...props }: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  return <button data-slot="button" className={cn(buttonVariants({ variant }), className)} {...props} />
}

export { Button }
