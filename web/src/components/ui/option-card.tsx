import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import * as React from 'react'

import { cn } from '@/lib/utils'

interface OptionCardProps {
  value: string
  icon?: React.ReactNode
  image?: string
  title: string
  caption?: string
  hint: string
  className?: string
}

function CheckBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 2200 2200"
      fill="currentColor"
      className={cn('text-light drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]', className)}
    >
      <path d="m1099.6 2189.19c-147.05 0-289.76-28.82-424.16-85.66-129.76-54.89-246.27-133.44-346.3-233.47-100.04-100.03-178.59-216.55-233.47-346.31-56.85-134.4-85.67-277.1-85.67-424.15 0-147.05 28.82-289.76 85.67-424.16 54.88-129.76 133.43-246.27 233.47-346.3 100.03-100.04 216.54-178.59 346.3-233.47 134.4-56.85 277.11-85.67 424.16-85.67 58.52 0 105.97 47.45 105.97 105.97 0 58.53-47.45 105.98-105.97 105.98-234.43 0-454.83 91.29-620.6 257.05-165.76 165.77-257.05 386.17-257.05 620.6 0 234.43 91.29 454.82 257.05 620.59 165.77 165.77 386.17 257.06 620.6 257.06 234.42 0 454.82-91.29 620.59-257.06 165.76-165.77 257.06-386.16 257.06-620.59 0-58.53 47.44-105.98 105.97-105.98 58.53 0 105.97 47.45 105.97 105.98 0 147.05-28.82 289.75-85.66 424.15-54.89 129.76-133.44 246.28-233.47 346.31-100.03 100.03-216.55 178.58-346.31 233.47-134.4 56.84-277.11 85.66-424.15 85.66z" />
      <path d="m2065.13 194.72c56.12 14.2 79.91 80.95 45.74 127.68-252.71 345.56-558.78 840.25-770.56 1212.35-42.43 74.57-118.41 124.05-203.82 132.19q-1.44 0.16-2.89 0.27c-95.69 9.32-188.75-34.03-243.42-113.1-115.57-167.21-242.09-326.84-378.52-477.55-50.6-55.88-47.27-142.23 8.04-193.5q1.36-1.27 2.76-2.53c96.09-88.58 246.48-79.82 332.88 18.22 85.66 97.17 163.01 189.78 230.1 279.73 231.14-324.39 503.32-661.13 755.46-918.46 60.55-61.79 145.84-85.13 224.23-65.3z" />
    </svg>
  )
}

export function OptionCard({ value, icon, image, title, caption, hint, className }: OptionCardProps) {
  if (image) {
    return (
      <RadioGroupPrimitive.Item
        value={value}
        className={cn(
          'group focus-visible:ring-ring/50 relative flex aspect-4/5 flex-col overflow-hidden rounded-xl border text-start shadow-sm outline-none transition-colors focus-visible:ring-[3px]',
          'hover:border-light/50',
          'data-[state=checked]:border-light data-[state=checked]:ring-light data-[state=checked]:ring-1',
          'cursor-pointer',
          className,
        )}
        dir={undefined}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />
        <RadioGroupPrimitive.Indicator asChild>
          <CheckBadge className="absolute top-2.5 inset-e-2.5 z-10 size-8" />
        </RadioGroupPrimitive.Indicator>
        <div className="group-data-[state=checked]:text-light relative mt-auto flex flex-col gap-0.5 bg-black/35 p-3 text-white backdrop-blur-md transition-all duration-300 group-hover:gap-1 group-hover:py-4">
          <span className="text-sm font-medium transition-all duration-300 group-hover:text-base">
            {title}
          </span>
          {caption ? <span className="-mt-0.5 text-xs text-white/80">{caption}</span> : null}
          <span className="text-xs leading-snug group-data-[state=checked]:text-light/80 text-white/80 transition-all duration-300 group-hover:text-sm">
            {hint}
          </span>
        </div>
      </RadioGroupPrimitive.Item>
    )
  }

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
        <CheckBadge className="absolute top-2 end-2 size-6" />
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
