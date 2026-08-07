import { cn } from '@/lib/utils'

/**
 * A drawn yahrzeit candle (נר נשמה): a short, wide wax-glass with a paper
 * band and a gold flame with a slow, quiet flicker. Use currentColor-driven
 * fills so the ornament inherits the active theme's gold.
 */
export function MemorialCandle({
  className,
  animate = true,
}: {
  className?: string
  animate?: boolean
}) {
  return (
    <svg
      viewBox="0 0 64 92"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={cn('h-16 w-11', className)}
    >
      <defs>
        <radialGradient id="flame-glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wax" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* flame unit: glow + flame, moved down close to the jar */}
      <g transform="translate(0 8)">
        <circle cx="32" cy="20" r="16" fill="url(#flame-glow)" opacity="0.5" />
        <g className={cn(animate && 'candle-flame')}>
          <path
            d="M32 4c5 7 9 11 9 16a9 9 0 0 1-18 0c0-5 4-9 9-16Z"
            fill="currentColor"
          />
          <path
            d="M32 9c3 5 5 8 5 12a5 5 0 0 1-10 0c0-4 2-7 5-12Z"
            fill="oklch(0.96 0.03 90)"
            opacity="0.9"
          />
        </g>
      </g>
      {/* wick, connecting the flame base to the lid */}
      <rect x="31" y="28" width="2" height="6" fill="currentColor" opacity="0.9" />
      {/* metal lid with wick hole */}
      {/* <rect x="7" y="34" width="50" height="6" rx="3" fill="currentColor" opacity="0.85" /> */}
      {/* <rect x="7" y="38" width="50" height="2" fill="currentColor" opacity="0.3" /> */}
      {/* glass jar of wax */}
      <rect x="10" y="40" width="44" height="40" rx="7" fill="url(#wax)" />
      {/* glass highlight */}
      <rect x="13" y="43" width="3" height="34" rx="1.5" fill="currentColor" opacity="0.22" />
      {/* paper band */}
      <rect x="10" y="55" width="44" height="11" fill="currentColor" opacity="0.2" />
      <rect x="10" y="54" width="44" height="1.5" fill="currentColor" opacity="0.35" />
      <rect x="10" y="66" width="44" height="1.5" fill="currentColor" opacity="0.35" />
      {/* base shadow */}
      <rect x="10" y="78" width="44" height="2" rx="1" fill="currentColor" opacity="0.18" />
    </svg>
  )
}

/** A hand-drawn ornament divider: ──✦── (used between landing sections). */
export function OrnamentDivider({
  className,
  icon = '✦',
}: {
  className?: string
  icon?: string
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'flex items-center justify-center gap-3 text-gold select-none',
        className,
      )}
    >
      <span className="h-px w-12 bg-current opacity-40 sm:w-20" />
      <span className="text-sm leading-none">{icon}</span>
      <span className="h-px w-12 bg-current opacity-40 sm:w-20" />
    </div>
  )
}

/** A thin ornamental frame used around the hero and feature sections. */
export function OrnamentFrame({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'relative rounded-lg border border-gold/35 p-2 [backdrop-filter:blur(2px)]',
        className,
      )}
    >
      <span aria-hidden className="absolute -top-px -inset-s-px size-2 border-t-2 border-s-2 border-gold rounded-ss-sm" />
      <span aria-hidden className="absolute -top-px -inset-e-px size-2 border-t-2 border-e-2 border-gold rounded-se-sm" />
      <span aria-hidden className="absolute -bottom-px -inset-s-px size-2 border-b-2 border-s-2 border-gold rounded-es-sm" />
      <span aria-hidden className="absolute -bottom-px -inset-e-px size-2 border-b-2 border-e-2 border-gold rounded-ee-sm" />
      {children}
    </div>
  )
}