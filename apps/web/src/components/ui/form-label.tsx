import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'

import { cn } from '@/lib/utils'

interface FormLabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  children: React.ReactNode
  required?: boolean
  optional?: boolean
}

export function FormLabel({
  className,
  children,
  required = false,
  optional = false,
  ...props
}: FormLabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="form-label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      {optional && !required && (
        <span className="text-muted-foreground text-sm font-normal">(optional)</span>
      )}
    </LabelPrimitive.Root>
  )
}