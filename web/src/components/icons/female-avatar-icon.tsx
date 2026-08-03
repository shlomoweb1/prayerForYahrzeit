import type { SVGProps } from 'react'

export function FemaleAvatarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="9.8" r="3.3" />
      <path d="M6.3 19.6c.4-3.9 2.9-6 5.7-6s5.3 2.1 5.7 6" />
      <path d="M8.4 7.9c-1 1.7-1.1 4.2-.4 6.4" />
      <path d="M15.6 7.9c1 1.7 1.1 4.2.4 6.4" />
    </svg>
  )
}
