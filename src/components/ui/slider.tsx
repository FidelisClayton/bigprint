import * as React from 'react'
import { Slider as SliderPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

function Slider({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn('relative flex h-6 w-full touch-none items-center select-none data-[disabled]:opacity-45', className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-[3px] grow rounded-full bg-line-strong">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-ctl" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-3.5 rounded-full border-2 border-ctl bg-panel outline-none focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-acc" />
    </SliderPrimitive.Root>
  )
}

export { Slider }
