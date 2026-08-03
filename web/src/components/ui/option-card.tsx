import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { CheckCircle2 } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

interface OptionCardProps {
  value: string
  icon: React.ReactNode
  title: string
  caption?: string
  hint: string
  className?: string
}

export function OptionCard({ value, icon, title, caption, hint, className }: OptionCardProps) {
  return (
    <RadioGroupPrimitive.Item
      value={value}
      className={cn(
        'group bg-card text-card-foreground focus-visible:ring-ring/50 relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center shadow-sm outline-none transition-colors focus-visible:ring-[3px]',
        'hover:border-primary/50',
        'data-[state=checked]:border-primary data-[state=checked]:ring-primary data-[state=checked]:ring-1',
        className,
      )}
      dir={undefined}
    >
      <RadioGroupPrimitive.Indicator asChild>
        <CheckCircle2 className="fill-primary text-primary-foreground absolute top-2 end-2 size-4" />
      </RadioGroupPrimitive.Indicator>
      <span className="text-muted-foreground group-data-[state=checked]:text-primary transition-colors">
        {icon}
      </span>
      <span className="text-sm font-medium">{title}</span>
      {caption ? <span className="text-muted-foreground -mt-1 text-xs">{caption}</span> : null}
      <span className="text-muted-foreground text-xs leading-snug">{hint}</span>
    </RadioGroupPrimitive.Item>
  )
}
