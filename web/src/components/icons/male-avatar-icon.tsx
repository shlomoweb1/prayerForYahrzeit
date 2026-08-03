import type { SVGProps } from 'react'

export function MaleAvatarIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M6.3 19.6c.4-3.7 2.5-5.6 4.7-5.9l1 1.5c.5.6 1.3.6 1.8 0l1-1.5c2.2.3 4.3 2.2 4.7 5.9" />
    </svg>
  )
}
